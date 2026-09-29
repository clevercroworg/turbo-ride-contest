"use client"

import { useState } from "react"
import {
  Calendar,
  Gauge,
  GasPump,
  User,
  MapPin,
  GearSix,
  Lightning,
  Palette,
  ShieldCheck,
  Timer,
  Certificate,
  CheckCircle,
  CaretDown,
} from "@phosphor-icons/react"

export function PorscheSpecs() {
  // Mobile accordion state: default first cluster open
  const [openClusters, setOpenClusters] = useState<Record<string, boolean>>({
    "POWERTRAIN & DYNAMICS": true,
    "PROVENANCE & CERTIFICATION": false,
    "REGISTRATION & COMPLIANCE": false,
  })

  const toggleCluster = (cat: string) => {
    setOpenClusters((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }))
  }

  const specClusters = [
    {
      category: "POWERTRAIN & DYNAMICS",
      shortName: "Powertrain & Engine",
      specs: [
        { label: "Engine", value: "2.0L Turbo Flat-4 · 300 BHP", icon: Lightning },
        { label: "Transmission", value: "7-Speed PDK Dual-Clutch", icon: GearSix },
        { label: "0-100 km/h", value: "4.9 Seconds", icon: Timer },
        { label: "Configuration", value: "Petrol · 2-Seater Mid-Engine", icon: GasPump },
      ],
    },
    {
      category: "PROVENANCE & CERTIFICATION",
      shortName: "History & Ownership",
      specs: [
        { label: "Year of Make", value: "2019", icon: Calendar },
        { label: "Kms Driven", value: "28,400 KM (Verified)", icon: Gauge },
        { label: "Ownership", value: "1st Owner (Single Driver)", icon: User },
        { label: "Service History", value: "Full · Porsche-Certified", icon: Certificate },
      ],
    },
    {
      category: "REGISTRATION & COMPLIANCE",
      shortName: "RTO & Legal Guarantee",
      specs: [
        { label: "Registration", value: "Karnataka (KA RTO)", icon: MapPin },
        { label: "Colour Finish", value: "Racing Yellow (OEM)", icon: Palette },
        { label: "Insurance", value: "Valid Comprehensive Cover", icon: ShieldCheck },
        { label: "Cash Alternative", value: "₹75,00,000 Direct Wire Option", icon: CheckCircle },
      ],
    },
  ]

  return (
    <div className="mt-6 sm:mt-8 rounded-none bg-white border border-zinc-200 p-4 sm:p-6 lg:p-8 shadow-xs">
      
      {/* Header - Single line on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 sm:mb-6 border-b border-zinc-100 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-sm sm:text-base uppercase tracking-wider font-black text-zinc-950 truncate">
            OFFICIAL VEHICLE PASSPORT<span className="hidden sm:inline"> · 100-POINT INSPECTION</span>
          </span>
        </div>
        <span className="text-xs sm:text-sm text-zinc-950 font-bold truncate">
          RTO Verified · Zero Hypothecation
        </span>
      </div>

      {/* 3 Grouped Clusters - Responsive Accordion on Mobile, Multi-column on Desktop - Sharp Edged */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8">
        {specClusters.map((cluster) => {
          const isOpen = openClusters[cluster.category] ?? false
          return (
            <div 
              key={cluster.category} 
              className="rounded-none border border-zinc-200/80 md:border-0 p-2.5 sm:p-0 bg-zinc-50/50 md:bg-transparent"
            >
              {/* Mobile Clickable Accordion Header / Desktop Static Header */}
              <button
                type="button"
                onClick={() => toggleCluster(cluster.category)}
                className="w-full flex items-center justify-between py-2 md:py-0 text-left cursor-pointer md:cursor-default md:pointer-events-none pb-2 border-b border-zinc-200/80 md:border-zinc-100 mb-2.5 sm:mb-3"
              >
                <span className="text-xs sm:text-sm uppercase font-black tracking-wider text-[#ea580c] block">
                  {cluster.category}
                </span>

                {/* Dropdown Indicator (Mobile Only) */}
                <div className="md:hidden flex items-center gap-1.5 text-zinc-700">
                  <span className="text-xs font-bold">
                    {isOpen ? "Hide" : "View"}
                  </span>
                  <CaretDown 
                    size={16} 
                    weight="bold" 
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#ea580c]" : ""}`} 
                  />
                </div>
              </button>

              {/* Specs List: Collapsible on mobile, always visible on desktop */}
              <div className={`space-y-2 sm:space-y-2.5 ${isOpen ? "block" : "hidden md:block"}`}>
                {cluster.specs.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className="p-2.5 sm:p-3 rounded-none bg-white md:bg-zinc-50 border border-zinc-200 hover:bg-zinc-100/80 transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-none bg-orange-100/80 border border-orange-200 flex items-center justify-center text-[#ea580c] shrink-0">
                        <Icon size={16} weight="bold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] sm:text-xs uppercase tracking-wider text-zinc-950 font-extrabold block mb-0.5">
                          {item.label}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-zinc-950 block truncate">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Legal Verification Guarantee */}
      <div className="mt-4 sm:mt-5 pt-3.5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs sm:text-sm text-zinc-950 font-semibold">
        <span className="flex items-center gap-1.5 text-zinc-950 truncate">
          <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
          <span className="truncate">RTO transfer fees, Karnataka road taxes, and handover covered</span>
        </span>
        <span className="text-[#ea580c] font-black shrink-0">100% Turnkey Handover</span>
      </div>

    </div>
  )
}
