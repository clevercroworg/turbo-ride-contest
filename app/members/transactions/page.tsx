import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { pool } from "@/lib/db"
import { MembersHeader } from "@/components/members/members-header"
import Link from "next/link"
import { Receipt, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck, Ticket } from "lucide-react"

export const dynamic = "force-dynamic"

interface TransactionItem {
  id: string
  type: "ticket_purchase" | "reward_redemption" | "credit_refund" | "referral_earning"
  title: string
  description: string
  amount: number
  credits: number
  status: string
  createdAt: string
}

export default async function TransactionsPage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/transactions")
  }

  const credits = await getUserDriveCredits(session.email, session.phone)

  // Fetch orders and credit transactions for this member
  const cleanEmail = session.email ? session.email.toLowerCase().trim() : ""
  const cleanPhone = session.phone ? session.phone.replace(/\D/g, "").slice(-10) : ""

  const transactions: TransactionItem[] = []

  try {
    // 1. Ticket purchase orders
    const ordersRes = await pool.query(
      `SELECT id, ticket_count, amount_paid, credits_issued, status, created_at
       FROM contest_orders
       WHERE (user_email IS NOT NULL AND LOWER(user_email) = $1)
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       ORDER BY created_at DESC LIMIT 30`,
      [cleanEmail || "NOMATCH", `%${cleanPhone || "NOMATCH"}`]
    )

    for (const r of ordersRes.rows) {
      transactions.push({
        id: r.id,
        type: "ticket_purchase",
        title: "Ticket Purchase",
        description: `${r.ticket_count} ${Number(r.ticket_count) === 1 ? "ticket" : "tickets"} · Drive Credits Deposited`,
        amount: Number(r.amount_paid) || 0,
        credits: Number(r.credits_issued) || (Number(r.amount_paid) || 0),
        status: r.status || "completed",
        createdAt: new Date(r.created_at).toISOString(),
      })
    }

    // 2. Redemptions from reward_redemptions
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
        id: r.id,
        type: "reward_redemption",
        title: `Redeemed: ${r.reward_title}`,
        description: `Track Pass Voucher: ${r.voucher_code || "Generated"}`,
        amount: 0,
        credits: -Number(r.credits_debited || 0),
        status: r.status || "confirmed",
        createdAt: new Date(r.created_at).toISOString(),
      })
    }
  } catch (err) {
    console.error("[TransactionsPage query error]:", err)
  }

  // Sort descending by date
  transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
      <MembersHeader
        userName={session.name}
        userEmail={session.email}
        userPhone={session.phone}
        credits={credits}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ea580c]">
              <Receipt className="size-4" />
              Member Ledger
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-1">
              Transactions & Credits History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Transparent, immutable record of ticket allocations, credit deposits, and experience redemptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-card px-4 py-2.5 text-right">
              <p className="text-xs text-muted-foreground font-medium">Vault Balance</p>
              <p className="text-xl font-bold text-[#ea580c] tabular-nums">
                {credits.toLocaleString("en-IN")} Credits
              </p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Clock className="size-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-foreground">No Transactions Recorded Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-6">
              When you purchase tickets or redeem drive credits for supercar track experiences, your ledger entries will appear here.
            </p>
            <Link
              href="/members"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase transition-colors"
            >
              <Ticket className="size-4" />
              Buy Tickets to Enter
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="divide-y divide-border/60">
              {transactions.map((t) => {
                const isDebit = t.credits < 0
                return (
                  <div key={t.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/40 transition-colors">
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl shrink-0 ${isDebit ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                        {isDebit ? <ArrowUpRight className="size-5" /> : <ArrowDownLeft className="size-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{t.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                        <p className="text-[11px] text-muted-foreground/70 font-mono mt-1">
                          {new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })} · ID: {t.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className={`text-sm sm:text-base font-bold tabular-nums ${isDebit ? "text-amber-600" : "text-emerald-600"}`}>
                        {isDebit ? `${t.credits.toLocaleString("en-IN")} Credits` : `+${t.credits.toLocaleString("en-IN")} Credits`}
                      </div>
                      {t.amount > 0 && (
                        <span className="text-xs text-muted-foreground font-mono">
                          ₹{t.amount.toLocaleString("en-IN")} Paid
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-foreground">
                        {t.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Zero-Loss Guarantee: 100% of ticket expenditure is returned 1:1 in Drive Credits</span>
        </div>
      </footer>
    </div>
  )
}
