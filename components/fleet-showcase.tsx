"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react"

interface FleetItem {
  id: string
  name: string
  subtitle: string
  category: "Supercar Drive" | "Experience"
  credits: number
  image: string
  badge: string
}

export function FleetShowcase() {
  const fleetItems: FleetItem[] = [
    {
      id: "huracan",
      name: "LAMBORGHINI HURACÁN",
      subtitle: "5 Laps · 2 km Buddh Track Loop",
      category: "Supercar Drive",
      credits: 25000,
      image: "/fleet/huracan.jpg",
      badge: "V10 NA · 640 HP",
    },
    {
      id: "ferrari",
      name: "FERRARI 488 GTB",
      subtitle: "5 Laps · 2 km Buddh Track Loop",
      category: "Supercar Drive",
      credits: 25000,
      image: "/fleet/ferrari.jpg",
      badge: "V8 TWIN-TURBO · 661 HP",
    },
    {
      id: "mclaren",
      name: "MCLAREN 720S",
      subtitle: "5 Laps · 2 km Buddh Track Loop",
      category: "Supercar Drive",
      credits: 25000,
      image: "/fleet/mclaren.jpg",
      badge: "MONOCELL CARBON · 710 HP",
    },
    {
      id: "porsche-911",
      name: "PORSCHE 911 GT3",
      subtitle: "5 Laps · 2 km Buddh Track Loop",
      category: "Supercar Drive",
      credits: 25000,
      image: "/fleet/porsche-911.jpg",
      badge: "FLAT-6 · 9,000 RPM",
    },
    {
      id: "photoshoot",
      name: "SUPERCAR PHOTOSHOOT",
      subtitle: "5 High-Res Retouched Studio Photos",
      category: "Experience",
      credits: 1000,
      image: "/fleet/photoshoot.jpg",
      badge: "5 RAW + RETOUCHED",
    },
    {
      id: "reel",
      name: "INSTAGRAM 4K REEL",
      subtitle: "30-Sec FPV Drone & Cockpit Reel",
      category: "Experience",
      credits: 2000,
      image: "/fleet/instagram-reel.jpg",
      badge: "4K FPV DRONE + AUDIO",
    },
  ]

  return (
    <section id="the-fleet" className="py-12 sm:py-20 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creative Automotive Telemetry Deco & Single Line Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
            <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              04 · FLEET EXPERIENCES
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
            </span>
            <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none mb-3">
            SUPERCAR SEAT TIME
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-950 font-medium leading-relaxed max-w-2xl mx-auto">
            1 Credit = ₹1. Convert your deposits into supercar track laps, 4K FPV drone reels, or studio photoshoots.
          </p>
        </div>

        {/* 6-Card Grid - Sharp Edged Architectural Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {fleetItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-none bg-white border border-zinc-200 overflow-hidden shadow-2xs hover:border-zinc-400 transition-all flex flex-col justify-between"
            >
              {/* Image Container with Sharp Badges */}
              <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden rounded-none">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Technical Badge Overlay - Sharp Edged */}
                <div className="absolute top-3 left-3 text-[10px] font-bold text-white bg-zinc-950/85 backdrop-blur-md px-2.5 py-1 rounded-none uppercase tracking-wider">
                  {item.badge}
                </div>

                <div className="absolute top-3 right-3 text-[10px] font-bold text-zinc-900 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-none uppercase">
                  {item.category}
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-950 font-bold mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg sm:text-xl font-black text-[#ea580c] block leading-none tabular-nums">
                    {item.credits.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-zinc-950 font-bold block uppercase tracking-wider mt-1">
                    Credits
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-footer catalog link - Clean single line, sharp edged */}
        <div className="mt-8 sm:mt-10 flex justify-center px-4">
          <Link
            href="/members/rewards"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-none bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border border-zinc-200/90 shadow-2xs whitespace-nowrap"
          >
            <span>Browse Rewards Garage</span>
            <ArrowUpRight size={16} weight="bold" className="shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  )
}

