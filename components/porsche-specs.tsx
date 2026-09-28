"use client"

import {
  Calendar,
  Gauge,
  GasPump,
  User,
  MapPin,
  GearSix,
  Lightning,
  Users,
  Palette,
  ShieldCheck,
  Timer,
  Certificate,
  CheckCircle,
} from "@phosphor-icons/react"

export function PorscheSpecs() {
  const specClusters = [
    {
      category: "POWERTRAIN & DYNAMICS",
      specs: [
        { label: "Engine", value: "2.0L Turbo Flat-4 · 300 BHP", icon: Lightning },
        { label: "Transmission", value: "7-Speed PDK Dual-Clutch", icon: GearSix },
        { label: "0-100 km/h", value: "4.9 Seconds", icon: Timer },
        { label: "Configuration", value: "Petrol · 2-Seater Mid-Engine", icon: GasPump },
      ],
    },
    {
      category: "PROVENANCE & CERTIFICATION",
      specs: [
        { label: "Year of Make", value: "2019", icon: Calendar },
        { label: "Kms Driven", value: "28,400 KM (Verified)", icon: Gauge },
        { label: "Ownership", value: "1st Owner (Single Driver)", icon: User },
        { label: "Service History", value: "Full · Porsche-Certified", icon: Certificate },
      ],
    },
    {
      category: "REGISTRATION & COMPLIANCE",
      specs: [
        { label: "Registration", value: "Karnataka (KA RTO)", icon: MapPin },
        { label: "Colour Finish", value: "Racing Yellow (OEM)", icon: Palette },
        { label: "Insurance", value: "Valid Comprehensive Cover", icon: ShieldCheck },
        { label: "Cash Alternative", value: "₹75,00,000 Direct Wire Option", icon: CheckCircle },
      ],
    },
  ]

  return (
    <div className="mt-8 rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-zinc-100 gap-2">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs uppercase tracking-wider font-bold text-zinc-950">
            OFFICIAL VEHICLE PASSPORT // 100-POINT INSPECTION
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-500">
          Chassis & RTO Verified · Zero Hypothecation
        </span>
      </div>

      {/* 3 Grouped Clusters (No 12-cell boring grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {specClusters.map((cluster) => (
          <div key={cluster.category} className="space-y-3">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#ea580c] block pb-1 border-b border-zinc-100">
              {cluster.category}
            </span>

            <div className="space-y-2.5">
              {cluster.specs.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 hover:bg-zinc-100/60 transition-colors flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0 mt-0.5">
                      <Icon size={15} weight="bold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block mb-0.5 font-mono">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 block truncate">
                        {item.value}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Legal Verification Guarantee */}
      <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5 text-zinc-900 font-medium">
          <CheckCircle size={14} weight="fill" className="text-emerald-600" />
          RTO transfer fees, Karnataka road taxes, and physical handover covered by TurboRide
        </span>
        <span className="text-[#ea580c] font-bold">100% Turnkey Handover</span>
      </div>

    </div>
  )
}
