import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, ArrowLeft, Ticket, CheckCircle, Broadcast, Trophy, CurrencyInr, FileCode } from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
  title: "Official Draw #01 Regulations & Verification Protocol | TurboRide",
  description:
    "Official specifications, cryptographic RNG audit protocols, and prize fulfillment terms for TurboRide Supercar Club Draw #01 (Porsche 718 Cayman).",
}

export default function DrawRegulationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-950 font-sans selection:bg-[#ea580c] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center group py-2 shrink-0">
            <span className="font-display text-lg sm:text-xl font-black tracking-tight uppercase whitespace-nowrap text-zinc-950">
              WINMY<span className="text-[#ea580c]">PORSCHE</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold">
            <Link href="/terms" className="text-zinc-600 hover:text-zinc-950 transition-colors pb-1">
              Terms & Membership
            </Link>
            <Link href="/draw-regulations" className="text-[#ea580c] border-b-2 border-[#ea580c] pb-1">
              Draw Regulations
            </Link>
            <Link href="/privacy" className="text-zinc-600 hover:text-zinc-950 transition-colors pb-1">
              Privacy Policy
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-700 hover:text-zinc-950 px-3 py-1.5 transition-colors"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Back to Draw</span>
            </Link>

            <Link
              href="/#entry-allocation"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all rounded-none shadow-xs"
            >
              <Ticket size={16} weight="fill" />
              <span>Get Tickets</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Header Badge & Title */}
        <div className="mb-10 sm:mb-12 border-b border-zinc-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-950 text-white text-[11px] font-mono font-black uppercase tracking-widest rounded-none mb-4">
            <Broadcast size={14} weight="bold" className="text-emerald-400" />
            <span>AUDIT SPECIFICATION · IMMUTABLE 10,000 CAP</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight uppercase leading-none mb-4">
            DRAW #01 OFFICIAL REGULATIONS
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 font-medium leading-relaxed">
            Statutory contest protocol, cryptographic seed randomness specification, prize entitlement schedules, and tax compliance procedures for TurboRide Supercar Club Draw #01.
          </p>

          {/* Quick Sub-nav for Mobile */}
          <div className="flex md:hidden items-center gap-3 mt-6 pt-4 border-t border-zinc-200 text-xs font-bold overflow-x-auto">
            <Link href="/terms" className="text-zinc-600 hover:text-zinc-950 whitespace-nowrap">Terms & Rules</Link>
            <span className="text-zinc-300">/</span>
            <Link href="/draw-regulations" className="text-[#ea580c] whitespace-nowrap">Draw Regulations</Link>
            <span className="text-zinc-300">/</span>
            <Link href="/privacy" className="text-zinc-600 hover:text-zinc-950 whitespace-nowrap">Privacy Policy</Link>
          </div>
        </div>

        {/* 3 Prize Tiers Breakdown Table */}
        <div className="bg-white border border-zinc-300 shadow-2xs rounded-none mb-10 overflow-hidden">
          <div className="p-4 sm:p-5 bg-zinc-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-black tracking-wider uppercase">
              <Trophy size={16} weight="fill" className="text-[#ea580c]" />
              <span>Draw #01 Prize Schedule</span>
            </div>
            <span className="text-xs text-zinc-400 font-mono">10,000 Total Entries</span>
          </div>

          <div className="divide-y divide-zinc-200 text-sm">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 bg-orange-100 text-[#ea580c] font-mono text-[10px] font-black uppercase mb-1">
                  Tier 01 · Grand Prize
                </span>
                <h2 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight">
                  Brand New Porsche 718 Cayman (Speed Yellow)
                </h2>
                <p className="text-xs text-zinc-600 font-medium mt-0.5">
                  300 BHP · 0-100 km/h in 4.9s · Buddh Circuit Delivery · Market Value ₹1.6 Crore
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="font-mono text-xs text-zinc-500 block">Alternative</span>
                <span className="font-black text-sm text-zinc-950">₹75 Lakh Net Cash</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-800 font-mono text-[10px] font-black uppercase mb-1">
                  Tier 02 · Track Experience
                </span>
                <h2 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight">
                  50 Buddh Circuit Supercar Track Laps
                </h2>
                <p className="text-xs text-zinc-600 font-medium mt-0.5">
                  Full access to Lamborghini Huracán, Ferrari 488 & Porsche 911 fleet with pro telemetry coaching
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="font-mono text-xs text-zinc-500 block">Commercial Value</span>
                <span className="font-black text-sm text-zinc-950">₹15,00,000</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-800 font-mono text-[10px] font-black uppercase mb-1">
                  Tier 03 · Fleet Wallet
                </span>
                <h2 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight">
                  ₹10,00,000 TurboRide Drive Credits
                </h2>
                <p className="text-xs text-zinc-600 font-medium mt-0.5">
                  Credited directly to winning member’s wallet for perpetual track redemption and shoots
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="font-mono text-xs text-zinc-500 block">Credit Balance</span>
                <span className="font-black text-sm text-zinc-950">₹10 Lakh Wallet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Verification Clauses */}
        <div className="space-y-10 text-zinc-900 leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">01.</span>
              Strict 10,000 Cap & Allocation Architecture
            </h3>
            <p className="text-zinc-700">
              Draw #01 is provisioned with an immutable sequence of exactly 10,000 unique entry tickets, indexed from <code>#00001</code> to <code>#10000</code>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>Each ticket represents one unique allocation assigned to an active member with a verified Indian mobile number and email.</li>
              <li>Members may select specific numbers through the custom number picker or choose automated consecutive/random allocation.</li>
              <li>Once an individual ticket number is confirmed by our database, it is cryptographically locked with a SHA-256 hash receipt and cannot be reissued or duplicated.</li>
              <li>No tickets will ever be added above the 10,000 cap under any circumstances.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">02.</span>
              Live Cryptographic Random Selection Process
            </h3>
            <p className="text-zinc-700">
              The selection of all winning tickets will be conducted live before a public audience on official streaming platforms:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li><strong>Draw Trigger:</strong> Triggered within 72 hours of ticket #10000 being verified and locked.</li>
              <li><strong>Broadcasting:</strong> Broadcast live in high-definition on YouTube Live and Instagram Live with no recording delay or commercial cuts.</li>
              <li><strong>Certified Hardware / PRNG:</strong> Selection utilizes a dual-seed cryptographic Pseudo-Random Number Generator (PRNG) certified for unbias and uniform distribution, overseen by an independent Chartered Accountant / Legal Notary.</li>
              <li><strong>Dual-Draw Transparency:</strong> The initial seed phrase is generated from live public telemetry (e.g. latest Bitcoin block hash at draw start + live audience key) ensuring predetermination is mathematically impossible.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">03.</span>
              Statutory Tax Withholding (TDS Under Section 194B)
            </h3>
            <p className="text-zinc-700">
              In strict accordance with Section 194B of the Income Tax Act, 1961 of the Republic of India:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>All winnings from prize draws, lotteries, and promotional competitions exceeding ₹10,000 are subject to mandatory Tax Deducted at Source (TDS) at the statutory flat rate of 30% plus applicable Health & Education Cess (4%), for an effective rate of 31.2% (or higher if surcharge applies).</li>
              <li><strong>Vehicle Handover TDS:</strong> Before TurboRide executes the RTO registration and transfer of the Porsche 718 Cayman to the winner, the winner must remit the statutory TDS amount to TurboRide Supercar Club Pvt. Ltd. TurboRide will deposit this amount to the Central Government against the winner’s PAN and issue Form 16A.</li>
              <li><strong>Cash Alternative TDS:</strong> If the winner opts for the ₹75,00,000 cash option, TurboRide will automatically deduct the statutory TDS at source and disburse the net proceeds directly via bank transfer (NEFT/RTGS), accompanied by a formal Form 16A tax deduction certificate.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">04.</span>
              Winner Verification, KYC & Vehicle Handover
            </h3>
            <p className="text-zinc-700">
              Upon conclusion of the live broadcast, the winning ticket holder will be contacted immediately via telephone and registered email:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>The winner must furnish certified copies of their PAN Card, Aadhaar Card / Passport, and bank statement within 14 calendar days.</li>
              <li>If the winner fails to respond, cannot be verified, or is found to have breached eligibility clauses within 14 calendar days, an audited backup ticket drawn during the live broadcast will be promoted to winner status.</li>
              <li>Physical delivery of the Porsche 718 Cayman takes place at the Buddh International Circuit (Greater Noida) with track orientation, vehicle keys handover, and complimentary hospitality. Delivery to Bangalore or other metropolitan cities can be arranged on request.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">05.</span>
              Audit Trail & Public Registry
            </h3>
            <p className="text-zinc-700">
              Following the draw, TurboRide publishes an immutable public transparency ledger containing the winning ticket numbers, sanitized winner initials, draw timestamp, and cryptographic seed proof. This ledger remains permanently accessible to club members.
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-600">
          <div>
            Need regulatory clarifications? Contact <a href="mailto:compliance@turboride.in" className="text-[#ea580c] hover:underline">compliance@turboride.in</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">
              ← Read Terms of Membership
            </Link>
            <Link href="/privacy" className="hover:text-zinc-950 transition-colors">
              Read Privacy Policy →
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
