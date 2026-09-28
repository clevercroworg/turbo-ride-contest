import Link from "next/link"
import { ShieldCheck, EnvelopeSimple, Phone, ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Top Colophon Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-zinc-200 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ea580c]" />
            <span className="font-bold text-zinc-950">TURBORIDE SUPERCAR CLUB</span>
            <span className="text-zinc-300">/</span>
            <span>BANGALORE & BUDDH CIRCUIT</span>
          </div>
          <div>
            <span>100% CAPITAL ESCROW · INDIAN TRADE PROMOTION COMPLIANT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          
          {/* Brand Col */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <span className="font-display font-black text-xl text-zinc-950 uppercase tracking-tighter">
              WINMY<span className="text-[#ea580c]">PORSCHE</span>
            </span>
            <p className="text-zinc-500 text-xs leading-relaxed">
              India&apos;s premier supercar driving club. Convert your deposits into permanent drive credits and enter verified vehicle drops.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-mono font-semibold pt-1">
              <ShieldCheck size={16} weight="bold" />
              <span>100% Value Guarantee · Zero Loss</span>
            </div>
          </div>

          {/* Experience Links */}
          <div className="flex flex-col gap-3 font-mono">
            <span className="text-zinc-950 font-bold text-xs uppercase tracking-wider font-sans">
              Fleet Experiences
            </span>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group"
            >
              <span>Lamborghini Huracán</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group"
            >
              <span>Ferrari 488 GTB</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group"
            >
              <span>McLaren 720S</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
            <a
              href="https://book.turboridesupercars.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group"
            >
              <span>Porsche 911 GT3</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-zinc-950" />
            </a>
          </div>

          {/* Program & Members */}
          <div className="flex flex-col gap-3 font-mono">
            <span className="text-zinc-950 font-bold text-xs uppercase tracking-wider font-sans">
              Garage & Syndicate
            </span>
            <Link href="/members" className="text-zinc-600 hover:text-zinc-950 transition-colors">
              Member Garage Dashboard
            </Link>
            <Link href="/members/rewards" className="text-zinc-600 hover:text-zinc-950 transition-colors">
              Redeem Drive Credits
            </Link>
            <a href="#how-it-works" className="text-zinc-600 hover:text-zinc-950 transition-colors">
              Zero-Loss Protocol
            </a>
            <a href="#referrals" className="text-zinc-600 hover:text-zinc-950 transition-colors">
              Syndicate 25% Affiliate
            </a>
            <Link href="/admin" className="text-zinc-400 hover:text-zinc-700 transition-colors">
              Superadmin Console
            </Link>
          </div>

          {/* Legal Transparency */}
          <div className="flex flex-col gap-3">
            <span className="text-zinc-950 font-bold text-xs uppercase tracking-wider">
              Transparency & Concierge
            </span>
            <div className="flex items-center gap-2 font-mono">
              <EnvelopeSimple size={15} className="text-zinc-400" />
              <span>vip@turboridesupercars.com</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <Phone size={15} className="text-zinc-400" />
              <span>+91 99880 01122</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mt-2 font-mono">
              TurboRide operates as a commercial loyalty club. Every ₹1,000 deposited is credited 1:1 into member drive accounts and is never forfeit.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} TurboRide Club Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-800 transition-colors">Terms of Membership</a>
            <a href="#" className="hover:text-zinc-800 transition-colors">Draw Regulations</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
