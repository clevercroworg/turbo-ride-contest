"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Ticket, ArrowRight, ShieldCheck } from "@phosphor-icons/react"

interface CreditCalculatorProps {
  onBuyTickets: (count: number) => void
}

interface TierItem {
  credits: number
  creditsDisplay: string
  tickets: number
  costDisplay: string
  title: string
  description: string
  tickName: string
  image?: string
  isQuad?: boolean
}

export function CreditCalculator({ onBuyTickets }: CreditCalculatorProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const tiers: TierItem[] = [
    {
      credits: 1000,
      creditsDisplay: "1,000",
      tickets: 1,
      costDisplay: "₹1,000",
      title: "Supercar Photoshoot",
      description: "5 HD retouched photos posing with a supercar in studio.",
      tickName: "Photoshoot",
      image: "/fleet/photoshoot.jpg",
    },
    {
      credits: 2000,
      creditsDisplay: "2,000",
      tickets: 2,
      costDisplay: "₹2,000",
      title: "30-Second Instagram Reel",
      description: "A cinematic 30-second 4K reel with drone and cockpit footage.",
      tickName: "Reel",
      image: "/fleet/instagram-reel.jpg",
    },
    {
      credits: 25000,
      creditsDisplay: "25,000",
      tickets: 25,
      costDisplay: "₹25,000",
      title: "Lamborghini Huracán Drive",
      description: "5 adrenaline-fueled track laps on the Buddh Circuit (2 km per lap).",
      tickName: "Lambo drive",
      image: "/fleet/huracan.jpg",
    },
    {
      credits: 100000,
      creditsDisplay: "1,00,000",
      tickets: 100,
      costDisplay: "₹1,00,000",
      title: "All 4 Supercars",
      description: "Drive the Lamborghini, Ferrari, McLaren, and Porsche 911 across the full fleet.",
      tickName: "All 4 cars",
      isQuad: true,
    },
  ]

  const activeTier = tiers[activeIndex]
  const progressPercent = (activeIndex / (tiers.length - 1)) * 100

  return (
    <section id="credit-calculator" className="py-12 sm:py-20 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Telemetry Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
            <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              CREDIT CALCULATOR
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
            </span>
            <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none mb-3">
            WHAT YOUR CREDITS GET YOU
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto px-4 xs:px-6 sm:px-0">
            Slide to see what you can redeem at TurboRide Supercars.
          </p>
        </div>

        {/* Master Showcase Card: Balanced Proportions Matching Reference Mockup */}
        <div className="max-w-[620px] mx-auto rounded-2xl bg-white border border-zinc-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.06)] overflow-hidden">
          
          {/* Visual Experience Stage */}
          <div className="relative w-full aspect-[16/9] bg-zinc-950 overflow-hidden select-none">
            <AnimatePresence mode="wait">
              {activeTier.isQuad ? (
                /* Quad Split View for 1,00,000 Tier */
                <motion.div
                  key="quad-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 bg-zinc-900"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src="/fleet/huracan.jpg"
                      alt="Lamborghini Huracán"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 310px"
                    />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 uppercase rounded-sm">
                      Huracán
                    </span>
                  </div>
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src="/fleet/ferrari.jpg"
                      alt="Ferrari 488 GTB"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 310px"
                    />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 uppercase rounded-sm">
                      488 GTB
                    </span>
                  </div>
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src="/fleet/mclaren.jpg"
                      alt="McLaren 720S"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 310px"
                    />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 uppercase rounded-sm">
                      720S
                    </span>
                  </div>
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src="/fleet/porsche-911.jpg"
                      alt="Porsche 911 GT3"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 310px"
                    />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-black/80 px-1.5 py-0.5 uppercase rounded-sm">
                      911 GT3
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* Single Image Hero View */
                <motion.div
                  key={activeTier.title}
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeTier.image || "/fleet/photoshoot.jpg"}
                    alt={activeTier.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 620px"
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Top Credits Badge (Matching reference rounded pill) */}
            <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ea580c] text-white text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {activeTier.creditsDisplay} credits
              </span>
            </div>
          </div>

          {/* Experience Details Deck */}
          <div className="p-4 sm:p-5 bg-white">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight leading-tight">
              {activeTier.title}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1 leading-snug">
              {activeTier.description}
            </p>

            <div className="mt-2.5 inline-flex items-center gap-1.5 text-[#ea580c] text-xs sm:text-sm font-bold">
              <Ticket size={15} weight="fill" className="shrink-0" />
              <span>
                {activeTier.tickets} {activeTier.tickets === 1 ? "ticket" : "tickets"} · {activeTier.costDisplay}
              </span>
            </div>
          </div>

          {/* Stepped Slider Deck */}
          <div className="px-4 pb-5 pt-3 sm:px-5 sm:pb-6 bg-white border-t border-zinc-100">
            {/* Custom Interactive Range Slider */}
            <div className="relative mb-5 pt-2">
              {/* Slider Track Background */}
              <div className="w-full h-1.5 sm:h-2 bg-zinc-200 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-[#ea580c] rounded-full transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Native Range Input (Transparent, sitting directly over the track) */}
              <input
                type="range"
                min="0"
                max={tiers.length - 1}
                step="1"
                value={activeIndex}
                onChange={(e) => setActiveIndex(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                aria-label="Credit Experience Tier Slider"
              />

              {/* Visual Draggable Thumb Pill */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-[#ea580c] rounded-full border-2 border-white shadow-md pointer-events-none transition-all duration-200 z-10"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            {/* 4 Stepped Ticks */}
            <div className="grid grid-cols-4 gap-1 text-center">
              {tiers.map((tier, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={tier.credits}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className="flex flex-col items-center justify-start group cursor-pointer transition-colors py-0.5"
                  >
                    <span
                      className={`text-xs sm:text-sm font-mono tabular-nums leading-tight transition-all ${
                        isActive
                          ? "text-[#ea580c] font-black"
                          : "text-zinc-600 font-bold group-hover:text-zinc-950"
                      }`}
                    >
                      {tier.creditsDisplay}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs tracking-tight mt-0.5 leading-tight transition-all ${
                        isActive
                          ? "text-zinc-950 font-black"
                          : "text-zinc-400 font-medium group-hover:text-zinc-700"
                      }`}
                    >
                      {tier.tickName}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Direct CTA Button */}
            <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
              <div className="hidden xs:flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-500 font-medium">
                <ShieldCheck size={16} weight="fill" className="text-emerald-600 shrink-0" />
                <span>100% refundable as drive credits</span>
              </div>

              <button
                type="button"
                onClick={() => onBuyTickets(activeTier.tickets)}
                className="w-full xs:w-auto ml-auto px-5 py-2.5 rounded-lg bg-zinc-950 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow hover:shadow-md active:scale-98"
              >
                <span>Get {activeTier.tickets} {activeTier.tickets === 1 ? "Ticket" : "Tickets"}</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
