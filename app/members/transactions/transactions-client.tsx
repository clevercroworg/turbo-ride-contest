"use client"

import { useState } from "react"
import Link from "next/link"
import { MembersHeader } from "@/components/members/members-header"
import { logoutMember } from "@/lib/auth"
import type { MemberSession } from "@/lib/types"
import { 
  Ticket, 
  Coins, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sparkle, 
  Users, 
  CreditCard,
  Clock
} from "lucide-react"

export type TransactionCategory = "all" | "tickets" | "entries" | "referrals" | "wallet"

export interface TransactionRecord {
  id: string
  category: "tickets" | "entries" | "referrals" | "wallet"
  title: string
  status: "CONFIRMED" | "COMPLETED" | "PAID" | "PENDING"
  description: string
  createdAt: string
  displayAmount: string
  isPositive: boolean
}

interface TransactionsClientProps {
  session: MemberSession
  credits: number
  transactions: TransactionRecord[]
}

const FILTER_TABS: { id: TransactionCategory; label: string }[] = [
  { id: "all", label: "All activity" },
  { id: "tickets", label: "Tickets" },
  { id: "entries", label: "Entries" },
  { id: "referrals", label: "Referrals" },
  { id: "wallet", label: "Wallet" },
]

function formatTxDate(isoString: string) {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } catch {
    return isoString
  }
}

export function TransactionsClient({ session, credits, transactions }: TransactionsClientProps) {
  const [activeTab, setActiveTab] = useState<TransactionCategory>("all")

  const filtered = transactions.filter((t) => {
    if (activeTab === "all") return true
    return t.category === activeTab
  })

  const getIcon = (category: string) => {
    switch (category) {
      case "entries":
        return <Sparkle className="size-4" />
      case "tickets":
        return <Ticket className="size-4" />
      case "referrals":
        return <Users className="size-4" />
      case "wallet":
      default:
        return <Coins className="size-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans flex flex-col justify-between">
      {/* Universal Members Header */}
      <MembersHeader
        userName={session.name}
        userEmail={session.email}
        userPhone={session.phone}
        credits={credits}
        onLogout={logoutMember}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Title Section matching Cg75rB.jpg */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-2">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#c53030] mb-0.5 sm:mb-1">
              ACCOUNT ACTIVITY
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight uppercase">
              TRANSACTIONS
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5 sm:mt-1 leading-relaxed">
              Track ticket purchases, contest entries, referral rewards, commission payouts, and drive credit activity.
            </p>
          </div>

          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 self-start px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors shadow-xs"
          >
            <span>←</span>
            <span>Back to garage</span>
          </Link>
        </div>

        {/* Activity History Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-xs space-y-5">
          {/* Header Row with Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                Activity history
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                {filtered.length} {filtered.length === 1 ? "transaction" : "transactions"} across your account
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
              {FILTER_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#c53030] text-white font-semibold shadow-xs"
                        : "bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* List of Transactions */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 space-y-2">
              <Clock className="size-8 mx-auto text-zinc-300 mb-2" />
              <p className="text-sm font-semibold text-zinc-800">No transactions in this view</p>
              <p className="text-xs text-zinc-400">
                {activeTab === "all" 
                  ? "When you buy tickets or earn referral rewards, your history appears here."
                  : `No activity found under "${FILTER_TABS.find(t => t.id === activeTab)?.label}".`}
              </p>
              {activeTab !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className="mt-3 inline-block px-3.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  View all activity
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-zinc-50/50 transition-colors px-1 sm:px-2 rounded-xl"
                >
                  {/* Left: Icon + Description */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-9 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-zinc-950">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5 truncate">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {formatTxDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount or Credits */}
                  <div className="shrink-0 text-right">
                    <span
                      className={`text-xs sm:text-sm font-black font-mono tracking-tight ${
                        item.isPositive ? "text-[#c53030]" : "text-zinc-950"
                      }`}
                    >
                      {item.displayAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
