"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Gauge, Camera, VideoCamera } from "@phosphor-icons/react"

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
    <section id="the-fleet" className="py-20 md:py-28 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-12 border-b border-zinc-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
              <span>03 // EXPERIMENTAL COMMERCE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight leading-[1.02]">
              SPEND CREDITS ON REAL SEAT TIME
            </h2>
          </div>
          <p className="text-sm font-mono text-zinc-500 max-w-md">
            1 Credit = ₹1. Your ticket deposits can be converted into track laps or media sessions immediately.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {fleetItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              {/* Image Container with Badge */}
              <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Technical Badge Overlay */}
                <div className="absolute top-3 left-3 font-mono text-[10px] font-bold text-white bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded uppercase tracking-wider">
                  {item.badge}
                </div>

                <div className="absolute top-3 right-3 font-mono text-[10px] font-bold text-zinc-900 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded uppercase">
                  {item.category}
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl sm:text-2xl font-black text-[#ea580c] font-mono block leading-none">
                    {item.credits.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block uppercase tracking-wider mt-1">
                    Credits
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-footer catalog link */}
        <div className="mt-12 text-center">
          <Link
            href="/members/rewards"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 font-mono text-xs font-bold uppercase tracking-wider transition-all border border-zinc-200"
          >
            <span>Browse Full Rewards Garage & Booking Engine</span>
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>

      </div>
    </section>
  )
}
