import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { pool } from "@/lib/db"
import { TransactionsClient, type TransactionRecord } from "./transactions-client"

export const dynamic = "force-dynamic"

export default async function TransactionsPage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/transactions")
  }

  const credits = await getUserDriveCredits(session.email, session.phone)

  const cleanEmail = session.email ? session.email.toLowerCase().trim() : ""
  const cleanPhone = session.phone ? session.phone.replace(/\D/g, "").slice(-10) : ""

  const transactions: TransactionRecord[] = []

  try {
    // 1. Ticket purchase orders from contest_orders
    const ordersRes = await pool.query(
      `SELECT id, ticket_count, amount_paid, credits_issued, status, created_at
       FROM contest_orders
       WHERE (user_email IS NOT NULL AND LOWER(user_email) = $1)
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       ORDER BY created_at DESC LIMIT 50`,
      [cleanEmail || "NOMATCH", `%${cleanPhone || "NOMATCH"}`]
    )

    for (const r of ordersRes.rows) {
      const ticketsCount = Number(r.ticket_count) || 1
      const amount = Number(r.amount_paid) || 0
      const creditsIssued = Number(r.credits_issued) || amount

      // A) Ticket purchase debit
      transactions.push({
        id: `ord-${r.id}`,
        category: "tickets",
        title: "Ticket purchase",
        status: "COMPLETED",
        description: `${ticketsCount} Porsche 911 GT3 RS ${ticketsCount === 1 ? "ticket" : "tickets"}`,
        createdAt: new Date(r.created_at).toISOString(),
        displayAmount: `-₹${amount.toLocaleString("en-IN")}`,
        isPositive: false,
      })

      // B) 100% Drive Credits added
      if (creditsIssued > 0) {
        transactions.push({
          id: `crd-${r.id}`,
          category: "wallet",
          title: "Drive credits added",
          status: "COMPLETED",
          description: "Ticket purchase bonus",
          createdAt: new Date(r.created_at).toISOString(),
          displayAmount: `+${creditsIssued.toLocaleString("en-IN")} credits`,
          isPositive: true,
        })
      }
    }

    // 2. Contest entries / allocated lucky numbers
    const ticketsRes = await pool.query(
      `SELECT id, ticket_number, created_at
       FROM contest_tickets
       WHERE (user_email IS NOT NULL AND LOWER(user_email) = $1)
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       ORDER BY created_at DESC LIMIT 50`,
      [cleanEmail || "NOMATCH", `%${cleanPhone || "NOMATCH"}`]
    )

    for (const t of ticketsRes.rows) {
      transactions.push({
        id: `entry-${t.id}`,
        category: "entries",
        title: "Contest entry",
        status: "CONFIRMED",
        description: `Porsche 718 Cayman · Entry #${t.ticket_number}`,
        createdAt: new Date(t.created_at).toISOString(),
        displayAmount: "+1 ticket",
        isPositive: true,
      })
    }

    // 3. Drive credits redeemed for supercars/experiences
    const redemptionsRes = await pool.query(
      `SELECT id, reward_title, credits_debited, voucher_code, status, created_at
       FROM reward_redemptions
       WHERE (user_email IS NOT NULL AND LOWER(user_email) = $1)
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       ORDER BY created_at DESC LIMIT 30`,
      [cleanEmail || "NOMATCH", `%${cleanPhone || "NOMATCH"}`]
    )

    for (const r of redemptionsRes.rows) {
      transactions.push({
        id: `rdm-${r.id}`,
        category: "wallet",
        title: "Drive credits redeemed",
        status: "COMPLETED",
        description: r.reward_title || "Supercar Track Experience",
        createdAt: new Date(r.created_at).toISOString(),
        displayAmount: `-${Number(r.credits_debited || 0).toLocaleString("en-IN")} credits`,
        isPositive: false,
      })
    }

    // 4. Referral commission payouts
    const payoutsRes = await pool.query(
      `SELECT id, amount, status, created_at
       FROM referral_payouts
       WHERE (user_email IS NOT NULL AND LOWER(user_email) = $1)
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       ORDER BY created_at DESC LIMIT 20`,
      [cleanEmail || "NOMATCH", `%${cleanPhone || "NOMATCH"}`]
    )

    for (const p of payoutsRes.rows) {
      transactions.push({
        id: `payout-${p.id}`,
        category: "referrals",
        title: "Commission paid",
        status: "PAID",
        description: "Referral commission payout",
        createdAt: new Date(p.created_at).toISOString(),
        displayAmount: `-₹${Number(p.amount || 0).toLocaleString("en-IN")}`,
        isPositive: false,
      })
    }

    // 5. Referral earnings summary from referral_profiles
    const profileRes = await pool.query(
      `SELECT id, total_credits_earned, total_cash_earned, updated_at, created_at
       FROM referral_profiles
       WHERE (user_email IS NOT NULL AND LOWER(user_email) = $1)
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       LIMIT 1`,
      [cleanEmail || "NOMATCH", `%${cleanPhone || "NOMATCH"}`]
    )

    if (profileRes.rows.length > 0) {
      const prof = profileRes.rows[0]
      const creditsEarned = Number(prof.total_credits_earned) || 0
      const cashEarned = Number(prof.total_cash_earned) || 0
      const date = prof.updated_at || prof.created_at || new Date().toISOString()

      if (creditsEarned > 0) {
        transactions.push({
          id: `ref-crd-${prof.id}`,
          category: "referrals",
          title: "Referral credits earned",
          status: "COMPLETED",
          description: "A friend purchased tickets via your referral link",
          createdAt: new Date(date).toISOString(),
          displayAmount: `+${creditsEarned.toLocaleString("en-IN")} credits`,
          isPositive: true,
        })
      }

      if (cashEarned > 0) {
        transactions.push({
          id: `ref-cash-${prof.id}`,
          category: "referrals",
          title: "Referral cash earned",
          status: "COMPLETED",
          description: "Commission from invited friend's ticket purchase",
          createdAt: new Date(date).toISOString(),
          displayAmount: `+₹${cashEarned.toLocaleString("en-IN")}`,
          isPositive: true,
        })
      }
    }
  } catch (err) {
    console.error("[TransactionsPage query error]:", err)
  }

  // Sort descending by date
  transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <TransactionsClient
      session={session}
      credits={credits}
      transactions={transactions}
    />
  )
}
