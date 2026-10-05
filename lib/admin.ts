"use server"

import { pool } from "./db"
import { revalidatePath } from "next/cache"
import type { AdminPlatformSettings } from "./types"

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Safe fallback
  }
}

export interface AdminContest {
  id: string
  title: string
  subtitle: string
  carName: string
  imageUrl: string
  galleryImages?: string[]
  youtubeUrl?: string
  worthDisplay: string
  targetTickets: number
  soldTickets: number
  ticketPrice: number
  creditsPerTicket: number
  status: string
  drawDate?: string
  winnerName?: string
  winnerTicketNumber?: string
}

export interface AdminMember {
  id: string
  name: string
  email: string
  phone: string
  referralCode: string
  ticketsBought: number
  creditsBalance: number
  referralsCount: number
  cashEarned: number
  status: "active" | "kyc_pending" | "flagged"
  joinedAt: string
}

export interface AdminOrder {
  id: string
  userName: string
  userEmail: string
  userPhone: string
  contestId: string
  ticketCount: number
  amountPaid: number
  creditsIssued: number
  paymentGateway: string
  status: "completed" | "pending" | "refunded"
  createdAt: string
}

export interface AdminPayout {
  id: string
  payoutCode: string
  userName: string
  userEmail: string
  userPhone: string
  referralsCount: number
  amount: number
  status: "due" | "hold" | "paid"
  requestedAt: string
  paidAt?: string
  notes?: string
  upiId?: string
  bankAccount?: string
}

export interface AdminRedemption {
  id: string
  refCode: string
  userName: string
  userEmail: string
  rewardTitle: string
  creditsSpent: number
  venue: string
  slot: string
  status: "Requested" | "Scheduled" | "Fulfilled" | string
  createdAt: string
}

export interface AdminTicket {
  id: string
  contestId: string
  ticketNumber: string
  userEmail: string
  userPhone: string
  userName?: string
  orderId?: string
  createdAt: string
  contestTitle?: string
  carName?: string
  contestStatus?: string
  isWinner?: boolean
}

export interface SupportReply {
  id: string
  sender: "user" | "admin" | "support"
  senderName: string
  content: string
  createdAt: string
}

export interface AdminSupportTicket {
  id: string
  ticketCode: string
  userEmail: string
  userName: string
  userPhone: string
  subject: string
  description: string
  status: "open" | "resolved" | "in_progress"
  category: string
  replies: SupportReply[]
  createdAt: string
  updatedAt: string
}

function formatRelativeTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "Recently"
  const d = new Date(dateInput)
  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000))
  if (diffSec < 60) return "Just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} hr ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 30) return `${diffDays} days ago`
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export async function getAdminOverviewData() {
  try {
    const [
      ordersRes,
      contestsRes,
      membersRes,
      payoutsRes,
      creditsRes,
      redemptionsRes,
      ticketsRes,
    ] = await Promise.all([
      pool.query(`SELECT * FROM contest_orders ORDER BY created_at DESC LIMIT 50`),
      pool.query(`SELECT * FROM contests ORDER BY created_at ASC`),
      pool.query(`SELECT * FROM referral_profiles ORDER BY created_at DESC`),
      pool.query(`SELECT * FROM referral_payouts ORDER BY requested_at DESC`),
      pool.query(`SELECT COALESCE(SUM(credits_granted), 0) as issued, COALESCE(SUM(credits_remaining), 0) as remaining FROM user_credits WHERE status = 'active'`),
      pool.query(`SELECT * FROM reward_redemptions ORDER BY created_at DESC LIMIT 20`),
      pool.query(`SELECT COUNT(*) as count FROM contest_tickets`),
    ])

    const orders = ordersRes.rows
    const contests = contestsRes.rows
    const members = membersRes.rows
    const payouts = payoutsRes.rows
    const redemptions = redemptionsRes.rows

    const activeContest = contests.find((c) => c.status === "active") || contests[0]

    // 100% Real DB Calculations - Zero mock fallbacks
    const ticketsSoldFromOrders = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + Number(o.ticket_count || 0), 0)
    const ticketsSoldFromContests = contests.reduce((sum, c) => sum + Number(c.sold_tickets || 0), 0)
    const ticketsSold = Math.max(ticketsSoldFromOrders, ticketsSoldFromContests)

    const revenueFromOrders = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + Number(o.amount_paid || 0), 0)
    const grossRevenue = revenueFromOrders > 0
      ? revenueFromOrders
      : contests.reduce((sum, c) => sum + Number(c.sold_tickets || 0) * Number(c.ticket_price || 1000), 0)

    const activeMembersCount = members.length

    const duePayouts = payouts.filter((p) => p.status === "due")
    const cashCommissionOwed = duePayouts.reduce((sum, p) => sum + Number(p.amount || 0), 0)

    const totalCreditsIssued = Number(creditsRes.rows[0]?.issued || 0)
    const totalCreditsRedeemed = redemptions.reduce((sum, r) => sum + Number(r.credits_spent || 0), 0)

    const contestFill = activeContest && Number(activeContest.target_tickets) > 0
      ? Math.round((Number(activeContest.sold_tickets) / Number(activeContest.target_tickets)) * 100)
      : 0

    const liveContestsCount = contests.filter((c) => c.status === "active").length

    // Dynamic Live Activity Feed generated 100% from actual database events
    const liveEvents: Array<{ id: string; title: string; time: string; type: string; timestamp: number }> = []

    for (const o of orders) {
      if (o.status === "completed") {
        liveEvents.push({
          id: `act-ord-${o.id}`,
          title: `${o.user_name || "Customer"} purchased ${o.ticket_count || 1} tickets (₹${Number(o.amount_paid || 0).toLocaleString("en-IN")})`,
          time: formatRelativeTime(o.created_at),
          type: "order",
          timestamp: new Date(o.created_at).getTime(),
        })
      }
    }

    for (const p of payouts) {
      liveEvents.push({
        id: `act-pay-${p.id}`,
        title: `Payout ${p.payout_code || p.id} marked ${p.status} to ${p.user_name || "Member"} (₹${Number(p.amount || 0).toLocaleString("en-IN")})`,
        time: formatRelativeTime(p.requested_at),
        type: "payout",
        timestamp: new Date(p.requested_at).getTime(),
      })
    }

    for (const r of redemptions) {
      liveEvents.push({
        id: `act-red-${r.id}`,
        title: `Redemption ${r.ref_code || r.id} (${r.status}) — ${r.reward_title || "Experience"}`,
        time: formatRelativeTime(r.created_at),
        type: "redemption",
        timestamp: new Date(r.created_at).getTime(),
      })
    }

    // Sort by most recent timestamp
    liveEvents.sort((a, b) => b.timestamp - a.timestamp)
    const activities = liveEvents.slice(0, 7)

    return {
      stats: {
        ticketsSold: ticketsSold || 0,
        grossRevenue: grossRevenue || 0,
        activeMembers: activeMembersCount || 0,
        activeMembersCount: activeMembersCount || 0,
        cashCommissionOwed: cashCommissionOwed || 0,
        creditsIssued: totalCreditsIssued || 0,
        totalCreditsIssued: totalCreditsIssued || 0,
        creditsRedeemed: totalCreditsRedeemed || 0,
        totalCreditsRedeemed: totalCreditsRedeemed || 0,
        contestFill: contestFill || 0,
        liveContests: liveContestsCount || 0,
        liveContestsCount: liveContestsCount || 0,
      },
      recentOrders: orders.slice(0, 7),
      activity: activities,
      activities: activities,
      contests,
      payouts,
      members,
    }
  } catch (err) {
    console.error("[getAdminOverviewData error]:", err)
    throw err
  }
}

// CONTEST MANAGEMENT ACTIONS
export async function getAdminContests(): Promise<AdminContest[]> {
  try {
    const res = await pool.query(`SELECT * FROM contests ORDER BY created_at ASC`)
    return res.rows.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      carName: r.car_name,
      imageUrl: r.image_url,
      galleryImages: Array.isArray(r.gallery_images)
        ? r.gallery_images
        : typeof r.gallery_images === "string"
        ? JSON.parse(r.gallery_images || "[]")
        : [],
      youtubeUrl: r.youtube_url || "",
      worthDisplay: r.worth_display,
      targetTickets: Number(r.target_tickets),
      soldTickets: Number(r.sold_tickets),
      ticketPrice: Number(r.ticket_price || 1000),
      creditsPerTicket: Number(r.credits_per_ticket || 1000),
      status: r.status,
      drawDate: r.draw_date,
      winnerName: r.winner_name,
      winnerTicketNumber: r.winner_ticket_number,
    }))
  } catch (err) {
    console.error("[getAdminContests error]:", err)
    return []
  }
}

export async function updateContestAction(
  contestId: string,
  data: Partial<AdminContest>
): Promise<{ ok: boolean; error?: string }> {
  try {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (data.carName !== undefined) {
      fields.push(`car_name = $${idx++}`)
      values.push(data.carName)
    }
    if (data.title !== undefined) {
      fields.push(`title = $${idx++}`)
      values.push(data.title)
    }
    if (data.subtitle !== undefined) {
      fields.push(`subtitle = $${idx++}`)
      values.push(data.subtitle)
    }
    if (data.worthDisplay !== undefined) {
      fields.push(`worth_display = $${idx++}`)
      values.push(data.worthDisplay)
    }
    if (data.ticketPrice !== undefined) {
      fields.push(`ticket_price = $${idx++}`)
      values.push(data.ticketPrice)
      fields.push(`credits_per_ticket = $${idx++}`)
      values.push(data.ticketPrice) // Keep 1:1 drive credits
    }
    if (data.targetTickets !== undefined) {
      fields.push(`target_tickets = $${idx++}`)
      values.push(data.targetTickets)
    }
    if (data.soldTickets !== undefined) {
      fields.push(`sold_tickets = $${idx++}`)
      values.push(data.soldTickets)
    }
    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`)
      values.push(data.status)
    }
    if (data.drawDate !== undefined) {
      fields.push(`draw_date = $${idx++}`)
      values.push(data.drawDate ? new Date(data.drawDate) : null)
    }
    if (data.imageUrl !== undefined) {
      fields.push(`image_url = $${idx++}`)
      values.push(data.imageUrl)
    }
    if (data.galleryImages !== undefined) {
      fields.push(`gallery_images = $${idx++}::jsonb`)
      values.push(JSON.stringify(data.galleryImages))
    }
    if (data.youtubeUrl !== undefined) {
      fields.push(`youtube_url = $${idx++}`)
      values.push(data.youtubeUrl)
    }
    if (data.winnerName !== undefined) {
      fields.push(`winner_name = $${idx++}`)
      values.push(data.winnerName)
    }
    if (data.winnerTicketNumber !== undefined) {
      fields.push(`winner_ticket_number = $${idx++}`)
      values.push(data.winnerTicketNumber)
    }

    if (fields.length === 0) return { ok: true }

    fields.push(`updated_at = NOW()`)
    values.push(contestId)

    await pool.query(
      `UPDATE contests SET ${fields.join(", ")} WHERE id = $${idx}`,
      values
    )

    if (data.status === "active") {
      await pool.query(
        `UPDATE contests SET status = 'upcoming', updated_at = NOW() WHERE id != $1 AND status != 'completed'`,
        [contestId]
      )
    }

    revalidatePath("/")
    revalidatePath("/members")
    revalidatePath("/admin")
    return { ok: true }
  } catch (err: any) {
    console.error("[updateContestAction error]:", err)
    return { ok: false, error: err.message || "Failed to update contest." }
  }
}

export async function setActiveContestAction(contestId: string): Promise<{ ok: boolean; error?: string }> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    // Set all others to upcoming (preserving completed contests)
    await client.query(`UPDATE contests SET status = 'upcoming', updated_at = NOW() WHERE id != $1 AND status != 'completed'`, [contestId])
    // Set selected to active
    await client.query(`UPDATE contests SET status = 'active', updated_at = NOW() WHERE id = $1`, [contestId])
    
    // Sync ticket price from site_settings to ensure price consistency
    const priceRes = await client.query(`SELECT value FROM site_settings WHERE key = 'contest_ticket_price' LIMIT 1`)
    if (priceRes.rows.length > 0 && Number(priceRes.rows[0].value)) {
      const activePrice = Number(priceRes.rows[0].value)
      await client.query(`UPDATE contests SET ticket_price = $1, credits_per_ticket = $1 WHERE id = $2`, [activePrice, contestId])
    }
    await client.query("COMMIT")

    revalidatePath("/")
    revalidatePath("/members")
    revalidatePath("/admin")
    return { ok: true }
  } catch (err: any) {
    await client.query("ROLLBACK")
    console.error("[setActiveContestAction error]:", err)
    return { ok: false, error: err.message || "Failed to switch active contest." }
  } finally {
    client.release()
  }
}

export async function createContestAction(data: {
  id: string
  carName: string
  title: string
  subtitle?: string
  worthDisplay: string
  ticketPrice: number
  targetTickets: number
  imageUrl: string
  galleryImages?: string[]
  youtubeUrl?: string
  status: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    await pool.query(
      `INSERT INTO contests (id, car_name, title, subtitle, worth_display, ticket_price, credits_per_ticket, target_tickets, sold_tickets, image_url, gallery_images, youtube_url, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6, $7, 0, $8, $9::jsonb, $10, $11, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET
         car_name = EXCLUDED.car_name,
         title = EXCLUDED.title,
         worth_display = EXCLUDED.worth_display,
         ticket_price = EXCLUDED.ticket_price,
         target_tickets = EXCLUDED.target_tickets,
         gallery_images = EXCLUDED.gallery_images,
         youtube_url = EXCLUDED.youtube_url,
         status = EXCLUDED.status,
         updated_at = NOW()`,
      [
        data.id,
        data.carName,
        data.title,
        data.subtitle || "Official TurboRide Grand Draw",
        data.worthDisplay,
        data.ticketPrice,
        data.targetTickets,
        data.imageUrl,
        JSON.stringify(data.galleryImages || []),
        data.youtubeUrl || "",
        data.status,
      ]
    )

    revalidatePath("/")
    revalidatePath("/members")
    revalidatePath("/admin")
    return { ok: true }
  } catch (err: any) {
    console.error("[createContestAction error]:", err)
    return { ok: false, error: err.message || "Failed to create contest." }
  }
}

// MEMBERS MANAGEMENT ACTIONS
export async function getAdminMembers(): Promise<AdminMember[]> {
  try {
    const res = await pool.query(
      `SELECT 
         id, user_name as "userName", user_email as "userEmail", user_phone as "userPhone",
         referral_code as "referralCode", tickets_bought as "ticketsBought",
         total_credits_earned as "totalCreditsEarned", total_cash_earned as "totalCashEarned",
         total_referred_users as "totalReferredUsers", status, created_at as "createdAt"
       FROM referral_profiles
       ORDER BY created_at DESC`
    )

    return res.rows.map((r) => ({
      id: r.id || `M-${Math.floor(10000 + Math.random() * 90000)}`,
      name: r.userName || "Unnamed Member",
      email: r.userEmail || "member@example.com",
      phone: r.userPhone || "9999999999",
      referralCode: r.referralCode || "TRB001",
      ticketsBought: Number(r.ticketsBought || 0),
      creditsBalance: Number(r.totalCreditsEarned || r.ticketsBought * 1000),
      referralsCount: Number(r.totalReferredUsers || 0),
      cashEarned: Number(r.totalCashEarned || 0),
      status: (r.status as any) || (r.ticketsBought >= 50 ? "active" : "active"),
      joinedAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }))
  } catch (err) {
    console.error("[getAdminMembers error]:", err)
    return []
  }
}

export async function updateMemberStatusAction(
  memberId: string,
  newStatus: "active" | "kyc_pending" | "flagged"
): Promise<{ ok: boolean; error?: string }> {
  try {
    await pool.query(
      `UPDATE referral_profiles SET status = $1, updated_at = NOW() WHERE id = $2 OR user_email = $2`,
      [newStatus, memberId]
    )
    revalidatePath("/admin")
    return { ok: true }
  } catch (err: any) {
    console.error("[updateMemberStatusAction error]:", err)
    return { ok: false, error: err.message || "Failed to update member status." }
  }
}

// ORDERS MANAGEMENT ACTIONS
export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const res = await pool.query(
      `SELECT id, user_name as "userName", user_email as "userEmail", user_phone as "userPhone",
              contest_id as "contestId", ticket_count as "ticketCount", amount_paid as "amountPaid",
              credits_issued as "creditsIssued", payment_gateway as "paymentGateway", status,
              created_at as "createdAt"
       FROM contest_orders
       ORDER BY created_at DESC`
    )

    return res.rows.map((r) => ({
      id: r.id,
      userName: r.userName || "Member",
      userEmail: r.userEmail || "",
      userPhone: r.userPhone || "",
      contestId: r.contestId || "porsche-718",
      ticketCount: Number(r.ticketCount || 0),
      amountPaid: Number(r.amountPaid || 0),
      creditsIssued: Number(r.creditsIssued || 0),
      paymentGateway: r.paymentGateway || "UPI",
      status: r.status === "completed" ? "completed" : r.status === "refunded" ? "refunded" : "pending",
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }))
  } catch (err) {
    console.error("[getAdminOrders error]:", err)
    return []
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: "completed" | "pending" | "refunded"
): Promise<{ ok: boolean; error?: string }> {
  try {
    await pool.query(
      `UPDATE contest_orders SET status = $1 WHERE id = $2`,
      [status, orderId]
    )
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/members")
    return { ok: true }
  } catch (err: any) {
    console.error("[updateOrderStatusAction error]:", err)
    return { ok: false, error: err.message || "Failed to update order status." }
  }
}

// REFERRAL PAYOUTS MANAGEMENT ACTIONS
export async function getAdminPayouts(): Promise<{
  currentPayouts: AdminPayout[]
  payoutHistory: AdminPayout[]
  stats: { dueNow: number; paidToDate: number; onHold: number }
}> {
  try {
    const res = await pool.query(
      `SELECT id, payout_code as "payoutCode", user_name as "userName", user_email as "userEmail",
              user_phone as "userPhone", referrals_count as "referralsCount", amount, status,
              requested_at as "requestedAt", paid_at as "paidAt", notes
       FROM referral_payouts
       ORDER BY requested_at DESC`
    )

    const all: AdminPayout[] = res.rows.map((r) => ({
      id: r.id,
      payoutCode: r.payoutCode,
      userName: r.userName,
      userEmail: r.userEmail,
      userPhone: r.userPhone,
      referralsCount: Number(r.referralsCount || 0),
      amount: Number(r.amount || 0),
      status: r.status as any,
      requestedAt: r.requestedAt ? new Date(r.requestedAt).toISOString() : new Date().toISOString(),
      paidAt: r.paidAt ? new Date(r.paidAt).toISOString() : undefined,
      notes: r.notes || "",
    }))

    const currentPayouts = all.filter((p) => p.status === "due" || p.status === "hold")
    const payoutHistory = all.filter((p) => p.status === "paid")

    const dueNow = currentPayouts
      .filter((p) => p.status === "due")
      .reduce((sum, p) => sum + p.amount, 0)
    const paidToDate = payoutHistory.reduce((sum, p) => sum + p.amount, 0)
    const onHold = currentPayouts.filter((p) => p.status === "hold").length

    return {
      currentPayouts,
      payoutHistory,
      stats: { dueNow, paidToDate, onHold },
    }
  } catch (err) {
    console.error("[getAdminPayouts error]:", err)
    return {
      currentPayouts: [],
      payoutHistory: [],
      stats: { dueNow: 0, paidToDate: 0, onHold: 0 },
    }
  }
}

export async function processPayoutAction(
  payoutId: string,
  newStatus: "paid" | "hold" | "due"
): Promise<{ ok: boolean; error?: string }> {
  try {
    const paidAtSql = newStatus === "paid" ? "NOW()" : "NULL"
    await pool.query(
      `UPDATE referral_payouts 
       SET status = $1, paid_at = ${paidAtSql}, updated_at = NOW() 
       WHERE id = $2 OR payout_code = $2`,
      [newStatus, payoutId]
    )
    revalidatePath("/admin")
    return { ok: true }
  } catch (err: any) {
    console.error("[processPayoutAction error]:", err)
    return { ok: false, error: err.message || "Failed to process payout." }
  }
}

// REDEMPTIONS ACTIONS
export async function getAdminRedemptions(): Promise<AdminRedemption[]> {
  try {
    const res = await pool.query(
      `SELECT id, ref_code as "refCode", user_name as "userName", user_email as "userEmail",
              reward_title as "rewardTitle", credits_spent as "creditsSpent",
              venue, slot, status, created_at as "createdAt"
       FROM reward_redemptions
       ORDER BY created_at DESC`
    )

    return res.rows.map((r, i) => ({
      id: r.id,
      refCode: r.refCode || `RD-${9021 - i}`,
      userName: r.userName || "Entrant",
      userEmail: r.userEmail || "",
      rewardTitle: r.rewardTitle || "Supercar Track Experience",
      creditsSpent: Number(r.creditsSpent || 0),
      venue: r.venue || "Turboride Bengaluru",
      slot: r.slot || "—",
      status: r.status === "completed" ? "Fulfilled" : (r.status || "Requested"),
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }))
  } catch (err) {
    console.error("[getAdminRedemptions error]:", err)
    return []
  }
}

export async function updateRedemptionStatusAction(
  id: string,
  status: "Requested" | "Scheduled" | "Fulfilled",
  slot?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (slot) {
      await pool.query(
        `UPDATE reward_redemptions SET status = $1, slot = $2 WHERE id = $3 OR ref_code = $3`,
        [status, slot, id]
      )
    } else {
      await pool.query(
        `UPDATE reward_redemptions SET status = $1 WHERE id = $2 OR ref_code = $2`,
        [status, id]
      )
    }
    revalidatePath("/admin")
    revalidatePath("/admin/redemptions")
    return { ok: true }
  } catch (err: any) {
    console.error("[updateRedemptionStatusAction error]:", err)
    return { ok: false, error: err.message || "Failed to update redemption." }
  }
}

export async function getAdminTickets(contestId?: string): Promise<AdminTicket[]> {
  try {
    const where = contestId && contestId !== "all" ? "WHERE ct.contest_id = $1" : ""
    const params = contestId && contestId !== "all" ? [contestId] : []
    const res = await pool.query(
      `SELECT ct.id, ct.contest_id as "contestId", ct.user_phone as "userPhone", ct.user_email as "userEmail",
              ct.user_name as "userName", ct.ticket_number as "ticketNumber", ct.order_id as "orderId",
              ct.created_at as "createdAt",
              COALESCE(c.title, 'PORSCHE 718 CAYMAN') as "contestTitle",
              COALESCE(c.car_name, 'Porsche 718 Cayman') as "carName",
              COALESCE(c.status, 'active') as "contestStatus"
       FROM contest_tickets ct
       LEFT JOIN contests c ON ct.contest_id = c.id
       ${where}
       ORDER BY ct.created_at DESC`,
      params
    )
    return res.rows.map((r) => ({
      id: r.id,
      contestId: r.contestId,
      ticketNumber: r.ticketNumber,
      userEmail: r.userEmail || "",
      userPhone: r.userPhone || "",
      userName: r.userName || "Member",
      orderId: r.orderId || undefined,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      contestTitle: r.contestTitle,
      carName: r.carName,
      contestStatus: r.contestStatus,
    }))
  } catch (err) {
    console.error("[getAdminTickets error]:", err)
    return []
  }
}

export async function getAdminSettingsAction(): Promise<AdminPlatformSettings> {
  try {
    const res = await pool.query(
      `SELECT key, value FROM site_settings 
       WHERE key IN (
         'contest_ticket_price',
         'contest_credit_multiplier',
         'contest_max_customer_limit',
         'contest_referral_drive_pct',
         'contest_referral_cash_pct',
         'contest_cash_unlock_threshold',
         'contest_fallback_payout_pct',
         'contest_draw_type',
         'contest_is_paused',
         'contest_is_closed'
       )`
    )
    const map = new Map(res.rows.map((r: { key: string; value: string }) => [r.key, r.value]))
    return {
      ticketPrice: Number(map.get("contest_ticket_price")) || 1000,
      creditsPerTicket: Number(map.get("contest_credit_multiplier")) || 1000,
      maxCustomerPurchaseLimit: Number(map.get("contest_max_customer_limit")) || 100000,
      creditRewardPercent: Number(map.get("contest_referral_drive_pct")) || 25,
      cashCommissionPercent: Number(map.get("contest_referral_cash_pct")) || 25,
      cashUnlockThreshold: Number(map.get("contest_cash_unlock_threshold")) || 25,
      fallbackPayoutPercent: Number(map.get("contest_fallback_payout_pct")) || 70,
      drawType: map.get("contest_draw_type") || "Provably Fair Digital Draw",
      isPaused: map.get("contest_is_paused") === "true",
      isClosed: map.get("contest_is_closed") === "true",
    }
  } catch (err) {
    console.error("[getAdminSettingsAction error]:", err)
    return {
      ticketPrice: 1000,
      creditsPerTicket: 1000,
      maxCustomerPurchaseLimit: 100000,
      creditRewardPercent: 25,
      cashCommissionPercent: 25,
      cashUnlockThreshold: 25,
      fallbackPayoutPercent: 70,
      drawType: "Provably Fair Digital Draw",
      isPaused: false,
      isClosed: false,
    }
  }
}

export async function saveAdminSettingsAction(settings: AdminPlatformSettings): Promise<{ ok: boolean; error?: string }> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const upsertSetting = async (key: string, value: string) => {
      await client.query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      )
    }

    await upsertSetting("contest_ticket_price", String(settings.ticketPrice))
    await upsertSetting("contest_credit_multiplier", String(settings.creditsPerTicket))
    await upsertSetting("contest_max_customer_limit", String(settings.maxCustomerPurchaseLimit || 100000))
    await upsertSetting("contest_referral_drive_pct", String(settings.creditRewardPercent))
    await upsertSetting("contest_referral_cash_pct", String(settings.cashCommissionPercent))
    await upsertSetting("contest_cash_unlock_threshold", String(settings.cashUnlockThreshold))
    await upsertSetting("contest_fallback_payout_pct", String(settings.fallbackPayoutPercent))
    await upsertSetting("contest_draw_type", String(settings.drawType))
    await upsertSetting("contest_is_paused", String(settings.isPaused))
    await upsertSetting("contest_is_closed", String(settings.isClosed))

    // Also synchronize active contest ticket_price and credits_per_ticket
    await client.query(
      `UPDATE contests 
       SET ticket_price = $1, credits_per_ticket = $2, updated_at = NOW()
       WHERE status = 'active'`,
      [settings.ticketPrice, settings.creditsPerTicket]
    )

    await client.query("COMMIT")

    safeRevalidate("/")
    safeRevalidate("/admin")
    safeRevalidate("/admin/settings")
    safeRevalidate("/admin/contests")
    safeRevalidate("/members")

    return { ok: true }
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("[saveAdminSettingsAction error]:", err)
    return { ok: false, error: "Failed to persist platform settings to database." }
  } finally {
    client.release()
  }
}

export async function updateContestShowcaseAction(data: {
  id: string
  title: string
  subtitle: string
  carName: string
  worthDisplay: string
  targetTickets: number
  soldTickets: number
  ticketPrice: number
}): Promise<{ ok: boolean; error?: string }> {
  try {
    await pool.query(
      `UPDATE contests
       SET title = $1, subtitle = $2, car_name = $3, worth_display = $4,
           target_tickets = $5, sold_tickets = $6, ticket_price = $7,
           credits_per_ticket = $7, updated_at = NOW()
       WHERE id = $8`,
      [
        data.title,
        data.subtitle,
        data.carName,
        data.worthDisplay,
        data.targetTickets,
        data.soldTickets,
        data.ticketPrice,
        data.id,
      ]
    )

    safeRevalidate("/")
    safeRevalidate("/admin")
    safeRevalidate("/admin/contests")
    safeRevalidate("/members")

    return { ok: true }
  } catch (err) {
    console.error("[updateContestShowcaseAction error]:", err)
    return { ok: false, error: "Failed to update contest showcase." }
  }
}

// SUPPORT TICKETS MANAGEMENT
export async function getAdminSupportTickets(): Promise<AdminSupportTicket[]> {
  try {
    const res = await pool.query(`SELECT * FROM support_tickets ORDER BY created_at DESC`)
    return res.rows.map((r) => ({
      id: r.id,
      ticketCode: r.ticket_code,
      userEmail: r.user_email,
      userName: r.user_name || "Member",
      userPhone: r.user_phone || "",
      subject: r.subject,
      description: r.description,
      status: (r.status as any) || "open",
      category: r.category || "general",
      replies: Array.isArray(r.replies)
        ? r.replies
        : typeof r.replies === "string"
        ? JSON.parse(r.replies || "[]")
        : [],
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }))
  } catch (err) {
    console.error("[getAdminSupportTickets error]:", err)
    return []
  }
}

export async function replyToSupportTicketAction(
  ticketId: string,
  replyText: string,
  adminName: string = "TurboRide Support"
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!replyText || !replyText.trim()) {
      return { ok: false, error: "Reply text cannot be empty." }
    }
    const ticketRes = await pool.query(`SELECT replies FROM support_tickets WHERE id = $1`, [ticketId])
    if (ticketRes.rows.length === 0) {
      return { ok: false, error: "Ticket not found." }
    }
    const currentReplies: SupportReply[] = Array.isArray(ticketRes.rows[0].replies)
      ? ticketRes.rows[0].replies
      : typeof ticketRes.rows[0].replies === "string"
      ? JSON.parse(ticketRes.rows[0].replies || "[]")
      : []

    const newReply: SupportReply = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: "support",
      senderName: adminName,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedReplies = [...currentReplies, newReply]

    await pool.query(
      `UPDATE support_tickets 
       SET replies = $2::jsonb, updated_at = NOW() 
       WHERE id = $1`,
      [ticketId, JSON.stringify(updatedReplies)]
    )

    safeRevalidate("/admin")
    safeRevalidate("/admin/support")
    safeRevalidate("/members/support")
    return { ok: true }
  } catch (err: any) {
    console.error("[replyToSupportTicketAction error]:", err)
    return { ok: false, error: err.message || "Failed to post reply." }
  }
}

export async function updateSupportTicketStatusAction(
  ticketId: string,
  status: "open" | "resolved"
): Promise<{ ok: boolean; error?: string }> {
  try {
    await pool.query(
      `UPDATE support_tickets 
       SET status = $2, updated_at = NOW() 
       WHERE id = $1`,
      [ticketId, status]
    )
    safeRevalidate("/admin")
    safeRevalidate("/admin/support")
    safeRevalidate("/members/support")
    return { ok: true }
  } catch (err: any) {
    console.error("[updateSupportTicketStatusAction error]:", err)
    return { ok: false, error: err.message || "Failed to update status." }
  }
}

export async function createSupportTicketAction(data: {
  userEmail: string
  userName: string
  userPhone?: string
  subject: string
  description: string
  category?: string
}): Promise<{ ok: boolean; ticketCode?: string; error?: string }> {
  try {
    const id = `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const randNum = Math.floor(1000 + Math.random() * 9000)
    const ticketCode = `WM-${randNum}`

    await pool.query(
      `INSERT INTO support_tickets 
        (id, ticket_code, user_email, user_name, user_phone, subject, description, status, category, replies, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'open', $8, '[]'::jsonb, NOW(), NOW())`,
      [
        id,
        ticketCode,
        data.userEmail.toLowerCase().trim(),
        data.userName.trim(),
        data.userPhone || "",
        data.subject.trim(),
        data.description.trim(),
        data.category || "general",
      ]
    )

    safeRevalidate("/admin")
    safeRevalidate("/admin/support")
    safeRevalidate("/members/support")
    return { ok: true, ticketCode }
  } catch (err: any) {
    console.error("[createSupportTicketAction error]:", err)
    return { ok: false, error: err.message || "Failed to create support ticket." }
  }
}

export async function getMemberSupportTickets(userEmail: string): Promise<AdminSupportTicket[]> {
  try {
    const res = await pool.query(
      `SELECT * FROM support_tickets WHERE LOWER(user_email) = LOWER($1) ORDER BY created_at DESC`,
      [userEmail.trim()]
    )
    return res.rows.map((r) => ({
      id: r.id,
      ticketCode: r.ticket_code,
      userEmail: r.user_email,
      userName: r.user_name || "Member",
      userPhone: r.user_phone || "",
      subject: r.subject,
      description: r.description,
      status: (r.status as any) || "open",
      category: r.category || "general",
      replies: Array.isArray(r.replies)
        ? r.replies
        : typeof r.replies === "string"
        ? JSON.parse(r.replies || "[]")
        : [],
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }))
  } catch (err) {
    console.error("[getMemberSupportTickets error]:", err)
    return []
  }
}

export async function addMemberReplyAction(
  ticketId: string,
  userEmail: string,
  replyText: string,
  userName?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!replyText || !replyText.trim()) return { ok: false, error: "Reply cannot be empty." }
    const ticketRes = await pool.query(
      `SELECT replies, user_email FROM support_tickets WHERE id = $1`,
      [ticketId]
    )
    if (ticketRes.rows.length === 0) return { ok: false, error: "Ticket not found." }
    if (ticketRes.rows[0].user_email.toLowerCase() !== userEmail.toLowerCase()) {
      return { ok: false, error: "Unauthorized." }
    }

    const currentReplies: SupportReply[] = Array.isArray(ticketRes.rows[0].replies)
      ? ticketRes.rows[0].replies
      : typeof ticketRes.rows[0].replies === "string"
      ? JSON.parse(ticketRes.rows[0].replies || "[]")
      : []

    const newReply: SupportReply = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: "user",
      senderName: userName || "You",
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
    }

    await pool.query(
      `UPDATE support_tickets 
       SET replies = $2::jsonb, updated_at = NOW(), status = 'open' 
       WHERE id = $1`,
      [ticketId, JSON.stringify([...currentReplies, newReply])]
    )

    safeRevalidate("/admin")
    safeRevalidate("/admin/support")
    safeRevalidate("/members/support")
    return { ok: true }
  } catch (err: any) {
    console.error("[addMemberReplyAction error]:", err)
    return { ok: false, error: err.message || "Failed to add reply." }
  }
}

export async function loadAdminFullProps() {
  const [
    overviewData,
    contests,
    members,
    orders,
    payouts,
    redemptions,
    tickets,
    settings,
    supportTickets,
  ] = await Promise.all([
    getAdminOverviewData(),
    getAdminContests(),
    getAdminMembers(),
    getAdminOrders(),
    getAdminPayouts(),
    getAdminRedemptions(),
    getAdminTickets(),
    getAdminSettingsAction(),
    getAdminSupportTickets(),
  ])

  return {
    initialOverview: overviewData,
    initialContests: contests,
    initialMembers: members,
    initialOrders: orders,
    initialPayouts: payouts,
    initialRedemptions: redemptions,
    initialTickets: tickets,
    initialSettings: settings,
    initialSupportTickets: supportTickets,
  }
}


