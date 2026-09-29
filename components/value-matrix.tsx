"use client"

import { ShieldCheck, Gauge, VideoCamera, ClockCounterClockwise } from "@phosphor-icons/react"

interface ValueMatrixProps {
  ticketPrice?: number
  carName?: string
}

export function ValueMatrix({
  ticketPrice = 1000,
}: ValueMatrixProps = {}) {
  const counts = [
    { count: 1, badge: "" },
    { count: 10, badge: "POPULAR" },
    { count: 50, badge: "VIP CLUB" },
    { count: 100, badge: "TRACK VIP" },
  ]

  const tiers = counts.map(({ count, badge }) => ({
    count,
    cost: `₹${(count * ticketPrice).toLocaleString("en-IN")}`,
    credits: (count * ticketPrice).toLocaleString("en-IN"),
    entries: count === 1 ? "1 Draw Entry" : `${count} Draw Entries`,
    badge,
  }))

  return (
    <section className="py-12 sm:py-20 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creative Automotive Telemetry Deco & Single Line Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <span className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent to-[#ea580c]" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#ea580c] font-black uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block" />
              03 // GUARANTEED UTILITY
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block" />
            </span>
            <span className="w-6 sm:w-10 h-px bg-gradient-to-l from-transparent to-[#ea580c]" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none mb-3">
            100% CREDITS BACK
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Zero capital risk. Every rupee converts to permanent Buddh Circuit Drive Credits for real track drives and reels.
          </p>
        </div>

        {/* 2-Column Bento - Sharp Edges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* Left Column: 1:1 Parity Card - Sharp Edged */}
          <div className="lg:col-span-5 rounded-none bg-white border border-zinc-200 p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 sm:mb-5 border-b border-zinc-100 text-xs font-semibold">
                <span className="text-zinc-500 uppercase tracking-wider font-bold">
                  CONVERSION RATIO
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-none border border-emerald-200 text-[11px] sm:text-xs">
                  <ShieldCheck size={14} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>100% Capital Protected</span>
                </span>
              </div>

              <div className="mb-5 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-black text-zinc-950 block tracking-tight">
                  1 : 1 PARITY
                </span>
                <span className="text-xs sm:text-sm text-[#ea580c] font-bold tracking-wide mt-1 block">
                  ₹{ticketPrice.toLocaleString("en-IN")} Deposit = {ticketPrice.toLocaleString("en-IN")} Drive Credits
                </span>
              </div>

              {/* 3 Core Utilities - Sharp */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 p-2.5 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200/80">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-none bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                    <Gauge size={18} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-zinc-950 block truncate">Real Supercar Laps</span>
                    <span className="text-[11px] sm:text-xs text-zinc-500 block truncate">Redeem for Buddh Circuit seat time</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200/80">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-none bg-zinc-950 text-white flex items-center justify-center shrink-0">
                    <VideoCamera size={18} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-zinc-950 block truncate">4K FPV Media Shoots</span>
                    <span className="text-[11px] sm:text-xs text-zinc-500 block truncate">Professional reels & track photos</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200/80">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-none bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                    <ClockCounterClockwise size={18} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-zinc-950 block truncate">Credits Never Expire</span>
                    <span className="text-[11px] sm:text-xs text-zinc-500 block truncate">Use your credits whenever you wish</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-5 border-t border-zinc-100 text-[11px] sm:text-xs text-zinc-500 flex items-center justify-between font-semibold">
              <span>LEGAL ESCROW PROTOCOL</span>
              <span className="text-zinc-950 font-bold">ZERO CAPITAL RISK</span>
            </div>
          </div>

          {/* Right Column: High-Readability Tier Matrix - Sharp Edged */}
          <div className="lg:col-span-7 rounded-none bg-white border border-zinc-200 p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2.5 mb-3 sm:mb-4 border-b border-zinc-100 text-[11px] sm:text-xs font-bold text-zinc-500 tracking-wider">
                <span className="uppercase">ENTRY TIER</span>
                <span className="uppercase">CREDITS & ENTRIES</span>
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                {tiers.map((tier) => (
                  <div
                    key={tier.count}
                    className="p-3 sm:p-4 rounded-none bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200/80 transition-colors flex items-center justify-between gap-3"
                  >
                    {/* Left: Ticket count + Badge + Cost */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-zinc-950 tracking-tight">
                          {tier.count === 1 ? "1 Ticket" : `${tier.count} Tickets`}
                        </span>
                        {tier.badge && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-none bg-orange-100 text-[#ea580c] border border-orange-200 tracking-tight">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500 font-semibold block mt-0.5">
                        {tier.cost}
                      </span>
                    </div>

                    {/* Right: Credits + Entries */}
                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-black text-emerald-600 block tabular-nums">
                        +{tier.credits} Credits
                      </span>
                      <span className="text-xs font-bold text-[#ea580c] block mt-0.5">
                        {tier.entries}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-[11px] sm:text-xs text-zinc-600 font-medium">
              <span className="truncate">100% usable on track laps & media</span>
              <span className="text-emerald-700 font-bold shrink-0 ml-2">Buddh Circuit Ready</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
