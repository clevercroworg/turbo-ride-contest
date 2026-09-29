import Link from "next/link"
import { ShieldCheck, EnvelopeSimple, Phone, ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-950 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-zinc-200">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-block">
              <span className="font-display text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight">
                WINMY<span className="text-[#ea580c]">PORSCHE</span>
              </span>
            </Link>
            <p className="text-zinc-600 text-xs font-medium leading-relaxed max-w-sm">
              India&apos;s premier supercar driving club. Convert your deposits into permanent Buddh International Circuit drive credits and enter verified supercar draws.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold pt-1">
              <ShieldCheck size={16} weight="fill" className="text-emerald-600 shrink-0" />
              <span>100% Capital Returned in Drive Credits</span>
            </div>
          </div>

          {/* Fleet Experiences */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-mono tracking-wider text-zinc-950 font-black uppercase mb-1">
              Fleet Experiences
            </span>
            <a
              href="#the-fleet"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group py-0.5"
            >
              <span className="font-medium">Lamborghini Huracán</span>
              <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
            </a>
            <a
              href="#the-fleet"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group py-0.5"
            >
              <span className="font-medium">Ferrari 488 GTB</span>
              <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
            </a>
            <a
              href="#the-fleet"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group py-0.5"
            >
              <span className="font-medium">McLaren 720S</span>
              <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
            </a>
            <a
              href="#the-fleet"
              className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between group py-0.5"
            >
              <span className="font-medium">Porsche 911 GT3</span>
              <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
            </a>
          </div>

          {/* Garage & Club */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-mono tracking-wider text-zinc-950 font-black uppercase mb-1">
              Garage & Syndicate
            </span>
            <Link href="/members" className="text-zinc-600 hover:text-zinc-950 font-medium transition-colors py-0.5">
              Member Garage Dashboard
            </Link>
            <Link href="/members/rewards" className="text-zinc-600 hover:text-zinc-950 font-medium transition-colors py-0.5">
              Redeem Track Credits
            </Link>
            <a href="#how-it-works" className="text-zinc-600 hover:text-zinc-950 font-medium transition-colors py-0.5">
              Zero-Loss Protocol
            </a>
            <a href="#referrals" className="text-zinc-600 hover:text-zinc-950 font-medium transition-colors py-0.5">
              Syndicate 25% Affiliate
            </a>
            <a href="#faq" className="text-zinc-600 hover:text-zinc-950 font-medium transition-colors py-0.5">
              Audit & FAQs
            </a>
          </div>

          {/* Concierge & Transparency */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-mono tracking-wider text-zinc-950 font-black uppercase mb-1">
              Club Concierge
            </span>
            <a 
              href="mailto:concierge@turboride.in" 
              className="flex items-center gap-2 text-zinc-700 hover:text-zinc-950 font-medium transition-colors py-0.5"
            >
              <EnvelopeSimple size={15} className="text-[#ea580c] shrink-0" />
              <span>concierge@turboride.in</span>
            </a>
            <a 
              href="tel:+919988001122" 
              className="flex items-center gap-2 text-zinc-700 hover:text-zinc-950 font-medium transition-colors py-0.5"
            >
              <Phone size={15} className="text-[#ea580c] shrink-0" />
              <span>+91 99880 01122</span>
            </a>
            <p className="text-[11px] text-zinc-500 font-normal leading-relaxed mt-1">
              TurboRide operates as a commercial supercar club. Every ₹1,000 deposited is credited 1:1 into member drive accounts and is never forfeit.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p className="font-normal text-center sm:text-left">
            © {new Date().getFullYear()} TurboRide Supercar Club Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center font-medium text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms of Membership</Link>
            <Link href="/draw-regulations" className="hover:text-zinc-950 transition-colors">Draw Regulations</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
