"use client"

import { Check, X, ShieldCheck, Scales, Sparkle } from "@phosphor-icons/react"

export function ValueMatrix() {
  const comparisonRows = [
    {
      feature: "Your Money",
      traditional: "Gone immediately if you don't win",
      turboride: "100% returned into your drive wallet",
    },
    {
      feature: "If You Don't Win",
      traditional: "You walk away with ₹0",
      turboride: "You keep all credits to drive real supercars",
    },
    {
      feature: "Real Supercar Access",
      traditional: "None. Just a raffle ticket",
      turboride: "Drive Lamborghini, Ferrari 488, McLaren 720S",
    },
    {
      feature: "Do Credits Expire?",
      traditional: "Tickets expire on the day of the draw",
      turboride: "Your Drive Credits never expire",
    },
    {
      feature: "Draw Transparency",
      traditional: "Private, unverified draw",
      turboride: "Streamed live on YouTube & Instagram",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 sm:py-24 lg:py-28 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-5 mb-10 sm:mb-12 border-b border-zinc-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
              <span>01 // THE ZERO-LOSS GUARANTEE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 uppercase tracking-tight leading-[1.02]">
              YOU FUND YOUR TRACK DRIVES.<br className="hidden sm:inline" />
              THE PORSCHE CONTEST IS 100% FREE.
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
            100% Money-Back in Drive Credits
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Clear Simple Explanation */}
          <div className="lg:col-span-5 flex flex-col items-start justify-between h-full">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight mb-3">
                How It Works
              </h3>

              <p className="text-base text-zinc-600 leading-relaxed mb-4">
                When you pay ₹1,000 for a contest ticket, every single Rupee is credited straight into your <strong className="text-zinc-950 font-bold">Drive Credits wallet</strong>.
              </p>

              <p className="text-base text-zinc-600 leading-relaxed mb-4">
                You can use these credits anytime to drive our <strong className="text-zinc-950 font-bold">Lamborghini Huracán, Ferrari 488, McLaren 720S, or Porsche 911</strong> on the track, or to get a 4K drone video reel.
              </p>

              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Because you receive full value for your money right away, you risk nothing. Even if your ticket is not drawn for the Porsche 718, your credits stay in your account forever.
              </p>
            </div>

            {/* Trust Cards */}
            <div className="w-full flex flex-col gap-3 font-mono text-xs mt-auto pt-2">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <ShieldCheck size={24} weight="fill" className="text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-zinc-950 block">Official Loyalty Rewards Program</span>
                  <span className="text-zinc-500 text-[11px]">Fully legal under Indian trade promotion laws.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <Scales size={24} weight="bold" className="text-[#ea580c] shrink-0" />
                <div>
                  <span className="font-bold text-zinc-950 block">100% Value Guarantee</span>
                  <span className="text-zinc-500 text-[11px]">₹1,000 ticket = 1,000 credits to drive supercars.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Comparison Box */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-100 font-mono text-xs">
              <span className="uppercase tracking-wider text-zinc-400 font-bold">
                DIRECT COMPARISON
              </span>
              <span className="text-zinc-500">
                10,000 Tickets Max
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 font-mono text-zinc-400 text-[11px] uppercase">
                    <th className="pb-3 w-5/12 font-bold">Other Giveaways</th>
                    <th className="pb-3 w-7/12 text-[#ea580c] font-black">TurboRide Club</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-3.5 pr-3 sm:pr-4 align-top">
                        <span className="font-mono text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                          {row.feature}
                        </span>
                        <div className="flex items-start gap-1.5 text-zinc-500 line-through text-xs sm:text-[13px]">
                          <X size={14} className="text-zinc-400 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pl-3 sm:pl-4 align-top bg-orange-50/30 rounded-lg">
                        <span className="font-mono text-[10px] text-[#ea580c] uppercase font-bold block mb-1">
                          Our Guarantee
                        </span>
                        <div className="flex items-start gap-2 text-zinc-950 font-semibold text-xs sm:text-[13px]">
                          <Check size={16} weight="bold" className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.turboride}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
              <span className="text-zinc-500">Strictly capped at 10,000 entries</span>
              <span className="text-emerald-600 font-bold">1 Ticket = 1,000 Credits Guaranteed</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
