"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CaretDown } from "@phosphor-icons/react"

interface FaqAccordionProps {
  ticketPrice?: number
  targetTickets?: number
  carName?: string
}

export function FaqAccordion({
  ticketPrice = 1000,
  targetTickets = 10000,
  carName = "Porsche 718 Cayman",
}: FaqAccordionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      num: "01",
      q: `What happens to my ₹${ticketPrice.toLocaleString("en-IN")} deposit when I enter?`,
      a: `Every ₹${ticketPrice.toLocaleString("en-IN")} you deposit is 100% credited into your permanent TurboRide Drive Credits wallet. The contest ticket is completely complimentary. Your credits never expire and can be redeemed for real track drives, photoshoots, and reels on book.turboridesupercars.com.`,
    },
    {
      num: "02",
      q: "Is this a lottery or gambling?",
      a: "No. TurboRide Win A Supercar is a promotional loyalty rewards program. Because you receive 100% commercial value in drive credits for every Rupee deposited, your capital is never wagered or lost. The program operates legally under Indian trade promotion laws.",
    },
    {
      num: "03",
      q: "When and how will the winning ticket be selected?",
      a: `The draw is streamed live across our official YouTube and Instagram handles as soon as the ${targetTickets.toLocaleString("en-IN")} ticket cap is reached. A certified cryptographic random generator will draw the winning 5-digit ticket number on live camera with public auditing.`,
    },
    {
      num: "04",
      q: "How do game vouchers and Turboride Coin Rush work?",
      a: "For each ₹1,000 you deposit, you receive a 12-digit game voucher (e.g. 7KQ4-M2XD-9PHA) along with ₹1,000 in permanent Drive Credits. You can input this code in Turboride Coin Rush to play online races. Every race adds points to your player total and keeps your rank updated on the live public leaderboard.",
    },
    {
      num: "05",
      q: "How do I redeem my credits for track drives?",
      a: "Visit the Redeem Credits page in your Member Garage. Select your desired supercar (Lamborghini Huracán, Ferrari 488, McLaren, Porsche 911), and click Redeem. Your credits are verified and debited, and you will be seamlessly redirected to our booking engine to pick your track date.",
    },
    {
      num: "06",
      q: `What happens if I do not win the ${carName}?`,
      a: "You lose nothing. Your full deposit remains in your wallet as TurboRide Drive Credits, which you can use for supercar laps or media shoots at your convenience.",
    },
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-12 sm:py-20 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creative Automotive Telemetry Deco & Single Line Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
            <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              07 · AUDIT & DISCLOSURES
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
            </span>
            <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none">
            FAQS & VERIFICATION
          </h2>
        </div>

        {/* Accordion List with Motion - Sharp Edged */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-none bg-white border border-zinc-200 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-zinc-950 hover:text-[#ea580c] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs sm:text-sm font-black text-[#ea580c] shrink-0">
                      {faq.num}
                    </span>
                    <span className="font-black text-sm sm:text-base tracking-tight truncate">
                      {faq.q}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                      isOpen
                        ? "rotate-180 bg-[#ea580c] text-white border-[#ea580c]"
                        : "bg-zinc-50 text-zinc-950 border-zinc-200"
                    }`}
                  >
                    <CaretDown size={13} weight="bold" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-zinc-100 bg-zinc-50/50"
                    >
                      <div className="p-4 sm:p-5 text-sm sm:text-base text-zinc-950 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

