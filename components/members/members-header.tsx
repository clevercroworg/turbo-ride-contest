"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Gift, 
  Receipt, 
  UserRound, 
  HelpCircle, 
  Menu, 
  X, 
  LogOut,
  Gauge,
  Coins
} from "lucide-react"

interface MembersHeaderProps {
  userName?: string
  userEmail?: string
  userPhone?: string
  credits?: number
  onLogout?: () => void
}

const MENU_ITEMS = [
  { href: "/members", label: "Dashboard", icon: Gauge },
  { href: "/members/rewards", label: "Redeem Credits", icon: Gift },
  { href: "/members/profile", label: "Your Profile", icon: UserRound },
  { href: "/members/support", label: "Support Centre", icon: HelpCircle },
  { href: "/members/transactions", label: "Transactions", icon: Receipt },
]

export function MembersHeader({
  userName,
  userEmail,
  userPhone,
  credits = 0,
  onLogout,
}: MembersHeaderProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center group py-2 shrink-0">
          <span className="font-display text-lg sm:text-2xl font-black tracking-tight uppercase leading-none select-none">
            <span className="text-zinc-950">WINMY</span>
            <span className="text-[#ea580c]">PORSCHE</span>
          </span>
        </Link>

        {/* Right: Available Credit Pill + Hamburger MENU Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {credits !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs shadow-2xs whitespace-nowrap shrink-0">
              <Coins className="size-3.5 sm:size-4 text-[#c53030] shrink-0 animate-pulse" />
              <span className="hidden sm:inline text-zinc-500 text-xs font-medium">Available:</span>
              <span className="font-bold text-[#c53030] font-mono text-xs sm:text-sm">
                {credits.toLocaleString("en-IN")}
              </span>
              <span className="text-zinc-500 text-[11px] sm:text-xs font-normal">credits</span>
            </div>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center justify-center size-8 sm:size-10 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer shadow-xs"
            >
              {isOpen ? <X className="size-4 sm:size-5 text-zinc-900" /> : <Menu className="size-4 sm:size-5 text-zinc-900" />}
            </button>

          {/* Dropdown Menu Card */}
          {isOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 duration-100">
              {/* User Info Header inside Dropdown */}
              <div className="px-3 py-2.5 bg-zinc-50 rounded-xl border border-zinc-100 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-zinc-950 text-white font-mono text-xs font-bold flex items-center justify-center uppercase shrink-0">
                    {(userName || userEmail || "M")[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {userName || "Member"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Navigation Options */}
              <ul className="flex flex-col gap-0.5">
                {MENU_ITEMS.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-orange-50 text-[#ea580c] font-bold"
                            : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={`size-4 ${isActive ? "text-[#ea580c]" : "text-zinc-500"}`} />
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Logout Option */}
              {onLogout && (
                <div className="mt-1.5 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      onLogout()
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
  )
}
