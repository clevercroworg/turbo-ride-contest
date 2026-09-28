"use client"

import { ShieldCheck, ArrowRight, Gauge, VideoCamera, ClockCounterClockwise, Sparkle } from "@phosphor-icons/react"

interface ValueMatrixProps {
  ticketPrice?: number
  carName?: string
}

export function ValueMatrix({
  ticketPrice = 1000,
  carName = "Porsche 718 Cayman",
}: ValueMatrixProps = {}) {
  const counts = [
    { count: 1, badge: "" },
    { count: 10, badge: "POPULAR" },
    { count: 50, badge: "VIP CLUB" },
    { count: 100, badge: "TRACK DAY VIP" },
  ]

  const tiers = counts.map(({ count, badge }) => ({
    tickets: String(count).padStart(2, "0"),
    cost: `₹${(count * ticketPrice).toLocaleString("en-IN")}`,
    credits: (count * ticketPrice).toLocaleString("en-IN"),
    entries: count === 1 ? "1 Entry" : `${count} Entries`,
    badge,
  }))

  return (
    <section className="py-16 sm:py-20 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-10 border-b border-zinc-200 gap-3">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#ea580c] block mb-1">
              GUARANTEED UTILITY
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight">
              EVERY TICKET PAYS YOU BACK
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md">
            Zero capital risk. 100% of your deposit converts to permanent TurboRide Drive Credits for track drives and reels.
          </p>
        </div>

        {/* 2-Column Asymmetric Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: 1:1 Parity Terminal Card */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-zinc-200 p-6 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 font-mono text-xs">
                <span className="text-zinc-400 font-bold uppercase tracking-wider">
                  CONVERSION RATIO
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck size={14} weight="fill" />
                  100% Protected
                </span>
              </div>

              <div className="mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-black text-zinc-950 block tracking-tight">
                  1 : 1 PARITY
                </span>
                <span className="text-xs font-mono text-[#ea580c] font-bold uppercase tracking-wide mt-1 block">
                  ₹{ticketPrice.toLocaleString("en-IN")} Deposit = {ticketPrice.toLocaleString("en-IN")} Permanent Credits
                </span>
              </div>

              {/* 3 Core Utilities (No bullet points, clean badge cards) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                    <Gauge size={18} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-950 block">Supercar Track Laps</span>
                    <span className="text-[11px] text-zinc-500">Drive Cayman, Huracán or 488 at Buddh Circuit</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <VideoCamera size={18} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-950 block">4K Drone Reel & Telemetry</span>
                    <span className="text-[11px] text-zinc-500">Professional track footage produced for Instagram</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                    <ClockCounterClockwise size={18} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-950 block">Credits Never Expire</span>
                    <span className="text-[11px] text-zinc-500">Even if your ticket is not drawn, your funds remain yours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-zinc-100 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
              <span>LEGAL ESCROW PROTOCOL</span>
              <span className="text-zinc-950 font-bold">ZERO CAPITAL RISK</span>
            </div>
          </div>

          {/* Right Column: High-Velocity Tier Matrix (Clean modern rows, not a boring table) */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-zinc-200 p-6 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 font-mono text-xs text-zinc-400">
                <span className="uppercase font-bold tracking-wider">ENTRY TIER</span>
                <span className="uppercase font-bold tracking-wider">CREDITS & DRAW ALLOCATION</span>
              </div>

              <div className="space-y-2">
                {tiers.map((tier) => (
                  <div
                    key={tier.tickets}
                    className="p-3.5 sm:p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg sm:text-xl font-black text-zinc-950">
                        {tier.tickets}
                      </span>
                      <div>
                        <span className="font-mono text-xs font-bold text-zinc-900 block">
                          {tier.tickets === "01" ? "1 Ticket" : `${tier.tickets} Tickets`}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-500">
                          {tier.cost} Escrow
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6 text-right">
                      <div>
                        <span className="font-mono text-sm sm:text-base font-black text-emerald-600 block">
                          +{tier.credits} Cr
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">
                          Permanent Wallet
                        </span>
                      </div>

                      <div className="min-w-[70px]">
                        <span className="font-mono text-xs sm:text-sm font-black text-[#ea580c] block">
                          {tier.entries}
                        </span>
                        {tier.badge && (
                          <span className="inline-block text-[8px] font-mono font-black uppercase px-1.5 py-0.2 rounded-full bg-orange-100 text-[#ea580c] border border-orange-200">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between font-mono text-[11px] text-zinc-500">
              <span>Stackable with every entry</span>
              <span className="text-emerald-600 font-bold">100% Usable at Buddh Circuit</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
