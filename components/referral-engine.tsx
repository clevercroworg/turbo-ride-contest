"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LinkSimple,
  CurrencyInr,
  Gift,
  Copy,
  Check,
  ArrowRight,
} from "@phosphor-icons/react"

interface ReferralEngineProps {
  ticketPrice?: number
}

export function ReferralEngine({ ticketPrice = 1000 }: ReferralEngineProps = {}) {
  const checkpoints = [5, 10, 25, 50, 100, 250, 500]
  const [checkpointIndex, setCheckpointIndex] = useState(2) // Default 25 tickets
  const [copied, setCopied] = useState(false)

  const activeTickets = checkpoints[checkpointIndex]
  // 25% of ticket value issued as credits & cash commission
  const driveCredits = Math.round(activeTickets * (ticketPrice * 0.25))
  const cashCommission = Math.round(activeTickets * (ticketPrice * 0.25))

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://winmyporsche.in/r/4821")
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrev = () => setCheckpointIndex((prev) => Math.max(0, prev - 1))
  const handleNext = () => setCheckpointIndex((prev) => Math.min(checkpoints.length - 1, prev + 1))
  const progressPercent = (checkpointIndex / (checkpoints.length - 1)) * 100

  return (
    <section id="referrals" className="py-12 sm:py-20 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-6 sm:mb-10 border-b border-zinc-200 gap-2 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              <span>SYNDICATE PARTNERSHIP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight">
              REFER FRIENDS, EARN CREDITS & CASH
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md leading-relaxed">
            Earn 25% in permanent Drive Credits on every referral. Unlock 25% cash commission after 25 personal entries.
          </p>
        </div>

        {/* 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch mb-8 sm:mb-10">
          
          {/* LEFT COLUMN: Link Box + Earnings Calculator */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4 sm:gap-6">
            
            {/* Box 1: Your Referral Link Card */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  YOUR SYNDICATE LINK
                </span>
                <span className="text-[11px] font-bold text-[#ea580c] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                  Instant 25% Match
                </span>
              </div>

              {/* Input & Copy Button Bar */}
              <div className="bg-zinc-50 rounded-xl p-1.5 pl-3 sm:pl-4 flex items-center justify-between gap-2 border border-zinc-200">
                <span className="text-xs sm:text-sm text-zinc-800 font-semibold truncate select-all">
                  winmyporsche.in/r/4821
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check size={14} weight="bold" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} weight="bold" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Box 2: Earnings Calculator Card */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-2xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-100">
                  <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    SIMULATE EARNINGS
                  </span>
                  <span className="text-xs font-black text-[#ea580c] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 tabular-nums">
                    {activeTickets} Referred {activeTickets === 1 ? "Ticket" : "Tickets"}
                  </span>
                </div>

                {/* Dual Stat Metrics */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-4">
                  {/* Metric 1: Drive Credits */}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
                    <span className="text-[11px] text-zinc-500 font-bold uppercase block mb-1">
                      Drive Credits (1:1)
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-zinc-950 block leading-none tabular-nums">
                      +{driveCredits.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium block mt-1.5">
                      25% credit match
                    </span>
                  </div>

                  {/* Metric 2: Cash Commission */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3 sm:p-4">
                    <span className="text-[11px] text-[#ea580c] font-bold uppercase block mb-1">
                      Cash Commission
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#ea580c] block leading-none tabular-nums">
                      ₹{cashCommission.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-zinc-600 font-medium block mt-1.5">
                      25% direct cash
                    </span>
                  </div>
                </div>

                {/* Synced Checkpoint Stepper & Slider */}
                <div className="bg-zinc-50/80 rounded-xl border border-zinc-200/80 p-3 sm:p-3.5 mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    {/* Previous Checkpoint Button */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={checkpointIndex === 0}
                      aria-label="Previous checkpoint"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none text-zinc-800 flex items-center justify-center shrink-0 transition-colors border border-zinc-200 cursor-pointer active:scale-95"
                    >
                      <ArrowRight size={14} weight="bold" className="rotate-180" />
                    </button>

                    {/* Progress Slider Track with Checkpoints */}
                    <div className="relative flex-1 py-2 select-none">
                      {/* Background Bar */}
                      <div className="relative w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-[#ea580c] transition-all duration-200 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {/* Checkpoint tick dots */}
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        {checkpoints.map((val, idx) => (
                          <span
                            key={val}
                            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white transition-all ${
                              idx <= checkpointIndex ? "bg-[#ea580c]" : "bg-zinc-300"
                            }`}
                            style={{ left: `${(idx / (checkpoints.length - 1)) * 100}%` }}
                          />
                        ))}
                      </div>

                      {/* Visible Thumb Knob */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#ea580c] shadow-sm pointer-events-none transition-all duration-200 z-10"
                        style={{ left: `${progressPercent}%` }}
                      />

                      {/* Snap Slider Input Overlay */}
                      <input
                        type="range"
                        min="0"
                        max={checkpoints.length - 1}
                        step="1"
                        value={checkpointIndex}
                        onChange={(e) => setCheckpointIndex(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        aria-label="Select referral ticket checkpoint"
                      />
                    </div>

                    {/* Next Checkpoint Button */}
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={checkpointIndex === checkpoints.length - 1}
                      aria-label="Next checkpoint"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none text-zinc-800 flex items-center justify-center shrink-0 transition-colors border border-zinc-200 cursor-pointer active:scale-95"
                    >
                      <ArrowRight size={14} weight="bold" />
                    </button>
                  </div>

                  {/* Checkpoints Pill Buttons - Perfectly Aligned */}
                  <div className="flex items-center justify-between gap-1">
                    {checkpoints.map((val, idx) => {
                      const isSelected = checkpointIndex === idx
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCheckpointIndex(idx)}
                          className={`flex-1 py-1 px-1 rounded-md text-[11px] sm:text-xs font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? "bg-zinc-950 text-white shadow-xs font-black"
                              : "bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80"
                          }`}
                        >
                          {val}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Clarification */}
              <p className="text-[11px] sm:text-xs text-zinc-500 font-medium pt-3 mt-1 border-t border-zinc-100">
                * Drive credits are instant from referral #1. 25% cash commission unlocks after 25 personal entries.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: 3 Numbered Steps with clean inline layout */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-3 sm:gap-4">
            
            {/* Step 1 */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-5 shadow-2xs flex-1 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                01
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-zinc-950 uppercase tracking-tight mb-0.5">
                  Share Your Unique Link
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Every member receives a dedicated syndicate link. Share with friends on WhatsApp, Instagram, or car clubs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-5 shadow-2xs flex-1 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                02
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-zinc-950 uppercase tracking-tight mb-0.5">
                  Accrue 25% Drive Credits
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Whenever an invitee joins and buys tickets, you instantly get 25% in permanent Drive Credits (₹250/ticket).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-5 shadow-2xs flex-1 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 text-[#ea580c] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                03
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-zinc-950 uppercase tracking-tight mb-0.5">
                  Unlock 25% Cash Commission
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Hold 25 personal entries to unlock ₹250 cash per referral, paid directly to your bank account or UPI.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Action Button */}
        <div className="text-center px-4 sm:px-0">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <span className="hidden sm:inline">Access Member Garage & Copy Syndicate Link</span>
            <span className="sm:hidden">Access Member Garage</span>
            <ArrowRight size={16} weight="bold" className="shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  )
}

