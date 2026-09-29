"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "motion/react"
import { Ticket, User, List, X, ShieldCheck, ArrowRight, Gauge } from "@phosphor-icons/react"

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

            {/* Mobile Menu Button - Adaptive Contrast */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-none flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0 ${
                scrolled || mobileMenuOpen
                  ? "text-zinc-900 hover:bg-zinc-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-20 bottom-0 z-40 bg-white border-b border-zinc-200 flex flex-col justify-between p-6 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-2 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-lg font-bold text-zinc-900 border-b border-zinc-100 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} className="text-zinc-400" />
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-zinc-200 flex flex-col gap-3">
              {memberEmail ? (
                <Link
                  href="/members"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-semibold flex items-center justify-between"
                >
                  <span>My Member Garage</span>
                  <span className="text-[#ea580c] font-bold">{userCredits.toLocaleString("en-IN")} Credits</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-semibold text-center"
                >
                  Member Login
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  if (onBuyTicketsClick) onBuyTicketsClick()
                }}
                className="w-full py-3.5 rounded-lg bg-[#ea580c] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Ticket size={18} weight="fill" />
                <span>Get Tickets (₹1,000)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
