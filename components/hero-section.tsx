"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Ticket, ArrowDown, ArrowUp, ShieldCheck, Gauge, Trophy, Scales, Broadcast } from "@phosphor-icons/react"

interface HeroSectionProps {
  onBuyClick: (ticketCount: number) => void
  onAllocationClick?: () => void
  isAllocationExpanded?: boolean
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
  onAllocationClick,
  isAllocationExpanded = false,
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
    <section className="relative pt-28 sm:pt-30 md:pt-30 lg:pt-32 pb-12 sm:pb-14 md:pb-12 lg:pb-14 flex flex-col justify-center overflow-hidden border-b border-orange-700 bg-[#ea580c]">
      
      {/* Smooth Automotive Studio Lighting - Clean & Glossy */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 85% 65% at 50% 35%, rgba(251, 146, 60, 0.45) 0%, rgba(234, 88, 12, 0.95) 55%, #c2410c 100%)
          `,
        }}
      />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Sleek Minimalist Studio Strip (Tablet & Desktop) - High-Contrast on Orange */}
        <div className="hidden md:flex items-center justify-between gap-4 pb-2.5 mb-5 md:mb-6 border-b border-white/25 text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="text-white font-black uppercase tracking-wider text-xs">
              TurboRide Supercar Club
            </span>
            <span className="text-white/40">/</span>
            <span className="text-orange-100 font-bold">
              Draw Cap: {totalCap.toLocaleString("en-IN")} Verified Entries
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-950 bg-white px-3 py-1 font-black text-xs shadow-2xs">
            <ShieldCheck size={15} weight="fill" className="text-emerald-600 shrink-0" />
            <span>100% Capital Returned in Drive Credits</span>
          </div>
        </div>

        {/* Expansive Responsive Layout with Balanced Column Alignment for Mobile, Tablet & Web */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Bold Headline & Sleek CTA - Centered on Mobile/Tablet, Left-Aligned on Desktop */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-center lg:text-left max-w-xl md:max-w-2xl lg:max-w-none mx-auto w-full">
            
            {/* Clean Telemetry Badge - No Clutter, No Fussy Lines, No Star Diamonds */}
            <div className="flex items-center justify-center lg:justify-start pt-2 sm:pt-0 mb-3 sm:mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-zinc-950 text-white text-[11px] sm:text-xs font-mono font-black tracking-widest uppercase border border-zinc-900 shadow-xs">
                <ShieldCheck size={15} weight="fill" className="text-emerald-400 shrink-0" />
                <span>DRAW #01 · ZERO LOSS</span>
              </div>
            </div>

            {/* Sharp, Well-Structured Headline - Fluid Clamp on Mobile, Scaled for Tablet Portrait (md:44px), Tablet Landscape (lg:36px), and Desktop (xl:48px, 2xl:52px) */}
            <h1 className="text-[clamp(27px,8.4vw,36.3px)] sm:text-[38px] md:text-[44px] lg:text-[36px] xl:text-[48px] 2xl:text-[52px] font-black tracking-tight uppercase leading-[1.05] text-white mb-3 sm:mb-3.5">
              <span className="block whitespace-nowrap">WIN A PORSCHE 718</span>
              <span className="block whitespace-nowrap">
                <span className="text-white">CAYMAN </span>
                <span className="text-zinc-950">FOR ₹{ticketPrice.toLocaleString("en-IN")}.</span>
              </span>
            </h1>

            {/* Well-Sized Subtext in Clean White for High Readability on Orange */}
            <p className="text-[13px] xs:text-sm sm:text-base md:text-base lg:text-[15px] xl:text-lg text-white font-semibold leading-snug sm:leading-relaxed mb-4 sm:mb-5 max-w-xl md:max-w-2xl lg:max-w-none mx-auto lg:mx-0">
              100% of your deposit returns as Buddh Circuit Drive Credits — win the supercar or hit the track.
            </p>

            {/* Clean Action Row - High-Contrast Jet Black Primary CTA on Orange Canvas */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-4 sm:mb-5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onAllocationClick || handleScrollToAllocation}
                className="w-full sm:w-auto h-[48px] sm:h-[52px] px-6 sm:px-7 md:px-8 lg:px-5 xl:px-8 rounded-none bg-zinc-950 hover:bg-black text-white text-sm sm:text-base font-black uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer border border-zinc-900"
              >
                <Ticket size={20} weight="fill" className="shrink-0 text-white" />
                <span className="whitespace-nowrap">
                  {isAllocationExpanded ? (
                    <span className="hidden lg:inline">Collapse Allocation</span>
                  ) : (
                    <span className="hidden lg:inline">Select Entry Allocation</span>
                  )}
                  <span className="lg:hidden">Select Entry Allocation</span>
                </span>
                {isAllocationExpanded ? (
                  <ArrowUp size={18} weight="bold" className="shrink-0 hidden lg:inline" />
                ) : (
                  <ArrowDown size={18} weight="bold" className="shrink-0 hidden lg:inline" />
                )}
                <ArrowDown size={18} weight="bold" className="shrink-0 lg:hidden animate-bounce" />
              </button>

              <a
                href="#how-it-works"
                className="hidden sm:inline-flex h-[48px] sm:h-[52px] px-5 sm:px-6 md:px-7 lg:px-5 xl:px-6 rounded-none bg-white hover:bg-zinc-100 text-zinc-950 border border-white text-sm sm:text-base font-black uppercase tracking-wider transition-all shadow-md items-center justify-center text-center cursor-pointer whitespace-nowrap"
              >
                How It Works
              </a>
            </div>

            {/* Micro Trust Telemetry Strip - Crisp White Card Floating on Orange, Symmetrically Aligned on Tablet */}
            <div className="w-full max-w-xl md:max-w-2xl lg:max-w-none xl:max-w-xl grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-none bg-white text-center text-[11px] sm:text-xs md:text-sm text-zinc-950 font-black shadow-[0_6px_20px_rgba(0,0,0,0.15)] border border-white mx-auto lg:mx-0">
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 min-w-0">
                <Scales size={16} weight="bold" className="text-emerald-600 shrink-0" />
                <span className="truncate">1:1 Parity</span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 border-x border-zinc-200">
                <Ticket size={16} weight="bold" className="text-[#ea580c] shrink-0" />
                <span className="truncate">10,000 Cap</span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 min-w-0">
                <Broadcast size={16} weight="bold" className="text-emerald-600 shrink-0" />
                <span className="truncate">Live Stream</span>
              </div>
            </div>

          </div>

          {/* Right Column: Supercar Studio Stage (Aligned on Tablet & Web) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center max-w-xl md:max-w-2xl lg:max-w-none mx-auto w-full">
            
            {/* Specs Strip - Crisp White Card with High-Impact Hierarchy & Tablet-Tuned Sizing */}
            <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-3 p-3 sm:p-4 rounded-none bg-white text-zinc-950 shadow-[0_6px_20px_rgba(0,0,0,0.15)] border border-white mb-3.5 sm:mb-4 md:mb-4">
              <div className="flex flex-col items-start min-w-0 px-1 sm:px-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-1">
                  Horsepower
                </span>
                <span className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-xl xl:text-3xl font-black text-zinc-950 tracking-tight leading-none whitespace-nowrap">
                  300 BHP
                </span>
              </div>

              <div className="flex flex-col items-center min-w-0 px-1 sm:px-2 border-x border-zinc-200">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-1">
                  0-100 km/h
                </span>
                <span className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-xl xl:text-3xl font-black text-zinc-950 tracking-tight leading-none whitespace-nowrap">
                  4.9s
                </span>
              </div>

              <div className="flex flex-col items-end min-w-0 px-1 sm:px-2 text-right">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-1">
                  Market Value
                </span>
                <span className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-xl xl:text-3xl font-black text-[#ea580c] tracking-tight leading-none whitespace-nowrap">
                  {cleanWorth}
                </span>
              </div>
            </div>

            {/* Vehicle Render - Expansive on Desktop, Proportioned with Generous Breathing Space on Mobile & Tablet */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col items-center justify-center pt-4 pb-7 sm:pt-5 sm:pb-8 md:pt-4 md:pb-6 lg:py-2 group"
            >
              <div className="relative w-full max-w-[420px] sm:max-w-[560px] md:max-w-[640px] lg:max-w-[760px] xl:max-w-[840px] mx-auto">
                <Image
                  src="/cars/car-718.png"
                  alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                  width={1000}
                  height={325}
                  priority
                  className="relative z-10 w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-500 select-none"
                />

                {/* Ground Shadow - Anchoring the Yellow Porsche firmly onto the Orange Surface */}
                <div 
                  className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-5 sm:h-7 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)",
                  }}
                />
                <div 
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[65%] h-2.5 sm:h-3 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,0.3) 0%, transparent 70%)",
                  }}
                />
              </div>
            </motion.div>

            {/* Bottom Delivery & Cash Option Bar - Crisp White with Black & Orange Accents */}
            <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 md:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-none bg-white text-zinc-950 shadow-[0_6px_20px_rgba(0,0,0,0.15)] border border-white">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 text-zinc-950 font-black shrink-0">
                <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-none bg-orange-100 flex items-center justify-center shrink-0">
                  <Gauge size={16} weight="bold" className="text-[#ea580c]" />
                </div>
                <span className="hidden sm:inline whitespace-nowrap text-xs sm:text-sm font-black">Buddh Circuit Delivery Included</span>
                <span className="sm:hidden whitespace-nowrap text-xs xs:text-[13px] font-black">Buddh Circuit Delivery</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-zinc-600 font-bold hidden md:inline lg:hidden xl:inline text-xs">Or choose</span>
                <span className="font-black text-white bg-zinc-950 border border-zinc-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-none text-xs xs:text-[13px] sm:text-sm whitespace-nowrap shadow-xs">
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
