"use server"

import { pool } from "./db"
import type { Contest, ContestTicket } from "./types"

export async function getContests(): Promise<Contest[]> {
  try {
    const res = await pool.query(`
      SELECT 
        id, title, subtitle, car_name as "carName", image_url as "imageUrl",
        gallery_images as "galleryImages", youtube_url as "youtubeUrl",
        worth_display as "worthDisplay", target_tickets as "targetTickets",
        sold_tickets as "soldTickets", ticket_price as "ticketPrice",
        credits_per_ticket as "creditsPerTicket", status,
        draw_date as "drawDate", winner_ticket_number as "winnerTicketNumber",
        winner_name as "winnerName"
      FROM contests
      ORDER BY CASE WHEN status = 'active' THEN 0 ELSE 1 END, created_at ASC
    `)
    return res.rows.map((r) => ({
      ...r,
      galleryImages: Array.isArray(r.galleryImages)
        ? r.galleryImages
        : typeof r.galleryImages === "string"
        ? JSON.parse(r.galleryImages || "[]")
        : [],
      youtubeUrl: r.youtubeUrl || "",
    }))
  } catch (err) {
    console.error("[getContests error]:", err)
    return [
      {
        id: "porsche-718",
        title: "PORSCHE 718 CAYMAN",
        subtitle: "The yellow mid-engine legend. One lucky entry drives it home.",
        carName: "Porsche 718 Cayman",
        imageUrl: "/cars/porsche-side.png",
        worthDisplay: "Worth over ₹1.6 Crore",
        targetTickets: 10000,
        soldTickets: 6300,
        ticketPrice: 1000,
        creditsPerTicket: 1000,
        status: "active",
      },
    ]
  }
}

export async function getActiveContest(): Promise<Contest> {
  const all = await getContests()
  return all.find((c) => c.status === "active") || all[0]
}

export async function getUserTickets(
  email?: string,
  phone?: string,
  contestId?: string
): Promise<ContestTicket[]> {
  let cleanEmail = email?.trim().toLowerCase() || ""
  let cleanPhone = phone?.replace(/\D/g, "") || ""

  // Auto-resolve associated phone/email if only one was provided
  try {
    if (!cleanPhone && cleanEmail) {
      const pRes = await pool.query(
        `SELECT user_phone FROM referral_profiles WHERE LOWER(user_email) = $1 AND user_phone IS NOT NULL AND user_phone != '' LIMIT 1`,
        [cleanEmail]
      )
      if (pRes.rows.length > 0) {
        cleanPhone = pRes.rows[0].user_phone.replace(/\D/g, "")
      }
    } else if (!cleanEmail && cleanPhone) {
      const eRes = await pool.query(
        `SELECT user_email FROM referral_profiles WHERE user_phone = $1 AND user_email IS NOT NULL AND user_email != '' LIMIT 1`,
        [cleanPhone]
      )
      if (eRes.rows.length > 0) {
        cleanEmail = eRes.rows[0].user_email.trim().toLowerCase()
      }
    }
  } catch {
    // fallback
  }

  if (!cleanEmail && !cleanPhone) return []

  try {
    const whereClauses: string[] = [
      `((ct.user_email IS NOT NULL AND LOWER(ct.user_email) = $1)
        OR (ct.user_phone IS NOT NULL AND ct.user_phone != '' AND ct.user_phone LIKE $2))`
    ]
    const params: any[] = [cleanEmail || "NOMATCH", `%${cleanPhone ? cleanPhone.slice(-10) : "NOMATCH"}`]

    if (contestId && contestId !== "all") {
      params.push(contestId)
      whereClauses.push(`ct.contest_id = $${params.length}`)
    }

    const res = await pool.query(
      `SELECT ct.id, ct.contest_id as "contestId", ct.user_phone as "userPhone", ct.user_email as "userEmail",
              ct.user_name as "userName", ct.ticket_number as "ticketNumber", ct.order_id as "orderId",
              ct.created_at as "createdAt",
              COALESCE(c.title, 'PORSCHE 718 CAYMAN') as "contestTitle",
              COALESCE(c.car_name, 'Porsche 718 Cayman') as "carName",
              COALESCE(c.status, 'active') as "contestStatus",
              c.winner_ticket_number as "winnerTicketNumber",
              c.draw_date as "drawDate"
       FROM contest_tickets ct
       LEFT JOIN contests c ON ct.contest_id = c.id
       WHERE ${whereClauses.join(" AND ")}
       ORDER BY ct.created_at DESC`,
      params
    )
    return res.rows
  } catch (err) {
    console.error("[getUserTickets error]:", err)
    return []
  }
}

export async function getUserTicketStats(
  email?: string,
  phone?: string,
  contestId: string = "porsche-718"
): Promise<{
  totalBought: number
  totalAssigned: number
  availableToAssign: number
  tickets: ContestTicket[]
}> {
  let cleanEmail = email?.trim().toLowerCase() || ""
  let cleanPhone = phone?.replace(/\D/g, "") || ""

  try {
    if (!cleanPhone && cleanEmail) {
      const pRes = await pool.query(
        `SELECT user_phone FROM referral_profiles WHERE LOWER(user_email) = $1 AND user_phone IS NOT NULL AND user_phone != '' LIMIT 1`,
        [cleanEmail]
      )
      if (pRes.rows.length > 0) {
        cleanPhone = pRes.rows[0].user_phone.replace(/\D/g, "")
      }
    } else if (!cleanEmail && cleanPhone) {
      const eRes = await pool.query(
        `SELECT user_email FROM referral_profiles WHERE user_phone = $1 AND user_email IS NOT NULL AND user_email != '' LIMIT 1`,
        [cleanPhone]
      )
      if (eRes.rows.length > 0) {
        cleanEmail = eRes.rows[0].user_email.trim().toLowerCase()
      }
    }
  } catch {
    // fallback
  }

  if (!cleanEmail && !cleanPhone) {
    return { totalBought: 0, totalAssigned: 0, availableToAssign: 0, tickets: [] }
  }

  try {
    const [ordersRes, allTickets] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(ticket_count), 0) as total_bought 
         FROM contest_orders 
         WHERE contest_id = $1 
           AND (
             (user_email IS NOT NULL AND LOWER(user_email) = $2)
             OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $3)
           )
           AND status = 'completed'`,
        [contestId, cleanEmail || "NOMATCH", `%${cleanPhone ? cleanPhone.slice(-10) : "NOMATCH"}`]
      ),
      getUserTickets(cleanEmail, cleanPhone, contestId)
    ])

    const totalBought = Number(ordersRes.rows[0]?.total_bought) || 0
    const activeAssigned = allTickets.filter(
      (t) => t.contestId === contestId || t.contestStatus === "active"
    ).length
    const availableToAssign = Math.max(0, totalBought - activeAssigned)

    return {
      totalBought,
      totalAssigned: activeAssigned,
      availableToAssign,
      tickets: allTickets,
    }
  } catch (err) {
    console.error("[getUserTicketStats error]:", err)
    return { totalBought: 0, totalAssigned: 0, availableToAssign: 0, tickets: [] }
  }
}

export async function getUserReferrals(referralCode: string) {
  if (!referralCode) return []
  try {
    const res = await pool.query(
      `SELECT id, user_name as "userName", user_email as "userEmail", 
              ticket_count as "ticketCount", amount_paid as "amountPaid", 
              ROUND(amount_paid * 0.25) as "creditsEarned",
              ROUND(amount_paid * 0.25) as "cashEarned",
              created_at as "createdAt"
       FROM contest_orders
       WHERE UPPER(referral_code_used) = UPPER($1) AND status = 'completed'
       ORDER BY created_at DESC`,
      [referralCode.trim()]
    )
    return res.rows
  } catch (err) {
    console.error("[getUserReferrals error]:", err)
    return []
  }
}

