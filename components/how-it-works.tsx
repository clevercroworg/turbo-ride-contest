"use client"

import { Wallet, Hash, Broadcast, Gauge } from "@phosphor-icons/react"

interface HowItWorksProps {
  ticketPrice?: number
  targetTickets?: number
  carName?: string
}

export function HowItWorks({
  ticketPrice = 1000,
  targetTickets = 10000,
  carName = "Porsche 718 Cayman",
}: HowItWorksProps = {}) {
  const steps = [
    {
      num: "01",
      icon: Wallet,
      action: `Deposit ₹${ticketPrice.toLocaleString("en-IN")}`,
      detail: `${ticketPrice.toLocaleString("en-IN")} Drive Credits credited instantly to your wallet.`,
      badge: "1:1 Value Ratio",
    },
    {
      num: "02",
      icon: Hash,
      action: "Choose 5-Digits",
      detail: "Pick your lucky sequence or trigger cryptographic Auto-Pick.",
      badge: "Verifiable Seed",
    },
    {
      num: "03",
      icon: Broadcast,
      action: "Live Streamed Draw",
      detail: "Official draw broadcasted live on YouTube and Instagram.",
      badge: `${targetTickets.toLocaleString("en-IN")} Entry Cap`,
    },
    {
      num: "04",
      icon: Gauge,
      action: "Zero Capital Loss",
      detail: `Win the ${carName} or use credits for real circuit track drives.`,
      badge: "Permanent Credits",
    },
  ]

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-8 sm:mb-10 border-b border-zinc-200 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c] block mb-1">
              THE ZERO-LOSS PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight">
              HOW IT WORKS
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-zinc-500 font-medium">
            Not a lottery · 100% drive credit backing
          </span>
        </div>

        {/* 4-Step Connected Telemetry Track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="relative rounded-2xl bg-zinc-50 border border-zinc-200 p-5 sm:p-6 flex flex-col justify-between hover:bg-white hover:border-zinc-300 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200/60">
                    <span className="text-2xl font-black text-zinc-300 tabular-nums">
                      {step.num}
                    </span>
                    <span className="text-[11px] uppercase font-bold text-[#ea580c] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={20} weight="bold" className="text-zinc-950 shrink-0" />
                    <h3 className="text-base sm:text-lg font-bold text-zinc-950 uppercase tracking-tight">
                      {step.action}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {step.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
