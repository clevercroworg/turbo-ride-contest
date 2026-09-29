"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "motion/react"
import { Ticket, ArrowRight, Gauge } from "@phosphor-icons/react"

interface NavProps {
  onBuyTicketsClick?: () => void
  userCredits?: number
  memberEmail?: string
}

export function Nav({ onBuyTicketsClick, userCredits = 0, memberEmail }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrolled = latest > 20
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled)
    }
  })

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Prizes", href: "#the-car" },
    { label: "The Fleet", href: "#the-fleet" },
    { label: "Refer & Earn", href: "#referrals" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${
          scrolled || mobileMenuOpen
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs"
            : "bg-transparent border-none"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-2">
          
          {/* Brand Logo - Adaptive Contrast */}
          <Link href="/" className="flex items-center group py-2 shrink-0">
            <span className="font-display text-base xs:text-lg sm:text-xl md:text-2xl font-black tracking-tight uppercase whitespace-nowrap transition-colors duration-300">
              <span className={scrolled || mobileMenuOpen ? "text-zinc-950" : "text-white"}>WINMY</span>
              <span className={scrolled || mobileMenuOpen ? "text-[#ea580c]" : "text-zinc-950"}>PORSCHE</span>
            </span>
          </Link>

          {/* Clean, Spacious Navigation Links - Adaptive Contrast */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm py-1 transition-colors duration-300 ${
                  scrolled || mobileMenuOpen
                    ? "font-medium text-zinc-700 hover:text-zinc-950"
                    : "font-semibold text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            {memberEmail ? (
              <Link
                href="/members"
                className={`hidden sm:inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-none text-xs font-semibold transition-all duration-300 ${
                  scrolled || mobileMenuOpen
                    ? "bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900"
                    : "bg-zinc-950/70 hover:bg-zinc-950 border border-white/20 text-white"
                }`}
              >
                <Gauge size={15} weight="bold" className={scrolled || mobileMenuOpen ? "text-[#ea580c]" : "text-orange-400"} />
                <span className="truncate">My Garage ({userCredits.toLocaleString("en-IN")})</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 transition-colors duration-300 ${
                  scrolled || mobileMenuOpen
                    ? "text-zinc-700 hover:text-zinc-950"
                    : "text-white/90 hover:text-white"
                }`}
              >
                Member Login
              </Link>
            )}

            {/* Primary Action Button - Adaptive Style */}
            <button
              type="button"
              onClick={onBuyTicketsClick}
              className={`inline-flex items-center gap-1.5 px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2 rounded-none text-[11px] xs:text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 cursor-pointer shrink-0 ${
                scrolled || mobileMenuOpen
                  ? "bg-[#ea580c] hover:bg-[#c2410c] text-white"
                  : "bg-zinc-950 hover:bg-black text-white border border-zinc-900"
              }`}
            >
              <Ticket size={15} weight="fill" className="shrink-0" />
              <span className="whitespace-nowrap">Get Tickets</span>
            </button>

            {/* Creative Automotive Aero-Slats Menu Trigger with Smooth Kinetic Animation */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-none flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 border active:scale-90 select-none shadow-xs ${
                scrolled || mobileMenuOpen
                  ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-950"
                  : "bg-zinc-950/30 hover:bg-zinc-950/50 border-white/35 hover:border-white text-white backdrop-blur-xs"
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-[18px] h-[14px] relative flex flex-col justify-between items-center pointer-events-none">
                {/* Top Blade */}
                <span
                  className={`w-full h-[2px] rounded-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                    scrolled || mobileMenuOpen ? "bg-zinc-950" : "bg-white"
                  } ${mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
                />
                
                {/* Middle Blade with Supercar Orange Accent */}
                <span
                  className={`h-[2px] rounded-none transition-all duration-200 ease-in-out origin-left self-start ${
                    mobileMenuOpen
                      ? "w-0 opacity-0"
                      : "w-3 bg-[#ea580c] opacity-100"
                  }`}
                />
                
                {/* Bottom Blade */}
                <span
                  className={`w-full h-[2px] rounded-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                    scrolled || mobileMenuOpen ? "bg-zinc-950" : "bg-white"
                  } ${mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Supercar Cockpit Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-20 bottom-0 z-40 bg-white border-b border-zinc-200 flex flex-col justify-between p-5 xs:p-6 overflow-y-auto lg:hidden"
          >
            {/* Top Telemetry Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-[11px] font-mono font-black text-zinc-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-zinc-950">
                  <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
                  NAVIGATION TELEMETRY
                </span>
                <span className="text-[#ea580c] font-black">DRAW #01 · ZERO LOSS</span>
              </div>

              {/* Numbered Automotive Nav Links */}
              <div className="flex flex-col">
                {[
                  { index: "01", label: "HOW IT WORKS", subtitle: "1:1 Capital Returned in Buddh Circuit Credits", href: "#how-it-works" },
                  { index: "02", label: "THE CAR & SPECS", subtitle: "Porsche 718 Cayman · 300 BHP · ₹75L Option", href: "#the-car" },
                  { index: "03", label: "THE FLEET", subtitle: "Lamborghini, Ferrari & McLaren Drives", href: "#the-fleet" },
                  { index: "04", label: "REFER & EARN", subtitle: "25% Drive Credits & Cash Commission", href: "#referrals" },
                  { index: "05", label: "RULES & FAQ", subtitle: "Section 194B TDS & Seed Audit Protocol", href: "#faq" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-2 rounded-none hover:bg-orange-50/60 border-b border-zinc-100 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="text-xs font-mono font-black text-[#ea580c] shrink-0">
                        {link.index}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-base font-black text-zinc-950 uppercase tracking-tight group-hover:text-[#ea580c] transition-colors">
                          {link.label}
                        </span>
                        <span className="text-[11px] font-medium text-zinc-500 truncate">
                          {link.subtitle}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} weight="bold" className="text-zinc-400 group-hover:text-[#ea580c] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom Action Station */}
            <div className="pt-5 border-t border-zinc-200 flex flex-col gap-3 mt-4">
              {memberEmail ? (
                <Link
                  href="/members"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-none bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-950 text-xs font-black uppercase tracking-wider flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Gauge size={16} weight="bold" className="text-[#ea580c]" />
                    My Member Garage
                  </span>
                  <span className="text-[#ea580c] font-black">{userCredits.toLocaleString("en-IN")} Credits</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 px-4 rounded-none bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-950 text-xs font-black uppercase tracking-wider text-center transition-colors"
                >
                  Member Garage Login
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  if (onBuyTicketsClick) onBuyTicketsClick()
                }}
                className="w-full py-3.5 rounded-none bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Ticket size={18} weight="fill" />
                <span>Get Tickets · ₹1,000 (100% Back)</span>
              </button>

              {/* Legal Links Footer in Drawer */}
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="hover:text-zinc-950">Terms</Link>
                <span>·</span>
                <Link href="/draw-regulations" onClick={() => setMobileMenuOpen(false)} className="hover:text-zinc-950">Regulations</Link>
                <span>·</span>
                <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="hover:text-zinc-950">Privacy</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
