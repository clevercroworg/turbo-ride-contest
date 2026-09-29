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
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
            <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              03 · GUARANTEED UTILITY
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
            </span>
            <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none mb-3">
            100% CREDITS BACK
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-950 font-medium leading-relaxed max-w-2xl mx-auto">
            Zero capital risk. Every rupee converts to permanent Buddh Circuit Drive Credits for real track drives and reels.
          </p>
        </div>

        {/* 2-Column Bento - Sharp Edges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* Left Column: 1:1 Parity Card - Sharp Edged */}
          <div className="lg:col-span-5 rounded-none bg-white border border-zinc-200 p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 sm:mb-5 border-b border-zinc-100 text-xs font-semibold">
                <span className="text-zinc-950 uppercase tracking-wider font-black">
                  CONVERSION RATIO
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-none border border-emerald-200 text-xs">
                  <ShieldCheck size={15} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>100% Capital Protected</span>
                </span>
              </div>

              <div className="mb-5 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-black text-zinc-950 block tracking-tight">
                  1 : 1 PARITY
                </span>
                <span className="text-xs sm:text-sm text-[#ea580c] font-black tracking-wide mt-1 block">
                  ₹{ticketPrice.toLocaleString("en-IN")} Deposit = {ticketPrice.toLocaleString("en-IN")} Drive Credits
                </span>
              </div>

              {/* 3 Core Utilities - Sharp */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                    <Gauge size={20} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm sm:text-base font-black text-zinc-950 block">Real Supercar Laps</span>
                    <span className="text-xs sm:text-sm text-zinc-950 font-bold block">Redeem for Buddh Circuit seat time</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-zinc-950 text-white flex items-center justify-center shrink-0">
                    <VideoCamera size={20} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm sm:text-base font-black text-zinc-950 block">4K FPV Media Shoots</span>
                    <span className="text-xs sm:text-sm text-zinc-950 font-bold block">Professional reels & track photos</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-zinc-200 text-zinc-900 flex items-center justify-center shrink-0">
                    <ClockCounterClockwise size={20} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm sm:text-base font-black text-zinc-950 block">Credits Never Expire</span>
                    <span className="text-xs sm:text-sm text-zinc-950 font-bold block">Use your credits whenever you wish</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-5 border-t border-zinc-100 text-xs sm:text-sm text-zinc-950 flex items-center justify-between font-black">
              <span>LEGAL ESCROW PROTOCOL</span>
              <span className="text-zinc-950 font-black">ZERO CAPITAL RISK</span>
            </div>
          </div>

          {/* Right Column: High-Readability Tier Matrix - Sharp Edged */}
          <div className="lg:col-span-7 rounded-none bg-white border border-zinc-200 p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2.5 mb-3 sm:mb-4 border-b border-zinc-100 text-xs sm:text-sm font-black text-zinc-950 tracking-wider">
                <span className="uppercase">ENTRY TIER</span>
                <span className="uppercase">CREDITS & ENTRIES</span>
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                {tiers.map((tier) => (
                  <div
                    key={tier.count}
                    className="p-2.5 sm:p-4 rounded-none bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200/80 transition-colors flex items-center justify-between gap-2 sm:gap-3"
                  >
                    {/* Left: Ticket count + Badge + Cost (Responsive single-line on mobile) */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg lg:text-xl font-black text-zinc-950 tracking-tight whitespace-nowrap">
                          {tier.count === 1 ? "1 Ticket" : `${tier.count} Tickets`}
                        </span>
                        {tier.badge && (
                          <span className="hidden sm:inline-flex text-[11px] font-black uppercase px-2 py-0.5 rounded-none bg-orange-100 text-[#ea580c] border border-orange-200 tracking-tight whitespace-nowrap shrink-0">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs sm:text-sm text-zinc-950 font-black whitespace-nowrap">
                          {tier.cost}
                        </span>
                        {tier.badge && (
                          <span className="sm:hidden inline-flex text-[10px] font-black uppercase px-1.5 py-0.5 rounded-none bg-orange-100 text-[#ea580c] border border-orange-200 tracking-tight whitespace-nowrap shrink-0">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Credits + Entries */}
                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg lg:text-xl font-black text-emerald-600 block tabular-nums whitespace-nowrap">
                        +{tier.credits} Credits
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#ea580c] block mt-0.5 whitespace-nowrap">
                        {tier.entries}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs sm:text-sm text-zinc-950 font-black">
              <span className="hidden sm:inline whitespace-nowrap">100% usable on track laps & media</span>
              <span className="sm:hidden whitespace-nowrap text-zinc-950 font-black">100% usable on track laps</span>
              <span className="text-emerald-700 font-black shrink-0 ml-2 whitespace-nowrap">Buddh Circuit Ready</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
