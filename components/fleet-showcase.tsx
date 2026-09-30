"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CaretLeft, CaretRight } from "@phosphor-icons/react"

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
  const [activeSlide, setActiveSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isInteractingRef = useRef(false)

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

  const isVisibleRef = useRef(false)

  const scrollToSlide = useCallback((index: number) => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const cards = container.children
    if (cards[index]) {
      const card = cards[index] as HTMLElement
      // Calculate target horizontal scroll offset to center the card within the container
      const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      })
      setActiveSlide(index)
    }
  }, [])

  // Detect whether the carousel section is actually in the user's viewport
  useEffect(() => {
    if (!carouselRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.15 }
    )
    observer.observe(carouselRef.current)
    return () => observer.disconnect()
  }, [])

  // Auto carousel effect for mobile: gently advances every 3.8s ONLY when visible in viewport and not user-interacting
  useEffect(() => {
    const timer = setInterval(() => {
      if (isInteractingRef.current || !isVisibleRef.current) return
      setActiveSlide((prev) => {
        const next = (prev + 1) % fleetItems.length
        scrollToSlide(next)
        return next
      })
    }, 3800)

    return () => clearInterval(timer)
  }, [fleetItems.length, scrollToSlide])

  // Update active slide on manual touch/scroll
  const handleScroll = () => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const scrollLeft = container.scrollLeft
    const cardWidth = container.offsetWidth * 0.82
    const newIndex = Math.round(scrollLeft / (cardWidth + 14))
    if (newIndex >= 0 && newIndex < fleetItems.length && newIndex !== activeSlide) {
      setActiveSlide(newIndex)
    }
  }

  const renderFleetCard = (item: FleetItem, isCarousel = false) => (
    <div
      key={item.id}
      className={`group rounded-none bg-white border border-zinc-200 overflow-hidden shadow-2xs hover:border-zinc-400 transition-all flex flex-col justify-between select-none ${
        isCarousel ? "w-[84vw] max-w-[340px] shrink-0 snap-center" : ""
      }`}
    >
      {/* Image Container with Sharp Badges */}
      <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden rounded-none">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes={isCarousel ? "84vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
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
          <p className="text-xs sm:text-sm text-zinc-600 font-medium mt-0.5 truncate">
            {item.subtitle}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg sm:text-xl font-black text-[#ea580c] block leading-none tabular-nums">
            {item.credits.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider mt-1">
            Credits
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <section id="the-fleet" className="py-12 sm:py-20 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creative Automotive Telemetry Deco & Single Line Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <span className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#ea580c] shrink" />
            <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#ea580c] font-black uppercase flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
              05 · FLEET EXPERIENCES
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block shrink-0" />
            </span>
            <span className="w-4 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#ea580c] shrink" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none mb-3">
            SUPERCAR SEAT TIME
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto px-4 xs:px-6 sm:px-0">
            1 Credit = ₹1. Convert your deposits into supercar track laps, 4K FPV drone reels, or studio photoshoots.
          </p>
        </div>

        {/* Mobile-Only Horizontal Swipe Carousel (Reduces vertical scroll by 80%) */}
        <div className="md:hidden">
          {/* Scrollable Container with Snap & Touch Events */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            onTouchStart={() => {
              isInteractingRef.current = true
            }}
            onTouchEnd={() => {
              setTimeout(() => {
                isInteractingRef.current = false
              }, 4000)
            }}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4 scroll-smooth"
          >
            {fleetItems.map((item) => renderFleetCard(item, true))}
          </div>

          {/* Carousel Telemetry & Step Controls */}
          <div className="flex items-center justify-between mt-3 px-1">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {fleetItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    isInteractingRef.current = true
                    scrollToSlide(idx)
                    setTimeout(() => (isInteractingRef.current = false), 4000)
                  }}
                  className={`h-1.5 transition-all duration-300 rounded-none cursor-pointer ${
                    idx === activeSlide ? "w-6 bg-[#ea580c]" : "w-2 bg-zinc-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Monospace Counter + Navigation Arrows */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-zinc-500 tabular-nums">
                {String(activeSlide + 1).padStart(2, "0")} / {String(fleetItems.length).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    isInteractingRef.current = true
                    const prev = (activeSlide - 1 + fleetItems.length) % fleetItems.length
                    scrollToSlide(prev)
                    setTimeout(() => (isInteractingRef.current = false), 4000)
                  }}
                  className="w-8 h-8 rounded-none bg-white border border-zinc-300 hover:border-zinc-950 flex items-center justify-center text-zinc-900 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  aria-label="Previous Car"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    isInteractingRef.current = true
                    const next = (activeSlide + 1) % fleetItems.length
                    scrollToSlide(next)
                    setTimeout(() => (isInteractingRef.current = false), 4000)
                  }}
                  className="w-8 h-8 rounded-none bg-white border border-zinc-300 hover:border-zinc-950 flex items-center justify-center text-zinc-900 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  aria-label="Next Car"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet: Clean 2 & 3 Column Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {fleetItems.map((item) => renderFleetCard(item, false))}
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

