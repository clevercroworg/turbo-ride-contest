"use server"

import { pool } from "./db"
import { revalidatePath } from "next/cache"
import { loginOrSignupMember } from "./auth"

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Safe when invoked outside Next.js request context
  }
}

export async function getUserDriveCredits(email?: string, phone?: string): Promise<number> {
  if (!email && !phone) return 0
  try {
    const cleanEmail = email?.trim().toLowerCase() || ""
    const digits = phone?.replace(/\D/g, "") || ""
    
    // In shared database, user_credits uses 'identifier' (either email or phone) and 'credits_remaining'
    const res = await pool.query(
      `SELECT COALESCE(SUM(credits_remaining), 0) as balance 
       FROM user_credits 
       WHERE (LOWER(identifier) = $1 OR (identifier IS NOT NULL AND identifier != '' AND identifier LIKE $2))
         AND status = 'active'
         AND credits_remaining > 0`,
      [cleanEmail, `%${digits ? digits.slice(-10) : "NOMATCH"}`]
    )
    if (res.rows.length > 0) {
      return Number(res.rows[0].balance) || 0
    }
  } catch (err) {
    console.error("[getUserDriveCredits error]:", err)
  }
  return 0
}

export async function buyContestTicketsAction(params: {
  contestId: string
  ticketCount: number
  userEmail: string
  userPhone: string
  userName?: string
  referralCodeUsed?: string
  autoAssign?: boolean
}): Promise<{ ok: boolean; orderId?: string; creditsAdded?: number; error?: string }> {
  const { contestId, ticketCount, userEmail, userPhone, userName, referralCodeUsed, autoAssign = false } = params
  if (!ticketCount || ticketCount < 1) {
    return { ok: false, error: "Please select at least 1 ticket." }
  }
  if (!userEmail && !userPhone) {
    return { ok: false, error: "Please enter your email or phone to receive tickets." }
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const orderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
    const cost = ticketCount * 1000
    const creditsIssued = ticketCount * 1000
    const primaryId = userEmail ? userEmail.trim().toLowerCase() : userPhone.trim()

    // 1. Record Order in contest_orders
    await client.query(
      `INSERT INTO contest_orders (id, user_phone, user_email, user_name, contest_id, ticket_count, amount_paid, credits_issued, referral_code_used, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'completed', NOW())`,
      [orderId, userPhone, userEmail.toLowerCase(), userName || "Member", contestId, ticketCount, cost, creditsIssued, referralCodeUsed || null]
    )

    // 2. Deposit 1:1 Drive Credits in shared user_credits table matching booking-app schema
    const creditPackId = `crd_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
    await client.query(
      `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_gateway, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', 'direct', NOW(), NOW())`,
      [creditPackId, primaryId, `contest_${contestId}`, cost, creditsIssued, creditsIssued]
    )

    // 3. Increment Contest Ticket Count
    await client.query(
      `UPDATE contests 
       SET sold_tickets = sold_tickets + $1, updated_at = NOW()
       WHERE id = $2`,
      [ticketCount, contestId]
    )

    // 4. Auto-generate tickets ONLY if autoAssign is true (e.g. from public guest checkout)
    if (autoAssign) {
      for (let i = 0; i < ticketCount; i++) {
        let assigned = false
        let attempts = 0
        while (!assigned && attempts < 20) {
          attempts++
          const candidate = String(Math.floor(10000 + Math.random() * 90000))
          const check = await client.query(
            `SELECT id FROM contest_tickets WHERE contest_id = $1 AND ticket_number = $2 LIMIT 1`,
            [contestId, candidate]
          )
          if (check.rows.length === 0) {
            const tktId = `TKT-${Date.now()}-${candidate}-${i}`
            await client.query(
              `INSERT INTO contest_tickets (id, contest_id, user_phone, user_email, user_name, ticket_number, order_id, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
              [tktId, contestId, userPhone, userEmail.toLowerCase(), userName || "Member", candidate, orderId]
            )
            assigned = true
          }
        }
      }
    }

    // 5. Update Buyer's Referral Profile
    await client.query(
      `UPDATE referral_profiles
       SET tickets_bought = tickets_bought + $1,
           is_cash_unlocked = CASE WHEN (tickets_bought + $1) >= 25 THEN TRUE ELSE is_cash_unlocked END,
           updated_at = NOW()
       WHERE LOWER(user_email) = $2 OR user_phone = $3`,
      [ticketCount, userEmail.toLowerCase(), userPhone || "NONE"]
    )

    // 6. Handle Referral Commission if referral code used
    if (referralCodeUsed && referralCodeUsed.trim()) {
      const code = referralCodeUsed.trim().toUpperCase()
      const refQuery = await client.query(
        `SELECT user_email, user_phone, is_cash_unlocked FROM referral_profiles WHERE UPPER(referral_code) = $1 LIMIT 1`,
        [code]
      )

      if (refQuery.rows.length > 0) {
        const referrer = refQuery.rows[0]
        const bonusCredits = Math.round(creditsIssued * 0.25)
        const cashCommission = referrer.is_cash_unlocked ? Math.round(cost * 0.25) : 0
        const refId = (referrer.user_email || referrer.user_phone || "referrer").toLowerCase()

        await client.query(
          `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_gateway, created_at, updated_at)
           VALUES ($1, $2, 'referral_bonus', 0, $3, $3, 'active', 'referral', NOW(), NOW())`,
          [`crd_ref_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`, refId, bonusCredits]
        )

        await client.query(
          `UPDATE referral_profiles
           SET total_referred_users = total_referred_users + 1,
               total_credits_earned = total_credits_earned + $1,
               total_cash_earned = total_cash_earned + $2,
               updated_at = NOW()
           WHERE UPPER(referral_code) = $3`,
          [bonusCredits, cashCommission, code]
        )
      }
    }

    await client.query("COMMIT")

    // Auto-login buyer into Member Garage session
    try {
      await loginOrSignupMember(userEmail || userPhone, userName)
    } catch {
      // Non-fatal if cookie setting fails in background context
    }

    safeRevalidate("/")
    safeRevalidate("/members")
    return { ok: true, orderId, creditsAdded: creditsIssued }
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("[buyContestTicketsAction error]:", err)
    return { ok: false, error: "Failed to process ticket purchase. Please try again." }
  } finally {
    client.release()
  }
}

export async function assignTicketNumberAction(params: {
  contestId: string
  ticketNumber: string
  userEmail: string
  userPhone: string
  userName?: string
  orderId?: string
}): Promise<{ ok: boolean; ticketId?: string; ticketNumber?: string; availableLeft?: number; error?: string }> {
  const { contestId, ticketNumber, userEmail, userPhone, userName, orderId } = params
  const cleanNum = ticketNumber.trim()
  if (!cleanNum || !/^\d{5}$/.test(cleanNum)) {
    return { ok: false, error: "Please enter a valid 5-digit number (e.g. 40821)." }
  }

  const cleanEmail = userEmail?.trim().toLowerCase() || ""
  const digits = userPhone?.replace(/\D/g, "") || (userEmail?.replace(/\D/g, "") || "")

  try {
    // 1. Strict Validation: Check available entries to assign
    const [ordersRes, ticketsRes] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(ticket_count), 0) as total_bought 
         FROM contest_orders 
         WHERE contest_id = $1 
           AND (
             (user_email IS NOT NULL AND LOWER(user_email) = $2)
             OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $3)
           )
           AND status = 'completed'`,
        [contestId, cleanEmail || "NOMATCH", `%${digits ? digits.slice(-10) : "NOMATCH"}`]
      ),
      pool.query(
        `SELECT COUNT(*) as total_assigned 
         FROM contest_tickets 
         WHERE contest_id = $1 
           AND (
             (user_email IS NOT NULL AND LOWER(user_email) = $2)
             OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $3)
           )`,
        [contestId, cleanEmail || "NOMATCH", `%${digits ? digits.slice(-10) : "NOMATCH"}`]
      )
    ])

    const totalBought = Number(ordersRes.rows[0]?.total_bought) || 0
    const totalAssigned = Number(ticketsRes.rows[0]?.total_assigned) || 0

    if (totalAssigned >= totalBought) {
      return { ok: false, error: "No entries left to assign. Buy more tickets to enter again." }
    }

    // 2. Strict Validation: Check if 5-digit number is already taken
    const existing = await pool.query(
      `SELECT id FROM contest_tickets WHERE contest_id = $1 AND ticket_number = $2 LIMIT 1`,
      [contestId, cleanNum]
    )
    if (existing.rows.length > 0) {
      return { ok: false, error: `Ticket #${cleanNum} has already been claimed! Please pick another number or use Auto-Pick.` }
    }

    const ticketId = `TKT-${Date.now()}-${cleanNum}`
    try {
      await pool.query(
        `INSERT INTO contest_tickets (id, contest_id, user_phone, user_email, user_name, ticket_number, order_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [ticketId, contestId, userPhone || "", cleanEmail, userName || "Member", cleanNum, orderId || null]
      )
    } catch (insertErr: any) {
      if (insertErr.code === "23505") {
        return { ok: false, error: `Ticket #${cleanNum} has already been claimed! Please pick another number or use Auto-Pick.` }
      }
      throw insertErr
    }

    safeRevalidate("/members")
    return {
      ok: true,
      ticketId,
      ticketNumber: cleanNum,
      availableLeft: Math.max(0, totalBought - totalAssigned - 1)
    }
  } catch (err) {
    console.error("[assignTicketNumberAction error]:", err)
    return { ok: false, error: "Could not lock in your ticket number. Please try again." }
  }
}

export async function autoPickTicketNumberAction(params: {
  contestId: string
  userEmail: string
  userPhone: string
  userName?: string
}): Promise<{ ok: boolean; ticketNumber?: string; availableLeft?: number; error?: string }> {
  const { contestId, userEmail, userPhone, userName } = params

  for (let attempt = 0; attempt < 30; attempt++) {
    const randomNum = String(Math.floor(10000 + Math.random() * 90000))
    const res = await assignTicketNumberAction({
      contestId,
      ticketNumber: randomNum,
      userEmail,
      userPhone,
      userName,
    })
    if (res.ok) {
      return { ok: true, ticketNumber: randomNum, availableLeft: res.availableLeft }
    }
    if (res.error && res.error.includes("No entries left")) {
      return { ok: false, error: res.error }
    }
  }

  return { ok: false, error: "Could not auto-generate an unclaimed ticket number. Please try manual entry." }
}

export async function simulateReferralAction(params: {
  referralCode: string
  friendName: string
  ticketCount: number
  referrerEmail: string
}): Promise<{ ok: boolean; creditsAdded?: number; cashAdded?: number; error?: string }> {
  const { referralCode, friendName, ticketCount, referrerEmail } = params
  if (!friendName || !friendName.trim()) {
    return { ok: false, error: "Please enter your friend's name." }
  }
  if (!ticketCount || ticketCount < 1) {
    return { ok: false, error: "Please enter at least 1 ticket." }
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const orderId = `ORD-REF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
    const cost = ticketCount * 1000
    const creditsIssued = ticketCount * 1000
    const fakeFriendEmail = `${friendName.trim().toLowerCase().replace(/\s+/g, "")}.${Date.now().toString().slice(-4)}@example.com`

    // 1. Record friend order
    await client.query(
      `INSERT INTO contest_orders (id, user_phone, user_email, user_name, contest_id, ticket_count, amount_paid, credits_issued, referral_code_used, status, created_at)
       VALUES ($1, '9999999999', $2, $3, 'porsche-718', $4, $5, $6, $7, 'completed', NOW())`,
      [orderId, fakeFriendEmail, friendName.trim(), ticketCount, cost, creditsIssued, referralCode.trim()]
    )

    // 2. Check if referrer has unlocked cash commission
    const refProfile = await client.query(
      `SELECT is_cash_unlocked, tickets_bought FROM referral_profiles WHERE UPPER(referral_code) = UPPER($1) LIMIT 1`,
      [referralCode.trim()]
    )
    const isCashUnlocked = refProfile.rows[0]?.is_cash_unlocked || (Number(refProfile.rows[0]?.tickets_bought) >= 25)

    const bonusCredits = ticketCount * 250 // 25% of ₹1,000 spend
    const cashCommission = isCashUnlocked ? ticketCount * 250 : 0
    const primaryId = referrerEmail.trim().toLowerCase()

    // 3. Grant credits to referrer in user_credits
    const creditPackId = `crd_ref_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
    await client.query(
      `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_gateway, created_at, updated_at)
       VALUES ($1, $2, 'referral_bonus', 0, $3, $3, 'active', 'referral', NOW(), NOW())`,
      [creditPackId, primaryId, bonusCredits]
    )

    // 4. Update metrics in referral_profiles
    await client.query(
      `UPDATE referral_profiles
       SET total_referred_users = total_referred_users + 1,
           total_credits_earned = total_credits_earned + $1,
           total_cash_earned = total_cash_earned + $2,
           updated_at = NOW()
       WHERE UPPER(referral_code) = UPPER($3)`,
      [bonusCredits, cashCommission, referralCode.trim()]
    )

    await client.query("COMMIT")
    safeRevalidate("/members")
    return { ok: true, creditsAdded: bonusCredits, cashAdded: cashCommission }
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("[simulateReferralAction error]:", err)
    return { ok: false, error: "Failed to simulate referral." }
  } finally {
    client.release()
  }
}

