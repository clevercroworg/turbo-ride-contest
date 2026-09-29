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
        
        {/* Creative Automotive Telemetry Deco & Single Line Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
            <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              02 · ZERO-LOSS PROTOCOL
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
            </span>
            <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none">
            HOW IT WORKS
          </h2>
        </div>

        {/* 4-Step Connected Telemetry Track - Sharp Edged */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="relative rounded-none bg-zinc-50 border border-zinc-200 p-5 sm:p-6 flex flex-col justify-between hover:bg-white hover:border-zinc-400 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-zinc-200/60">
                    <span className="text-2xl sm:text-3xl font-black text-zinc-400 tabular-nums">
                      {step.num}
                    </span>
                    <span className="text-[11px] sm:text-xs uppercase font-extrabold text-[#ea580c] bg-orange-100/80 border border-orange-200 px-2.5 py-0.5 rounded-none tracking-tight">
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Icon size={22} weight="bold" className="text-zinc-950 shrink-0" />
                    <h3 className="text-lg xs:text-xl sm:text-lg lg:text-xl font-black text-zinc-950 uppercase tracking-tight">
                      {step.action}
                    </h3>
                  </div>

                  <p className="text-[13px] sm:text-sm text-zinc-950 leading-relaxed font-medium">
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
