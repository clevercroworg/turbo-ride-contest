import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, ArrowLeft, CheckCircle, FileText, Scales, LockKey, Ticket } from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
  title: "Terms of Membership & Contest Rules | TurboRide Supercar Club",
  description:
    "Official terms and conditions governing TurboRide Supercar Club membership, the 1:1 Drive Credit parity protocol, and Draw #01 promotional rules.",
}

export default function TermsPage() {
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
            <Link href="/terms" className="text-[#ea580c] border-b-2 border-[#ea580c] pb-1">
              Terms & Membership
            </Link>
            <Link href="/draw-regulations" className="text-zinc-600 hover:text-zinc-950 transition-colors pb-1">
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
            <ShieldCheck size={14} weight="fill" className="text-emerald-400" />
            <span>LEGAL SPECIFICATION · DRAW #01</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight uppercase leading-none mb-4">
            TERMS OF MEMBERSHIP & CONTEST RULES
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 font-medium leading-relaxed">
            Last Updated: March 2026 · TurboRide Supercar Club Pvt. Ltd. (Bengaluru, India). These Terms govern your member account, 1:1 Drive Credit wallet, and complimentary participation in verified supercar promotional draws.
          </p>

          {/* Quick Sub-nav for Mobile */}
          <div className="flex md:hidden items-center gap-3 mt-6 pt-4 border-t border-zinc-200 text-xs font-bold overflow-x-auto">
            <Link href="/terms" className="text-[#ea580c] whitespace-nowrap">Terms & Rules</Link>
            <span className="text-zinc-300">/</span>
            <Link href="/draw-regulations" className="text-zinc-600 hover:text-zinc-950 whitespace-nowrap">Draw Regulations</Link>
            <span className="text-zinc-300">/</span>
            <Link href="/privacy" className="text-zinc-600 hover:text-zinc-950 whitespace-nowrap">Privacy Policy</Link>
          </div>
        </div>

        {/* Highlight Callout: 1:1 Capital Parity & Zero-Loss */}
        <div className="p-5 sm:p-6 bg-white border border-zinc-300 shadow-2xs rounded-none mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center shrink-0">
              <Scales size={22} weight="bold" className="text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight mb-1">
                The 1:1 Zero-Loss Legal Framework
              </h2>
              <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                TurboRide operates strictly as a commercial supercar club and automotive loyalty platform. Every ₹1,000 deposited is credited 100% as permanent Drive Credits into your account. All draw entry tickets are <strong>complimentary customer loyalty rewards</strong>. Your capital is never wagered, forfeit, or lost, adhering strictly to Indian trade promotion jurisprudence.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-zinc-900 leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">01.</span>
              Membership & Account Eligibility
            </h3>
            <p className="text-zinc-700">
              Membership in the TurboRide Supercar Club is open exclusively to individuals who satisfy the following mandatory statutory criteria:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>Must be a citizen or resident of India aged 18 years or older as of the transaction date.</li>
              <li>Must possess a valid Indian Permanent Account Number (PAN) and government-issued photo identity proof (Aadhaar, Passport, or Voter ID).</li>
              <li>Must register using an active mobile number and valid email address capable of receiving SMS and email One-Time Passwords (OTPs).</li>
              <li>Officers, directors, key administrative personnel of TurboRide Supercar Club Pvt. Ltd., and immediate family members residing in the same household are strictly disqualified from winning grand vehicle prizes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">02.</span>
              1:1 Drive Credit Parity & Wallet Protocol
            </h3>
            <p className="text-zinc-700">
              TurboRide operates a closed-loop automotive experience wallet. For every ₹1,000 Indian Rupees deposited:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>The member immediately receives exactly 1,000 TurboRide Drive Credits (1:1 INR parity) credited to their Member Garage account.</li>
              <li>Drive Credits hold <strong>perpetual validity and never expire</strong>.</li>
              <li>Credits are redeemable against official Buddh International Circuit track drives, high-performance coaching, passenger hot laps, professional automotive video shoots, and supercar fleet access via book.turboridesupercars.com.</li>
              <li>Drive Credits are non-transferable to third-party bank accounts once credited, except where mandated by statutory consumer protection provisions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">03.</span>
              Complimentary Draw Tickets & Non-Gambling Declaration
            </h3>
            <p className="text-zinc-700">
              For every 1,000 Drive Credits purchased, TurboRide grants 1 (one) complimentary promotional entry ticket into the active vehicle draw (e.g. Draw #01: Porsche 718 Cayman):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>No entry fee, stake, or wagering fee is charged for draw tickets. Tickets are provided solely as marketing loyalty incentives.</li>
              <li>Because members receive full commercial fair market value in drive credits for 100% of their deposited capital, this promotion does not constitute a lottery, game of chance, wagering, or prize competition under the Public Gambling Act, 1867, or the Lotteries (Regulation) Act, 1998.</li>
              <li>Participation is void in any territory or jurisdiction where promotional trade schemes are specifically restricted or prohibited by local ordinance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">04.</span>
              Draw Cap, Scheduling & Transparent Verification
            </h3>
            <p className="text-zinc-700">
              Draw #01 operates under a strict, immutable total cap of exactly 10,000 verified entries:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>No further entries will be issued once ticket #10000 has been allocated. Ticket supply is cryptographically locked.</li>
              <li>The live public draw will occur within 72 (seventy-two) hours of the final ticket allocation.</li>
              <li>The draw will be broadcast live across TurboRide’s official verified YouTube and Instagram channels.</li>
              <li>Winning ticket selection is conducted via a publicly auditable cryptographic pseudo-random number generator (PRNG) supervised by an independent Chartered Accountant / legal auditor.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">05.</span>
              Prize Claims, Tax Compliance (TDS) & Cash Alternative
            </h3>
            <p className="text-zinc-700">
              The grand prize winner is entitled to choose between the brand-new Porsche 718 Cayman or a flat ₹75 Lakh Net Cash Alternative:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li><strong>Statutory Tax Deduction:</strong> In accordance with Section 194B of the Indian Income Tax Act, 1961, winnings from promotional trade contests are subject to Tax Deducted at Source (TDS) at the statutory rate (currently 30% plus applicable surcharge and cess).</li>
              <li>For physical vehicle handover, the winning member must deposit the requisite TDS with TurboRide Supercar Club Pvt. Ltd. prior to vehicle registration and RTO title transfer.</li>
              <li>If the winner elects the ₹75 Lakh Cash Option, the TDS will be deducted directly from the gross prize disbursement, and net proceeds will be transferred via RTGS/NEFT to the winner’s verified Indian bank account.</li>
              <li>Winners must complete statutory KYC verification within 14 (fourteen) calendar days of notification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">06.</span>
              Governing Law & Jurisdiction
            </h3>
            <p className="text-zinc-700">
              These Terms and any dispute or claim arising out of or in connection with membership, credit issuance, or the draw are governed by and construed in accordance with the laws of the Republic of India. The courts located in Bengaluru, Karnataka, India shall have exclusive territorial and subject-matter jurisdiction.
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-600">
          <div>
            Questions? Contact <a href="mailto:legal@turboride.in" className="text-[#ea580c] hover:underline">legal@turboride.in</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/draw-regulations" className="hover:text-zinc-950 transition-colors">
              Read Draw Regulations →
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
