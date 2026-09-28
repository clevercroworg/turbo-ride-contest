"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Sparkle, ShieldCheck, ArrowRight, Warning, CheckCircle, ArrowCounterClockwise, Ticket, Copy } from "@phosphor-icons/react"
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
    <div className="min-h-[100dvh] bg-[#fafafa] text-zinc-950 flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="border-b border-zinc-200/80 bg-white py-3.5 px-4 sm:px-8 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/members"
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 border border-zinc-200 transition-colors"
              title="Back to Garage"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex flex-col">
              <span className="text-zinc-950 font-extrabold text-sm uppercase tracking-tight">
                Redeem Drive Credits
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                TurboRide Supercar Fleet
              </span>
            </div>
          </div>

          {/* Current Credit Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-600">Available:</span>
            <span className="font-bold text-emerald-600">₹{credits.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-16">
        
        {/* Intro Banner */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-2">
            Supercar Experiences & Media
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Redeem credits for track laps or media packages. Credits are placed into a reserved Track Pass voucher with instant 1-click self-service refund if you ever decide not to complete the booking.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs mb-8 flex items-center gap-3">
            <Warning size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs mb-8 flex items-center gap-3">
            <CheckCircle size={18} className="shrink-0 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* ACTIVE ESCROW VOUCHERS SECTION */}
        {vouchers.length > 0 && (
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
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
                          className="text-zinc-400 hover:text-zinc-700 text-xs p-1"
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

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((item) => {
            const hasEnough = credits >= item.creditsRequired
            const isLoading = loadingRewardId === item.id

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all group"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono font-bold text-zinc-900">
                      {item.creditsRequired.toLocaleString("en-IN")} Credits
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-zinc-950 tracking-tight group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1">
                    {item.specs}
                  </p>

                  {/* Image */}
                  <div className="relative w-full h-44 my-4 flex items-center justify-center overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 p-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={380}
                      height={200}
                      className="object-contain max-h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Actions & Balance Check */}
                <div className="pt-4 border-t border-zinc-100">
                  {hasEnough ? (
                    <button
                      type="button"
                      onClick={() => handleRedeem(item)}
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkle size={16} weight="fill" />
                      <span>
                        {isLoading ? "Verifying & Redirecting..." : "Redeem & Schedule Drive"}
                      </span>
                      {!isLoading && <ArrowRight size={14} weight="bold" />}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-400 font-bold text-xs uppercase tracking-wider border border-zinc-200 cursor-not-allowed"
                      >
                        Need {(item.creditsRequired - credits).toLocaleString("en-IN")} More Credits
                      </button>
                      <Link
                        href="/members"
                        className="text-[11px] font-mono text-center text-orange-600 hover:underline font-semibold"
                      >
                        Deposit in Garage to Get Credits
                      </Link>
                    </div>
                  )}
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
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
