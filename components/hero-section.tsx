"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Ticket, ArrowRight, ShieldCheck, Gauge } from "@phosphor-icons/react"

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
  const [selectedTickets, setSelectedTickets] = useState(10)
  const reduceMotion = useReducedMotion()

  const ticketsSold = totalTicketsSold ?? soldTickets ?? 6362
  const totalCap = targetTickets || 10000
  const progressPercent = Math.min(100, Math.round((ticketsSold / totalCap) * 100))

  const ticketOptions = [
    { count: 1, label: "01", bonus: "" },
    { count: 5, label: "05", bonus: "" },
    { count: 10, label: "10", bonus: "POPULAR" },
    { count: 25, label: "25", bonus: "+CASH" },
    { count: 50, label: "50", bonus: "VIP CLUB" },
  ]

  const totalCost = selectedTickets * ticketPrice
  const totalCredits = selectedTickets * ticketPrice

  return (
    <section className="relative pt-20 sm:pt-22 lg:pt-24 pb-6 sm:pb-8 lg:pb-10 overflow-hidden lg:min-h-[calc(100vh-5rem)] lg:flex lg:flex-col lg:justify-center border-b border-zinc-200">
      
      {/* 
        Apt Automotive Studio Background:
        WHITE AT TOP -> VIBRANT GLOWING RACING ORANGE AT BOTTOM -> WHITE SEAM
        No black, proper radiant orange atmosphere rising from the stage floor
      */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 110% 70% at 50% 82%, rgba(234, 88, 12, 0.75) 0%, rgba(249, 115, 22, 0.5) 40%, rgba(254, 215, 170, 0.2) 70%, transparent 100%),
            radial-gradient(ellipse 75% 50% at 80% 80%, rgba(249, 115, 22, 0.55) 0%, transparent 60%),
            radial-gradient(ellipse 75% 50% at 20% 80%, rgba(234, 88, 12, 0.45) 0%, transparent 60%),
            linear-gradient(180deg, #ffffff 0%, #ffffff 24%, #fff7ed 46%, #fed7aa 64%, #f97316 80%, #ea580c 90%, #ffffff 100%)
          `,
        }}
      />

      {/* Precision Paddock Alignment Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(rgba(234, 88, 12, 0.3) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Technical Corner Markers */}
      <div className="absolute top-22 left-8 text-zinc-400 font-mono text-[10px] hidden xl:block select-none tracking-widest">
        + TR-GT718-SPEC
      </div>
      <div className="absolute top-22 right-8 text-zinc-400 font-mono text-[10px] hidden xl:block select-none tracking-widest">
        BIC-DELIVERY +
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Campaign Bar: Crisp Editorial Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 sm:mb-5 border-b border-zinc-200/80 font-mono text-[11px] sm:text-xs text-zinc-700">
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <span className="text-zinc-950 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
              TurboRide Supercar Club
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600 font-medium">
              Draw Cap: {totalCap.toLocaleString("en-IN")} Verified Entries
            </span>
          </div>

          <div className="flex items-center gap-3 uppercase tracking-wider font-mono text-[10px] sm:text-[11px] w-full sm:w-auto">
            <span className="flex items-center gap-1.5 text-emerald-800 font-bold bg-white/95 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
              <ShieldCheck size={14} weight="fill" className="text-emerald-600 shrink-0" />
              <span>100% Capital Returned in Drive Credits</span>
            </span>
            <span className="text-zinc-300 hidden md:inline">/</span>
            <span className="text-zinc-600 font-medium hidden md:inline">Buddh Circuit Delivery</span>
          </div>
        </div>

        {/* 2-Column Asymmetric Viewport-Fit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-10 items-center">
          
          {/* Left Column: Bold 2-Line Headline + Sleek Allocation Card */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Header Area: Strict Stack Discipline (Max 4 Text Elements) */}
            <div className="mb-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-white/90 text-[#ea580c] uppercase tracking-wider border border-orange-200 shadow-2xs mb-2">
                OFFICIAL GRAND PRIZE DRAW #01
              </div>

              {/* 2-Line Headline (Fits Viewport & Mobile) */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-black tracking-[-0.03em] uppercase leading-[1.0] text-balance text-zinc-950">
                ONE DEPOSIT. WIN A SUPERCAR.<br />
                <span className="text-[#ea580c]">100% IN DRIVE CREDITS.</span>
              </h1>
            </div>

            {/* Subtext: Strict 16 Words (Under 20 Words Cap) */}
            <p className="text-xs sm:text-[13px] text-zinc-700 font-medium leading-relaxed mb-3.5 max-w-lg">
              Deposit ₹{ticketPrice.toLocaleString("en-IN")} to enter the verified <strong className="text-zinc-950 font-bold">{carName}</strong> draw. Receive {ticketPrice.toLocaleString("en-IN")} permanent Buddh Circuit Drive Credits instantly.
            </p>

            {/* Interactive Allocation Terminal Card */}
            <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-orange-200/80 p-3.5 sm:p-4 shadow-[0_12px_36px_rgba(234,88,12,0.14)] relative">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-zinc-100 font-mono">
                <div className="flex items-center gap-1.5">
                  <Ticket size={14} weight="bold" className="text-zinc-950 shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-950">
                    SELECT ENTRY ALLOCATION
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">
                  ₹{ticketPrice.toLocaleString("en-IN")} = 1 Ticket + {ticketPrice.toLocaleString("en-IN")} cr
                </span>
              </div>

              {/* 5 Selector Buttons */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2.5">
                {ticketOptions.map((opt) => {
                  const isSelected = selectedTickets === opt.count
                  return (
                    <button
                      key={opt.count}
                      type="button"
                      onClick={() => setSelectedTickets(opt.count)}
                      className={`relative py-1.5 sm:py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-sm scale-[1.02]"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                      }`}
                    >
                      {opt.bonus && (
                        <span
                          className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-mono font-black uppercase px-1.5 py-0.2 rounded-full tracking-tight whitespace-nowrap shadow-2xs ${
                            isSelected
                              ? "bg-[#ea580c] text-white"
                              : "bg-orange-100 text-[#ea580c] border border-orange-200"
                          }`}
                        >
                          {opt.bonus}
                        </span>
                      )}
                      <span className="font-mono text-sm sm:text-base font-black leading-none">
                        {opt.label}
                      </span>
                      <span className={`text-[8px] sm:text-[9px] font-mono mt-0.5 ${isSelected ? "text-zinc-400" : "text-zinc-500"}`}>
                        {opt.count === 1 ? "ENTRY" : "ENTRIES"}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Live Telemetry Calculation Grid */}
              <div className="grid grid-cols-3 gap-2 py-1.5 px-3 rounded-xl bg-orange-50/60 border border-orange-200/70 font-mono text-xs mb-2.5">
                <div className="min-w-0">
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold tracking-wider truncate">
                    Capital Escrow
                  </span>
                  <span className="text-xs sm:text-sm font-black text-zinc-950 tracking-tight block truncate mt-0.5">
                    ₹{totalCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="min-w-0 border-x border-orange-200 px-2 text-center">
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold tracking-wider truncate">
                    Drive Credits
                  </span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600 tracking-tight block truncate mt-0.5">
                    +{totalCredits.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="min-w-0 text-right">
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold tracking-wider truncate">
                    Draw Entries
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#ea580c] tracking-tight block truncate mt-0.5">
                    {selectedTickets} {selectedTickets === 1 ? "Ticket" : "Tickets"}
                  </span>
                </div>
              </div>

              {/* Primary High-Velocity Action Button */}
              <button
                type="button"
                onClick={() => onBuyClick(selectedTickets)}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:shadow-[0_6px_22px_rgba(234,88,12,0.5)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mb-2.5"
              >
                <Ticket size={15} weight="fill" className="shrink-0" />
                <span className="truncate">
                  Get {selectedTickets} {selectedTickets === 1 ? "Ticket" : "Tickets"} · ₹{totalCost.toLocaleString("en-IN")}
                </span>
                <ArrowRight size={13} weight="bold" className="shrink-0" />
              </button>

              {/* Real-time Allocation Progress Bar */}
              <div className="pt-1.5 border-t border-zinc-100 font-mono text-xs">
                <div className="flex items-center justify-between gap-1 text-zinc-600 mb-1 text-[10px] sm:text-[11px]">
                  <span className="tracking-tight truncate">
                    Live Allocation: <strong className="text-zinc-950 font-bold">{ticketsSold.toLocaleString("en-IN")}</strong> / {totalCap.toLocaleString("en-IN")} Entries
                  </span>
                  <span className="text-[#ea580c] font-bold shrink-0">
                    {progressPercent}% Claimed
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-[#ea580c] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: High-Impact Automotive Stage Grounded on Radiant Orange */}
          <div className="lg:col-span-6 flex flex-col justify-center pt-2 lg:pt-0">
            
            {/* Top Telemetry Specs Strip */}
            <div className="w-full flex items-center justify-between font-mono pb-2 mb-2 border-b border-zinc-200/90">
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  Powertrain
                </span>
                <span className="text-xs sm:text-sm font-black text-zinc-950 tracking-tight leading-none truncate">
                  2.0L Turbo Flat-4
                </span>
              </div>

              <div className="flex flex-col items-center min-w-0 px-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  0-100 km/h
                </span>
                <span className="text-xs sm:text-sm font-black text-zinc-950 tracking-tight leading-none">
                  4.9s
                </span>
              </div>

              <div className="flex flex-col items-end min-w-0 text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#ea580c] font-bold block mb-0.5">
                  Market Value
                </span>
                <span className="text-xs sm:text-sm font-black text-[#ea580c] tracking-tight leading-none truncate">
                  {worthDisplay ? worthDisplay.replace(/^Worth\s+(over\s+)?/i, "").trim() : "₹1.6 Crore"}
                </span>
              </div>
            </div>

            {/* Vehicle Render Illuminated in Center Studio Halo */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col items-center justify-center my-1 sm:my-2 group"
            >
              <div className="relative w-full max-w-[560px] lg:max-w-none">
                <Image
                  src="/cars/car-718.png"
                  alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                  width={880}
                  height={350}
                  priority
                  className="relative z-10 w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-500 select-none drop-shadow-[0_20px_35px_rgba(234,88,12,0.25)]"
                />

                {/* Studio Ground Shadow anchored directly under tires */}
                <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-4 sm:h-6 bg-zinc-950/25 rounded-full blur-md sm:blur-xl transform scale-y-50 pointer-events-none" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-2 sm:h-4 bg-orange-600/35 rounded-full blur-xs sm:blur-md pointer-events-none" />
              </div>
            </motion.div>

            {/* Bottom Delivery & Cash Option Bar */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono pt-2.5 border-t border-zinc-200/90">
              <div className="flex items-center gap-2 text-zinc-950 font-bold">
                <div className="w-5 h-5 rounded-md bg-white border border-orange-200 shadow-2xs flex items-center justify-center shrink-0">
                  <Gauge size={13} weight="bold" className="text-[#ea580c]" />
                </div>
                <span className="text-[11px] sm:text-xs tracking-tight">Buddh Circuit Delivery</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 text-zinc-700 text-xs">
                <span className="text-zinc-500 text-[11px] font-medium">Or choose</span>
                <span className="inline-flex items-center font-black text-zinc-950 bg-white border border-zinc-200 shadow-2xs px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs tracking-tight">
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
