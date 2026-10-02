"use server"

import crypto from "crypto"
import { pool } from "./db"
import { revalidatePath } from "next/cache"
import { loginOrSignupMember } from "./auth"
import { cookies } from "next/headers"

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {}
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_TVcBqxdRYHZ9A2"
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "7i70nClf4o63ct8YZynPpRly"

function authHeader(): string {
  return "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
}

/**
 * 1. Create a server-side Razorpay Order for ticket checkout
 */
export async function createRazorpayOrderAction(params: {
  amountInINR: number
  receipt: string
  notes?: Record<string, string>
}): Promise<{
  ok: boolean
  orderId?: string
  amount?: number
  currency?: string
  keyId?: string
  error?: string
}> {
  try {
    const amountPaise = Math.round(params.amountInINR * 100)
    if (amountPaise <= 0) {
      return { ok: false, error: "Invalid payment amount." }
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: params.receipt,
        notes: params.notes || {},
      }),
      cache: "no-store",
    })

    const json = (await res.json().catch(() => ({}))) as {
      id?: string
      amount?: number
      currency?: string
      error?: { description?: string }
    }

    if (!res.ok || !json.id) {
      return {
        ok: false,
        error: json.error?.description || `Razorpay order creation failed (${res.status})`,
      }
    }

    return {
      ok: true,
      orderId: json.id,
      amount: json.amount,
      currency: json.currency,
      keyId: RAZORPAY_KEY_ID,
    }
  } catch (err: any) {
    console.error("[createRazorpayOrderAction error]:", err)
    return { ok: false, error: err.message || "Failed to initiate Razorpay payment." }
  }
}

/**
 * 2. Verify Razorpay Payment and Settle Contest Tickets & Drive Credits
 */
export async function verifyAndCompleteRazorpayPaymentAction(params: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature?: string
  contestId: string
  ticketCount: number
  userEmail: string
  userPhone: string
  userName?: string
  referralCodeUsed?: string
}): Promise<{ ok: boolean; orderId?: string; creditsAdded?: number; error?: string }> {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    contestId,
    ticketCount,
    userEmail,
    userPhone,
    userName,
    referralCodeUsed,
  } = params

  if (!razorpayPaymentId) {
    return { ok: false, error: "Missing Razorpay payment ID." }
  }

  // A. Verify Signature if provided
  if (razorpaySignature && razorpayOrderId) {
    const generated = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    if (generated !== razorpaySignature) {
      console.warn("[Razorpay signature mismatch]: expected", generated, "got", razorpaySignature)
      // Double check directly with Razorpay API
      const rzpCheck = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
        headers: { Authorization: authHeader() },
        cache: "no-store",
      })
      const pJson = await rzpCheck.json().catch(() => ({}))
      if (!rzpCheck.ok || (pJson.status !== "captured" && pJson.status !== "authorized")) {
        return { ok: false, error: "Razorpay payment verification failed." }
      }
    }
  }

  // Resolve referral code from cookie if not passed directly
  let codeToUse = (referralCodeUsed || "").trim().toUpperCase()
  if (!codeToUse) {
    try {
      const cookieStore = await cookies()
      codeToUse = (cookieStore.get("referral_code")?.value || "").trim().toUpperCase()
    } catch {}
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Check if payment already processed
    const existing = await client.query(
      `SELECT id FROM contest_orders WHERE id = $1 LIMIT 1`,
      [razorpayOrderId]
    )
    if (existing.rows.length > 0) {
      await client.query("COMMIT")
      return { ok: true, orderId: razorpayOrderId }
    }

    // Fetch dynamic contest ticket price & credit parity
    const contestRes = await client.query(
      `SELECT ticket_price, credits_per_ticket FROM contests WHERE id = $1 LIMIT 1`,
      [contestId]
    )
    const ticketPrice = Number(contestRes.rows[0]?.ticket_price) || 1000
    const creditsPerTicket = Number(contestRes.rows[0]?.credits_per_ticket) || ticketPrice

    const cost = ticketCount * ticketPrice
    const creditsIssued = ticketCount * creditsPerTicket
    const primaryId = (userEmail ? userEmail.trim().toLowerCase() : userPhone.trim())

    // 1. Record Order in contest_orders
    await client.query(
      `INSERT INTO contest_orders (id, user_phone, user_email, user_name, contest_id, ticket_count, amount_paid, credits_issued, referral_code_used, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'completed', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [
        razorpayOrderId,
        userPhone,
        userEmail.toLowerCase(),
        userName || "Member",
        contestId,
        ticketCount,
        cost,
        creditsIssued,
        codeToUse || null,
      ]
    )

    // 2. Deposit 1:1 Drive Credits in shared user_credits table matching booking-app schema
    const creditPackId = `crd_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
    await client.query(
      `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_id, payment_gateway, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, 'razorpay', NOW(), NOW())`,
      [creditPackId, primaryId, `contest_${contestId}`, cost, creditsIssued, creditsIssued, razorpayPaymentId]
    )

    // 3. Increment Contest Ticket Count
    await client.query(
      `UPDATE contests 
       SET sold_tickets = sold_tickets + $1, updated_at = NOW()
       WHERE id = $2`,
      [ticketCount, contestId]
    )

    // 4. Query dynamic platform settings for referral economics and unlock thresholds
    const settingsRes = await client.query(
      `SELECT key, value FROM site_settings 
       WHERE key IN ('contest_referral_drive_pct', 'contest_referral_cash_pct', 'contest_cash_unlock_threshold')`
    )
    const sMap = new Map(settingsRes.rows.map((r: { key: string; value: string }) => [r.key, r.value]))
    const driveRewardPct = (Number(sMap.get("contest_referral_drive_pct")) || 25) / 100
    const cashCommissionPct = (Number(sMap.get("contest_referral_cash_pct")) || 25) / 100
    const cashUnlockThreshold = Number(sMap.get("contest_cash_unlock_threshold")) || 20

    // 5. Update Buyer's Referral Profile
    await client.query(
      `UPDATE referral_profiles
       SET tickets_bought = tickets_bought + $1,
           is_cash_unlocked = CASE WHEN (tickets_bought + $1) >= $2 THEN TRUE ELSE is_cash_unlocked END,
           updated_at = NOW()
       WHERE LOWER(user_email) = $3 OR user_phone = $4`,
      [ticketCount, cashUnlockThreshold, userEmail.toLowerCase(), userPhone || "NONE"]
    )

    // 6. Handle Referral Commission if referral code used
    if (codeToUse) {
      const refQuery = await client.query(
        `SELECT user_email, user_phone, is_cash_unlocked FROM referral_profiles WHERE UPPER(referral_code) = $1 LIMIT 1`,
        [codeToUse]
      )

      if (refQuery.rows.length > 0) {
        const referrer = refQuery.rows[0]
        const bonusCredits = Math.round(creditsIssued * driveRewardPct)
        const cashCommission = referrer.is_cash_unlocked ? Math.round(cost * cashCommissionPct) : 0
        const refId = (referrer.user_email || referrer.user_phone || "referrer").toLowerCase()

        await client.query(
          `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_id, payment_gateway, created_at, updated_at)
           VALUES ($1, $2, 'referral_bonus', 0, $3, $3, 'active', $4, 'referral', NOW(), NOW())`,
          [`crd_ref_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`, refId, bonusCredits, razorpayPaymentId]
        )

        await client.query(
          `UPDATE referral_profiles
           SET total_referred_users = total_referred_users + 1,
               total_credits_earned = total_credits_earned + $1,
               total_cash_earned = total_cash_earned + $2,
               updated_at = NOW()
           WHERE UPPER(referral_code) = $3`,
          [bonusCredits, cashCommission, codeToUse]
        )
      }
    }

    await client.query("COMMIT")

    // Auto-login buyer into Member Garage session
    try {
      await loginOrSignupMember(userEmail || userPhone, userName)
    } catch {}

    safeRevalidate("/")
    safeRevalidate("/members")
    safeRevalidate("/members/transactions")
    return { ok: true, orderId: razorpayOrderId, creditsAdded: creditsIssued }
  } catch (err: any) {
    await client.query("ROLLBACK")
    console.error("[verifyAndCompleteRazorpayPaymentAction error]:", err)
    return { ok: false, error: "Failed to finalize ticket purchase. Please contact support." }
  } finally {
    client.release()
  }
}
