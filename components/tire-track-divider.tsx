"use client"

import Image from "next/image"

export function TireTrackDivider() {
  return (
    <div className="relative w-full py-4 sm:py-6 overflow-hidden bg-white select-none pointer-events-none">
      {/* Background Asphalt Heat Fade */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "linear-gradient(180deg, rgba(249, 115, 22, 0.08) 0%, transparent 60%, rgba(0, 0, 0, 0.02) 100%)",
        }}
      />

      {/* Subtle Drift Dust Cloud / Smoke Particles */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-3/4 h-8 bg-gradient-to-r from-transparent via-orange-300/40 to-transparent blur-xl transform -skew-x-12" />
      </div>

      {/* Textured Tire Tread Skid Tracks (From User Reference Asset) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        
        {/* Left Hairline & Speed Marker */}
        <div className="hidden sm:flex items-center flex-1 pr-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 to-zinc-400" />
          <div className="flex gap-1 ml-2 shrink-0">
            <span className="w-1 h-3 bg-[#ea580c] -skew-x-12" />
            <span className="w-1 h-3 bg-zinc-800 -skew-x-12" />
            <span className="w-1 h-3 bg-zinc-400 -skew-x-12" />
          </div>
        </div>

        {/* Center Car Dust Path / Tire Tread Marks */}
        <div className="relative w-full sm:w-[680px] lg:w-[840px] h-10 sm:h-12 flex items-center justify-center">
          <Image
            src="/textures/tire-track-skid.png"
            alt="Porsche 718 Launch Skid Mark & Tire Dust Path"
            width={1600}
            height={56}
            className="w-full h-auto max-h-12 object-contain opacity-85 hover:opacity-100 transition-opacity drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
            priority
          />
        </div>

        {/* Right Hairline & Speed Marker */}
        <div className="hidden sm:flex items-center flex-1 pl-4">
          <div className="flex gap-1 mr-2 shrink-0">
            <span className="w-1 h-3 bg-zinc-400 -skew-x-12" />
            <span className="w-1 h-3 bg-zinc-800 -skew-x-12" />
            <span className="w-1 h-3 bg-[#ea580c] -skew-x-12" />
          </div>
          <div className="w-full h-px bg-gradient-to-l from-transparent via-zinc-300 to-zinc-400" />
        </div>

      </div>

      {/* Micro Telemetry Label */}
      <div className="flex items-center justify-center mt-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#ea580c] rotate-45 inline-block" />
          BUDDH CIRCUIT ASPHALT · 4.9S LAUNCH TESTED
          <span className="w-1 h-1 bg-[#ea580c] rotate-45 inline-block" />
        </span>
      </div>
    </div>
  )
}
