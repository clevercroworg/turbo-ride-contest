"use server"

import { pool } from "./db"
import { revalidatePath } from "next/cache"
import { loginOrSignupMember } from "./auth"
import { cookies } from "next/headers"
import { generateSingleVoucherCode, formatPlayerId, sanitizePlayerName, voucherTypeForPrice } from "./vouchers"

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
    let digits = phone?.replace(/\D/g, "") || ""

    if (!digits && cleanEmail) {
      const pRes = await pool.query(
        `SELECT user_phone FROM referral_profiles WHERE LOWER(user_email) = $1 AND user_phone IS NOT NULL AND user_phone != '' LIMIT 1`,
        [cleanEmail]
      )
      if (pRes.rows.length > 0) {
        digits = pRes.rows[0].user_phone.replace(/\D/g, "")
      }
    }
    
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

