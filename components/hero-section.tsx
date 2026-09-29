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
    <section className="relative pt-20 sm:pt-22 lg:pt-24 pb-8 sm:pb-12 overflow-hidden lg:min-h-[calc(100vh-5rem)] lg:flex lg:flex-col lg:justify-center border-b border-zinc-200">
      
      {/* Automotive Studio Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 110% 70% at 50% 82%, rgba(234, 88, 12, 0.65) 0%, rgba(249, 115, 22, 0.4) 40%, rgba(254, 215, 170, 0.15) 70%, transparent 100%),
            radial-gradient(ellipse 75% 50% at 80% 80%, rgba(249, 115, 22, 0.45) 0%, transparent 60%),
            radial-gradient(ellipse 75% 50% at 20% 80%, rgba(234, 88, 12, 0.35) 0%, transparent 60%),
            linear-gradient(180deg, #ffffff 0%, #ffffff 28%, #fff7ed 48%, #fed7aa 68%, #f97316 84%, #ea580c 94%, #ffffff 100%)
          `,
        }}
      />

      {/* Subtle Paddock Alignment Dots */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(234, 88, 12, 0.35) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Campaign Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 sm:mb-5 border-b border-zinc-200/80 text-xs text-zinc-700">
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="text-zinc-950 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
              TurboRide Supercar Club
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600 font-medium">
              Draw Cap: {totalCap.toLocaleString("en-IN")} Verified Entries
            </span>
          </div>

          <div className="flex items-center gap-2.5 uppercase tracking-wide text-xs w-full sm:w-auto">
            <span className="flex items-center gap-1.5 text-emerald-800 font-bold bg-white/95 px-3 py-1 rounded-full border border-emerald-300 shadow-2xs text-[11px] sm:text-xs">
              <ShieldCheck size={14} weight="fill" className="text-emerald-600 shrink-0" />
              <span>100% Capital Returned in Drive Credits</span>
            </span>
            <span className="text-zinc-300 hidden md:inline">/</span>
            <span className="text-zinc-600 font-medium hidden md:inline">Buddh Circuit Delivery</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          
          {/* Left Column: Bold Headline & Interactive Allocation */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Header Area */}
            <div className="mb-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#ea580c] uppercase tracking-wide border border-orange-200 shadow-2xs mb-2.5">
                Official Grand Prize Draw #01
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black tracking-tight uppercase leading-[1.05] text-zinc-950">
                ONE DEPOSIT. WIN A SUPERCAR.<br />
                <span className="text-[#ea580c]">100% IN DRIVE CREDITS.</span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-sm sm:text-[15px] text-zinc-700 font-medium leading-relaxed mb-4 max-w-lg">
              Deposit ₹{ticketPrice.toLocaleString("en-IN")} to enter the verified <strong className="text-zinc-950 font-bold">{carName}</strong> draw. Receive {ticketPrice.toLocaleString("en-IN")} permanent Buddh Circuit Drive Credits instantly.
            </p>

            {/* Interactive Allocation Terminal Card */}
            <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-orange-200/80 p-4 sm:p-5 shadow-[0_12px_36px_rgba(234,88,12,0.12)] relative">
              
              {/* Terminal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 mb-3 border-b border-zinc-100">
                <div className="flex items-center gap-1.5">
                  <Ticket size={16} weight="bold" className="text-zinc-950 shrink-0" />
                  <span className="text-xs uppercase tracking-wide font-bold text-zinc-950">
                    SELECT ENTRY ALLOCATION
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-zinc-500 font-semibold">
                  1 Ticket = ₹{ticketPrice.toLocaleString("en-IN")} (100% Credits Back)
                </span>
              </div>

              {/* 5 Selector Buttons */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3">
                {ticketOptions.map((opt) => {
                  const isSelected = selectedTickets === opt.count
                  return (
                    <button
                      key={opt.count}
                      type="button"
                      onClick={() => setSelectedTickets(opt.count)}
                      className={`relative py-2 sm:py-2.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-sm scale-[1.02]"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                      }`}
                    >
                      {opt.bonus && (
                        <span
                          className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full tracking-tight whitespace-nowrap shadow-2xs ${
                            isSelected
                              ? "bg-[#ea580c] text-white"
                              : "bg-orange-100 text-[#ea580c] border border-orange-200"
                          }`}
                        >
                          {opt.bonus}
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-black leading-none tabular-nums">
                        {opt.label}
                      </span>
                      <span className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>
                        {opt.count === 1 ? "Ticket" : "Tickets"}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Live Telemetry Calculation Grid */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80 mb-3">
                <div className="min-w-0">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider truncate">
                    Capital Escrow
                  </span>
                  <span className="text-sm sm:text-base font-black text-zinc-950 tracking-tight block truncate mt-0.5 tabular-nums">
                    ₹{totalCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="min-w-0 border-x border-orange-200 px-2 text-center">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider truncate">
                    Drive Credits
                  </span>
                  <span className="text-sm sm:text-base font-black text-emerald-600 tracking-tight block truncate mt-0.5 tabular-nums">
                    +{totalCredits.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="min-w-0 text-right">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider truncate">
                    Draw Entries
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#ea580c] tracking-tight block truncate mt-0.5 tabular-nums">
                    {selectedTickets} {selectedTickets === 1 ? "Entry" : "Entries"}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => onBuyClick(selectedTickets)}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:shadow-[0_6px_22px_rgba(234,88,12,0.5)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mb-3"
              >
                <Ticket size={16} weight="fill" className="shrink-0" />
                <span className="truncate">
                  Get {selectedTickets} {selectedTickets === 1 ? "Ticket" : "Tickets"} · ₹{totalCost.toLocaleString("en-IN")}
                </span>
                <ArrowRight size={14} weight="bold" className="shrink-0" />
              </button>

              {/* Real-time Allocation Progress Bar */}
              <div className="pt-2 border-t border-zinc-100 text-xs">
                <div className="flex items-center justify-between gap-1 text-zinc-600 mb-1.5 text-xs">
                  <span className="tracking-tight truncate font-medium">
                    Live Allocation: <strong className="text-zinc-950 font-bold">{ticketsSold.toLocaleString("en-IN")}</strong> / {totalCap.toLocaleString("en-IN")} Entries
                  </span>
                  <span className="text-[#ea580c] font-bold shrink-0">
                    {progressPercent}% Claimed
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-[#ea580c] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Vehicle Display Stage */}
          <div className="lg:col-span-6 flex flex-col justify-center pt-2 lg:pt-0">
            
            {/* Top Specs Strip - High Contrast Box */}
            <div className="w-full grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/90 shadow-2xs mb-2">
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  Powertrain
                </span>
                <span className="text-xs sm:text-sm font-black text-zinc-950 tracking-tight leading-none truncate">
                  2.0L Turbo Flat-4
                </span>
              </div>

              <div className="flex flex-col items-center min-w-0 px-2 border-x border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  0-100 km/h
                </span>
                <span className="text-xs sm:text-sm font-black text-zinc-950 tracking-tight leading-none">
                  4.9s
                </span>
              </div>

              <div className="flex flex-col items-end min-w-0 text-right">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
                  Market Value
                </span>
                <span className="text-xs sm:text-sm font-black text-[#ea580c] tracking-tight leading-none truncate">
                  {worthDisplay ? worthDisplay.replace(/^Worth\s+(over\s+)?/i, "").trim() : "₹1.6 Crore"}
                </span>
              </div>
            </div>

            {/* Vehicle Render */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 group"
            >
              <div className="relative w-full max-w-[560px] lg:max-w-none">
                <Image
                  src="/cars/car-718.png"
                  alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                  width={880}
                  height={350}
                  priority
                  className="relative z-10 w-full h-auto object-contain group-hover:scale-[1.015] transition-transform duration-500 select-none drop-shadow-[0_20px_35px_rgba(234,88,12,0.22)]"
                />

                {/* Studio Ground Shadow */}
                <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-4 sm:h-6 bg-zinc-950/25 rounded-full blur-md sm:blur-xl transform scale-y-50 pointer-events-none" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-2 sm:h-4 bg-orange-600/35 rounded-full blur-xs sm:blur-md pointer-events-none" />
              </div>
            </motion.div>

            {/* Bottom Delivery & Cash Option Bar - Clean High Contrast */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/90 shadow-2xs text-xs">
              <div className="flex items-center gap-2 text-zinc-950 font-bold">
                <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <Gauge size={14} weight="bold" className="text-[#ea580c]" />
                </div>
                <span className="text-xs font-bold tracking-tight">Buddh Circuit Delivery Included</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 text-zinc-700">
                <span className="text-zinc-500 text-xs font-medium">Or choose</span>
                <span className="inline-flex items-center font-black text-zinc-950 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-lg text-xs tracking-tight">
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
