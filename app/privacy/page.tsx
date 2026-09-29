import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, ArrowLeft, Ticket, LockKey, CheckCircle } from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy | TurboRide Supercar Club",
  description:
    "Privacy and data telemetry governance policies for TurboRide Supercar Club members, ticket holders, and transaction verifications.",
}

export default function PrivacyPolicyPage() {
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
            <Link href="/draw-regulations" className="text-zinc-600 hover:text-zinc-950 transition-colors pb-1">
              Draw Regulations
            </Link>
            <Link href="/privacy" className="text-[#ea580c] border-b-2 border-[#ea580c] pb-1">
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
            <LockKey size={14} weight="bold" className="text-emerald-400" />
            <span>DPDP ACT COMPLIANT · ENCRYPTED TELEMETRY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight uppercase leading-none mb-4">
            PRIVACY & DATA PROTECTION POLICY
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 font-medium leading-relaxed">
            Effective Date: March 2026 · TurboRide Supercar Club Pvt. Ltd. (Bengaluru, India). How we collect, verify, process, and protect member telemetry and payment information.
          </p>

          {/* Quick Sub-nav for Mobile */}
          <div className="flex md:hidden items-center gap-3 mt-6 pt-4 border-t border-zinc-200 text-xs font-bold overflow-x-auto">
            <Link href="/terms" className="text-zinc-600 hover:text-zinc-950 whitespace-nowrap">Terms & Rules</Link>
            <span className="text-zinc-300">/</span>
            <Link href="/draw-regulations" className="text-zinc-600 hover:text-zinc-950 whitespace-nowrap">Draw Regulations</Link>
            <span className="text-zinc-300">/</span>
            <Link href="/privacy" className="text-[#ea580c] whitespace-nowrap">Privacy Policy</Link>
          </div>
        </div>

        {/* Detailed Privacy Clauses */}
        <div className="space-y-10 text-zinc-900 leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">01.</span>
              Information We Collect
            </h3>
            <p className="text-zinc-700">
              To operate a secure commercial supercar club and ensure compliance with statutory KYC guidelines, TurboRide collects:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li><strong>Contact Identifiers:</strong> Mobile phone number (verified via SMS OTP) and verified email address.</li>
              <li><strong>Member Details:</strong> Full legal name as registered with government identification.</li>
              <li><strong>Transaction & Telemetry Records:</strong> Deposit amounts, order IDs, allocated ticket numbers (e.g. #07718), timestamp of credit issuance, and Drive Credit redemption history.</li>
              <li><strong>Technical Metadata:</strong> IP address, browser user-agent, and device type collected for fraud prevention and duplicate entry detection.</li>
              <li><strong>Winner KYC (Post-Draw Only):</strong> Permanent Account Number (PAN), Aadhaar / Passport identification, and bank account details required strictly for Section 194B tax withholding and prize transfer.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">02.</span>
              Payment Security & Financial Telemetry
            </h3>
            <p className="text-zinc-700">
              All member deposits are processed via RBI-authorized, PCI-DSS Level 1 compliant payment aggregators (e.g. Razorpay, Cashfree, UPI, Netbanking):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>TurboRide <strong>does not view, store, or process</strong> credit/debit card numbers, CVVs, or internet banking passwords.</li>
              <li>All payment transactions are encrypted end-to-end using 256-bit TLS protocol.</li>
              <li>Instant webhooks communicate transaction status to our secure backend to guarantee immediate 1:1 Drive Credit allocation to your Member Garage.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">03.</span>
              Public Transparency vs. Member Privacy
            </h3>
            <p className="text-zinc-700">
              To balance absolute transparency during the live draw with individual privacy:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>Winning ticket numbers (e.g. #06413) are announced publicly in full on the live broadcast.</li>
              <li>Winner identity is displayed publicly only with sanitized identifiers (e.g., &ldquo;Aditya K., Bengaluru&rdquo;) unless the winner explicitly consents to full promotional media participation.</li>
              <li>Personal phone numbers, email addresses, and financial account details are strictly confidential and will never be shared publicly or sold to third-party data brokers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">04.</span>
              Data Retention & Member Rights
            </h3>
            <p className="text-zinc-700">
              Under the Digital Personal Data Protection (DPDP) Act of India:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
              <li>Members have the right to access their complete transaction and credit history at any time through their Member Garage dashboard.</li>
              <li>Transaction logs and audit records are retained for a minimum of 7 (seven) years in compliance with statutory Indian financial and taxation audit mandates.</li>
              <li>Members may request account closure and data deletion for non-transactional metadata by contacting our Data Protection Officer.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
              <span className="text-[#ea580c] font-mono text-sm">05.</span>
              Grievance Officer & Statutory Contact
            </h3>
            <p className="text-zinc-700">
              In accordance with the Information Technology Act, 2000 and rules made thereunder, the contact details of the Grievance Officer are:
            </p>
            <div className="p-4 bg-zinc-100 border border-zinc-200 text-xs font-mono space-y-1">
              <div><strong>Grievance Officer:</strong> Legal & Compliance Desk</div>
              <div><strong>Company:</strong> TurboRide Supercar Club Private Limited</div>
              <div><strong>Address:</strong> Level 4, Prestige Trade Tower, Palace Road, Bengaluru 560001, Karnataka, India</div>
              <div><strong>Email:</strong> <a href="mailto:privacy@turboride.in" className="text-[#ea580c] hover:underline">privacy@turboride.in</a></div>
              <div><strong>Response SLA:</strong> Within 48 business hours</div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-600">
          <div>
            Need privacy support? Contact <a href="mailto:privacy@turboride.in" className="text-[#ea580c] hover:underline">privacy@turboride.in</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">
              ← Read Terms of Membership
            </Link>
            <Link href="/draw-regulations" className="hover:text-zinc-950 transition-colors">
              Read Draw Regulations →
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
