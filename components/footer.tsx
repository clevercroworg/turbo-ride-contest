import Link from "next/link"
import { ShieldCheck, EnvelopeSimple, Phone, ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-950 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Top Colophon Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 sm:mb-10 border-b border-zinc-200 text-xs text-zinc-950 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ea580c] rounded-xs" />
            <span className="font-black text-zinc-950">TURBORIDE SUPERCAR CLUB</span>
            <span className="text-zinc-300">/</span>
            <span className="font-semibold text-zinc-950">BANGALORE & BUDDH CIRCUIT</span>
          </div>
          <div>
            <span className="font-bold text-zinc-950">100% CAPITAL ESCROW · TRADE PROMOTION COMPLIANT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="font-black text-xl text-zinc-950 uppercase tracking-tight">
              WINMY<span className="text-[#ea580c]">PORSCHE</span>
            </span>
            <p className="text-zinc-950 text-xs font-medium leading-relaxed">
              India&apos;s premier supercar driving club. Convert your deposits into permanent drive credits and enter verified vehicle drops.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold pt-1">
              <ShieldCheck size={16} weight="fill" className="text-emerald-600 shrink-0" />
              <span>100% Value Guarantee · Zero Loss</span>
            </div>
          </div>

          {/* Experience Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-zinc-950 font-black text-xs uppercase tracking-wider">
              Fleet Experiences
            </span>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors flex items-center justify-between group"
            >
              <span>Lamborghini Huracán</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors flex items-center justify-between group"
            >
              <span>Ferrari 488 GTB</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors flex items-center justify-between group"
            >
              <span>McLaren 720S</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors flex items-center justify-between group"
            >
              <span>Porsche 911 GT3</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
          </div>

          {/* Program & Members */}
          <div className="flex flex-col gap-2.5">
            <span className="text-zinc-950 font-black text-xs uppercase tracking-wider">
              Garage & Syndicate
            </span>
            <Link href="/members" className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors">
              Member Garage Dashboard
            </Link>
            <Link href="/members/rewards" className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors">
              Redeem Drive Credits
            </Link>
            <a href="#how-it-works" className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors">
              Zero-Loss Protocol
            </a>
            <a href="#referrals" className="text-zinc-950 font-medium hover:text-[#ea580c] transition-colors">
              Syndicate 25% Affiliate
            </a>
            <Link href="/admin" className="text-zinc-500 hover:text-zinc-950 transition-colors">
              Superadmin Console
            </Link>
          </div>

          {/* Legal Transparency */}
          <div className="flex flex-col gap-2.5">
            <span className="text-zinc-950 font-black text-xs uppercase tracking-wider">
              Concierge & Desk
            </span>
            <div className="flex items-center gap-2 font-medium text-zinc-950">
              <EnvelopeSimple size={15} className="text-zinc-400 shrink-0" />
              <span>vip@turboridesupercars.com</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-zinc-950">
              <Phone size={15} className="text-zinc-400 shrink-0" />
              <span>+91 99880 01122</span>
            </div>
            <p className="text-xs text-zinc-950 font-medium leading-relaxed mt-1">
              TurboRide operates as a commercial loyalty club. Every ₹1,000 deposited is credited 1:1 into member drive accounts and is never forfeit.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-950">
          <p className="font-semibold">© {new Date().getFullYear()} TurboRide Club Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap font-medium">
            <a href="#" className="hover:text-[#ea580c] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#ea580c] transition-colors">Terms of Membership</a>
            <a href="#" className="hover:text-[#ea580c] transition-colors">Draw Regulations</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

