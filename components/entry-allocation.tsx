"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Ticket, ArrowRight, ArrowDown, ArrowUp, ShieldCheck, CheckCircle } from "@phosphor-icons/react"

interface EntryAllocationProps {
  onBuyClick: (ticketCount: number) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  totalTicketsSold?: number
  soldTickets?: number
  targetTickets?: number
  ticketPrice?: number
  carName?: string
}

export function EntryAllocation({
  onBuyClick,
  isExpanded = false,
  onToggleExpand,
  totalTicketsSold,
  soldTickets,
  targetTickets = 10000,
  ticketPrice = 1000,
  carName = "Porsche 718 Cayman",
}: EntryAllocationProps) {
  const reduceMotion = useReducedMotion()
  const [selectedTickets, setSelectedTickets] = useState(10)

  const ticketsSold = totalTicketsSold ?? soldTickets ?? 6413
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

  const renderCalculatorCard = () => (
    <div className="max-w-xl md:max-w-2xl lg:max-w-xl mx-auto">
      <div className="rounded-none bg-white border border-zinc-200 p-3.5 xs:p-4 sm:p-7 shadow-[0_16px_48px_rgba(234,88,12,0.10)] relative">
        
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-3.5 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Ticket size={18} weight="bold" className="text-zinc-950 shrink-0" />
            <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-zinc-950">
              CHOOSE YOUR TICKETS
            </span>
          </div>
          <span className="text-xs sm:text-[13px] text-zinc-950 font-bold">
            1 Ticket = ₹{ticketPrice.toLocaleString("en-IN")} (100% Back)
          </span>
        </div>

        {/* 5 Selector Buttons - Sharp Edged */}
        <div className="grid grid-cols-5 gap-1 xs:gap-1.5 sm:gap-2.5 mb-4">
          {ticketOptions.map((opt) => {
            const isSelected = selectedTickets === opt.count
            return (
              <button
                key={opt.count}
                type="button"
                onClick={() => setSelectedTickets(opt.count)}
                className={`relative py-2 xs:py-2.5 sm:py-3 px-0.5 xs:px-1 rounded-none flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.02]"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                }`}
              >
                {opt.bonus && (
                  <span
                    className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold uppercase px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-none tracking-tight whitespace-nowrap shadow-xs ${
                      isSelected
                        ? "bg-[#ea580c] text-white"
                        : "bg-orange-100 text-[#ea580c] border border-orange-200"
                    }`}
                  >
                    {opt.bonus}
                  </span>
                )}
                <span className="text-sm xs:text-base sm:text-xl font-black leading-none tabular-nums">
                  {opt.label}
                </span>
                <span className={`text-[9px] xs:text-[10px] sm:text-xs font-bold mt-1 ${isSelected ? "text-zinc-200" : "text-zinc-950"}`}>
                  {opt.count === 1 ? "Ticket" : "Tickets"}
                </span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Live Telemetry Calculation Grid - Sharp Edges */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 py-3 px-2 sm:px-4 rounded-none bg-orange-50/80 border border-orange-200/90 mb-4 text-center">
          <div className="min-w-0 flex flex-col items-center justify-center">
            <span className="text-zinc-950 block text-[11px] sm:text-xs uppercase font-black tracking-tight leading-tight mb-0.5">
              Deposit
            </span>
            <span className="text-base sm:text-xl font-black text-zinc-950 tracking-tight block tabular-nums">
              ₹{totalCost.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-zinc-950 font-bold block">100% Escrow</span>
          </div>
          <div className="min-w-0 border-x border-orange-200 px-1 sm:px-3 flex flex-col items-center justify-center">
            <span className="text-zinc-950 block text-[11px] sm:text-xs uppercase font-black tracking-tight leading-tight mb-0.5">
              Drive Credits
            </span>
            <span className="text-base sm:text-xl font-black text-emerald-600 tracking-tight block tabular-nums">
              +{totalCredits.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block">Never Expire</span>
          </div>
          <div className="min-w-0 flex flex-col items-center justify-center">
            <span className="text-zinc-950 block text-[11px] sm:text-xs uppercase font-black tracking-tight leading-tight mb-0.5">
              Draw Entries
            </span>
            <span className="text-base sm:text-xl font-black text-[#ea580c] tracking-tight block tabular-nums">
              {selectedTickets} {selectedTickets === 1 ? "Entry" : "Entries"}
            </span>
            <span className="text-[10px] text-orange-600 font-bold block">Grand Draw</span>
          </div>
        </div>

        {/* Primary Action Button - Sharp */}
        <button
          type="button"
          onClick={() => onBuyClick(selectedTickets)}
          className="w-full py-3.5 sm:py-4 px-5 rounded-none bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm sm:text-base font-bold uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(234,88,12,0.35)] hover:shadow-[0_8px_28px_rgba(234,88,12,0.5)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer mb-4"
        >
          <Ticket size={18} weight="fill" className="shrink-0" />
          <span>
            Get {selectedTickets} {selectedTickets === 1 ? "Ticket" : "Tickets"} · ₹{totalCost.toLocaleString("en-IN")}
          </span>
          <ArrowRight size={16} weight="bold" className="shrink-0" />
        </button>

        {/* Real-time Allocation Progress Bar - Sharp */}
        <div className="pt-3 border-t border-zinc-100 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-1 text-zinc-950 mb-2">
            <span className="tracking-tight font-medium">
              Live Allocation: <strong className="text-zinc-950 font-bold">{ticketsSold.toLocaleString("en-IN")}</strong> / {totalCap.toLocaleString("en-IN")} Entries
            </span>
            <span className="text-[#ea580c] font-black shrink-0">
              {progressPercent}% Claimed
            </span>
          </div>
          <div className="w-full h-2.5 bg-zinc-200 rounded-none overflow-hidden flex">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-[#ea580c] transition-all duration-500 rounded-none"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Trust Micro-Badges */}
        <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-zinc-950 font-bold">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={15} weight="fill" className="text-emerald-600 shrink-0" />
            <span>100% Capital Returned</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <CheckCircle size={15} weight="fill" className="text-orange-500 shrink-0" />
            <span>Permanent Wallet Credits</span>
          </div>
        </div>

        {/* Web-Only Collapse Button Inside Card */}
        {onToggleExpand && (
          <div className="hidden lg:flex justify-center mt-3 pt-2.5 border-t border-zinc-100">
            <button
              type="button"
              onClick={onToggleExpand}
              className="text-[11px] font-black text-zinc-500 hover:text-zinc-950 flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Collapse Terminal</span>
              <ArrowUp size={12} weight="bold" />
            </button>
          </div>
        )}

      </div>
    </div>
  )

  return (
    <section id="entry-allocation" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-zinc-200 relative overflow-hidden">
      {/* Background Accent Subtle Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background: "radial-gradient(circle, rgba(234,88,12,0.12) 0%, rgba(249,115,22,0.05) 50%, transparent 70%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creative Automotive Telemetry Deco & Single Line Heading */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
            <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              01 · ENTRY ALLOCATION
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
            </span>
            <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none">
            SELECT ENTRY ALLOCATION
          </h2>

          {/* Web Version Expand / Collapse Interactive Toggle */}
          <div className="hidden lg:flex items-center justify-center mt-4">
            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 hover:border-[#ea580c] text-xs font-black text-zinc-950 uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            >
              <Ticket size={15} weight="fill" className="text-[#ea580c]" />
              <span>{isExpanded ? "Collapse Calculator / Table" : "Expand Calculator / Table"}</span>
              {isExpanded ? (
                <ArrowUp size={14} weight="bold" />
              ) : (
                <ArrowDown size={14} weight="bold" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile View: Always fully visible and accessible */}
        <div className="lg:hidden">
          {renderCalculatorCard()}
        </div>

        {/* Web View: Smoothly expands with Framer Motion when clicked */}
        <div className="hidden lg:block">
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="web-allocation-calculator"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, scale: 0.98 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto", scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                {renderCalculatorCard()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
