"use client"

import Link from "next/link"
import Image from "next/image"
import { Coins } from "@phosphor-icons/react"
import { MembersHeader } from "@/components/members/members-header"
import { logoutMember } from "@/lib/auth"
import type { MemberSession, RewardItem } from "@/lib/types"

interface RewardsClientProps {
  session: MemberSession
  credits: number
  catalog: RewardItem[]
}

const BOOKING_APP_URL = process.env.NEXT_PUBLIC_BOOKING_APP_URL || "https://book.turboridesupercars.com"

export function RewardsClient({ session, credits, catalog }: RewardsClientProps) {
  const getBookingLink = (carTitle?: string) => {
    const base = `${BOOKING_APP_URL}/experience`
    const params = new URLSearchParams()
    if (session.email) params.set("email", session.email)
    if (session.phone) params.set("phone", session.phone)
    if (carTitle) params.set("car", carTitle)
    return `${base}?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans flex flex-col justify-between">
      {/* Universal Members Header */}
      <MembersHeader
        userName={session.name}
        userEmail={session.email}
        userPhone={session.phone}
        credits={credits}
        onLogout={logoutMember}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 pb-16 sm:pb-20 space-y-5 sm:space-y-6">
        {/* Intro Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-2">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#c53030] mb-0.5 sm:mb-1">
              POWERED BY TURBORIDE
            </p>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight uppercase">
              REDEEM CREDITS
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5 sm:mt-1 leading-relaxed">
              Spend your drive credits on supercar laps, photoshoots and reels.
            </p>
          </div>

          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors shadow-xs"
          >
            <span>←</span>
            <span>Back to garage</span>
          </Link>
        </div>

        {/* Supercar Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {catalog.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-zinc-200 p-3.5 sm:p-5 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all group"
            >
              <div>
                {/* Card Image with Floating Category Pill Badge */}
                <div className="relative w-full aspect-[1264/848] rounded-xl overflow-hidden bg-zinc-950 mb-3 sm:mb-3.5">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                  />
                  <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-medium tracking-tight shadow-xs select-none">
                    {item.category}
                  </div>
                </div>

                {/* Title & Specs */}
                <h2 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight">
                  {item.title}
                </h2>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">
                  {item.specs}
                </p>

                {/* Pricing / Parity */}
                <div className="mt-3 flex items-center gap-1.5">
                  <Coins size={16} weight="duotone" className="text-[#c53030] shrink-0" />
                  <span className="text-base font-black text-[#c53030] tabular-nums tracking-tight">
                    {item.creditsRequired.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">credits</span>
                </div>
              </div>

              {/* Simple Clean Redeem Button */}
              <div className="mt-4">
                <a
                  href={getBookingLink(item.title)}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-[#c53030] hover:bg-[#a82525] active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer flex items-center justify-center"
                >
                  Redeem
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
