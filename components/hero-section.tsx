"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Ticket, ArrowDown, ShieldCheck, Gauge, Trophy } from "@phosphor-icons/react"

interface HeroSectionProps {
  onBuyClick: (ticketCount: number) => void
  totalTicketsSold?: number
  ticketsRemaining?: number
  soldTickets?: number
  targetTickets?: number
  ticketPrice?: number
  carName?: string
  worthDisplay?: string
}

export function HeroSection({
  onBuyClick,
  totalTicketsSold,
  soldTickets,
  targetTickets = 10000,
  ticketPrice = 1000,
  carName = "Porsche 718 Cayman",
  worthDisplay = "Worth over ₹1.6 Crore",
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion()

  const ticketsSold = totalTicketsSold ?? soldTickets ?? 6413
  const totalCap = targetTickets || 10000

  const handleScrollToAllocation = () => {
    const el = document.getElementById("entry-allocation")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    } else {
      onBuyClick(10)
    }
  }

  const cleanWorth = worthDisplay ? worthDisplay.replace(/^Worth\s+(over\s+)?/i, "").trim() : "₹1.6 Crore"

  return (
    <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-6 sm:pb-8 lg:pb-10 min-h-[75dvh] flex flex-col justify-center overflow-hidden border-b border-zinc-200">
      
      {/* Automotive Studio Backdrop - Balanced Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 75% 50% at 50% 55%, rgba(249, 115, 22, 0.18) 0%, rgba(254, 215, 170, 0.08) 50%, transparent 80%),
            linear-gradient(180deg, #ffffff 0%, #fffcf8 40%, #fff6ec 75%, #ffffff 100%)
          `,
        }}
      />

      {/* Subtle Paddock Alignment Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(234, 88, 12, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Sleek Minimalist Studio Strip (Desktop Only to maximize mobile viewport) */}
        <div className="hidden lg:flex items-center justify-between gap-2 pb-2 mb-4 border-b border-zinc-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-950 font-bold uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45" />
              TurboRide Supercar Club
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600 font-medium">
              Draw Cap: {totalCap.toLocaleString("en-IN")} Verified Entries
            </span>
          </div>

          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <ShieldCheck size={14} weight="fill" className="text-emerald-600 shrink-0" />
            <span>100% Capital Returned in Drive Credits</span>
          </div>
        </div>

        {/* Expansive Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 xl:gap-12 items-center">
          
          {/* Left Column: Bold Headline & Sleek CTA */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-center lg:text-left">
            
            {/* Creative Telemetry Deco */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-2 sm:mb-2.5">
              <span className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent to-[#ea580c]" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#ea580c] font-black uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block" />
                OFFICIAL DRAW #01 // ZERO-LOSS PROTOCOL
                <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block" />
              </span>
              <span className="w-6 sm:w-10 h-px bg-gradient-to-l from-transparent to-[#ea580c]" />
            </div>

            {/* Sharp, Well Font Sized Headline */}
            <h1 className="text-[26px] xs:text-[28px] sm:text-4xl lg:text-[44px] xl:text-[50px] font-black tracking-tight uppercase leading-[1.08] text-zinc-950 mb-2 sm:mb-3">
              WIN A SUPERCAR.<br />
              <span className="text-[#ea580c]">100% CREDITS BACK.</span>
            </h1>

            {/* Well-Sized Subtext */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 font-medium leading-relaxed mb-3 sm:mb-4 max-w-md mx-auto lg:mx-0">
              Deposit ₹{ticketPrice.toLocaleString("en-IN")} to enter the verified <strong className="text-zinc-950 font-bold">{carName}</strong> draw. 100% returned in Buddh Circuit Drive Credits.
            </p>

            {/* Clean Action Row - Sharp Edges */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-2.5 sm:mb-4">
              <button
                type="button"
                onClick={handleScrollToAllocation}
                className="w-full sm:w-auto py-3 px-6 sm:px-7 rounded-none bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:shadow-[0_6px_22px_rgba(234,88,12,0.5)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket size={17} weight="fill" className="shrink-0" />
                <span>Select Entry Allocation</span>
                <ArrowDown size={15} weight="bold" className="shrink-0 animate-bounce" />
              </button>

              <a
                href="#how-it-works"
                className="hidden sm:inline-flex py-3 px-4 sm:px-5 rounded-none bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-2xs items-center justify-center text-center"
              >
                How It Works
              </a>
            </div>

            {/* Micro Trust Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-[10px] sm:text-xs text-zinc-600 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rotate-45" />
                1:1 Credit Parity
              </span>
              <span className="text-zinc-300">•</span>
              <span>10,000 Cap Draw</span>
              <span className="text-zinc-300">•</span>
              <span>Live Streamed</span>
            </div>

          </div>

          {/* Right Column: Supercar Studio Stage (Expansive on Web & Perfectly Scaled on Mobile) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            
            {/* Specs Strip - Sharp Edged */}
            <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-none bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-2xs mb-1.5 sm:mb-2">
              <div className="flex flex-col items-start min-w-0 px-1">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  Powertrain
                </span>
                <span className="text-[11px] sm:text-xs lg:text-sm font-black text-zinc-950 tracking-tight leading-none truncate">
                  2.0L Turbo Flat-4
                </span>
              </div>

              <div className="flex flex-col items-center min-w-0 px-1 border-x border-zinc-200">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  0-100 km/h
                </span>
                <span className="text-[11px] sm:text-xs lg:text-sm font-black text-zinc-950 tracking-tight leading-none">
                  4.9s
                </span>
              </div>

              <div className="flex flex-col items-end min-w-0 px-1 text-right">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  Market Value
                </span>
                <span className="text-[11px] sm:text-xs lg:text-sm font-black text-[#ea580c] tracking-tight leading-none truncate">
                  {cleanWorth}
                </span>
              </div>
            </div>

            {/* Vehicle Render - Expansive on Desktop & Perfectly Proportioned on Mobile */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col items-center justify-center my-0.5 sm:my-1.5 group"
            >
              <div className="relative w-full max-w-[380px] sm:max-w-[560px] lg:max-w-[760px] xl:max-w-[840px]">
                <Image
                  src="/cars/car-718.png"
                  alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                  width={1100}
                  height={450}
                  priority
                  className="relative z-10 w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-500 select-none drop-shadow-[0_12px_24px_rgba(234,88,12,0.2)]"
                />

                {/* Studio Ground Shadow */}
                <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-2.5 sm:h-4 bg-zinc-950/20 rounded-none blur-md transform scale-y-50 pointer-events-none" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-1 sm:h-2 bg-orange-600/25 rounded-none blur-xs pointer-events-none" />
              </div>
            </motion.div>

            {/* Bottom Delivery & Cash Option Bar - Sharp Edged */}
            <div className="w-full flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-none bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-2xs text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5 text-zinc-950 font-bold truncate">
                <div className="w-5 h-5 rounded-none bg-orange-100 flex items-center justify-center shrink-0">
                  <Gauge size={13} weight="bold" className="text-[#ea580c]" />
                </div>
                <span className="truncate">Buddh Circuit Delivery Included</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-zinc-500 hidden sm:inline">Or choose</span>
                <span className="font-black text-zinc-950 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-none text-[10px] sm:text-xs">
                  ₹75 Lakh Cash Option
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
