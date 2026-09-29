import Image from "next/image"
import { PorscheSpecs } from "./porsche-specs"

interface PrizePoolProps {
  carName?: string
  worthDisplay?: string
}

export function PrizePool({
  carName = "Porsche 718 Cayman",
  worthDisplay = "Worth over ₹1.6 Crore",
}: PrizePoolProps = {}) {
  return (
    <section id="the-car" className="py-14 sm:py-20 lg:py-24 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creative Automotive Telemetry Deco & Single Line Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <span className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent to-[#ea580c]" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#ea580c] font-black uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block" />
              05 // VERIFIED PRIZES
              <span className="w-1.5 h-1.5 bg-[#ea580c] rotate-45 inline-block" />
            </span>
            <span className="w-6 sm:w-10 h-px bg-gradient-to-l from-transparent to-[#ea580c]" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-none mb-3">
            THE 3 PRIZE TIERS
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto mb-3">
            Every single ticket enters you into all 3 verified prize tiers automatically.
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 font-medium bg-white px-3 py-1 rounded-none border border-zinc-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Draw Triggered When 10,000 Tickets Sell Out</span>
          </div>
        </div>

        {/* 1st Prize Grand Feature Card: Horizontal Architectural Stage - Sharp Edges */}
        <div className="rounded-none bg-white border border-zinc-200 overflow-hidden shadow-2xs mb-8 group">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left: Cinematic 16:9 Studio Porsche Photograph */}
            <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[440px] bg-zinc-950 overflow-hidden rounded-none">
              <Image
                src="/prizes/porsche-718.jpg"
                alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              {/* Badges Overlay - Sharp */}
              <div className="absolute top-4 left-4 text-xs font-bold text-white bg-zinc-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-none uppercase tracking-wide">
                1st Prize · 1 Winner
              </div>
              <div className="absolute top-4 right-4 text-xs font-black text-orange-400 bg-zinc-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-none">
                {worthDisplay}
              </div>
            </div>

            {/* Right: Details & Value Option */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c] block mb-1">
                  GRAND PRIZE VEHICLE
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight mb-3">
                  {carName}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6">
                  Delivered straight to you with all road taxes, official registration plates, and comprehensive insurance completely paid by TurboRide Club.
                </p>

                {/* Cash Alternative Banner - Sharp */}
                <div className="p-4 rounded-none bg-orange-50/70 border border-orange-200/80 mb-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                  <span className="font-bold text-zinc-950 block mb-0.5">💰 Guaranteed Cash Option</span>
                  <span>If you prefer cash, you can choose a <strong className="text-[#ea580c] font-black">₹75,00,000 direct bank wire transfer</strong> instead.</span>
                </div>
              </div>

              {/* 4-Stat Performance Grid - Sharp */}
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-zinc-100 text-xs">
                <div className="p-3 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 uppercase font-semibold block mb-0.5">Engine</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">2.0L Turbo Flat-4</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 uppercase font-semibold block mb-0.5">Horsepower</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">300 HP / 380 Nm</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 uppercase font-semibold block mb-0.5">0-100 km/h</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">4.9 Seconds</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-none bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 uppercase font-semibold block mb-0.5">Top Speed</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">275 km/h</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Verified Grand Prize 100-Point Inspection Passport */}
        <PorscheSpecs />

        {/* 2nd & 3rd Prize Grid - Sharp Edged */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-8">
          
          {/* 2nd Prize Card: Apple iPhone 16 Pro */}
          <div className="rounded-none bg-white border border-zinc-200 overflow-hidden shadow-2xs flex flex-col justify-between group">
            <div>
              {/* 16:9 Image Container */}
              <div className="relative w-full aspect-[16/9] bg-zinc-950 overflow-hidden rounded-none">
                <Image
                  src="/prizes/iphone-16-pro.jpg"
                  alt="Apple iPhone 16 Pro in Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute top-3.5 left-3.5 text-xs font-bold text-white bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-none uppercase">
                  2nd Prize · 10 Winners
                </div>
                <div className="absolute top-3.5 right-3.5 text-xs font-bold text-zinc-200 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-none">
                  ₹1.35 Lakh Each
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6">
                <h4 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                  10x Apple iPhone 16 Pro (256GB)
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Ten separate winners receive factory-sealed 256GB Space Black iPhone 16 Pro flagship devices delivered to their doorstep anywhere in India.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium">
              <span className="font-bold text-zinc-950">10 Separate Draws</span>
              <span>Space Black Sealed Box</span>
            </div>
          </div>

          {/* 3rd Prize Card: VIP Drive Credits */}
          <div className="rounded-none bg-white border border-zinc-200 overflow-hidden shadow-2xs flex flex-col justify-between group">
            <div>
              {/* 16:9 Image Container */}
              <div className="relative w-full aspect-[16/9] bg-zinc-950 overflow-hidden rounded-none">
                <Image
                  src="/prizes/track-credits.jpg"
                  alt="TurboRide VIP Drive Club 10,000 Credits Card"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute top-3.5 left-3.5 text-xs font-bold text-white bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-none uppercase">
                  3rd Prize · 25 Winners
                </div>
                <div className="absolute top-3.5 right-3.5 text-xs font-bold text-emerald-400 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-none">
                  10,000 Credits Each
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6">
                <h4 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                  25x 10,000 Free Bonus Credits
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Twenty-five separate winners will receive 10,000 free bonus credits credited directly to their permanent wallet to book extra supercar track laps or drone videos.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium">
              <span className="font-bold text-zinc-950">25 Separate Draws</span>
              <span className="text-emerald-600 font-bold">Credits Never Expire</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
