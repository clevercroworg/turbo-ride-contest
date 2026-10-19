import crypto from "crypto"
import type { PoolClient } from "pg"
import { generateSingleVoucherCode, formatPlayerId, sanitizePlayerName, voucherTypeForPrice } from "./vouchers"

// Server-only helpers for paid ticket purchases. Deliberately NOT a "use server" module:
// nothing here may be callable from the browser. Settlement only ever runs after a
// payment has been verified with the gateway (see lib/razorpay.ts).

type Queryable = Pick<PoolClient, "query">

export const MAX_TICKETS_PER_ORDER = 1000

export interface ContestPricing {
  ticketPrice: number
  creditsPerTicket: number
}

/** Current price and credit parity for a contest, as stored in the database. */
export async function getContestPricing(db: Queryable, contestId: string): Promise<ContestPricing | null> {
  const res = await db.query(`SELECT ticket_price, credits_per_ticket FROM contests WHERE id = $1 LIMIT 1`, [contestId])
  if (res.rows.length === 0) return null
  const ticketPrice = Number(res.rows[0].ticket_price) || 1000
  const creditsPerTicket = Number(res.rows[0].credits_per_ticket) || ticketPrice
  return { ticketPrice, creditsPerTicket }
}

/**
 * Enforces the lifetime purchase cap (site setting `contest_max_customer_limit`, default ₹1,00,000).
 * Returns an error message when the new purchase would exceed it.
 */
export async function checkPurchaseLimit(
  db: Queryable,
  params: { userEmail: string; userPhone: string; cost: number }
): Promise<string | null> {
  const limitRes = await db.query(`SELECT value FROM site_settings WHERE key = 'contest_max_customer_limit' LIMIT 1`)
  const maxCustomerLimit = Number(limitRes.rows[0]?.value) || 100000

  const cleanEmail = params.userEmail?.trim().toLowerCase() || ""
  const cleanDigits = params.userPhone?.replace(/\D/g, "").slice(-10) || ""
  const priorRes = await db.query(
    `SELECT COALESCE(SUM(amount_paid), 0) as total_spent
     FROM contest_orders
     WHERE status = 'completed'
       AND (
         (user_email IS NOT NULL AND LOWER(user_email) = $1 AND $1 != '')
         OR (user_phone IS NOT NULL AND user_phone LIKE $2 AND $2 != '')
       )`,
    [cleanEmail || "NOMATCH", cleanDigits ? `%${cleanDigits}` : "NOMATCH"]
  )
  const priorSpent = Number(priorRes.rows[0]?.total_spent) || 0
  if (priorSpent + params.cost > maxCustomerLimit) {
    const remainingAllowed = Math.max(0, maxCustomerLimit - priorSpent)
    return `Purchase limit exceeded. Each member can purchase a maximum of ₹${maxCustomerLimit.toLocaleString("en-IN")} worth of drive credits. Your current remaining headroom is ₹${remainingAllowed.toLocaleString("en-IN")}.`
  }
  return null
}

export interface PaidTicketPurchase {
  orderId: string
  contestId: string
  ticketCount: number
  ticketPrice: number
  creditsPerTicket: number
  userEmail: string
  userPhone: string
  userName?: string
  referralCode?: string
  paymentId: string
  gateway: "razorpay"
  /** Auto-assign random 5-digit draw numbers (homepage checkout). Members pick their own otherwise. */
  autoAssign: boolean
}

/**
 * Records a verified, paid ticket purchase: order, 1:1 drive credits, contest count,
 * Coin Rush vouchers, optional draw numbers, buyer profile and referral commission.
 * Must run inside the caller's transaction. Idempotent per orderId: a repeat call
 * (e.g. a retried verification) returns created=false and changes nothing.
 */
export async function settleTicketPurchase(
  client: Queryable,
  p: PaidTicketPurchase
): Promise<{ created: boolean; creditsIssued: number; vouchers: string[] }> {
  const cost = p.ticketCount * p.ticketPrice
  const creditsIssued = p.ticketCount * p.creditsPerTicket
  const userEmail = p.userEmail.trim().toLowerCase()
  const userPhone = p.userPhone.trim()
  const primaryId = userEmail || userPhone
  const codeToUse = (p.referralCode || "").trim().toUpperCase()

  // 1. Record the order. ON CONFLICT + RETURNING makes concurrent retries settle exactly once.
  const orderRes = await client.query(
    `INSERT INTO contest_orders (id, user_phone, user_email, user_name, contest_id, ticket_count, amount_paid, credits_issued, referral_code_used, payment_gateway, payment_id, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'completed', NOW())
     ON CONFLICT (id) DO NOTHING
     RETURNING id`,
    [p.orderId, userPhone, userEmail, p.userName || "Member", p.contestId, p.ticketCount, cost, creditsIssued, codeToUse || null, p.gateway, p.paymentId]
  )
  if (orderRes.rows.length === 0) {
    const existing = await client.query(`SELECT code FROM game_vouchers WHERE order_id = $1 ORDER BY id`, [p.orderId])
    return { created: false, creditsIssued, vouchers: existing.rows.map((r: { code: string }) => r.code) }
  }

  // 2. Deposit 1:1 Drive Credits in shared user_credits table matching booking-app schema
  await client.query(
    `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_id, payment_gateway, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, $8, NOW(), NOW())`,
    [`crd_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`, primaryId, `contest_${p.contestId}`, cost, creditsIssued, creditsIssued, p.paymentId, p.gateway]
  )

  // 3. Increment Contest Ticket Count
  await client.query(`UPDATE contests SET sold_tickets = sold_tickets + $1, updated_at = NOW() WHERE id = $2`, [p.ticketCount, p.contestId])

  // 4. Generate 12-digit Turboride Coin Rush game vouchers (1 per ticket)
  const cleanDigits = userPhone.replace(/\D/g, "").slice(-10)
  const profRes = await client.query(
    `SELECT id, user_name FROM referral_profiles
     WHERE (LOWER(user_email) = $1 AND $1 != '') OR (user_phone IS NOT NULL AND user_phone LIKE $2) LIMIT 1`,
    [userEmail || "NOMATCH", cleanDigits ? `%${cleanDigits}` : "NOMATCH"]
  )
  const profileId = profRes.rows[0]?.id || primaryId
  const playerName = sanitizePlayerName(profRes.rows[0]?.user_name || p.userName)
  const playerId = formatPlayerId(profileId)
  const voucherType = voucherTypeForPrice(p.ticketPrice)

  const vouchers: string[] = []
  for (let i = 0; i < p.ticketCount; i++) {
    let inserted = false
    let attempts = 0
    while (!inserted && attempts < 15) {
      attempts++
      const { code, normalizedCode } = generateSingleVoucherCode()
      const res = await client.query(
        `INSERT INTO game_vouchers (
          code, normalized_code, user_id, player_id, player_name,
          contest_id, order_id, voucher_type, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW())
        ON CONFLICT DO NOTHING
        RETURNING code`,
        [code, normalizedCode, profileId, playerId, playerName, p.contestId, p.orderId, voucherType]
      )
      if (res.rows.length > 0) {
        vouchers.push(code)
        inserted = true
      }
    }
    if (!inserted) throw new Error("Failed to generate a unique voucher code after multiple attempts.")
  }

  // 5. Auto-assign random 5-digit draw numbers in contest_tickets
  if (p.autoAssign) {
    for (let i = 0; i < p.ticketCount; i++) {
      let assigned = false
      let attempts = 0
      while (!assigned && attempts < 20) {
        attempts++
        const candidate = String(Math.floor(10000 + Math.random() * 90000))
        const check = await client.query(
          `SELECT id FROM contest_tickets WHERE contest_id = $1 AND ticket_number = $2 LIMIT 1`,
          [p.contestId, candidate]
        )
        if (check.rows.length === 0) {
          await client.query(
            `INSERT INTO contest_tickets (id, contest_id, user_phone, user_email, user_name, ticket_number, order_id, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [`TKT-${Date.now()}-${candidate}-${i}`, p.contestId, userPhone, userEmail, p.userName || "Member", candidate, p.orderId]
          )
          assigned = true
        }
      }
    }
  }

  // 6. Referral economics and unlock thresholds
  const settingsRes = await client.query(
    `SELECT key, value FROM site_settings
     WHERE key IN ('contest_referral_drive_pct', 'contest_referral_cash_pct', 'contest_cash_unlock_threshold')`
  )
  const sMap = new Map(settingsRes.rows.map((r: { key: string; value: string }) => [r.key, r.value]))
  const driveRewardPct = (Number(sMap.get("contest_referral_drive_pct")) || 25) / 100
  const cashCommissionPct = (Number(sMap.get("contest_referral_cash_pct")) || 25) / 100
  const cashUnlockThreshold = Number(sMap.get("contest_cash_unlock_threshold")) || 20

  // 7. Update Buyer's Referral Profile
  await client.query(
    `UPDATE referral_profiles
     SET tickets_bought = tickets_bought + $1,
         is_cash_unlocked = CASE WHEN (tickets_bought + $1) >= $2 THEN TRUE ELSE is_cash_unlocked END,
         updated_at = NOW()
     WHERE LOWER(user_email) = $3 OR user_phone = $4`,
    [p.ticketCount, cashUnlockThreshold, userEmail, userPhone || "NONE"]
  )

  // 8. Referral commission. A buyer can never earn commission on their own purchase.
  if (codeToUse) {
    const refQuery = await client.query(
      `SELECT user_email, user_phone, is_cash_unlocked FROM referral_profiles WHERE UPPER(referral_code) = $1 LIMIT 1`,
      [codeToUse]
    )
    const referrer = refQuery.rows[0]
    const refDigits = String(referrer?.user_phone || "").replace(/\D/g, "").slice(-10)
    const isSelfReferral =
      !!referrer &&
      ((!!userEmail && String(referrer.user_email || "").toLowerCase() === userEmail) ||
        (!!cleanDigits && refDigits === cleanDigits))

    if (referrer && !isSelfReferral) {
      const bonusCredits = Math.round(creditsIssued * driveRewardPct)
      const cashCommission = referrer.is_cash_unlocked ? Math.round(cost * cashCommissionPct) : 0
      const refId = (referrer.user_email || referrer.user_phone || "referrer").toLowerCase()

      await client.query(
        `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_id, payment_gateway, created_at, updated_at)
         VALUES ($1, $2, 'referral_bonus', 0, $3, $3, 'active', $4, 'referral', NOW(), NOW())`,
        [`crd_ref_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`, refId, bonusCredits, p.paymentId]
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

  return { created: true, creditsIssued, vouchers }
}

/** Constant-time check of Razorpay's checkout signature: HMAC_SHA256(order_id|payment_id, key_secret). */
export function isValidRazorpaySignature(orderId: string, paymentId: string, signature: string, keySecret: string): boolean {
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex")
  const a = Buffer.from(expected)
  const b = Buffer.from(String(signature))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export interface RazorpayOrderRecord {
  id: string
  amount: number
  currency: string
  notes?: Record<string, string>
}

export interface RazorpayPaymentRecord {
  id: string
  order_id: string
  amount: number
  currency: string
  status: string
}

/**
 * Confirms with the gateway that the payment really belongs to this order and covers it in full.
 * The order (created server-side) is the source of truth for what was bought.
 */
export function checkRazorpayPayment(order: RazorpayOrderRecord, payment: RazorpayPaymentRecord): string | null {
  if (payment.order_id !== order.id) return "Payment does not belong to this order."
  if (payment.status !== "captured" && payment.status !== "authorized") return "Payment has not been completed."
  if (payment.currency !== order.currency || payment.amount !== order.amount) return "Payment amount does not match the order."
  return null
}

/** Rebuilds the purchase from the order's server-written notes. */
export function purchaseFromOrderNotes(order: RazorpayOrderRecord): Omit<PaidTicketPurchase, "orderId" | "paymentId" | "gateway"> | null {
  const n = order.notes || {}
  const ticketCount = Number(n.ticketCount)
  const ticketPrice = Number(n.ticketPrice)
  const creditsPerTicket = Number(n.creditsPerTicket)
  if (!n.contestId || !Number.isInteger(ticketCount) || ticketCount < 1 || !ticketPrice || !creditsPerTicket) return null
  if (ticketCount * ticketPrice * 100 !== order.amount) return null
  return {
    contestId: n.contestId,
    ticketCount,
    ticketPrice,
    creditsPerTicket,
    userEmail: n.userEmail || "",
    userPhone: n.userPhone || "",
    userName: n.userName || undefined,
    referralCode: n.referralCode || undefined,
    autoAssign: n.autoAssign === "1",
  }
}
