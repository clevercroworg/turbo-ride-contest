import { CreditCard, Hash, Trophy, ArrowRight, ShieldCheck, CheckCircle } from "@phosphor-icons/react/dist/ssr"

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: CreditCard,
      subtitle: "CAPITAL ESCROW & CONVERSION",
      title: "Deposit ₹1,000 per Entry",
      description:
        "Every single ₹1,000 deposited is instantly minted as 1,000 permanent TurboRide Drive Credits in your shared club wallet. Funds are never consumed or forfeited.",
      stat: "100% Value Back",
      statDetail: "1 ₹ = 1 Drive Credit",
    },
    {
      num: "02",
      icon: Hash,
      subtitle: "CRYPTOGRAPHIC ALLOCATION",
      title: "Pick Your 5-Digit Number",
      description:
        "For each deposit, choose your lucky 5-digit sequence (e.g., 40821) or trigger our deterministic cryptographic Auto-Pick. Every ticket is publicly verifiable.",
      stat: "Deterministic",
      statDetail: "Self-chosen 5-digit ticket",
    },
    {
      num: "03",
      icon: Trophy,
      subtitle: "DUAL OUTCOME RESOLUTION",
      title: "Win Cayman or Track Laps",
      description:
        "Spend your credits anytime on our fleet at Buddh International Circuit (Lamborghini, Ferrari, Cayman) while your ticket remains live in the 10,000-entry draw.",
      stat: "Zero Capital Risk",
      statDetail: "Delivery or ₹75L cash wire",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 sm:py-28 border-t border-zinc-200 bg-white relative overflow-hidden">
      
      {/* Subtle architectural background grid */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Masthead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-zinc-200 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
              <span className="font-mono text-xs uppercase tracking-widest font-black text-[#ea580c]">
                PROGRAM PROTOCOL // THE MECHANICS
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 uppercase leading-[0.95]">
              HOW ZERO CAPITAL DILUTION WORKS
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end font-mono text-xs text-zinc-500">
            <span className="text-zinc-900 font-bold uppercase tracking-wider">
              3-STAGE DUAL-VALUE PIPELINE
            </span>
            <span className="text-[11px] text-zinc-400">
              AUDITED ON NEON POSTGRESQL · VERIFIED SEED
            </span>
          </div>
        </div>

        {/* 3 Process Column Grid with High-End Editorial Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="relative rounded-2xl bg-zinc-50/70 border border-zinc-200/90 p-8 flex flex-col justify-between hover:bg-white hover:border-zinc-300 hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-200/70">
                    <span className="font-mono text-4xl sm:text-5xl font-black text-zinc-300 group-hover:text-[#ea580c] transition-colors leading-none">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:bg-[#ea580c] group-hover:text-white group-hover:border-[#ea580c] transition-all shadow-xs">
                      <Icon size={24} weight="bold" />
                    </div>
                  </div>

                  {/* Subtitle & Title */}
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#ea580c] block mb-2">
                    {step.subtitle}
                  </span>
                  <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-zinc-600 leading-relaxed font-normal mb-8">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Spec Anchor */}
                <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-400 font-semibold">
                      {step.stat}
                    </span>
                    <span className="font-bold text-zinc-900">
                      {step.statDetail}
                    </span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-zinc-100 group-hover:bg-orange-50 group-hover:text-[#ea580c] text-zinc-400 flex items-center justify-center transition-colors">
                    <ArrowRight size={12} weight="bold" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tactical Banner Callout */}
        <div className="mt-12 rounded-2xl bg-zinc-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={28} weight="fill" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                Guaranteed Balance Portability
              </h4>
              <p className="text-sm text-zinc-400 font-sans mt-0.5">
                Drive credits have no expiration date and apply 100% to track day bookings, coaching sessions, or gift passes.
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-zinc-300 shrink-0 flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-white/10 font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle size={14} weight="fill" />
              Buddh Circuit Partnered
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
