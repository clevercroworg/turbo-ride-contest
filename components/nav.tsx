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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 h-20 flex items-center ${
          scrolled || mobileMenuOpen
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs"
            : "bg-white/80 backdrop-blur-xs border-b border-zinc-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group py-2 shrink-0">
            <span className="font-display text-2xl font-black tracking-tight text-zinc-950 uppercase">
              WINMY<span className="text-[#ea580c]">PORSCHE</span>
            </span>
          </Link>

          {/* Clean, Spacious Navigation Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-4">
            {memberEmail ? (
              <Link
                href="/members"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
              >
                <Gauge size={16} weight="bold" className="text-[#ea580c]" />
                <span>My Garage ({userCredits.toLocaleString("en-IN")} Credits)</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-950 px-3 py-2 transition-colors"
              >
                Member Login
              </Link>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onBuyTicketsClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold uppercase tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <Ticket size={16} weight="fill" />
              <span>Get Tickets</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
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
