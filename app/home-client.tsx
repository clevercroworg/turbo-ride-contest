"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/hero-section"
import { TireTrackDivider } from "@/components/tire-track-divider"
import { EntryAllocation } from "@/components/entry-allocation"
import { HowItWorks } from "@/components/how-it-works"
import { ValueMatrix } from "@/components/value-matrix"
import { FleetShowcase } from "@/components/fleet-showcase"
import { PrizePool } from "@/components/prize-pool"
import { ReferralEngine } from "@/components/referral-engine"
import { FaqAccordion } from "@/components/faq-accordion"
import { Footer } from "@/components/footer"
import { TicketCheckoutModal } from "@/components/ticket-checkout-modal"
import type { Contest } from "@/lib/types"

interface HomeClientProps {
  contest: Contest
  memberEmail?: string
  userCredits?: number
}

export function HomeClient({ contest, memberEmail, userCredits = 0 }: HomeClientProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTicketCount, setSelectedTicketCount] = useState(10)

  const handleOpenBuy = (count: number = 10) => {
    setSelectedTicketCount(count)
    setModalOpen(true)
  }

  const handleHeroAllocationClick = () => {
    document.getElementById("entry-allocation")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fafafa] text-[#09090b]">
      {/* 1. Sleek Nav */}
      <Nav
        onBuyTicketsClick={() => handleOpenBuy(10)}
        userCredits={userCredits}
        memberEmail={memberEmail}
      />

      <main className="flex-1">
        {/* 2. Hero Section: Architectural Center-Stage Showcase */}
        <HeroSection
          onBuyClick={(count) => handleOpenBuy(count || 10)}
          onAllocationClick={handleHeroAllocationClick}
          soldTickets={contest.soldTickets}
          targetTickets={contest.targetTickets}
          ticketPrice={contest.ticketPrice}
          carName={contest.carName}
          worthDisplay={contest.worthDisplay}
        />

        {/* 2.5. Dedicated Entry Allocation Terminal (Always Open on Mobile & Web) */}
        <EntryAllocation
          onBuyClick={(count) => handleOpenBuy(count || 10)}
          soldTickets={contest.soldTickets}
          targetTickets={contest.targetTickets}
          ticketPrice={contest.ticketPrice}
          carName={contest.carName}
        />

        {/* 2.2. Supercar Launch Skid Mark & Dust Path Divider */}
        <TireTrackDivider />

        {/* 3. The Protocol: 4-Step Telemetry Track */}
        <HowItWorks
          ticketPrice={contest.ticketPrice}
          targetTickets={contest.targetTickets}
          carName={contest.carName}
        />

        {/* 4. The Principle: Zero Loss Guarantee Bento */}
        <ValueMatrix
          ticketPrice={contest.ticketPrice}
          carName={contest.carName}
        />

        {/* 4. The Fleet: Interactive Supercar Stage */}
        <FleetShowcase />

        {/* 5. Prize Pool: 3-Tier Architectural Spec */}
        <PrizePool
          carName={contest.carName}
          worthDisplay={contest.worthDisplay}
        />

        {/* 6. Referral Engine: 2-Tier Program */}
        <ReferralEngine
          ticketPrice={contest.ticketPrice}
        />

        {/* 7. Clear FAQ */}
        <FaqAccordion />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* 9. Ticket Checkout Modal */}
      <TicketCheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCount={selectedTicketCount}
        contestId={contest.id}
        ticketPrice={contest.ticketPrice}
        carName={contest.carName}
        defaultEmail={memberEmail}
      />
    </div>
  )
}
