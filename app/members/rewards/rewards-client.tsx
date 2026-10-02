"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Warning, CheckCircle, ArrowCounterClockwise, Ticket, Copy, Coins, ArrowRight } from "@phosphor-icons/react"
import { MembersHeader } from "@/components/members/members-header"
import { logoutMember } from "@/lib/auth"
import { redeemRewardAction, cancelRedemptionAction } from "@/lib/rewards"
import type { MemberSession, RewardItem, ActiveVoucher } from "@/lib/types"

interface RewardsClientProps {
  session: MemberSession
  credits: number
  catalog: RewardItem[]
  initialVouchers?: ActiveVoucher[]
}

export function RewardsClient({ session, credits: initialCredits, catalog, initialVouchers = [] }: RewardsClientProps) {
  const [credits, setCredits] = useState<number>(initialCredits)
  const [vouchers, setVouchers] = useState<ActiveVoucher[]>(initialVouchers)
  const [loadingRewardId, setLoadingRewardId] = useState<string | null>(null)
  const [cancellingVoucherId, setCancellingVoucherId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const handleRedeem = async (reward: RewardItem) => {
    setErrorMsg(null)
    setSuccessMsg(null)

    if (credits < reward.creditsRequired) {
      setErrorMsg(
        `You currently have ₹${credits.toLocaleString("en-IN")} drive credits. ${reward.title} requires ${reward.creditsRequired.toLocaleString("en-IN")} credits. Add contest tickets in your Garage to earn more drive credits.`
      )
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setLoadingRewardId(reward.id)

    try {
      const res = await redeemRewardAction({
        rewardId: reward.id,
        userEmail: session.email,
        userPhone: session.phone,
        userName: session.name,
      })

      if (!res.ok) {
        setErrorMsg(res.error || "Unable to complete redemption.")
        setLoadingRewardId(null)
        return
      }

      setCredits((prev) => Math.max(0, prev - reward.creditsRequired))
      setSuccessMsg(`Pass issued! Code: ${res.voucherCode}. Routing to booking engine...`)

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl
      }
    } catch {
      setErrorMsg("Connection issue. Please verify your internet and try again.")
      setLoadingRewardId(null)
    }
  }

  const handleCancelVoucher = async (voucher: ActiveVoucher) => {
    setErrorMsg(null)
    setSuccessMsg(null)
    setCancellingVoucherId(voucher.id)

    try {
      const res = await cancelRedemptionAction({
        redemptionId: voucher.id,
        userEmail: session.email,
        userPhone: session.phone,
      })

      if (!res.ok) {
        setErrorMsg(res.error || "Could not cancel voucher.")
        setCancellingVoucherId(null)
        return
      }

      const restored = res.creditsRestored || voucher.creditsSpent
      setCredits((prev) => prev + restored)
      setVouchers((prev) => prev.filter((v) => v.id !== voucher.id))
      setSuccessMsg(`Voucher ${voucher.code} cancelled. ₹${restored.toLocaleString("en-IN")} Drive Credits restored to your wallet!`)
    } catch {
      setErrorMsg("Network error cancelling voucher. Please try again.")
    } finally {
      setCancellingVoucherId(null)
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

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20 space-y-6">
        
        {/* Intro Banner matching HK90D8.jpg */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
          <div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#c53030] mb-1">
              POWERED BY TURBORIDE
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight uppercase">
              REDEEM CREDITS
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1 leading-relaxed">
              Spend your drive credits on supercar laps, photoshoots and reels.
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

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Warning size={18} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
            <Link
              href="/members"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors self-start sm:self-auto"
            >
              Get Credits in Garage
            </Link>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 shadow-xs">
            <CheckCircle size={18} className="shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* ACTIVE ESCROW VOUCHERS SECTION */}
        {vouchers.length > 0 && (
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Ticket size={20} className="text-amber-600 shrink-0" weight="fill" />
                <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wide">
                  Active Track Pass Vouchers ({vouchers.length}) · Ready to Book
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                Credits held safely in escrow. Zero risk.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.map((v) => (
                <div key={v.id} className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-md border border-amber-300">
                          {v.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(v.code)}
                          className="text-zinc-400 hover:text-zinc-700 text-xs p-1 cursor-pointer"
                          title="Copy voucher code"
                        >
                          {copiedCode === v.code ? <span className="text-[10px] text-emerald-600 font-bold">COPIED</span> : <Copy size={13} />}
                        </button>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                        {v.creditsSpent.toLocaleString("en-IN")} cr
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900">{v.rewardTitle}</h4>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Status: <span className="font-semibold text-amber-600">Awaiting Track Slot Selection</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={cancellingVoucherId === v.id}
                      onClick={() => handleCancelVoucher(v)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowCounterClockwise size={13} className={cancellingVoucherId === v.id ? "animate-spin" : ""} />
                      <span>{cancellingVoucherId === v.id ? "Refunding..." : "Cancel & Restore"}</span>
                    </button>

                    <a
                      href={v.bookingUrl}
                      className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Complete Booking</span>
                      <ArrowRight size={12} weight="bold" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalog Grid matching HK90D8.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {catalog.map((item) => {
            const isLoading = loadingRewardId === item.id

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all group"
              >
                <div>
                  {/* Card Image with Floating Category Pill Badge */}
                  <div className="relative w-full aspect-[1264/848] rounded-xl overflow-hidden bg-zinc-950 mb-3.5">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                    />
                    <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-medium tracking-tight shadow-xs select-none">
                      {item.category}
                    </div>
                  </div>

                  {/* Title & Specs */}
                  <h2 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    {item.specs}
                  </p>

                  {/* Pricing */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <Coins size={16} weight="duotone" className="text-[#c53030] shrink-0" />
                    <span className="text-base font-black text-[#c53030] tabular-nums tracking-tight">
                      {item.creditsRequired.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-zinc-500 font-normal">credits</span>
                  </div>
                </div>

                {/* Redeem Button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handleRedeem(item)}
                    disabled={isLoading}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-[#c53030] hover:bg-[#a82525] active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? "Processing..." : "Redeem"}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Booking Guarantee */}
        <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-600 shrink-0" />
            <span>
              All drives are conducted at certified tracks with professional instructors and in-car telemetry cameras.
            </span>
          </div>
          <a
            href="https://book.turboridesupercars.com"
            target="_blank"
            rel="noreferrer"
            className="text-orange-600 hover:underline font-mono font-bold shrink-0"
          >
            Visit TurboRide Booking Portal
          </a>
        </div>

      </main>

      {/* Rewards Clean Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 px-4 text-xs text-zinc-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>TurboRide Rewards Catalog · Verified Credits Engine</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-950 transition-colors">Drop Showcase</Link>
            <Link href="/members" className="hover:text-zinc-950 transition-colors">Member Garage</Link>
            <a href="mailto:vip@turboridesupercars.com" className="hover:text-zinc-950 transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
