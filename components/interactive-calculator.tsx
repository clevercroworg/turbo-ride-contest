"use client"

import { useState } from "react"
import { Ticket, ArrowRight, CheckCircle } from "@phosphor-icons/react"

interface CalculatorProps {
  onBuyTickets: (count: number) => void
}

export function InteractiveCalculator({ onBuyTickets }: CalculatorProps) {
  const [ticketCount, setTicketCount] = useState<number>(10)

  const quickPresets = [1, 5, 10, 25, 50, 100]

  const getRewardTier = (count: number) => {
    if (count >= 100) return "VIP Multi-Supercar Track Session (Huracán, Ferrari 488, McLaren)"
    if (count >= 50) return "Porsche 911 GT3 Full Track Day Session"
    if (count >= 25) return "Lamborghini / Ferrari 5-Lap Drive + 25% Cash Commission Unlocked"
    if (count >= 10) return "Instagram 4K Reel Production + Cockpit Telemetry"
    return "Supercar Studio Photoshoot (5 HD Edits)"
  }

  return (
    <section className="py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 mb-3 uppercase">
            Ticket & Credit Calculator
          </h2>
          <p className="text-base text-zinc-950 font-medium leading-relaxed px-4 xs:px-6 sm:px-0">
            Slide to see your credit allocation and the exact supercar experiences unlocked.
          </p>
        </div>

        {/* Calculator Hardware Card */}
        <div className="double-bezel-outer">
          <div className="double-bezel-inner p-6 sm:p-10 flex flex-col gap-8 bg-white shadow-sm">
            
            {/* Quick Preset Buttons */}
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-zinc-950 font-black mb-3">
                Select Ticket Count
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {quickPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTicketCount(preset)}
                    className={`py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      ticketCount === preset
                        ? "bg-orange-500 text-white font-black shadow-md shadow-orange-500/25 scale-105"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950 border border-zinc-200 font-bold"
                    }`}
                  >
                    {preset} {preset === 1 ? "Ticket" : "Tickets"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactile Range Slider */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-zinc-600">1 Ticket</span>
                <span className="text-[#ea580c] font-black text-sm">
                  {ticketCount} {ticketCount === 1 ? "Ticket" : "Tickets"}
                </span>
                <span className="text-zinc-600">100 Tickets</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-200/80">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <span className="block text-xs font-mono uppercase text-zinc-950 font-black mb-1">
                  You Deposit
                </span>
                <span className="text-2xl font-black font-mono text-zinc-950">
                  ₹{(ticketCount * 1000).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <span className="block text-xs font-mono uppercase text-zinc-950 font-black mb-1">
                  Drive Credits Received
                </span>
                <span className="text-2xl font-black font-mono text-emerald-600">
                  {(ticketCount * 1000).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <span className="block text-xs font-mono uppercase text-zinc-950 font-black mb-1">
                  Contest Entries
                </span>
                <span className="text-2xl font-black font-mono text-[#ea580c]">
                  {ticketCount} {ticketCount === 1 ? "Ticket" : "Tickets"}
                </span>
              </div>
            </div>

            {/* Unlocked Reward Preview */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-start gap-3">
              <CheckCircle size={20} weight="fill" className="text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-mono uppercase font-bold text-orange-700 mb-0.5">
                  Instant Redemption Unlock
                </span>
                <p className="text-xs font-semibold text-zinc-800">
                  {getRewardTier(ticketCount)}
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onBuyTickets(ticketCount)}
              className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm uppercase tracking-wide transition-all shadow-lg shadow-orange-500/25 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket size={18} weight="fill" />
              <span>Claim {ticketCount} {ticketCount === 1 ? "Ticket" : "Tickets"} Now</span>
              <ArrowRight size={16} weight="bold" />
            </button>

          </div>
        </div>

      </div>
    </section>
  )
}
