import Image from "next/image"
import { Trophy, DeviceMobile, Sparkle, ShieldCheck, Gauge, Broadcast, Check } from "@phosphor-icons/react/dist/ssr"

interface PrizePoolProps {
  carName?: string
  worthDisplay?: string
}

export function PrizePool({
  carName = "Porsche 718 Cayman",
  worthDisplay = "Worth over ₹1.6 Crore",
}: PrizePoolProps = {}) {
  return (
    <section id="the-car" className="py-16 sm:py-24 lg:py-28 bg-[#fafafa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-5 mb-10 sm:mb-12 border-b border-zinc-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
              <span>02 // PRIZES YOU CAN WIN</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 uppercase tracking-tight leading-[1.02]">
              ALL 3 PRIZE TIERS IN ONE TICKET
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Streamed live on YouTube & Instagram when tickets sell out</span>
          </div>
        </div>

        {/* 1st Prize Grand Feature Card: Horizontal Architectural Stage */}
        <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-sm mb-8 group">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left: Cinematic 16:9 Studio Porsche Photograph */}
            <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[440px] bg-zinc-950 overflow-hidden">
              <Image
                src="/prizes/porsche-718.jpg"
                alt="Porsche 718 Cayman in Speed Yellow Studio Lighting"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 font-mono text-xs font-bold text-white bg-zinc-950/85 backdrop-blur-md px-3.5 py-1.5 rounded uppercase tracking-wider">
                1st Prize · 1 Winner
              </div>
              <div className="absolute top-4 right-4 font-mono text-xs font-black text-orange-400 bg-zinc-950/85 backdrop-blur-md px-3.5 py-1.5 rounded">
                {worthDisplay}
              </div>
            </div>

            {/* Right: Technical Details & Value Option */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ea580c] block mb-1">
                  GRAND PRIZE VEHICLE
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight mb-3">
                  {carName}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6">
                  Delivered straight to you with all road taxes, official registration plates, and comprehensive insurance completely paid by TurboRide Club.
                </p>

                {/* Cash Alternative Banner */}
                <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 mb-6 text-xs text-zinc-700">
                  <span className="font-bold text-zinc-950 block mb-0.5">💰 Guaranteed Cash Option</span>
                  <span>If you prefer cash, you can choose a <strong className="text-[#ea580c] font-black">₹75,00,000 direct bank wire transfer</strong> instead.</span>
                </div>
              </div>

              {/* 4-Stat Performance Grid */}
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-zinc-100 font-mono text-xs">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-0.5">Engine</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">2.0L Turbo Flat-4</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-0.5">Horsepower</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">300 HP / 380 Nm</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-0.5">0-100 km/h</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">4.9 Seconds</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-0.5">Top Speed</span>
                  <span className="font-bold text-zinc-950 text-xs sm:text-sm">275 km/h</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 2nd & 3rd Prize Grid: Balanced 2-Column Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* 2nd Prize Card: Apple iPhone 16 Pro */}
          <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              {/* 16:9 Image Container */}
              <div className="relative w-full aspect-[16/9] bg-zinc-950 overflow-hidden">
                <Image
                  src="/prizes/iphone-16-pro.jpg"
                  alt="Apple iPhone 16 Pro in Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute top-3.5 left-3.5 font-mono text-[11px] font-bold text-white bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded uppercase">
                  2nd Prize · 10 Winners
                </div>
                <div className="absolute top-3.5 right-3.5 font-mono text-[11px] font-bold text-zinc-200 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded">
                  ₹1.35 Lakh Each
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6">
                <h4 className="font-display text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                  10x Apple iPhone 16 Pro (256GB)
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Ten separate winners receive factory-sealed 256GB Space Black iPhone 16 Pro flagship devices delivered to their doorstep anywhere in India.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span className="font-bold text-zinc-950">10 Separate Draws</span>
              <span>Space Black Sealed Box</span>
            </div>
          </div>

          {/* 3rd Prize Card: VIP Drive Credits */}
          <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              {/* 16:9 Image Container */}
              <div className="relative w-full aspect-[16/9] bg-zinc-950 overflow-hidden">
                <Image
                  src="/prizes/track-credits.jpg"
                  alt="TurboRide VIP Drive Club 10,000 Credits Card"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute top-3.5 left-3.5 font-mono text-[11px] font-bold text-white bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded uppercase">
                  3rd Prize · 25 Winners
                </div>
                <div className="absolute top-3.5 right-3.5 font-mono text-[11px] font-bold text-emerald-400 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded">
                  10,000 Credits Each
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6">
                <h4 className="font-display text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                  25x 10,000 Free Bonus Credits
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Twenty-five separate winners will receive 10,000 free bonus credits credited directly to their permanent wallet to book extra supercar track laps or drone videos.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span className="font-bold text-zinc-950">25 Separate Draws</span>
              <span className="text-emerald-600 font-bold">Credits Never Expire</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
