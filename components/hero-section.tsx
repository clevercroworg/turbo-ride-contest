"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Ticket, ArrowRight, ShieldCheck, Gauge, Check } from "@phosphor-icons/react"

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
  const totalCredits = selectedTickets * 1000

  return (
    <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 overflow-hidden bg-[#fafafa] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Campaign Bar: Clean, Non-Repetitive */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 sm:mb-8 border-b border-zinc-200 font-mono text-xs text-zinc-600">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-zinc-950 font-bold uppercase text-[11px] sm:text-xs tracking-wider">
              TurboRide Supercar Club
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600 font-medium tracking-wide">
              {totalCap.toLocaleString("en-IN")} Total Entries
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck size={16} weight="fill" />
              <span>100% Money Back in Drive Credits</span>
            </span>
            <span className="text-zinc-300 hidden sm:inline">/</span>
            <span className="text-zinc-600 font-medium hidden sm:inline">Buddh Circuit Delivery</span>
          </div>
        </div>

        {/* Asymmetric Split Layout: Left Terminal + Right Automotive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Staggered Title + Interactive Allocation Terminal */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Staggered Title */}
            <div className="mb-4 sm:mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                  Official Grand Prize Draw
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl xl:text-[60px] font-black tracking-tight text-zinc-950 uppercase leading-[0.96]">
                ONE DEPOSIT.<br />
                <span className="text-zinc-400">WIN A SUPERCAR.</span><br />
                <span className="text-[#ea580c]">100% IN CREDITS.</span>
              </h1>
            </div>

            {/* Campaign Narrative */}
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed mb-6 max-w-xl">
              Deposit ₹{ticketPrice.toLocaleString("en-IN")} to receive <strong className="text-zinc-950 font-bold">{ticketPrice.toLocaleString("en-IN")} permanent TurboRide Drive Credits</strong> for track drives at Buddh International Circuit. Your entry into the verified <strong className="text-zinc-950 font-bold">{carName}</strong> draw is completely complimentary with zero capital risk.
            </p>

            {/* Interactive Allocation Terminal Card */}
            <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-xs relative">
              
              {/* Terminal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-3 mb-3 sm:mb-4 border-b border-zinc-100 font-mono">
                <div className="flex items-center gap-2">
                  <Ticket size={16} weight="bold" className="text-zinc-950 shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-950">
                    SELECT ENTRY ALLOCATION
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 font-medium">
                  ₹{ticketPrice.toLocaleString("en-IN")} = 1 Ticket + {ticketPrice.toLocaleString("en-IN")} Credits
                </span>
              </div>

              {/* Discrete Numerical Selector Buttons */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-2.5 mb-3.5 sm:mb-4">
                {ticketOptions.map((opt) => {
                  const isSelected = selectedTickets === opt.count
                  return (
                    <button
                      key={opt.count}
                      type="button"
                      onClick={() => setSelectedTickets(opt.count)}
                      className={`relative py-2.5 sm:py-3 px-0.5 sm:px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.02]"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                      }`}
                    >
                      {opt.bonus && (
                        <span
                          className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-mono font-black uppercase px-1 sm:px-1.5 py-0.2 rounded tracking-tight whitespace-nowrap ${
                            isSelected
                              ? "bg-[#ea580c] text-white"
                              : "bg-orange-100 text-[#ea580c] border border-orange-200"
                          }`}
                        >
                          {opt.bonus}
                        </span>
                      )}
                      <span className="font-mono text-sm sm:text-base lg:text-lg font-black leading-none">
                        {opt.label}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] font-mono mt-1 ${isSelected ? "text-zinc-400" : "text-zinc-500"}`}>
                        {opt.count === 1 ? "ENTRY" : "ENTRIES"}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Live Telemetry Calculation Grid */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2.5 sm:px-3.5 rounded-lg bg-zinc-50 border border-zinc-200 font-mono text-xs mb-3.5 sm:mb-4">
                <div className="min-w-0">
                  <span className="text-zinc-400 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">
                    Capital Escrow
                  </span>
                  <span className="text-sm sm:text-base lg:text-lg font-black text-zinc-950 tracking-tight block truncate mt-0.5">
                    ₹{totalCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="min-w-0 border-x border-zinc-200/60 px-1 sm:px-2 text-center">
                  <span className="text-zinc-400 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">
                    Drive Credits
                  </span>
                  <span className="text-sm sm:text-base lg:text-lg font-black text-emerald-600 tracking-tight block truncate mt-0.5">
                    +{totalCredits.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="min-w-0 text-right">
                  <span className="text-zinc-400 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">
                    Draw Entries
                  </span>
                  <span className="text-sm sm:text-base lg:text-lg font-black text-[#ea580c] tracking-tight block truncate mt-0.5">
                    {selectedTickets} {selectedTickets === 1 ? "Ticket" : "Tickets"}
                  </span>
                </div>
              </div>

              {/* Primary High-Velocity Action Button */}
              <button
                type="button"
                onClick={() => onBuyClick(selectedTickets)}
                className="w-full py-3.5 sm:py-4 px-3 sm:px-6 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_8px_25px_rgba(234,88,12,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mb-3.5"
              >
                <Ticket size={18} weight="fill" className="shrink-0" />
                <span className="truncate">
                  Get {selectedTickets} {selectedTickets === 1 ? "Ticket" : "Tickets"} · ₹{totalCost.toLocaleString("en-IN")}
                </span>
                <ArrowRight size={16} weight="bold" className="shrink-0" />
              </button>

              {/* Real-time Allocation Progress Bar */}
              <div className="pt-3 border-t border-zinc-100 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-zinc-500 mb-2 text-[10px] sm:text-[11px]">
                  <span className="tracking-tight truncate">
                    Live Allocation: <strong className="text-zinc-950 font-bold">{ticketsSold.toLocaleString("en-IN")}</strong> / {totalCap.toLocaleString("en-IN")} Tickets
                  </span>
                  <span className="text-[#ea580c] font-bold self-start sm:self-auto shrink-0">
                    {progressPercent}% Claimed
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-[#ea580c] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: High-Impact Automotive Campaign Stage (Open, Unboxed) */}
          <div className="lg:col-span-6 flex flex-col justify-between pt-6 lg:pt-0">
            
            {/* Top Telemetry Specs Strip: Clean Editorial Bar */}
            <div className="w-full flex items-center justify-between font-mono pb-3 mb-2 sm:mb-4 border-b border-zinc-200">
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
                  Powertrain
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-black text-zinc-950 tracking-tight leading-none truncate">
                  2.0L Turbo Flat-4
                </span>
              </div>

              <div className="flex flex-col items-center min-w-0 px-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
                  0-100 km/h
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-black text-zinc-950 tracking-tight leading-none">
                  4.9s
                </span>
              </div>

              <div className="flex flex-col items-end min-w-0 text-right">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#ea580c] font-bold block mb-1">
                  Market Value
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-black text-[#ea580c] tracking-tight leading-none truncate">
                  {worthDisplay ? worthDisplay.replace(/^Worth\s+(over\s+)?/i, "").trim() : "₹1.6 Crore"}
                </span>
              </div>
            </div>

            {/* Vehicle Render with Precision Grounding Shadow - Natural, Open Stage */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col items-center justify-center my-4 sm:my-8 group"
            >
              <div className="relative w-full max-w-[640px] lg:max-w-none">
                <Image
                  src="/cars/car-718.png"
                  alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                  width={920}
                  height={380}
                  priority
                  className="relative z-10 w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700 select-none"
                />

                {/* Studio Ground Shadows anchored directly under the tires */}
                <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-4 sm:h-8 bg-zinc-950/20 rounded-full blur-md sm:blur-2xl transform scale-y-50 pointer-events-none" />
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-3 sm:h-6 bg-amber-500/15 rounded-full blur-sm sm:blur-xl pointer-events-none" />
              </div>
            </motion.div>

            {/* Bottom Quick Feature Highlights with Crisp Divider */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 text-xs font-mono pt-4 border-t border-zinc-200">
              <div className="flex items-center gap-2 text-zinc-950 font-bold">
                <div className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                  <Gauge size={14} weight="bold" className="text-[#ea580c]" />
                </div>
                <span className="text-xs tracking-tight">Buddh Track Delivery</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 text-zinc-600 text-xs">
                <span className="text-zinc-500 font-medium">Or choose</span>
                <span className="inline-flex items-center font-black text-zinc-950 bg-white border border-zinc-200 shadow-2xs px-2.5 py-1 rounded-md text-xs tracking-tight">
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
