"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { 
  Ticket, 
  Trophy, 
  Gift, 
  Coins, 
  ArrowRight, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Copy, 
  Check, 
  Lock, 
  Wallet, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle,
  Play,
  X,
  Gauge,
  ShieldCheck,
  Zap,
  CornerDownLeft,
  ExternalLink,
  Link2
} from "lucide-react"

import { MembersHeader } from "@/components/members/members-header"
import { 
  buyContestTicketsAction, 
  assignTicketNumberAction, 
  autoPickTicketNumberAction,
  simulateReferralAction
} from "@/lib/credits"
import { logoutMember } from "@/lib/auth"
import { cancelRedemptionAction } from "@/lib/rewards"
import type { 
  MemberSession, 
  Contest, 
  ContestTicket, 
  ReferralProfile, 
  ReferralRecord, 
  ActiveVoucher 
} from "@/lib/types"

interface MemberDashboardClientProps {
  session: MemberSession
  credits: number
  contest: Contest
  allContests?: Contest[]
  ticketStats: {
    totalBought: number
    totalAssigned: number
    availableToAssign: number
    tickets: ContestTicket[]
  }
  referralProfile: ReferralProfile | null
  initialReferrals: ReferralRecord[]
  initialVouchers?: ActiveVoucher[]
  adminSettings?: {
    ticketPrice: number
    creditsPerTicket: number
    creditRewardPercent: number
    cashCommissionPercent: number
    cashUnlockThreshold: number
    fallbackPayoutPercent: number
    drawType: string
    isPaused: boolean
    isClosed: boolean
  }
}

// Multi-contest data definition for the interactive carousel stage
interface ContestShowcase {
  id: string
  title: string
  carName: string
  worthDisplay: string
  status: "live" | "coming" | "closed"
  statusBadge: string
  soldTickets: number
  targetTickets: number
  ticketPrice: number
  images: Array<{ label: string; src: string }>
  videoSrc?: string
  specs: Array<{ label: string; value: string }>
}

export function MemberDashboardClient({
  session,
  credits: initialCredits,
  contest,
  allContests = [],
  ticketStats: initialTicketStats,
  referralProfile: initialReferralProfile,
  initialReferrals,
  initialVouchers = [],
  adminSettings,
}: MemberDashboardClientProps) {
  const router = useRouter()

  // Primary Interactive State
  const [credits, setCredits] = useState<number>(initialCredits)
  const [ticketStats, setTicketStats] = useState(initialTicketStats)
  const [referralProfile, setReferralProfile] = useState<ReferralProfile | null>(initialReferralProfile)
  const [referrals, setReferrals] = useState<ReferralRecord[]>(initialReferrals)
  const [vouchers, setVouchers] = useState<ActiveVoucher[]>(initialVouchers)

  // Ticket Buying State
  const [ticketBuyCount, setTicketBuyCount] = useState<number>(1)
  const [buying, setBuying] = useState<boolean>(false)
  const [buyMsg, setBuyMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // 5-Digit Number Entry State
  const [customNumber, setCustomNumber] = useState<string>("")
  const [assigning, setAssigning] = useState<boolean>(false)
  const [assignMsg, setAssignMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Referral State
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [showReferralsList, setShowReferralsList] = useState<boolean>(false)
  const [friendName, setFriendName] = useState<string>("")
  const [simTickets, setSimTickets] = useState<number>(1)
  const [simulating, setSimulating] = useState<boolean>(false)
  const [simMsg, setSimMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Voucher Cancellation State
  const [cancellingVoucherId, setCancellingVoucherId] = useState<string | null>(null)
  const [voucherMsg, setVoucherMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Video Modal State
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false)

  // Origin for dynamic referral link
  const [activeOrigin, setActiveOrigin] = useState<string>("")
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveOrigin(window.location.origin)
    }
  }, [])

  // Build the dynamic showcase by overlaying live DB contests managed by Admin Console
  const BASE_CATALOG: ContestShowcase[] = [
    {
      id: contest.id || "contest-porsche-718",
      title: contest.title || "PORSCHE 718 CAYMAN",
      carName: contest.carName || "Porsche 718 Cayman",
      worthDisplay: contest.worthDisplay || "₹1.6 Crore",
      status: "live",
      statusBadge: "LIVE CONTEST",
      soldTickets: Number(contest.soldTickets || 6413),
      targetTickets: Number(contest.targetTickets || 10000),
      ticketPrice: Number(contest.ticketPrice || 1000),
      images: [
        { label: "Studio", src: "/images/porsche-yellow.png" },
        { label: "Profile", src: "/cars/car-718.png" },
        { label: "Cockpit", src: "/images/cockpit/porsche-cockpit.png" },
        { label: "Track Rear", src: "/experience/hero-rear.png" },
      ],
      videoSrc: "/experience/teaser-video.mp4",
      specs: [
        { label: "POWER", value: "300 BHP" },
        { label: "0-100 KM/H", value: "4.9 Sec" },
        { label: "TOP SPEED", value: "275 km/h" },
        { label: "TRANSMISSION", value: "7-Speed PDK" },
        { label: "ENGINE", value: "2.0L Turbo Flat-4" },
        { label: "DELIVERY", value: "Pan-India" },
      ],
    },
    {
      id: "contest-bmw-m340i",
      title: "BMW M340i xDRIVE",
      carName: "BMW M340i xDrive",
      worthDisplay: "₹75 Lakh",
      status: "coming",
      statusBadge: "COMING SOON",
      soldTickets: 0,
      targetTickets: 7500,
      ticketPrice: 1000,
      images: [
        { label: "Front Angle", src: "/cars/bmw-side.png" },
        { label: "Track Spec", src: "/cars/car-ferrari-488.png" },
      ],
      specs: [
        { label: "POWER", value: "382 BHP" },
        { label: "0-100 KM/H", value: "4.4 Sec" },
        { label: "TOP SPEED", value: "250 km/h" },
        { label: "TRANSMISSION", value: "8-Speed Steptronic" },
        { label: "ENGINE", value: "3.0L Turbo Inline-6" },
        { label: "DELIVERY", value: "Pan-India" },
      ],
    },
    {
      id: "contest-mustang-gt",
      title: "FORD MUSTANG GT 5.0 V8",
      carName: "Ford Mustang GT",
      worthDisplay: "₹85 Lakh",
      status: "coming",
      statusBadge: "COMING SOON",
      soldTickets: 0,
      targetTickets: 8500,
      ticketPrice: 1000,
      images: [
        { label: "Profile", src: "/cars/car-mustang-gt.png" },
        { label: "Track", src: "/cars/mustang-side.png" },
      ],
      specs: [
        { label: "POWER", value: "450 BHP" },
        { label: "0-100 KM/H", value: "4.3 Sec" },
        { label: "TOP SPEED", value: "250 km/h" },
        { label: "TRANSMISSION", value: "10-Speed Automatic" },
        { label: "ENGINE", value: "5.0L Coyote V8" },
        { label: "DELIVERY", value: "Pan-India" },
      ],
    },
    {
      id: "contest-lamborghini-huracan",
      title: "LAMBORGHINI HURACÁN EVO",
      carName: "Lamborghini Huracán Evo",
      worthDisplay: "₹3.8 Crore",
      status: "coming",
      statusBadge: "COMING SOON",
      soldTickets: 0,
      targetTickets: 38000,
      ticketPrice: 1000,
      images: [
        { label: "Hero Front", src: "/cars/car-huracan.png" },
        { label: "Side View", src: "/cars/lambo-side.png" },
      ],
      specs: [
        { label: "POWER", value: "640 BHP" },
        { label: "0-100 KM/H", value: "2.9 Sec" },
        { label: "TOP SPEED", value: "325 km/h" },
        { label: "TRANSMISSION", value: "7-Speed Dual-Clutch" },
        { label: "ENGINE", value: "5.2L V10 NA" },
        { label: "DELIVERY", value: "Pan-India" },
      ],
    },
    {
      id: "contest-ferrari-488",
      title: "FERRARI 488 GTB",
      carName: "Ferrari 488 GTB",
      worthDisplay: "₹3.5 Crore",
      status: "coming",
      statusBadge: "COMING SOON",
      soldTickets: 0,
      targetTickets: 35000,
      ticketPrice: 1000,
      images: [
        { label: "Front Quarter", src: "/cars/car-ferrari-488.png" },
        { label: "Side Profile", src: "/cars/ferrari-side.png" },
      ],
      specs: [
        { label: "POWER", value: "661 BHP" },
        { label: "0-100 KM/H", value: "3.0 Sec" },
        { label: "TOP SPEED", value: "330 km/h" },
        { label: "TRANSMISSION", value: "7-Speed F1 Dual-Clutch" },
        { label: "ENGINE", value: "3.9L Twin-Turbo V8" },
        { label: "DELIVERY", value: "Pan-India" },
      ],
    },
    {
      id: "contest-porsche-gt3",
      title: "PORSCHE 911 GT3 RS",
      carName: "Porsche 911 GT3 RS",
      worthDisplay: "₹2.7 Crore",
      status: "closed",
      statusBadge: "DRAW COMPLETED",
      soldTickets: 25000,
      targetTickets: 25000,
      ticketPrice: 1000,
      images: [
        { label: "Track Angle", src: "/cars/car-911-gt3.png" },
        { label: "Side Aero", src: "/cars/gt3-side.png" },
      ],
      specs: [
        { label: "POWER", value: "518 BHP" },
        { label: "0-100 KM/H", value: "3.2 Sec" },
        { label: "TOP SPEED", value: "296 km/h" },
        { label: "WINNER", value: "Rahul M. (Bengaluru)" },
        { label: "ENGINE", value: "4.0L Flat-6 NA" },
        { label: "STATUS", value: "Delivered at BIC" },
      ],
    },
  ]

  // Merge live DB contests so any admin modifications to price, target, or sold tickets are reflected
  const ALL_CONTESTS: ContestShowcase[] = BASE_CATALOG.map((base) => {
    const dbMatch = allContests.find((c) => c.id === base.id || c.carName.toLowerCase() === base.carName.toLowerCase())
    if (!dbMatch) return base
    return {
      ...base,
      title: dbMatch.title || base.title,
      carName: dbMatch.carName || base.carName,
      worthDisplay: dbMatch.worthDisplay || base.worthDisplay,
      ticketPrice: Number(dbMatch.ticketPrice) || base.ticketPrice,
      targetTickets: Number(dbMatch.targetTickets) || base.targetTickets,
      soldTickets: Number(dbMatch.soldTickets) || base.soldTickets,
      status: dbMatch.status === "active" ? "live" : dbMatch.status === "completed" ? "closed" : "coming",
    }
  })

  // Carousel & Filtering State
  const [contestFilter, setContestFilter] = useState<"all" | "live" | "coming" | "closed">("all")
  const [activeContestIndex, setActiveContestIndex] = useState<number>(0)
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)

  // Filtered contests
  const filteredContests = ALL_CONTESTS.filter((c) => {
    if (contestFilter === "all") return true
    return c.status === contestFilter
  })

  // Safe active contest index within filtered array
  const safeIndex = Math.min(activeContestIndex, Math.max(0, filteredContests.length - 1))
  const currentContest = filteredContests[safeIndex] || ALL_CONTESTS[0]

  // Left peek contest and Right peek contest (cyclic)
  const leftContest = filteredContests[(safeIndex - 1 + filteredContests.length) % filteredContests.length]
  const rightContest = filteredContests[(safeIndex + 1) % filteredContests.length]

  // Handle switching contests
  const handlePrevContest = () => {
    setActiveContestIndex((prev) => (prev > 0 ? prev - 1 : filteredContests.length - 1))
    setActiveImageIndex(0)
  }

  const handleNextContest = () => {
    setActiveContestIndex((prev) => (prev < filteredContests.length - 1 ? prev + 1 : 0))
    setActiveImageIndex(0)
  }

  // Handle filter tab click
  const handleFilterChange = (filter: "all" | "live" | "coming" | "closed") => {
    setContestFilter(filter)
    setActiveContestIndex(0)
    setActiveImageIndex(0)
  }

  // Dynamic economics from adminSettings & active contest
  const unitPrice = currentContest.ticketPrice || contest.ticketPrice || adminSettings?.ticketPrice || 1000
  const creditRewardPercent = adminSettings?.creditRewardPercent ?? 25
  const cashCommissionPercent = adminSettings?.cashCommissionPercent ?? 25
  const cashUnlockThreshold = adminSettings?.cashUnlockThreshold ?? 20
  const platformTicketPrice = adminSettings?.ticketPrice ?? unitPrice
  const driveRewardPerTicket = Math.round(platformTicketPrice * (creditRewardPercent / 100))
  const refCode = referralProfile?.referralCode || session.phone?.slice(-4) || "4021"
  const productionBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://win.turboridesupercars.com"
  const referralLinkUrl = `${activeOrigin && !activeOrigin.includes("localhost") ? activeOrigin : productionBaseUrl}/r/${refCode}`

  // 1. Buy Tickets Handler
  const handleBuyTickets = async (countToBuy?: number) => {
    const qty = countToBuy || ticketBuyCount
    if (qty < 1) return

    setBuying(true)
    setBuyMsg(null)
    try {
      const res = await buyContestTicketsAction({
        contestId: currentContest.id || contest.id,
        ticketCount: qty,
        userEmail: session.email,
        userPhone: session.phone,
        userName: session.name,
      })

      if (!res.ok) {
        setBuyMsg({ type: "error", text: res.error || "Purchase failed. Please try again." })
        setBuying(false)
        return
      }

      setCredits((prev) => prev + qty * unitPrice)
      setTicketStats((prev) => ({
        ...prev,
        totalBought: prev.totalBought + qty,
        availableToAssign: prev.availableToAssign + qty,
      }))

      setBuyMsg({
        type: "success",
        text: `Success! Added ${qty} ticket${qty > 1 ? "s" : ""} & ${(qty * unitPrice).toLocaleString("en-IN")} permanent Drive Credits to your garage.`,
      })

      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } })
      } catch {}

      router.refresh()
    } catch {
      setBuyMsg({ type: "error", text: "Network error. Please try again." })
    } finally {
      setBuying(false)
    }
  }

  // 2. Assign Manual 5-Digit Number Handler
  const handleAssignManualNumber = async () => {
    const clean = customNumber.trim()
    if (!/^\d{5}$/.test(clean)) {
      setAssignMsg({ type: "error", text: "Please enter a valid 5-digit lucky number (00000 - 99999)." })
      return
    }

    if (ticketStats.availableToAssign <= 0) {
      setAssignMsg({ type: "error", text: "No entries left to assign. Buy tickets above to pick more lucky numbers." })
      return
    }

    setAssigning(true)
    setAssignMsg(null)
    try {
      const res = await assignTicketNumberAction({
        contestId: contest.id,
        ticketNumber: clean,
        userEmail: session.email,
        userPhone: session.phone,
        userName: session.name,
      })

      if (!res.ok) {
        setAssignMsg({ type: "error", text: res.error || "Could not assign ticket number." })
        setAssigning(false)
        return
      }

      const newTicket: ContestTicket = {
        id: res.ticketId || `TKT-${Date.now()}-${clean}`,
        contestId: contest.id,
        userPhone: session.phone,
        userEmail: session.email,
        userName: session.name,
        ticketNumber: clean,
        orderId: undefined,
        createdAt: new Date().toISOString(),
        carName: contest.carName || "Porsche 718 Cayman",
        contestTitle: contest.title || "PORSCHE 718 CAYMAN",
        contestStatus: "active",
      }

      setTicketStats((prev) => ({
        ...prev,
        totalAssigned: prev.totalAssigned + 1,
        availableToAssign: Math.max(0, prev.availableToAssign - 1),
        tickets: [newTicket, ...prev.tickets],
      }))

      setAssignMsg({ type: "success", text: `Confirmed! Lucky Ticket #${clean} is officially registered into the Porsche 718 Cayman draw.` })
      setCustomNumber("")

      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.55 } })
      } catch {}

      router.refresh()
    } catch {
      setAssignMsg({ type: "error", text: "Failed to connect to database." })
    } finally {
      setAssigning(false)
    }
  }

  // 3. Auto-Pick 1 Lucky Number
  const handleAutoPickOne = async () => {
    if (ticketStats.availableToAssign <= 0) {
      setAssignMsg({ type: "error", text: "No entries left to assign. Buy tickets above to pick more numbers." })
      return
    }

    setAssigning(true)
    setAssignMsg(null)
    try {
      const res = await autoPickTicketNumberAction({
        contestId: contest.id,
        userEmail: session.email,
        userPhone: session.phone,
        userName: session.name,
      })

      if (!res.ok || !res.ticketNumber) {
        setAssignMsg({ type: "error", text: res.error || "Could not auto-generate lucky number." })
        setAssigning(false)
        return
      }

      const pickedNum = res.ticketNumber
      const newTicket: ContestTicket = {
        id: `TKT-${Date.now()}-${pickedNum}`,
        contestId: contest.id,
        userPhone: session.phone,
        userEmail: session.email,
        userName: session.name,
        ticketNumber: pickedNum,
        orderId: undefined,
        createdAt: new Date().toISOString(),
        carName: contest.carName || "Porsche 718 Cayman",
        contestTitle: contest.title || "PORSCHE 718 CAYMAN",
        contestStatus: "active",
      }

      setTicketStats((prev) => ({
        ...prev,
        totalAssigned: prev.totalAssigned + 1,
        availableToAssign: Math.max(0, prev.availableToAssign - 1),
        tickets: [newTicket, ...prev.tickets],
      }))

      setAssignMsg({ type: "success", text: `Auto-picked lucky ticket #${pickedNum} for you!` })

      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.55 } })
      } catch {}

      router.refresh()
    } catch {
      setAssignMsg({ type: "error", text: "Failed to connect to server." })
    } finally {
      setAssigning(false)
    }
  }

  // 4. Auto-Pick ALL Available Lucky Numbers
  const handleAutoPickAll = async () => {
    const toPick = ticketStats.availableToAssign
    if (toPick <= 0) {
      setAssignMsg({ type: "error", text: "No entries left to assign. Buy tickets above to pick more numbers." })
      return
    }

    setAssigning(true)
    setAssignMsg(null)
    try {
      let count = 0
      const newTickets: ContestTicket[] = []
      for (let i = 0; i < toPick; i++) {
        const res = await autoPickTicketNumberAction({
          contestId: contest.id,
          userEmail: session.email,
          userPhone: session.phone,
          userName: session.name,
        })
        if (res.ok && res.ticketNumber) {
          count++
          newTickets.push({
            id: `TKT-${Date.now()}-${res.ticketNumber}-${i}`,
            contestId: contest.id,
            userPhone: session.phone,
            userEmail: session.email,
            userName: session.name,
            ticketNumber: res.ticketNumber,
            orderId: undefined,
            createdAt: new Date().toISOString(),
            carName: contest.carName || "Porsche 718 Cayman",
            contestTitle: contest.title || "PORSCHE 718 CAYMAN",
            contestStatus: "active",
          })
        }
      }

      setTicketStats((prev) => ({
        ...prev,
        totalAssigned: prev.totalAssigned + count,
        availableToAssign: Math.max(0, prev.availableToAssign - count),
        tickets: [...newTickets, ...prev.tickets],
      }))

      setAssignMsg({ type: "success", text: `Success! Auto-picked all ${count} lucky ticket numbers for the Porsche draw!` })

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.55 } })
      } catch {}

      router.refresh()
    } catch {
      setAssignMsg({ type: "error", text: "Error during auto-allocation." })
    } finally {
      setAssigning(false)
    }
  }

  // 5. Copy Referral Link Handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLinkUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  // 6. Simulate Referral Handler
  const handleSimulateReferral = async () => {
    if (!referralProfile?.referralCode) {
      setSimMsg({ type: "error", text: "Referral program not initialized for this account." })
      return
    }

    setSimulating(true)
    setSimMsg(null)
    try {
      const res = await simulateReferralAction({
        referralCode: referralProfile.referralCode,
        friendName: friendName.trim() || "Dave",
        ticketCount: simTickets,
        referrerEmail: session.email,
      })

      if (!res.ok) {
        setSimMsg({ type: "error", text: res.error || "Simulation failed." })
        setSimulating(false)
        return
      }

      setReferralProfile((prev) =>
        prev
          ? {
              ...prev,
              totalCreditsEarned: prev.totalCreditsEarned + (res.creditsAdded || 0),
              totalCashEarned: prev.totalCashEarned + (res.cashAdded || 0),
              totalReferredUsers: prev.totalReferredUsers + 1,
            }
          : null
      )

      if (res.creditsAdded) {
        setCredits((prev) => prev + res.creditsAdded!)
      }

      if (res.newReferral) {
        setReferrals((prev) => [res.newReferral!, ...prev])
        setShowReferralsList(true)
      }

      const friendLabel = friendName.trim() || "Dave"
      const creditsGained = res.creditsAdded || simTickets * driveRewardPerTicket
      const cashGained = res.cashAdded || 0

      setSimMsg({
        type: "success",
        text: `Simulated! ${friendLabel} bought ${simTickets} ticket(s) → You earned ${creditsGained.toLocaleString("en-IN")} Drive Credits${cashGained > 0 ? ` + ₹${cashGained.toLocaleString("en-IN")} cash commission` : ""}!`,
      })

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } })
      } catch {}

      setFriendName("")
      setSimTickets(1)
      router.refresh()
    } catch {
      setSimMsg({ type: "error", text: "Simulation request failed." })
    } finally {
      setSimulating(false)
    }
  }

  // 7. Cancel Active Escrow Voucher
  const handleCancelVoucher = async (voucherId: string) => {
    setCancellingVoucherId(voucherId)
    setVoucherMsg(null)
    try {
      const res = await cancelRedemptionAction({
        redemptionId: voucherId,
        userEmail: session.email,
        userPhone: session.phone,
      })
      if (!res.ok) {
        setVoucherMsg({ type: "error", text: res.error || "Could not cancel voucher." })
        setCancellingVoucherId(null)
        return
      }

      const returned = res.creditsRestored || 0
      setCredits((prev) => prev + returned)
      setVouchers((prev) => prev.filter((v) => v.id !== voucherId))
      setVoucherMsg({
        type: "success",
        text: `Voucher cancelled! ${returned.toLocaleString("en-IN")} Drive Credits restored to your garage balance.`,
      })
      router.refresh()
    } catch {
      setVoucherMsg({ type: "error", text: "Failed to cancel voucher." })
    } finally {
      setCancellingVoucherId(null)
    }
  }

  // Quick preset pills for ticket purchase
  const PRESET_PILLS = [1, 5, 10, 25, 50]

  // Progress metrics for center live contest
  const progressPercent = Math.min(
    100,
    Math.round(((currentContest.soldTickets || 0) / (currentContest.targetTickets || 10000)) * 100)
  )

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b] flex flex-col antialiased">
      {/* 1. Sleek Navigation Header */}
      <MembersHeader
        userName={session.name}
        userEmail={session.email}
        userPhone={session.phone}
        credits={credits}
        onLogout={logoutMember}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">

          {/* Active Escrow Vouchers Banner (if any) */}
          {vouchers.length > 0 && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wide">
                  <Sparkles className="size-4 text-[#ea580c]" />
                  Active Track Pass Vouchers · Reserved in Escrow
                </div>
                <span className="text-xs text-zinc-500 font-medium">Self-service refund available</span>
              </div>

              {voucherMsg && (
                <div className={`p-3 rounded-lg text-xs font-semibold ${
                  voucherMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}>
                  {voucherMsg.text}
                </div>
              )}

              <div className="space-y-3">
                {vouchers.map((v) => (
                  <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs">
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{v.rewardTitle}</p>
                      <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                        Code: <span className="font-bold text-[#ea580c]">{v.code}</span> · {v.creditsSpent.toLocaleString("en-IN")} Credits
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={v.bookingUrl || `https://book.turboridesupercars.com/checkout?voucher=${v.code}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Complete Booking →
                      </a>
                      <button
                        type="button"
                        disabled={cancellingVoucherId === v.id}
                        onClick={() => handleCancelVoucher(v.id)}
                        className="px-3.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-600 transition-colors cursor-pointer"
                      >
                        {cancellingVoucherId === v.id ? "Restoring..." : "Cancel & Restore Credits"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. HOW IT WORKS / YOUR 3-STEP JOURNEY */}
          <section aria-labelledby="member-journey-title" className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ea580c]">How it works</p>
              <h2 id="member-journey-title" className="mt-1 font-display text-2xl font-black uppercase sm:text-3xl text-zinc-950 tracking-tight">
                Your 3-step journey
              </h2>
            </div>
            
            <ol className="grid gap-3.5 md:grid-cols-3">
              {/* Step 01 */}
              <li className="relative flex min-w-0 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-sm font-bold tracking-widest text-[#ea580c]">STEP 01</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-[#ea580c]">
                      <Ticket className="size-4" />
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-display text-base sm:text-lg font-bold text-zinc-900">Buy tickets</h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-600">
                    Buy tickets for ₹1,000 each. 100% of your capital is credited back to your garage for track drives.
                  </p>
                </div>
                <span className="absolute -bottom-3 left-1/2 z-10 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 shadow-xs">
                  <ArrowDown className="size-3 md:hidden" />
                  <ArrowRight className="hidden size-3 md:block" />
                </span>
              </li>

              {/* Step 02 */}
              <li className="relative flex min-w-0 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-sm font-bold tracking-widest text-[#ea580c]">STEP 02</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-[#ea580c]">
                      <Trophy className="size-4" />
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-display text-base sm:text-lg font-bold text-zinc-900">Enter a contest</h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-600">
                    Choose a car, pick your 5-digit lucky number to enter its draw. Add more entries for more chances.
                  </p>
                </div>
                <span className="absolute -bottom-3 left-1/2 z-10 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 shadow-xs">
                  <ArrowDown className="size-3 md:hidden" />
                  <ArrowRight className="hidden size-3 md:block" />
                </span>
              </li>

              {/* Step 03 */}
              <li className="relative flex min-w-0 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-sm font-bold tracking-widest text-[#ea580c]">STEP 03</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-[#ea580c]">
                      <Gift className="size-4" />
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-display text-base sm:text-lg font-bold text-zinc-900">Refer or redeem</h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-600">
                    Refer friends to earn drive credits & 25% cash. Spend credits on supercar driving experiences at BIC.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* 3. THREE STAT CARDS IN A ROW */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-zinc-500">
                <Ticket className="size-4 text-[#ea580c]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Tickets purchased</span>
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-zinc-950 tabular-nums">
                {ticketStats.totalBought}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">Total tickets purchased</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-zinc-500">
                <Trophy className="size-4 text-[#ea580c]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Contest entries</span>
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-zinc-950 tabular-nums">
                {ticketStats.totalAssigned}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {ticketStats.availableToAssign > 0 
                  ? `${ticketStats.availableToAssign} ready to allocate`
                  : "All numbers assigned"}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-orange-950">
                <Coins className="size-4 text-[#ea580c]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Drive credits</span>
              </div>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-black text-[#ea580c] tabular-nums">
                {credits.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] text-orange-900/80 font-medium">100% capital redeemable on track</p>
            </div>
          </div>

          {/* 4. BUY TICKETS SECTION (DYNAMIC COUNTER + QUICK PILLS) */}
          <section id="ticket-selector" className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 space-y-5 shadow-xs scroll-mt-24">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-zinc-950">
                  Buy tickets
                </h2>
                {currentContest.status === "live" ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#ea580c] uppercase tracking-wide">
                    Live Draw: {currentContest.carName}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-600 uppercase tracking-wide">
                    {currentContest.statusBadge || "Upcoming"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-600">
                Tickets cost ₹{unitPrice.toLocaleString("en-IN")} each for {currentContest.carName}. Every ticket gives you 1 contest entry and {unitPrice.toLocaleString("en-IN")} Drive Credits.
              </p>
            </div>

            {buyMsg && (
              <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                buyMsg.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}>
                {buyMsg.type === "success" ? <CheckCircle2 className="size-4 shrink-0 text-emerald-600" /> : <AlertCircle className="size-4 shrink-0 text-rose-600" />}
                <span>{buyMsg.text}</span>
              </div>
            )}

            {/* Quick Count Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_PILLS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTicketBuyCount(n)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    ticketBuyCount === n
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700"
                  }`}
                >
                  +{n} {n === 1 ? "ticket" : "tickets"}
                </button>
              ))}
            </div>

            {/* Stepper Control */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTicketBuyCount((prev) => Math.max(1, prev - 1))}
                className="size-10 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center font-bold text-lg text-zinc-800 cursor-pointer transition-colors shadow-2xs"
                aria-label="Decrease ticket count"
              >
                -
              </button>
              <div className="h-10 w-24 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center font-bold text-base text-zinc-950 font-mono">
                {ticketBuyCount}
              </div>
              <button
                type="button"
                onClick={() => setTicketBuyCount((prev) => prev + 1)}
                className="size-10 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center font-bold text-lg text-zinc-800 cursor-pointer transition-colors shadow-2xs"
                aria-label="Increase ticket count"
              >
                +
              </button>
            </div>

            {/* Calculation Row */}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
              <div>
                <span className="text-xs text-zinc-500 block uppercase font-medium">You pay</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-zinc-950">
                  ₹{(ticketBuyCount * unitPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-500 block uppercase font-medium">You get</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#ea580c]">
                  {(ticketBuyCount * unitPrice).toLocaleString("en-IN")} credits
                </span>
              </div>
            </div>

            {/* Buy Action Button */}
            <button
              type="button"
              disabled={buying}
              onClick={() => handleBuyTickets()}
              className="w-full py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Ticket className="size-4" />
              <span>{buying ? "Processing..." : `Buy ${ticketBuyCount} ticket${ticketBuyCount > 1 ? "s" : ""} (₹${(ticketBuyCount * unitPrice).toLocaleString("en-IN")})`}</span>
            </button>
          </section>

          {/* 5. YOUR CONTEST CAROUSEL (3-STAGE PEEK + SPECS + ALLOCATOR) */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 space-y-6 shadow-xs">
            {/* Header + Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-zinc-950">
                  Your Contest
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Browse live, upcoming, and completed car contests.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    contestFilter === "all" 
                      ? "bg-zinc-950 text-white" 
                      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  All contests {ALL_CONTESTS.length}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange("live")}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    contestFilter === "live" 
                      ? "bg-[#ea580c] text-white" 
                      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Live {ALL_CONTESTS.filter(c => c.status === "live").length}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange("coming")}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    contestFilter === "coming" 
                      ? "bg-amber-600 text-white" 
                      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Coming soon {ALL_CONTESTS.filter(c => c.status === "coming").length}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange("closed")}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    contestFilter === "closed" 
                      ? "bg-zinc-700 text-white" 
                      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Closed {ALL_CONTESTS.filter(c => c.status === "closed").length}
                </button>
              </div>
            </div>

            {/* Carousel Stepper Bar */}
            <div className="flex items-center justify-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>CONTEST {safeIndex + 1} OF {filteredContests.length}</span>
              <button 
                type="button"
                onClick={handlePrevContest}
                className="size-7 rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-100 text-zinc-700 cursor-pointer transition-colors shadow-2xs"
                aria-label="Previous contest"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button 
                type="button"
                onClick={handleNextContest}
                className="size-7 rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-100 text-zinc-700 cursor-pointer transition-colors shadow-2xs"
                aria-label="Next contest"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Triple Vehicle Carousel Stage (Peek Left & Right) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-hidden py-1">
              {/* Left Peek Car */}
              <button
                type="button"
                onClick={handlePrevContest}
                className="hidden sm:block w-36 md:w-48 aspect-[16/10] rounded-2xl overflow-hidden opacity-50 hover:opacity-80 transition-opacity border border-zinc-200 shrink-0 scale-95 shadow-xs cursor-pointer bg-zinc-100"
                title={`View ${leftContest.carName}`}
              >
                <img
                  src={leftContest.images[0]?.src || "/cars/car-718.png"}
                  alt={leftContest.carName}
                  className="size-full object-cover"
                />
              </button>

              {/* Center HERO Stage */}
              <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl border-2 border-[#ea580c] overflow-hidden bg-white shadow-md relative">
                {/* Header inside Center Card */}
                <div className="py-2.5 px-4 text-center border-b border-zinc-100 bg-white flex items-center justify-center gap-2">
                  <h3 className="font-display font-bold text-sm sm:text-base md:text-lg text-zinc-950 inline-flex items-center gap-2 flex-wrap justify-center">
                    <span>Win a {currentContest.carName} worth {currentContest.worthDisplay}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      currentContest.status === "live"
                        ? "bg-[#ea580c] text-white animate-pulse"
                        : currentContest.status === "coming"
                        ? "bg-amber-500 text-white"
                        : "bg-zinc-700 text-white"
                    }`}>
                      {currentContest.statusBadge}
                    </span>
                  </h3>
                </div>

                {/* Main Featured Photo */}
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-gradient-to-b from-zinc-50 to-zinc-100/60 flex items-center justify-center p-4">
                  <img
                    src={currentContest.images[activeImageIndex]?.src || currentContest.images[0]?.src || "/images/porsche-yellow.png"}
                    alt={currentContest.carName}
                    className="max-h-full max-w-full object-contain transition-all duration-300 drop-shadow-md"
                  />
                </div>
              </div>

              {/* Right Peek Car */}
              <button
                type="button"
                onClick={handleNextContest}
                className="hidden sm:block w-36 md:w-48 aspect-[16/10] rounded-2xl overflow-hidden opacity-50 hover:opacity-80 transition-opacity border border-zinc-200 shrink-0 scale-95 shadow-xs cursor-pointer bg-zinc-100"
                title={`View ${rightContest.carName}`}
              >
                <img
                  src={rightContest.images[0]?.src || "/cars/car-huracan.png"}
                  alt={rightContest.carName}
                  className="size-full object-cover"
                />
              </button>
            </div>

            {/* Thumbnail Selector Strip + Video Button */}
            <div className="flex items-center justify-center gap-2 pt-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentContest.images.length - 1))}
                className="size-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-100 text-zinc-600 cursor-pointer shadow-2xs"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              {currentContest.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative size-12 sm:size-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-zinc-50 p-1 flex items-center justify-center ${
                    activeImageIndex === idx ? "border-[#ea580c] ring-2 ring-orange-200 scale-105" : "border-zinc-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.src} alt={img.label} className="size-full object-contain" />
                </button>
              ))}

              {/* Video Thumbnail Button */}
              {currentContest.videoSrc && (
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="relative size-12 sm:size-14 rounded-xl overflow-hidden border-2 border-zinc-300 bg-zinc-950 text-white flex flex-col items-center justify-center hover:border-orange-500 hover:scale-105 transition-all cursor-pointer shadow-xs group"
                  title="Watch Supercar Track Footage"
                >
                  <Play className="size-4 text-orange-400 group-hover:scale-110 transition-transform fill-orange-400" />
                  <span className="text-[9px] font-bold tracking-wider uppercase text-zinc-300 mt-0.5">Video</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev < currentContest.images.length - 1 ? prev + 1 : 0))}
                className="size-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-100 text-zinc-600 cursor-pointer shadow-2xs"
                aria-label="Next image"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>

            {/* Video Modal Player */}
            {videoModalOpen && currentContest.videoSrc && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="relative w-full max-w-3xl bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Play className="size-3.5 text-orange-400 fill-orange-400" />
                      {currentContest.carName} Track Teaser
                    </span>
                    <button
                      type="button"
                      onClick={() => setVideoModalOpen(false)}
                      className="size-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="aspect-video w-full bg-black">
                    <video
                      src={currentContest.videoSrc}
                      controls
                      autoPlay
                      className="size-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Specs Bento Box (6 Clean Boxes) */}
            <div className="border-t border-zinc-100 pt-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display font-bold text-base sm:text-lg md:text-xl text-zinc-950 uppercase tracking-tight truncate">
                  {currentContest.carName} · {currentContest.worthDisplay}
                </h4>
                <span className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-100 text-[#ea580c]">
                  {currentContest.status === "live" ? "LIVE" : currentContest.statusBadge}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {currentContest.specs.map((s, idx) => (
                  <div key={idx} className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      {s.label}
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-zinc-950 mt-0.5 block">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ticket Sales Progress Bar */}
              <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-700 font-medium">{currentContest.carName} ticket sales progress</span>
                    {currentContest.status === "live" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-[#ea580c]">LIVE</span>
                    )}
                    {currentContest.status === "coming" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-200 text-zinc-600">UPCOMING</span>
                    )}
                    {currentContest.status === "closed" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-200">CONCLUDED</span>
                    )}
                  </div>
                  <span className="font-mono text-[#ea580c] font-black">{progressPercent}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-zinc-200 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500"
                    style={{ width: `${Math.max(1, Math.min(100, progressPercent))}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 font-mono text-right">
                  {(currentContest.soldTickets || 0).toLocaleString("en-IN")} of {(currentContest.targetTickets || 10000).toLocaleString("en-IN")} tickets claimed
                </p>
              </div>
            </div>

            {/* Ticket Allocator: 5-Digit Number Entry & Auto-Pick */}
            <div className="border-t border-zinc-100 pt-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-zinc-950 uppercase">
                    Allocate Lucky Numbers
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Pick your 5-digit lucky ticket numbers (00000 - 99999) for the {currentContest.carName} draw.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#ea580c] text-xs font-bold shrink-0 self-start sm:self-auto">
                  <Zap className="size-3.5" />
                  <span>{ticketStats.availableToAssign} entries available</span>
                </div>
              </div>

              {assignMsg && (
                <div className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                  assignMsg.type === "success" 
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}>
                  {assignMsg.type === "success" ? <CheckCircle2 className="size-4 shrink-0 text-emerald-600" /> : <AlertCircle className="size-4 shrink-0 text-rose-600" />}
                  <span>{assignMsg.text}</span>
                </div>
              )}

              {/* Conditional Display: Empty States vs Active Form */}
              {currentContest.status === "coming" ? (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 p-5 text-center space-y-2">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-zinc-200 text-zinc-700 uppercase tracking-wider">
                    Draw Launches Soon
                  </span>
                  <p className="text-xs text-zinc-600">
                    Lucky number allocation for the {currentContest.carName} will open once official ticket sales go live.
                  </p>
                </div>
              ) : currentContest.status === "closed" ? (
                <div className="rounded-xl border border-zinc-200 bg-zinc-100/70 p-5 text-center space-y-2">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-zinc-800 text-zinc-200 uppercase tracking-wider">
                    Contest Concluded
                  </span>
                  <p className="text-xs text-zinc-600">
                    This contest draw has concluded and lucky ticket entries are permanently locked.
                  </p>
                </div>
              ) : ticketStats.availableToAssign <= 0 ? (
                ticketStats.totalBought === 0 ? (
                  <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/40 p-5 sm:p-6 text-center space-y-3">
                    <div className="size-10 mx-auto rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c]">
                      <Ticket className="size-5" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h5 className="font-display font-bold text-sm text-zinc-950 uppercase">
                        No Entries to Allocate Yet
                      </h5>
                      <p className="text-xs text-zinc-600">
                        Purchase tickets above to pick your custom 5-digit lucky numbers (00000 - 99999) or use 1-click Auto-Pick.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("ticket-selector")
                        if (el) el.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      <Ticket className="size-3.5" />
                      <span>Select Tickets Above (₹{unitPrice.toLocaleString("en-IN")})</span>
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <div>
                        <h5 className="font-display font-bold text-xs sm:text-sm text-emerald-950 uppercase">
                          All {ticketStats.totalAssigned} Lucky Numbers Allocated! 🎉
                        </h5>
                        <p className="text-xs text-emerald-700">
                          Every ticket entry you own is officially registered in the {currentContest.carName} draw.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("ticket-selector")
                        if (el) el.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                    >
                      <Ticket className="size-3.5" />
                      <span>Buy More Tickets</span>
                    </button>
                  </div>
                )
              ) : (
                /* Active Lucky Number Input & Auto-Pick */
                <>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="Enter 5-digit number e.g. 74829"
                        value={customNumber}
                        onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-white font-mono text-sm tracking-wider text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                      />
                      {customNumber.length === 5 && (
                        <span className="absolute right-3 top-3 text-emerald-600">
                          <Check className="size-4" />
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={assigning || customNumber.length !== 5 || ticketStats.availableToAssign <= 0}
                      onClick={handleAssignManualNumber}
                      className="h-11 px-6 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                    >
                      {assigning ? "Registering..." : "Confirm Number"}
                    </button>
                  </div>

                  {/* Auto-Pick Helper Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={assigning || ticketStats.availableToAssign <= 0}
                      onClick={handleAutoPickOne}
                      className="h-10 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <Sparkles className="size-3.5 text-[#ea580c]" />
                      <span>Auto-pick 1 number</span>
                    </button>

                    {ticketStats.availableToAssign > 1 && (
                      <button
                        type="button"
                        disabled={assigning}
                        onClick={handleAutoPickAll}
                        className="h-10 px-4 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-xs font-bold text-orange-950 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <Zap className="size-3.5 text-[#ea580c]" />
                        <span>Auto-pick ALL ({ticketStats.availableToAssign}) numbers</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Assigned Tickets List */}
              {ticketStats.tickets.length > 0 && (
                <div className="pt-3 border-t border-zinc-100 space-y-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Your Assigned Lucky Tickets ({ticketStats.tickets.length})
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                    {ticketStats.tickets.map((t) => (
                      <div
                        key={t.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono font-bold text-zinc-900 shadow-2xs"
                      >
                        <Ticket className="size-3 text-[#ea580c]" />
                        <span>#{t.ticketNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 6. REFER & EARN (DYNAMIC COMMISSION + DRIVE CREDITS) */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            {/* Header + Unlock Alert */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                  Partner Program
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md shrink-0">
                  <Lock className="size-3 text-zinc-500" />
                  {(referralProfile?.isCashUnlocked || ticketStats.totalBought >= cashUnlockThreshold)
                    ? `${cashCommissionPercent}% Cash Commission Active`
                    : `Unlock ${cashCommissionPercent}% Cash: ${cashUnlockThreshold} Tickets`}
                </span>
              </div>
              <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950">
                Refer & earn
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                Earn {driveRewardPerTicket.toLocaleString("en-IN")} Drive Credits per ticket bought by friends. Unlock {cashCommissionPercent}% direct cash commission once you hold {cashUnlockThreshold} tickets.
              </p>
            </div>

            {/* Referrals Stats Banner */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
                <span className="text-xs text-zinc-500 font-medium block">Drive credits earned</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-[#ea580c] tabular-nums mt-1 block">
                  {(referralProfile?.totalCreditsEarned || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
                <span className="text-xs text-zinc-500 font-medium block">Cash commission</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-zinc-950 tabular-nums mt-1 block">
                  ₹{(referralProfile?.totalCashEarned || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Copy Link Row - Beautiful integrated container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                  Your referral link
                </label>
                <span className="text-[11px] text-zinc-500 font-medium">
                  Your code: <strong className="font-mono font-bold text-zinc-900 px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200">{refCode}</strong>
                </span>
              </div>

              {/* Integrated Single-Card Copy Container */}
              <div className="relative flex items-center w-full min-h-[48px] rounded-xl border border-zinc-200 bg-zinc-50/90 p-1.5 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/20 transition-all shadow-2xs">
                <div className="pl-3 pr-2 text-zinc-400 shrink-0">
                  <Link2 className="size-4 text-[#ea580c]" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={referralLinkUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-transparent font-mono text-xs sm:text-sm text-zinc-900 font-semibold focus:outline-none select-all truncate pr-2 tracking-tight"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="shrink-0 h-9 px-4 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5 text-zinc-300" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                <span>Share this link with friends to earn Drive Credits & cash commissions</span>
                {copiedLink && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    Copied to clipboard
                  </span>
                )}
              </div>
            </div>

            {/* Referral Simulator (Interactive Demo) */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  Simulate a referral (live demo)
                </span>
                <span className="text-[11px] text-zinc-500 hidden sm:inline">
                  Interactive calculator
                </span>
              </div>

              {simMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  simMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}>
                  {simMsg.text}
                </div>
              )}

              {/* Responsive Inputs Grid with balanced padding and heights */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-end">
                {/* Friend Name */}
                <div className="sm:col-span-6 space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Friend&apos;s name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dave"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                  />
                </div>

                {/* Tickets Bought & Button in side-by-side columns on mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-6 sm:col-span-6 gap-2.5 sm:gap-3 items-end">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                      Tickets bought
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={simTickets}
                      onChange={(e) => setSimTickets(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-11 px-3 rounded-xl border border-zinc-200 bg-white font-mono text-center text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      disabled={simulating}
                      onClick={handleSimulateReferral}
                      className="w-full h-11 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {simulating ? "Adding..." : "Add referral"}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-500">
                {simTickets} × ₹{platformTicketPrice.toLocaleString("en-IN")} → you earn{" "}
                <span className="font-bold text-[#ea580c]">
                  {(simTickets * driveRewardPerTicket).toLocaleString("en-IN")} credits
                </span>{" "}
                ({creditRewardPercent}% power)
                {(referralProfile?.isCashUnlocked || ticketStats.totalBought >= cashUnlockThreshold) && (
                  <span className="font-bold text-emerald-600 ml-1">
                    + ₹{(simTickets * Math.round(platformTicketPrice * (cashCommissionPercent / 100))).toLocaleString("en-IN")} cash
                  </span>
                )}
              </p>
            </div>

            {/* Expandable Referrals List */}
            <div>
              <button
                type="button"
                onClick={() => setShowReferralsList((prev) => !prev)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-zinc-700 hover:text-zinc-950 cursor-pointer border-t border-zinc-100 pt-3"
              >
                <span className="flex items-center gap-2">
                  <Users className="size-4 text-zinc-400" />
                  Your referrals ({referrals.length})
                </span>
                {showReferralsList ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {showReferralsList && (
                <div className="pt-2 space-y-2">
                  {referrals.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-3 text-center bg-zinc-50 rounded-lg">
                      No referrals registered yet. Share your link above to start earning!
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {referrals.map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-xs">
                          <span className="font-bold text-zinc-900">{r.userName || "Friend"}</span>
                          <span className="font-mono text-zinc-600">
                            {r.ticketCount} ticket(s) · <span className="font-bold text-[#ea580c]">+{r.creditsEarned} Credits</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Admin console link (subtle) */}
          <div className="text-center pt-2 pb-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <Lock className="size-3" />
              <span>Admin console</span>
            </Link>
          </div>

        </div>
      </main>

      {/* 8. Bottom Footer (Matching TurboRide Brand Identity) */}
      <footer className="border-t border-zinc-200 bg-white text-xs text-zinc-500 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm text-zinc-950 uppercase">
              WINMY<span className="text-[#ea580c]">PORSCHE</span>
            </span>
            <span className="text-zinc-300">·</span>
            <span>TurboRide Supercar Club Pvt Ltd</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-zinc-600">
            <Link href="/" className="hover:text-zinc-950 transition-colors">
              Home
            </Link>
            <Link href="/draw-regulations" className="hover:text-zinc-950 transition-colors">
              Regulations
            </Link>
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/members/support" className="hover:text-zinc-950 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
