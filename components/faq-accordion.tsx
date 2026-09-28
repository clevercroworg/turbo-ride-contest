"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CaretDown, ShieldCheck, FileText } from "@phosphor-icons/react"

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      num: "01",
      q: "What happens to my ₹1,000 deposit when I enter?",
      a: "Every ₹1,000 you deposit is 100% credited into your permanent TurboRide Drive Credits wallet. The contest ticket is completely free and complimentary. Your credits never expire and can be redeemed for real track drives, photoshoots, and reels on book.turboridesupercars.com.",
    },
    {
      num: "02",
      q: "Is this a lottery or gambling?",
      a: "No. TurboRide Win A Supercar is a promotional loyalty rewards program. Because you receive 100% commercial value in drive credits for every Rupee spent, your money is never wagered or lost. The program operates legally under Indian trade promotion laws.",
    },
    {
      num: "03",
      q: "When and how will the winning ticket be selected?",
      a: "The draw is streamed live across our official YouTube and Instagram handles as soon as the 10,000 ticket cap is reached. A certified cryptographic random generator will draw the winning 5-digit ticket number on live camera with public auditing.",
    },
    {
      num: "04",
      q: "Can I choose my own 5-digit ticket number?",
      a: "Yes. In your Member Garage dashboard, you can type in any available 5-digit number (e.g. 77718 or your birthday) or click Auto-Pick to generate verified unclaimed numbers instantly.",
    },
    {
      num: "05",
      q: "How do I redeem my credits for track drives?",
      a: "Visit the Redeem Credits page in your Member Garage. Select your desired supercar (Lamborghini Huracán, Ferrari 488, McLaren, Porsche 911), and click Redeem. Your credits are verified and debited, and you will be seamlessly redirected to our booking engine to pick your track date.",
    },
    {
      num: "06",
      q: "What happens if I do not win the Porsche?",
      a: "You lose nothing. Your full deposit remains in your wallet as TurboRide Drive Credits, which you can use for supercar laps or media shoots at your convenience.",
    },
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-12 border-b border-zinc-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
              <span>05 // AUDITING & DISCLOSURES</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight leading-[1.02]">
              VERIFICATION & INQUIRIES
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
            Clear Answers on Capital Custody & Draws
          </span>
        </div>

        {/* Accordion List with Motion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-zinc-950 hover:text-[#ea580c] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      {faq.num}
                    </span>
                    <span className="font-display font-bold text-base sm:text-lg tracking-tight">
                      {faq.q}
                    </span>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                      isOpen
                        ? "rotate-180 bg-[#ea580c] text-white border-[#ea580c]"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    <CaretDown size={14} weight="bold" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-zinc-100 bg-zinc-50/50"
                    >
                      <div className="p-5 sm:p-6 text-sm text-zinc-600 leading-relaxed font-sans pl-12 sm:pl-14">
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
