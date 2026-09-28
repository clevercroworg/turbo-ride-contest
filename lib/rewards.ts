"use server"

import { pool } from "./db"
import { revalidatePath } from "next/cache"
import { REWARDS_CATALOG } from "./catalog"
import type { RewardItem, ActiveVoucher } from "./types"

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Safe fallback
  }
}

export async function getRewardsCatalog(): Promise<RewardItem[]> {
  return REWARDS_CATALOG
}

/**
 * Fetch all active track pass vouchers awaiting booking for a member
 */
export async function getUserPendingVouchers(
  email?: string,
  phone?: string
): Promise<ActiveVoucher[]> {
  const cleanEmail = email?.trim().toLowerCase() || ""
  const digits = phone?.replace(/\D/g, "") || ""
  if (!cleanEmail && !digits) return []

  try {
    const res = await pool.query(
      `SELECT id, user_phone, user_email, user_name, reward_id, reward_title, credits_spent, 
              status, ref_code, created_at
       FROM reward_redemptions 
       WHERE (LOWER(user_email) = $1 OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2))
         AND status = 'pending_booking'
       ORDER BY created_at DESC`,
      [cleanEmail || "NOMATCH", `%${digits ? digits.slice(-10) : "NOMATCH"}`]
    )

    const bookingBase = process.env.NEXT_PUBLIC_BOOKING_APP_URL || "https://book.turboridesupercars.com"

    return res.rows.map((row) => {
      const reward = REWARDS_CATALOG.find((r) => r.id === row.reward_id)
      const params = new URLSearchParams({
        voucher: row.ref_code || row.id,
        redemption: row.id,
        reward: row.reward_id,
        credits: String(row.credits_spent),
        email: row.user_email || cleanEmail,
        phone: row.user_phone || digits,
      })
      if (reward?.bookingCarId) params.set("car", reward.bookingCarId)
      if (reward?.bookingLaps) params.set("laps", String(reward.bookingLaps))
      if (reward?.addonType) params.set("addon", reward.addonType)

      return {
        id: row.id,
        code: row.ref_code || row.id,
        rewardId: row.reward_id,
        rewardTitle: row.reward_title,
        creditsSpent: Number(row.credits_spent),
        status: row.status as "pending_booking",
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
        bookingUrl: `${bookingBase}/checkout?${params.toString()}`,
        bookingCarId: reward?.bookingCarId,
        bookingLaps: reward?.bookingLaps,
      }
    })
  } catch (err) {
    console.error("[getUserPendingVouchers error]:", err)
    return []
  }
}

/**
 * Redeem credits for a track experience voucher with escrow protection
 */
export async function redeemRewardAction(params: {
  rewardId: string
  userEmail: string
  userPhone: string
  userName?: string
}): Promise<{ ok: boolean; voucherCode?: string; redemptionId?: string; redirectUrl?: string; error?: string }> {
  const { rewardId, userEmail, userPhone, userName } = params
  const reward = REWARDS_CATALOG.find((r) => r.id === rewardId)

  if (!reward) {
    return { ok: false, error: "Invalid reward item selected." }
  }

  const cleanEmail = userEmail.trim().toLowerCase()
  const digits = userPhone?.replace(/\D/g, "") || ""

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // 1. Fetch active credit packs for user with row-level locking
    const packsRes = await client.query(
      `SELECT id, credits_remaining 
       FROM user_credits 
       WHERE (LOWER(identifier) = $1 OR (identifier IS NOT NULL AND identifier != '' AND identifier LIKE $2))
         AND status = 'active'
         AND credits_remaining > 0
       ORDER BY created_at ASC
       FOR UPDATE`,
      [cleanEmail || "NOMATCH", `%${digits ? digits.slice(-10) : "NOMATCH"}`]
    )

    const totalAvailable = packsRes.rows.reduce((sum, r) => sum + Number(r.credits_remaining), 0)

    if (totalAvailable < reward.creditsRequired) {
      await client.query("ROLLBACK")
      return {
        ok: false,
        error: `Insufficient drive credits. You have ${totalAvailable.toLocaleString("en-IN")} credits available, but ${reward.title} requires ${reward.creditsRequired.toLocaleString("en-IN")} credits.`,
      }
    }

    // 2. Sequentially debit credits across user's credit packs
    let needed = reward.creditsRequired
    let firstCreditId = packsRes.rows[0].id

    for (const pack of packsRes.rows) {
      if (needed <= 0) break
      const current = Number(pack.credits_remaining)
      const toDeduct = Math.min(current, needed)

      await client.query(
        `UPDATE user_credits 
         SET credits_remaining = credits_remaining - $1, updated_at = NOW() 
         WHERE id = $2`,
        [toDeduct, pack.id]
      )
      needed -= toDeduct
    }

    const remainingTotal = totalAvailable - reward.creditsRequired
    const redemptionId = `RDM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
    const carTag = (reward.bookingCarId?.replace(/[^a-zA-Z0-9]/g, "") || "PASS").slice(0, 5).toUpperCase()
    const passCode = `TR-${carTag}-${Math.floor(10000 + Math.random() * 90000)}`

    // 3. Log debit into credit_transactions table
    await client.query(
      `INSERT INTO credit_transactions (id, credit_id, identifier, amount_debited, balance_after, description, booking_ref, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        `CTX-${Date.now()}`,
        firstCreditId,
        cleanEmail,
        reward.creditsRequired,
        remainingTotal,
        `Voucher Escrow: ${reward.title} (${passCode})`,
        redemptionId,
      ]
    )

    // 4. Record in reward_redemptions table with status 'pending_booking'
    await client.query(
      `INSERT INTO reward_redemptions (id, user_phone, user_email, user_name, reward_id, reward_title, credits_spent, status, ref_code, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending_booking', $8, NOW())`,
      [redemptionId, userPhone, cleanEmail, userName || "Member", reward.id, reward.title, reward.creditsRequired, passCode]
    )

    // 5. Insert corresponding voucher into shared vouchers table
    await client.query(
      `INSERT INTO vouchers (
        code, kind, discount_kind, status, face_value, discount_value,
        purchaser_email, recipient_email, purchaser_name, recipient_name,
        single_use, max_use, used_count, created_at, expires_at
       )
       VALUES ($1, 'gift', 'amount', 'active', $2, $2, $3, $3, $4, $4, true, 1, 0, NOW(), NOW() + interval '90 days')
       ON CONFLICT (code) DO NOTHING`,
      [passCode, reward.creditsRequired, cleanEmail, userName || "Member"]
    )

    await client.query("COMMIT")

    // 6. Construct TurboRide Booking Engine redirect URL
    const bookingBase = process.env.NEXT_PUBLIC_BOOKING_APP_URL || "https://book.turboridesupercars.com"
    const paramsQuery = new URLSearchParams({
      voucher: passCode,
      redemption: redemptionId,
      reward: reward.id,
      credits: String(reward.creditsRequired),
      email: cleanEmail,
      phone: userPhone || "",
    })

    if (reward.bookingCarId) paramsQuery.set("car", reward.bookingCarId)
    if (reward.bookingLaps) paramsQuery.set("laps", String(reward.bookingLaps))
    if (reward.addonType) paramsQuery.set("addon", reward.addonType)

    const redirectUrl = `${bookingBase}/checkout?${paramsQuery.toString()}`

    safeRevalidate("/members")
    safeRevalidate("/members/rewards")
    safeRevalidate("/admin/redemptions")

    return { ok: true, voucherCode: passCode, redemptionId, redirectUrl }
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("[redeemRewardAction error]:", err)
    return { ok: false, error: "Failed to redeem reward. Please try again." }
  } finally {
    client.release()
  }
}

/**
 * 1-Click Self-Service Voucher Cancellation & Full Credit Restoration
 * Used when a member returns to the contest dashboard without completing booking.
 */
export async function cancelRedemptionAction(params: {
  redemptionId: string
  userEmail?: string
  userPhone?: string
}): Promise<{ ok: boolean; creditsRestored?: number; error?: string }> {
  const { redemptionId } = params
  if (!redemptionId) {
    return { ok: false, error: "Missing redemption ID." }
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // 1. Fetch redemption record for update
    const redRes = await client.query(
      `SELECT id, user_email, user_phone, reward_title, credits_spent, status, ref_code
       FROM reward_redemptions 
       WHERE id = $1 
       FOR UPDATE`,
      [redemptionId]
    )

    if (redRes.rows.length === 0) {
      await client.query("ROLLBACK")
      return { ok: false, error: "Voucher not found." }
    }

    const redemption = redRes.rows[0]

    if (redemption.status === "cancelled") {
      await client.query("ROLLBACK")
      return { ok: false, error: "This voucher has already been cancelled and refunded." }
    }

    if (redemption.status === "fulfilled" || redemption.status === "scheduled") {
      await client.query("ROLLBACK")
      return { ok: false, error: "This voucher is already scheduled or fulfilled on the track and cannot be cancelled automatically." }
    }

    const creditsToRestore = Number(redemption.credits_spent)
    const primaryId = redemption.user_email || redemption.user_phone || "unknown"

    // 2. Mark redemption as cancelled
    await client.query(
      `UPDATE reward_redemptions 
       SET status = 'cancelled' 
       WHERE id = $1`,
      [redemptionId]
    )

    // 3. Mark voucher in vouchers table as disabled
    if (redemption.ref_code) {
      await client.query(
        `UPDATE vouchers 
         SET status = 'disabled' 
         WHERE code = $1`,
        [redemption.ref_code]
      )
    }

    // 4. Restore credits into user_credits by adding a refund pack
    const refundPackId = `crd_refund_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
    await client.query(
      `INSERT INTO user_credits (id, identifier, pack_id, amount_paid, credits_granted, credits_remaining, status, payment_gateway, created_at, updated_at)
       VALUES ($1, $2, 'pass_refund', 0, $3, $3, 'active', 'system_refund', NOW(), NOW())`,
      [refundPackId, primaryId, creditsToRestore]
    )

    // 5. Query user's new total balance
    const balRes = await client.query(
      `SELECT COALESCE(SUM(credits_remaining), 0) as balance 
       FROM user_credits 
       WHERE identifier = $1 AND status = 'active'`,
      [primaryId]
    )
    const newBal = Number(balRes.rows[0]?.balance || creditsToRestore)

    // 6. Log transaction
    await client.query(
      `INSERT INTO credit_transactions (id, credit_id, identifier, amount_debited, balance_after, description, booking_ref, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        `CTX-${Date.now()}`,
        refundPackId,
        primaryId,
        -creditsToRestore,
        newBal,
        `Voucher Cancelled: Restored ${creditsToRestore.toLocaleString("en-IN")} Credits (${redemption.reward_title})`,
        redemptionId,
      ]
    )

    await client.query("COMMIT")

    safeRevalidate("/members")
    safeRevalidate("/members/rewards")
    safeRevalidate("/admin/redemptions")

    return { ok: true, creditsRestored: creditsToRestore }
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("[cancelRedemptionAction error]:", err)
    return { ok: false, error: "Failed to cancel voucher and restore credits. Please try again." }
  } finally {
    client.release()
  }
}

/**
 * Admin action to mark a voucher fulfilled or scheduled
 */
export async function updateRedemptionStatusAction(
  redemptionId: string,
  newStatus: "scheduled" | "fulfilled" | "cancelled"
): Promise<{ ok: boolean; error?: string }> {
  try {
    await pool.query(
      `UPDATE reward_redemptions SET status = $1 WHERE id = $2`,
      [newStatus, redemptionId]
    )
    safeRevalidate("/admin/redemptions")
    safeRevalidate("/members")
    return { ok: true }
  } catch (err) {
    console.error("[updateRedemptionStatusAction error]:", err)
    return { ok: false, error: "Failed to update redemption status." }
  }
}
