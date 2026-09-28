"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShareNetwork,
  LinkSimple,
  CurrencyInr,
  Gift,
  Copy,
  Check,
  ArrowRight,
  Sparkle,
  LockKeyOpen,
} from "@phosphor-icons/react"

interface ReferralEngineProps {
  ticketPrice?: number
}

export function ReferralEngine({ ticketPrice = 1000 }: ReferralEngineProps = {}) {
  const stops = [1, 5, 10, 25, 50, 100, 250, 500, 1000]
  const [stopIndex, setStopIndex] = useState(3) // Default 25 tickets
  const [copied, setCopied] = useState(false)

  const activeTickets = stops[stopIndex]
  // 25% of ticket value issued as credits & cash commission (when unlocked)
  const driveCredits = Math.round(activeTickets * (ticketPrice * 0.25))
  const cashCommission = Math.round(activeTickets * (ticketPrice * 0.25))

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://winmyporsche.in/r/4821")
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const progressPercent = (stopIndex / (stops.length - 1)) * 100

  return (
    <section id="referrals" className="py-20 md:py-28 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-12 border-b border-zinc-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
              <span>04 // SYNDICATE PARTNERSHIP</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight leading-[1.02]">
              REFER FRIENDS, STACK UP CREDITS & CASH
            </h2>
          </div>
          <p className="text-sm font-mono text-zinc-500 max-w-md">
            Earn 25% in Drive Credits immediately. Unlock 25% cash commission after acquiring 25 personal entries.
          </p>
        </div>

        {/* 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-10 sm:mb-12">
          
          {/* LEFT COLUMN: Link Box + Earnings Calculator (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-5 sm:gap-6">
            
            {/* Box 1: Your Referral Link Card */}
            <div className="rounded-xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-50 border border-orange-200 text-[#ea580c] text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
                <Gift size={14} weight="bold" />
                <span>YOUR SYNDICATE REFERRAL LINK</span>
              </div>

              {/* Input & Copy Button Bar */}
              <div className="bg-zinc-50 rounded-lg p-2 pl-4 flex items-center justify-between gap-3 border border-zinc-200">
                <span className="font-mono text-xs sm:text-sm text-zinc-800 font-semibold truncate select-all">
                  winmyporsche.in/r/4821
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold px-4 py-2.5 rounded flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check size={14} weight="bold" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} weight="bold" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-3 font-mono">
                Your unique code is generated automatically the instant you enter your email or phone in the garage.
              </p>
            </div>

            {/* Box 2: Earnings Calculator Card */}
            <div className="rounded-xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ea580c] block mb-1">
                  LIVE REVENUE SIMULATOR
                </span>
                <p className="text-xs sm:text-sm text-zinc-600 mb-5">
                  Simulate your returns when referred network members acquire{" "}
                  <strong className="text-zinc-950 font-bold">{activeTickets} tickets</strong> in total.
                </p>

                {/* Dual Stat Metrics */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mb-5 font-mono">
                  
                  {/* Metric 1: Drive Credits */}
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase mb-1.5">
                      <LinkSimple size={14} weight="bold" />
                      <span>DRIVE CREDITS (1:1)</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-zinc-950 block leading-none">
                      {driveCredits.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-1.5">
                      25% of their total credits
                    </span>
                  </div>

                  {/* Metric 2: Cash Commission */}
                  <div className="rounded-lg border border-orange-200 bg-orange-50/40 p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 text-[#ea580c] text-[10px] font-bold uppercase mb-1.5">
                      <CurrencyInr size={14} weight="bold" />
                      <span>CASH COMMISSION</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-[#ea580c] block leading-none">
                      ₹{cashCommission.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-1.5">
                      25% direct cash payout
                    </span>
                  </div>

                </div>

                {/* Range Slider with Interactive Stops */}
                <div className="flex flex-col gap-2 pt-1 mb-4">
                  <div className="relative w-full flex items-center">
                    <input
                      type="range"
                      min="0"
                      max={stops.length - 1}
                      step="1"
                      value={stopIndex}
                      onChange={(e) => setStopIndex(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                      style={{
                        background: `linear-gradient(to right, #ea580c 0%, #ea580c ${progressPercent}%, #e4e4e7 ${progressPercent}%, #e4e4e7 100%)`,
                      }}
                    />
                  </div>

                  {/* Stop Labels Row */}
                  <div className="flex justify-between items-center text-[11px] font-mono pt-1">
                    {stops.map((stop, idx) => (
                      <button
                        key={stop}
                        type="button"
                        onClick={() => setStopIndex(idx)}
                        className={`transition-colors cursor-pointer px-1 py-0.5 ${
                          stopIndex === idx
                            ? "text-[#ea580c] font-black"
                            : "text-zinc-400 hover:text-zinc-700"
                        }`}
                      >
                        {stop}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Clarification Box */}
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3.5 text-xs text-zinc-500 leading-relaxed mt-2 font-mono">
                Drive credits are credited from your very first referral. The 25% cash commission is unlocked once you personally acquire 25 tickets (₹25,000).
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3 Numbered Steps (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4 sm:gap-5">
            
            {/* Step 1 */}
            <div className="rounded-xl bg-white border border-zinc-200 p-6 sm:p-7 flex items-start gap-5 shadow-xs flex-1 hover:border-zinc-300 transition-all">
              <span className="font-mono text-2xl sm:text-3xl font-black text-zinc-300">01</span>
              <div>
                <h3 className="font-display text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight mb-1">
                  SHARE YOUR SYNDICATE LINK
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Every verified member receives a unique affiliate link in their Member Garage. Distribute via WhatsApp, Instagram, or automotive forums.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl bg-white border border-zinc-200 p-6 sm:p-7 flex items-start gap-5 shadow-xs flex-1 hover:border-zinc-300 transition-all">
              <span className="font-mono text-2xl sm:text-3xl font-black text-zinc-300">02</span>
              <div>
                <h3 className="font-display text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight mb-1">
                  ACCRUE 25% DRIVE CREDITS
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Whenever an invitee deposits for a ticket, you instantly receive 25% of their credits (250 credits per ticket) in your permanent wallet.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl bg-white border border-zinc-200 p-6 sm:p-7 flex items-start gap-5 shadow-xs flex-1 hover:border-zinc-300 transition-all">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#ea580c]">03</span>
              <div>
                <h3 className="font-display text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight mb-1">
                  UNLOCK 25% CASH COMMISSION
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Once you hold 25 personal contest tickets, every referral also grants you 25% direct cash (₹250 per ticket), withdrawable straight to UPI or bank account.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Action Button */}
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <span>Access Member Garage & Copy Syndicate Link</span>
            <ArrowRight size={18} weight="bold" />
          </Link>
        </div>

      </div>
    </section>
  )
}
