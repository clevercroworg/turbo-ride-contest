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
    <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 lg:pb-14 flex flex-col justify-center overflow-hidden border-b border-zinc-200">
      
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
        
        {/* Sleek Minimalist Studio Strip (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between gap-4 pb-2.5 mb-6 border-b border-zinc-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-950 font-black uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45" />
              TurboRide Supercar Club
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-950 font-bold">
              Draw Cap: {totalCap.toLocaleString("en-IN")} Verified Entries
            </span>
          </div>

          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs">
            <ShieldCheck size={15} weight="fill" className="text-emerald-600 shrink-0" />
            <span>100% Capital Returned in Drive Credits</span>
          </div>
        </div>

        {/* Expansive Responsive Layout with Balanced Column Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Bold Headline & Sleek CTA */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-center lg:text-left">
            
            {/* Creative Telemetry Deco */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2.5 sm:mb-3">
              <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
              <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
                DRAW #01 · ZERO LOSS
                <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              </span>
              <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
            </div>

            {/* Sharp, Well Font Sized Headline */}
            <h1 className="text-[28px] xs:text-[32px] sm:text-4xl lg:text-[44px] xl:text-[50px] font-black tracking-tight uppercase leading-[1.05] text-zinc-950 mb-3 sm:mb-3.5">
              WIN A SUPERCAR.<br />
              <span className="text-[#ea580c]">100% CREDITS BACK.</span>
            </h1>

            {/* Well-Sized Subtext in Full Black - 2 Lines Max in Any Display */}
            <p className="text-[13px] xs:text-sm sm:text-base lg:text-lg text-zinc-950 font-bold leading-snug sm:leading-relaxed mb-4 sm:mb-5 max-w-xl mx-auto lg:mx-0">
              <span className="hidden sm:inline">
                Deposit ₹{ticketPrice.toLocaleString("en-IN")} to enter the verified <strong className="text-zinc-950 font-black">{carName}</strong> draw. 100% back in Drive Credits.
              </span>
              <span className="sm:hidden">
                Deposit ₹{ticketPrice.toLocaleString("en-IN")} for the <strong className="text-zinc-950 font-black">{carName.includes("Porsche") ? "Porsche 718" : carName}</strong> draw.<br />100% back in Drive Credits.
              </span>
            </p>

            {/* Clean Action Row - Equal Height, Sharp Edges & High-End Hover States */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-4 sm:mb-5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleScrollToAllocation}
                className="w-full sm:w-auto h-[48px] sm:h-[52px] px-6 sm:px-8 rounded-none bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm sm:text-base font-black uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:shadow-[0_6px_22px_rgba(234,88,12,0.5)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Ticket size={20} weight="fill" className="shrink-0" />
                <span className="whitespace-nowrap">Select Entry Allocation</span>
                <ArrowDown size={18} weight="bold" className="shrink-0 animate-bounce" />
              </button>

              <a
                href="#how-it-works"
                className="hidden sm:inline-flex h-[48px] sm:h-[52px] px-5 sm:px-6 rounded-none bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-300 text-sm sm:text-base font-black uppercase tracking-wider transition-all shadow-2xs items-center justify-center text-center cursor-pointer"
              >
                How It Works
              </a>
            </div>

            {/* Micro Trust Telemetry Strip - Structured & Grounded on Web */}
            <div className="w-full max-w-xl grid grid-cols-3 gap-2 p-2 sm:p-2.5 rounded-none bg-white/90 backdrop-blur-md border border-zinc-200/90 shadow-2xs text-center text-xs sm:text-sm text-zinc-950 font-black">
              <div className="flex items-center justify-center gap-1.5 min-w-0">
                <span className="w-2 h-2 bg-emerald-600 rotate-45 shrink-0" />
                <span className="truncate">1:1 Parity</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 min-w-0 border-x border-zinc-200">
                <span className="w-1.5 h-1.5 bg-[#ea580c] rounded-full shrink-0" />
                <span className="truncate">10,000 Cap</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                <span className="truncate">Live Stream</span>
              </div>
            </div>

          </div>

          {/* Right Column: Supercar Studio Stage (Expansive on Web & Perfectly Scaled on Mobile) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            
            {/* Specs Strip - Sharp Edged & High-Readability Font Sizing */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-none bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-2xs mb-2 sm:mb-3">
              <div className="flex flex-col items-start min-w-0 px-1 sm:px-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-950 font-black block mb-0.5">
                  Horsepower
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-black text-zinc-950 tracking-tight leading-tight">
                  300 BHP
                </span>
              </div>

              <div className="flex flex-col items-center min-w-0 px-1 sm:px-2 border-x border-zinc-300">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-950 font-black block mb-0.5">
                  0-100 km/h
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-black text-zinc-950 tracking-tight leading-tight">
                  4.9s
                </span>
              </div>

              <div className="flex flex-col items-end min-w-0 px-1 sm:px-2 text-right">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-950 font-black block mb-0.5">
                  Market Value
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-black text-[#ea580c] tracking-tight leading-tight">
                  {cleanWorth}
                </span>
              </div>
            </div>

            {/* Vehicle Render - Expansive on Desktop & Perfectly Proportioned on Mobile */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col items-center justify-center my-1 sm:my-2 group"
            >
              <div className="relative w-full max-w-[420px] sm:max-w-[580px] lg:max-w-[760px] xl:max-w-[840px]">
                <Image
                  src="/cars/car-718.png"
                  alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                  width={1100}
                  height={450}
                  priority
                  className="relative z-10 w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-500 select-none drop-shadow-[0_10px_22px_rgba(0,0,0,0.12)]"
                />

                {/* Realistic Studio Radial Ground Shadow - Smooth & Natural, No Box Smudges */}
                <div 
                  className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-5 sm:h-7 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(9,9,11,0.25) 0%, rgba(9,9,11,0.08) 50%, transparent 75%)",
                  }}
                />
                <div 
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[65%] h-2.5 sm:h-3 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(234,88,12,0.15) 0%, transparent 70%)",
                  }}
                />
              </div>
            </motion.div>

            {/* Bottom Delivery & Cash Option Bar - Sharp Edged & Prominent (No mobile truncation) */}
            <div className="w-full flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-none bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-2xs text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-950 font-black shrink-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-orange-100 flex items-center justify-center shrink-0">
                  <Gauge size={15} weight="bold" className="text-[#ea580c]" />
                </div>
                <span className="hidden md:inline whitespace-nowrap">Buddh Circuit Delivery Included</span>
                <span className="md:hidden whitespace-nowrap text-[11px] sm:text-xs">Buddh Circuit Delivery</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-zinc-950 font-bold hidden md:inline text-xs">Or choose</span>
                <span className="font-black text-zinc-950 bg-zinc-100 border border-zinc-300 px-2 sm:px-3 py-1 rounded-none text-[11px] sm:text-xs md:text-sm whitespace-nowrap">
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
