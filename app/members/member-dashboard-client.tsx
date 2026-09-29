"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import {
  Ticket,
  Copy,
  Check,
  SignOut,
  Gift,
  Lock,
  LinkSimple,
  Wallet,
  Shuffle,
  ShieldCheck,
  LockKey,
  Users,
  Sparkle,
  ShareNetwork,
  Trophy,
  Lightning,
  MagnifyingGlass,
  CheckCircle,
  CaretLeft,
  CaretRight,
  ArrowRight,
  ArrowCounterClockwise,
} from "@phosphor-icons/react"
import { logoutMember } from "@/lib/auth"
import {
  buyContestTicketsAction,
  assignTicketNumberAction,
  autoPickTicketNumberAction,
  simulateReferralAction,
} from "@/lib/credits"
import { redeemRewardAction, cancelRedemptionAction } from "@/lib/rewards"
import { REWARDS_CATALOG } from "@/lib/catalog"
import type { MemberSession, Contest, ContestTicket, ReferralProfile, ReferralRecord, RewardItem, ActiveVoucher } from "@/lib/types"

interface DashboardProps {
  session: MemberSession
  credits: number
  contest: Contest
  ticketStats: {
    totalBought: number
    totalAssigned: number
    availableToAssign: number
    tickets: ContestTicket[]
  }
  referralProfile: ReferralProfile | null
  initialReferrals: ReferralRecord[]
  initialVouchers?: ActiveVoucher[]
}

export function MemberDashboardClient({
  session,
  credits: initialCredits,
  contest,
  ticketStats: initialTicketStats,
  referralProfile: initialReferralProfile,
  initialReferrals,
  initialVouchers = [],
}: DashboardProps) {
  const router = useRouter()

  // Reactive State for Live Dashboard Feedback
  const [credits, setCredits] = useState<number>(initialCredits)
  const [ticketStats, setTicketStats] = useState({
    totalBought: initialTicketStats.totalBought,
    totalAssigned: initialTicketStats.totalAssigned,
    availableToAssign: initialTicketStats.availableToAssign,
    tickets: initialTicketStats.tickets,
  })
  const [referralProfile, setReferralProfile] = useState<ReferralProfile | null>(initialReferralProfile)
  const [referrals, setReferrals] = useState<ReferralRecord[]>(initialReferrals)

  // Buy Tickets State
  const [ticketBuyCount, setTicketBuyCount] = useState<number>(1)
  const [buying, setBuying] = useState(false)
  const [buyMsg, setBuyMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // 5-Digit Number Assignment State
  const [customNumber, setCustomNumber] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [assignMsg, setAssignMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [searchTicketQuery, setSearchTicketQuery] = useState("")
  const [copiedTicketNum, setCopiedTicketNum] = useState<string | null>(null)
  const [ticketFilter, setTicketFilter] = useState<"all" | "active" | "past">("active")
  const [ticketPage, setTicketPage] = useState(1)
  const [ticketPageSize, setTicketPageSize] = useState(12)

  // Referral Simulation State
  const [copied, setCopied] = useState(false)
  const [friendName, setFriendName] = useState("")
  const [simTickets, setSimTickets] = useState(1)
  const [simulating, setSimulating] = useState(false)
  const [simMsg, setSimMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Selected Car Drop State
  const [activeCarTab, setActiveCarTab] = useState<"porsche" | "cyberster" | "mustang">("porsche")
  const [tabNotice, setTabNotice] = useState<string | null>(null)

  // In-Page Rewards Redemption State
  const [redeemingId, setRedeemingId] = useState<string | null>(null)
  const [redeemNotice, setRedeemNotice] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Escrow Voucher State
  const [vouchers, setVouchers] = useState<ActiveVoucher[]>(initialVouchers)
  const [cancellingVoucherId, setCancellingVoucherId] = useState<string | null>(null)
  const [copiedVoucherCode, setCopiedVoucherCode] = useState<string | null>(null)

  const referralCode = referralProfile?.referralCode || session.referralCode || "4821"
  const referralUrl = `https://winmyporsche.in/r/${referralCode}`

  const ticketsBoughtTotal = referralProfile?.ticketsBought || ticketStats.totalBought
  const isCashUnlocked = referralProfile?.isCashUnlocked || ticketsBoughtTotal >= 25
  const ticketsNeededForCash = Math.max(0, 25 - ticketsBoughtTotal)
  const percentageClaimed = Math.round((contest.soldTickets / contest.targetTickets) * 100)
  const unitPrice = contest.ticketPrice || 1000

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyTicket = (num: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(num)
    }
    setCopiedTicketNum(num)
    setTimeout(() => setCopiedTicketNum(null), 2000)
  }

  const handleLogout = async () => {
    await logoutMember()
    router.push("/login")
    router.refresh()
  }

  // 1. Buy Tickets Action (Mock Payment)
  const handleBuyTickets = async (countOverride?: number) => {
    const count = countOverride || ticketBuyCount
    if (count < 1) return

    setBuying(true)
    setBuyMsg(null)
    try {
      const res = await buyContestTicketsAction({
        contestId: contest.id,
        ticketCount: count,
        userEmail: session.email,
        userPhone: session.phone,
        userName: session.name,
        autoAssign: false, // Keep tickets unassigned so member can pick 5-digit numbers
      })

      if (!res.ok) {
        setBuyMsg({ type: "error", text: res.error || "Failed to process payment." })
        setBuying(false)
        return
      }

      const addedCredits = count * unitPrice
      setCredits((prev) => prev + addedCredits)
      setTicketStats((prev) => ({
        ...prev,
        totalBought: prev.totalBought + count,
        availableToAssign: prev.availableToAssign + count,
      }))

      if (referralProfile) {
        const newTotalBought = (referralProfile.ticketsBought || 0) + count
        setReferralProfile({
          ...referralProfile,
          ticketsBought: newTotalBought,
          isCashUnlocked: newTotalBought >= 25,
        })
      }

      setBuyMsg({
        type: "success",
        text: `Payment successful! Added ${addedCredits.toLocaleString("en-IN")} Drive Credits and unlocked ${count} contest ${count === 1 ? "entry" : "entries"} ready to assign in the Lucky Terminal below.`,
      })

      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } })
      } catch {}

      router.refresh()
    } catch {
      setBuyMsg({ type: "error", text: "Network error occurred. Please try again." })
    } finally {
      setBuying(false)
    }
  }

  // 2. Custom 5-Digit Number Assignment Action with Validations
  const handleAssignNumber = async () => {
    const clean = customNumber.trim()
    if (!clean || !/^\d{5}$/.test(clean)) {
      setAssignMsg({ type: "error", text: "Please enter a valid 5-digit number (e.g. 40821)." })
      return
    }

    if (ticketStats.availableToAssign <= 0) {
      setAssignMsg({ type: "error", text: "No entries left to assign. Acquire ticket packs below to unlock more numbers." })
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

      setAssignMsg({ type: "success", text: `Success! Lucky Ticket #${clean} is registered into the Porsche 718 Cayman grand draw.` })
      setCustomNumber("")

      try {
        confetti({ particleCount: 65, spread: 55, origin: { y: 0.55 } })
      } catch {}

      router.refresh()
    } catch {
      setAssignMsg({ type: "error", text: "Failed to connect to database." })
    } finally {
      setAssigning(false)
    }
  }

  // 3. Auto-Pick Lucky Number Action with Validations
  const handleAutoPick = async () => {
    if (ticketStats.availableToAssign <= 0) {
      setAssignMsg({ type: "error", text: "No entries left to assign. Acquire ticket packs below to unlock more numbers." })
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
        setAssignMsg({ type: "error", text: res.error || "Could not auto-generate number." })
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
        confetti({ particleCount: 65, spread: 55, origin: { y: 0.55 } })
      } catch {}

      router.refresh()
    } catch {
      setAssignMsg({ type: "error", text: "Failed to connect to server." })
    } finally {
      setAssigning(false)
    }
  }

  // 4. Simulate Referral Action (Demo)
  const handleSimulateReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!friendName.trim()) {
      setSimMsg({ type: "error", text: "Please enter your friend's name." })
      return
    }
    if (simTickets < 1) {
      setSimMsg({ type: "error", text: "Please select at least 1 ticket." })
      return
    }

    setSimulating(true)
    setSimMsg(null)
    try {
      const res = await simulateReferralAction({
        referralCode,
        friendName: friendName.trim(),
        ticketCount: simTickets,
        referrerEmail: session.email,
      })

      if (!res.ok) {
        setSimMsg({ type: "error", text: res.error || "Failed to add referral." })
        setSimulating(false)
        return
      }

      const addedCredits = res.creditsAdded || simTickets * 250
      const addedCash = res.cashAdded || (isCashUnlocked ? simTickets * 250 : 0)

      setCredits((prev) => prev + addedCredits)
      if (referralProfile) {
        setReferralProfile({
          ...referralProfile,
          totalReferredUsers: (referralProfile.totalReferredUsers || 0) + 1,
          totalCreditsEarned: (referralProfile.totalCreditsEarned || 0) + addedCredits,
          totalCashEarned: (referralProfile.totalCashEarned || 0) + addedCash,
        })
      }

      const newReferralRecord: ReferralRecord = {
        id: `ref_${Date.now()}`,
        userName: friendName.trim(),
        userEmail: `${friendName.trim().toLowerCase()}@example.com`,
        ticketCount: simTickets,
        amountPaid: simTickets * unitPrice,
        creditsEarned: addedCredits,
        cashEarned: addedCash,
        createdAt: new Date().toISOString(),
      }
      setReferrals((prev) => [newReferralRecord, ...prev])

      setSimMsg({
        type: "success",
        text: `Referral credited! Added ${addedCredits.toLocaleString("en-IN")} Drive Credits${addedCash > 0 ? ` and ₹${addedCash.toLocaleString("en-IN")} Cash Commission` : ""}.`,
      })
      setFriendName("")
      setSimTickets(1)

      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } })
      } catch {}

      router.refresh()
    } catch {
      setSimMsg({ type: "error", text: "Network error occurred." })
    } finally {
      setSimulating(false)
    }
  }

  // Active vs Past ticket differentiation
  const activeTicketsList = useMemo(() => {
    return ticketStats.tickets.filter((t) => {
      return t.contestStatus === "active" || (!t.contestStatus && t.contestId === contest.id)
    })
  }, [ticketStats.tickets, contest.id])

  const pastTicketsList = useMemo(() => {
    return ticketStats.tickets.filter((t) => {
      return (
        t.contestStatus === "completed" ||
        (t.contestStatus && t.contestStatus !== "active" && t.contestId !== contest.id)
      )
    })
  }, [ticketStats.tickets, contest.id])

  // Filter assigned tickets if search query or status filter is present
  const filteredTickets = useMemo(() => {
    let list = ticketStats.tickets
    if (ticketFilter === "active") list = activeTicketsList
    else if (ticketFilter === "past") list = pastTicketsList

    if (!searchTicketQuery.trim()) return list
    const q = searchTicketQuery.trim().toLowerCase()
    return list.filter(
      (t) =>
        t.ticketNumber.toLowerCase().includes(q) ||
        (t.carName && t.carName.toLowerCase().includes(q))
    )
  }, [ticketStats.tickets, ticketFilter, activeTicketsList, pastTicketsList, searchTicketQuery])

  const totalTicketPages = Math.max(1, Math.ceil(filteredTickets.length / ticketPageSize))

  const paginatedTickets = useMemo(() => {
    const start = (ticketPage - 1) * ticketPageSize
    return filteredTickets.slice(start, start + ticketPageSize)
  }, [filteredTickets, ticketPage, ticketPageSize])

  const handleCopyVoucherCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code)
    }
    setCopiedVoucherCode(code)
    setTimeout(() => setCopiedVoucherCode(null), 2500)
  }

  const handleCancelVoucher = async (voucher: ActiveVoucher) => {
    setCancellingVoucherId(voucher.id)
    try {
      const res = await cancelRedemptionAction({
        redemptionId: voucher.id,
        userEmail: session.email,
        userPhone: session.phone,
      })
      if (!res.ok) {
        setRedeemNotice({ type: "error", text: res.error || "Could not cancel voucher." })
        setCancellingVoucherId(null)
        return
      }
      const restored = res.creditsRestored || voucher.creditsSpent
      setCredits((prev) => prev + restored)
      setVouchers((prev) => prev.filter((v) => v.id !== voucher.id))
      setRedeemNotice({
        type: "success",
        text: `Voucher ${voucher.code} cancelled. ₹${restored.toLocaleString("en-IN")} Drive Credits restored to your garage wallet!`,
      })
    } catch {
      setRedeemNotice({ type: "error", text: "Network error cancelling voucher. Please try again." })
    } finally {
      setCancellingVoucherId(null)
    }
  }

  const handleInPageRedeem = async (reward: RewardItem) => {
    setRedeemNotice(null)
    setRedeemingId(reward.id)
    try {
      const res = await redeemRewardAction({
        rewardId: reward.id,
        userEmail: session.email,
        userPhone: session.phone,
        userName: session.name,
      })

      if (!res.ok) {
        setRedeemNotice({ type: "error", text: res.error || "Unable to redeem reward." })
        setRedeemingId(null)
        return
      }

      setCredits((prev) => Math.max(0, prev - reward.creditsRequired))
      if (res.voucherCode && res.redemptionId) {
        setVouchers((prev) => [
          {
            id: res.redemptionId!,
            code: res.voucherCode!,
            rewardId: reward.id,
            rewardTitle: reward.title,
            creditsSpent: reward.creditsRequired,
            status: "pending_booking",
            createdAt: new Date().toISOString(),
            bookingUrl: res.redirectUrl || "https://book.turboridesupercars.com",
            bookingCarId: reward.bookingCarId,
            bookingLaps: reward.bookingLaps,
          },
          ...prev,
        ])
      }

      setRedeemNotice({
        type: "success",
        text: `Track Pass issued! Code: ${res.voucherCode}. Routing to TurboRide track booking engine...`,
      })

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl
      } else {
        router.refresh()
      }
    } catch {
      setRedeemNotice({ type: "error", text: "Connection error. Please try again." })
      setRedeemingId(null)
    }
  }

  // Allocation tier packages
  const ticketTiers = [
    {
      count: 1,
      tag: "Single Entry",
      price: 1 * unitPrice,
      highlight: false,
      desc: "1 Draw Ticket + 1,000 Credits",
    },
    {
      count: 25,
      tag: "VIP Unlock",
      price: 25 * unitPrice,
      highlight: true,
      badge: "POPULAR",
      desc: "25 Tickets + 25% Cash Unlock",
    },
    {
      count: 50,
      tag: "High Roller",
      price: 50 * unitPrice,
      highlight: false,
      desc: "50 Tickets + 50,000 Credits",
    },
    {
      count: 100,
      tag: "Syndicate",
      price: 100 * unitPrice,
      highlight: false,
      desc: "100 Tickets + Full Track Drive",
    },
  ]

  return (
    <div className="min-h-[100dvh] bg-[#fbfbfb] text-zinc-950 font-sans selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      
      {/* 1. Header Bar with Paddock Badge & Member Auth */}
      <header className="border-b border-zinc-200/70 bg-white/95 backdrop-blur-md sticky top-0 z-50 py-3 sm:py-3.5 px-3.5 sm:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-base sm:text-xl font-black tracking-tight text-zinc-950 uppercase shrink-0">
                WINMY<span className="text-[#ea580c]">PORSCHE</span>
              </span>
            </Link>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200/60 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Member Garage
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Redeem CTA in Header */}
            <Link
              href="/members/rewards"
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <Sparkle size={13} weight="fill" className="shrink-0" />
              <span className="hidden sm:inline">Redeem Credits</span>
              <span className="sm:hidden">Redeem</span>
              <span className="hidden md:inline text-emerald-100 font-normal">({credits.toLocaleString("en-IN")})</span>
            </Link>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <div className="w-7 h-7 rounded-full bg-orange-100 text-[#ea580c] font-black flex items-center justify-center text-xs shrink-0">
                {session.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="font-bold text-zinc-900 block">{session.name}</span>
                <span className="text-[10px] text-zinc-400 block">{session.phone || session.email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-7 h-7 sm:w-auto sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-zinc-200/90 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-950 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
              title="Sign Out"
            >
              <SignOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* 2. Executive VIP Telemetry HUD (3 Bento Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Bento Card 1: Drive Credits */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200/80 p-4 sm:p-6 shadow-xs group hover:border-orange-200 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Drive Credits Vault
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wallet size={16} weight="bold" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight tabular-nums">
                  {credits.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-emerald-600 font-bold uppercase">
                  1:1 with INR
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                100% money back from tickets. Usable for supercar track rentals & booking club perks.
              </p>
            </div>

            <Link
              href="/members/rewards"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-between transition-colors shadow-xs group-hover:bg-[#ea580c] cursor-pointer"
            >
              <span>Redeem for Track Drives</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          {/* Bento Card 2: Contest Allocation & Lucky Numbers */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200/80 p-4 sm:p-6 shadow-xs group hover:border-orange-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Contest Allocation
              </span>
              <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ea580c] flex items-center justify-center">
                <Ticket size={16} weight="bold" />
              </div>
            </div>
            <div className="flex items-baseline gap-2.5 mb-1.5">
              <span className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight tabular-nums">
                {ticketStats.totalBought}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                entries bought
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-semibold">
                {ticketStats.totalAssigned} Used
              </span>
              <span className={`px-2 py-0.5 rounded-md font-bold ${ticketStats.availableToAssign > 0 ? "bg-orange-100 text-[#ea580c] animate-pulse" : "bg-zinc-100 text-zinc-400"}`}>
                {ticketStats.availableToAssign} Ready to Pick
              </span>
            </div>
          </div>

          {/* Bento Card 3: Referral Syndicate & Commission Status */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200/80 p-4 sm:p-6 shadow-xs group hover:border-orange-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Referral Rewards
              </span>
              <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ea580c] flex items-center justify-center">
                <Gift size={16} weight="bold" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-[#ea580c] tracking-tight tabular-nums">
                ₹{referralProfile?.totalCashEarned?.toLocaleString("en-IN") || 0}
              </span>
              <span className="text-xs text-zinc-500 font-semibold">
                + {referralProfile?.totalCreditsEarned?.toLocaleString("en-IN") || 0} credits
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {isCashUnlocked ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle size={14} weight="fill" /> 25% Cash Commission Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-zinc-500 font-medium">
                  <Lock size={13} /> Buy {ticketsNeededForCash} more for 25% Cash
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ESCROW TRACK PASS VOUCHERS BANNER */}
        {vouchers.length > 0 && (
          <section className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
              <div className="flex items-center gap-2">
                <Ticket size={22} className="text-amber-600 shrink-0" weight="fill" />
                <div>
                  <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wide">
                    Active Track Pass Vouchers ({vouchers.length}) · Reserved in Escrow
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    Your credits are safely reserved. Complete your track booking or cancel below for an instant full refund.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 self-start sm:self-auto">
                100% Refundable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {vouchers.map((v) => (
                <div key={v.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                          {v.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyVoucherCode(v.code)}
                          className="text-zinc-400 hover:text-zinc-800 text-xs p-1 cursor-pointer"
                          title="Copy voucher code"
                        >
                          {copiedVoucherCode === v.code ? <span className="text-[10px] text-emerald-600 font-bold">COPIED</span> : <Copy size={14} />}
                        </button>
                      </div>
                      <span className="text-xs font-mono font-black text-zinc-950 bg-zinc-100 px-2.5 py-1 rounded-md">
                        {v.creditsSpent.toLocaleString("en-IN")} Credits
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-950 mt-1">{v.rewardTitle}</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Status: <span className="font-semibold text-amber-600">Pending Track Slot Confirmation</span>
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={cancellingVoucherId === v.id}
                      onClick={() => handleCancelVoucher(v)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowCounterClockwise size={14} className={cancellingVoucherId === v.id ? "animate-spin" : ""} />
                      <span>{cancellingVoucherId === v.id ? "Restoring Credits..." : "Cancel & Restore Credits"}</span>
                    </button>

                    <a
                      href={v.bookingUrl}
                      className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Complete Booking</span>
                      <ArrowRight size={13} weight="bold" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. The Grand Draw Arena (Widescreen Showcase + Lucky Number Terminal) */}
        <section className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#ea580c] text-white uppercase tracking-wider whitespace-nowrap shrink-0">
                  GRAND PRIZE ARENA
                </span>
                <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">Official Entrant Pool</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                Porsche 718 Cayman Grand Draw
              </h2>
            </div>

            {/* Car Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => {
                  setActiveCarTab("porsche")
                  setTabNotice(null)
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCarTab === "porsche"
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Porsche 718
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCarTab("cyberster")
                  setTabNotice("MG Cyberster drop entries will unlock immediately when the Porsche 718 Cayman allocation closes.")
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>MG Cyberster</span>
                <span className="text-[9px] font-bold bg-zinc-200/70 text-zinc-600 px-1 py-0.2 rounded uppercase">Soon</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCarTab("mustang")
                  setTabNotice("Ford Mustang GT phase will open in Phase 2. Credits acquired today carry forward.")
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Mustang GT</span>
                <span className="text-[9px] font-bold bg-zinc-200/70 text-zinc-600 px-1 py-0.2 rounded uppercase">Soon</span>
              </button>
            </div>
          </div>

          {tabNotice && (
            <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 text-xs flex items-center justify-between">
              <span>{tabNotice}</span>
              <button onClick={() => setTabNotice(null)} className="text-orange-700 font-bold ml-2">×</button>
            </div>
          )}

          {/* Arena Content Grid: Car Visual (Left) + Interactive Lucky Terminal (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 items-center">
            
            {/* Left: Cinematic Car Showcase (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 shadow-inner group">
                <Image
                  src="/prizes/porsche-718.jpg"
                  alt="Porsche 718 Cayman"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#ea580c] text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE GRAND DRAW
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold whitespace-nowrap">
                    ₹1.22 Cr Value
                  </span>
                </div>
              </div>

              {/* Contest Claim Progress Bar */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-zinc-600 font-bold">Allocation Claimed</span>
                  <span className="text-[#ea580c] font-black tabular-nums">{percentageClaimed}% (6,350 / 10,000)</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-[#ea580c] rounded-full transition-all duration-1000"
                    style={{ width: `${percentageClaimed}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 font-medium">
                  <span>Guaranteed live audit</span>
                  <span className="text-emerald-700 font-semibold">Free Track Delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Lucky Number Terminal (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 p-4 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Lucky Number Terminal
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    5-Digit Custom
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-zinc-950 uppercase tracking-tight mb-1">
                  Assign Your Entry Numbers
                </h3>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                  Choose your lucky 5-digit number (e.g. 40821) or auto-pick a verified unclaimed number.
                </p>

                {/* Available Counter Pill */}
                <div className={`p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 flex items-center justify-between border transition-all ${
                  ticketStats.availableToAssign > 0
                    ? "bg-orange-50/80 border-orange-200 text-orange-950"
                    : "bg-white border-zinc-200 text-zinc-600"
                }`}>
                  <div className="flex items-center gap-2">
                    <Lightning size={18} className={ticketStats.availableToAssign > 0 ? "text-[#ea580c] animate-bounce" : "text-zinc-400"} weight="fill" />
                    <span className="text-xs font-bold">
                      Entries Available to Assign
                    </span>
                  </div>
                  <span className={`text-xl sm:text-2xl font-black tabular-nums ${ticketStats.availableToAssign > 0 ? "text-[#ea580c]" : "text-zinc-400"}`}>
                    {ticketStats.availableToAssign}
                  </span>
                </div>

                {/* 5-Digit Number Input Field & Enter Button */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={5}
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="5-digit # (e.g. 40821)"
                      disabled={assigning || ticketStats.availableToAssign <= 0}
                      className="flex-1 min-w-0 h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-white border border-zinc-300 text-xs sm:text-sm font-bold tracking-widest text-zinc-950 placeholder:text-zinc-400 placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-[#ea580c] disabled:bg-zinc-100 disabled:text-zinc-400"
                    />

                    <button
                      type="button"
                      onClick={handleAssignNumber}
                      disabled={assigning || customNumber.length !== 5 || ticketStats.availableToAssign <= 0}
                      className="h-11 sm:h-12 px-3.5 sm:px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed bg-[#ea580c] hover:bg-[#c2410c] text-white"
                    >
                      <Ticket size={16} weight="bold" />
                      <span>{assigning ? "..." : "Lock In"}</span>
                    </button>
                  </div>

                  {/* Auto-Pick Button */}
                  <button
                    type="button"
                    onClick={handleAutoPick}
                    disabled={assigning || ticketStats.availableToAssign <= 0}
                    className="w-full h-10 sm:h-11 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                  >
                    <Shuffle size={15} weight="bold" />
                    <span className="truncate">{assigning ? "Generating Unclaimed Number..." : "Auto-pick random available number"}</span>
                  </button>
                </div>

                {assignMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs mb-3 font-medium ${
                      assignMsg.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {assignMsg.text}
                  </div>
                )}
              </div>

              {/* Status Note */}
              <div className="pt-2.5 border-t border-zinc-200/60 text-center">
                {ticketStats.availableToAssign <= 0 ? (
                  <p className="text-xs text-zinc-500 font-medium">
                    All purchased entries currently assigned. <a href="#buy-tickets" className="text-[#ea580c] font-bold hover:underline">Acquire more tickets</a> to enter again.
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600 font-bold">
                    ✓ {ticketStats.availableToAssign} ticket {ticketStats.availableToAssign === 1 ? "entry is" : "entries are"} ready to be locked in.
                  </p>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 4. The Ticket Vault (Assigned / Used Tickets Display with Active vs Past & Pagination) */}
        <section className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={18} className="text-[#ea580c]" />
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight">
                  Your Secured Ticket Vault
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                Official 5-digit lucky numbers registered in our verified supercar prize draws.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-[#ea580c] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {activeTicketsList.length} Active in Live Draw
              </span>
              {pastTicketsList.length > 0 && (
                <span className="px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold">
                  {pastTicketsList.length} Past Draws
                </span>
              )}
              <span className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-600 font-bold">
                {ticketStats.totalBought} Total Bought
              </span>
            </div>
          </div>

          {/* Filter Tabs, Search Bar, and Page Size Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Active vs Past Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setTicketFilter("active")
                  setTicketPage(1)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  ticketFilter === "active"
                    ? "bg-[#ea580c] text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                <span>Active Draw ({activeTicketsList.length})</span>
                <span className={`w-1.5 h-1.5 rounded-full ${ticketFilter === "active" ? "bg-white" : "bg-emerald-500"}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setTicketFilter("past")
                  setTicketPage(1)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ticketFilter === "past"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                <span>Past Draws ({pastTicketsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTicketFilter("all")
                  setTicketPage(1)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ticketFilter === "all"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                <span>All Entries ({ticketStats.tickets.length})</span>
              </button>
            </div>

            {/* Right: Search & Page Size Options */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative w-full sm:w-64 min-w-[210px]">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchTicketQuery}
                  onChange={(e) => {
                    setSearchTicketQuery(e.target.value)
                    setTicketPage(1)
                  }}
                  placeholder="Search ticket number..."
                  className="w-full h-10 pl-10 pr-8 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 shadow-2xs transition-all"
                />
                {searchTicketQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTicketQuery("")
                      setTicketPage(1)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs font-bold p-1 cursor-pointer"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Page size selector */}
              {filteredTickets.length > 12 && (
                <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-500 shrink-0">
                  <span className="hidden md:inline">Per page:</span>
                  {[12, 24, 48].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setTicketPageSize(size)
                        setTicketPage(1)
                      }}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        ticketPageSize === size
                          ? "bg-zinc-950 text-white font-bold"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Grid Cards */}
          {ticketStats.tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <Ticket size={24} />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                No Tickets Assigned Yet
              </h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                {ticketStats.availableToAssign > 0
                  ? `You have ${ticketStats.availableToAssign} unassigned ticket entries! Use the Lucky Terminal above to lock in your numbers.`
                  : "Acquire contest tickets below to unlock your 5-digit lucky numbers and enter the grand draw."}
              </p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-10 text-center space-y-2">
              <Ticket size={24} className="text-zinc-400 mx-auto" />
              <p className="text-xs font-mono text-zinc-600 font-bold">
                {searchTicketQuery
                  ? `No tickets match "${searchTicketQuery}".`
                  : ticketFilter === "past"
                  ? "You have no tickets from past draws. All your entries are in the active live draw!"
                  : "No active draw tickets found."}
              </p>
              {ticketFilter === "past" && (
                <button
                  type="button"
                  onClick={() => setTicketFilter("active")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold transition-colors cursor-pointer mt-2 shadow-xs"
                >
                  <span>View {activeTicketsList.length} Active Tickets</span>
                  <ArrowRight size={13} weight="bold" />
                </button>
              )}
              {searchTicketQuery && (
                <button
                  type="button"
                  onClick={() => setSearchTicketQuery("")}
                  className="text-xs text-[#ea580c] font-mono font-bold hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginatedTickets.map((t) => {
                const isActive =
                  t.contestStatus === "active" || (!t.contestStatus && t.contestId === contest.id)
                const isWinner =
                  t.winnerTicketNumber && t.winnerTicketNumber === t.ticketNumber

                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl p-4 shadow-2xs transition-all relative group border ${
                      isActive
                        ? "bg-gradient-to-b from-white to-zinc-50/60 border-zinc-200/90 hover:border-orange-300 hover:shadow-xs"
                        : "bg-zinc-50/80 border-zinc-200/80"
                    }`}
                  >
                    {/* Top Row: Car Name / Draw Label & Copy */}
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                      <span
                        className={`uppercase font-bold tracking-wider ${
                          isActive ? "text-orange-600" : "text-zinc-500"
                        }`}
                      >
                        {isActive ? (t.carName || "Porsche 718") : `Past: ${t.carName || "Completed"}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopyTicket(t.ticketNumber)}
                        className="p-1 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Copy ticket number"
                      >
                        {copiedTicketNum === t.ticketNumber ? (
                          <Check size={13} className="text-emerald-600" weight="bold" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>

                    {/* Main Ticket Number */}
                    <div className="flex items-baseline justify-between mb-2">
                      <span
                        className={`text-2xl font-black font-mono tracking-wider ${
                          isActive ? "text-zinc-950" : isWinner ? "text-amber-600" : "text-zinc-600"
                        }`}
                      >
                        #{t.ticketNumber}
                      </span>
                    </div>

                    {/* Footer Status Badge */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                      {isActive ? (
                        <>
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            In Grand Draw
                          </span>
                          <span className="text-zinc-400 text-[10px]">
                            Verified Pass
                          </span>
                        </>
                      ) : isWinner ? (
                        <span className="text-amber-700 font-black text-[10px] flex items-center gap-1">
                          🏆 Grand Prize Winner
                        </span>
                      ) : (
                        <>
                          <span className="text-zinc-500 text-[10px] font-bold">
                            Draw Concluded
                          </span>
                          <span className="text-zinc-400 text-[9px]">
                            100% In Credits
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination Controls Bar */}
          {filteredTickets.length > ticketPageSize && (
            <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-zinc-500 text-[11px]">
                Showing{" "}
                <strong className="text-zinc-900 font-bold">
                  {(ticketPage - 1) * ticketPageSize + 1}–
                  {Math.min(ticketPage * ticketPageSize, filteredTickets.length)}
                </strong>{" "}
                of <strong className="text-zinc-900 font-bold">{filteredTickets.length}</strong> tickets
                {ticketFilter !== "all" && ` (${ticketFilter} filter)`}
              </div>

              {/* Prev / Page Numbers / Next */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTicketPage((p) => Math.max(1, p - 1))}
                  disabled={ticketPage <= 1}
                  className="px-2.5 py-1.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer font-bold"
                >
                  <CaretLeft size={14} weight="bold" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {Array.from({ length: totalTicketPages }, (_, idx) => idx + 1).map((pageNum) => {
                  // If lots of pages, show first, last, and window around current
                  if (
                    totalTicketPages > 7 &&
                    pageNum !== 1 &&
                    pageNum !== totalTicketPages &&
                    Math.abs(pageNum - ticketPage) > 1
                  ) {
                    if (pageNum === 2 || pageNum === totalTicketPages - 1) {
                      return (
                        <span key={pageNum} className="px-1 text-zinc-400">
                          …
                        </span>
                      )
                    }
                    return null
                  }

                  const isCurrent = pageNum === ticketPage
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setTicketPage(pageNum)}
                      className={`w-8 h-8 rounded-xl font-bold font-mono transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? "bg-[#ea580c] text-white shadow-xs"
                          : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => setTicketPage((p) => Math.min(totalTicketPages, p + 1))}
                  disabled={ticketPage >= totalTicketPages}
                  className="px-2.5 py-1.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span className="hidden sm:inline">Next</span>
                  <CaretRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 4.5. Supercar Experiences & Drive Credit Redemption */}
        <section id="redeem-credits" className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkle size={18} weight="fill" className="text-emerald-600" />
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight">
                  Redeem Your Drive Credits
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                100% of your ticket purchases are held as permanent Drive Credits. Redeem them for real supercar track sessions at Buddh Circuit or studio shoots.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-900 font-bold">Your Balance:</span>
                <span className="font-black text-emerald-600">{credits.toLocaleString("en-IN")} Credits</span>
              </div>
              <Link
                href="/members/rewards"
                className="px-4 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Full Catalog</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          </div>

          {redeemNotice && (
            <div className={`p-4 rounded-xl text-xs font-mono font-medium flex items-center justify-between ${
              redeemNotice.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <span>{redeemNotice.text}</span>
              <button
                type="button"
                onClick={() => setRedeemNotice(null)}
                className="text-xs font-bold hover:opacity-75 cursor-pointer ml-3"
              >
                ✕
              </button>
            </div>
          )}

          {/* Featured Experiences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REWARDS_CATALOG.slice(0, 3).map((item) => {
              const hasEnough = credits >= item.creditsRequired
              const isRedeeming = redeemingId === item.id

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-zinc-50/60 border border-zinc-200/90 p-5 flex flex-col justify-between hover:border-zinc-300 hover:bg-white transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2">
                      <span className="uppercase font-bold tracking-wider text-emerald-600">{item.category}</span>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-800 font-bold">
                        {item.creditsRequired.toLocaleString("en-IN")} Credits
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-zinc-950 uppercase tracking-tight group-hover:text-[#ea580c] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5 mb-3">
                      {item.specs}
                    </p>

                    <div className="relative h-36 w-full rounded-xl bg-white border border-zinc-100 flex items-center justify-center p-3 mb-4 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={280}
                        height={120}
                        className="object-contain max-h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/70">
                    {hasEnough ? (
                      <button
                        type="button"
                        onClick={() => handleInPageRedeem(item)}
                        disabled={isRedeeming}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
                      >
                        <Sparkle size={15} weight="fill" />
                        <span>{isRedeeming ? "Verifying..." : "Redeem Experience"}</span>
                        {!isRedeeming && <ArrowRight size={13} weight="bold" />}
                      </button>
                    ) : (
                      <div className="space-y-1 text-center">
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-400 font-mono text-xs font-bold border border-zinc-200 cursor-not-allowed"
                        >
                          Need {(item.creditsRequired - credits).toLocaleString("en-IN")} More Credits
                        </button>
                        <a
                          href="#buy-tickets"
                          className="text-[11px] font-mono text-[#ea580c] font-bold hover:underline inline-block"
                        >
                          Deposit in Garage to Get Credits →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Explanatory Guarantee Bar */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-600">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" weight="fill" />
              <span>
                <strong>How Redemption Works:</strong> When you redeem, credits are verified and debited, and you will be routed directly to the TurboRide track booking engine to pick your date and session.
              </span>
            </div>
            <Link
              href="/members/rewards"
              className="text-[#ea580c] font-bold hover:underline shrink-0"
            >
              Browse Full 6-Vehicle Rewards Fleet →
            </Link>
          </div>
        </section>

        {/* 5. Buy Tickets & Allocation Desk */}
        <section id="buy-tickets" className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-zinc-950 text-white uppercase tracking-wider whitespace-nowrap shrink-0">
                ALLOCATION DESK
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                100% Money Back In Drive Credits
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-tight">
              Acquire Tickets & Expand Draw Probability
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
              Every ₹1,000 ticket adds 1 official contest entry AND gives 1,000 Drive Credits to your garage balance to book supercar track drives.
            </p>
          </div>

          {/* Tier Cards Selector - 2x2 on Mobile, 4 Cols on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {ticketTiers.map((tier) => (
              <div
                key={tier.count}
                onClick={() => setTicketBuyCount(tier.count)}
                className={`rounded-2xl p-3.5 sm:p-5 border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  ticketBuyCount === tier.count
                    ? "border-[#ea580c] bg-orange-50/40 shadow-xs ring-2 ring-[#ea580c]"
                    : "border-zinc-200/80 bg-white hover:border-zinc-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider truncate">
                      {tier.tag}
                    </span>
                    {tier.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase bg-[#ea580c] text-white tracking-wider whitespace-nowrap shrink-0">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                      {tier.count}
                    </span>
                    <span className="text-[11px] sm:text-xs text-zinc-500 font-medium">
                      {tier.count === 1 ? "ticket" : "tickets"}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-500 leading-tight mb-3">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-zinc-100 flex flex-col xs:flex-row xs:items-center justify-between gap-0.5">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Total</span>
                  <span className="text-xs sm:text-sm font-black text-zinc-900 tabular-nums">
                    ₹{tier.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stepper + Dynamic Calculation + Payment CTA */}
          <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 sm:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6">
            {/* Stepper Control */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full lg:w-auto pb-3 border-b border-zinc-200/70 lg:border-b-0 lg:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 whitespace-nowrap">
                Custom Quantity:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setTicketBuyCount((prev) => Math.max(1, prev - 1))}
                  disabled={ticketBuyCount <= 1}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 font-bold flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer text-base"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={ticketBuyCount}
                  onChange={(e) => setTicketBuyCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 sm:w-20 h-9 sm:h-10 rounded-xl border border-zinc-300 bg-white text-center font-black text-sm text-zinc-950 focus:outline-none focus:border-[#ea580c]"
                />
                <button
                  type="button"
                  onClick={() => setTicketBuyCount((prev) => prev + 1)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 font-bold flex items-center justify-center transition-colors cursor-pointer text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex items-center justify-between sm:justify-center gap-6 sm:gap-10 py-1 lg:py-0">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total Investment</span>
                <span className="text-lg sm:text-2xl font-black text-zinc-950 tabular-nums">
                  ₹{(ticketBuyCount * unitPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">Drive Credits Granted</span>
                <span className="text-lg sm:text-2xl font-black text-[#ea580c] tabular-nums">
                  +{(ticketBuyCount * unitPrice).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={() => handleBuyTickets()}
              disabled={buying}
              className="w-full lg:w-auto h-12 px-6 sm:px-8 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>{buying ? "Depositing Credits..." : "Complete Mock Payment"}</span>
              {!buying && <ArrowRight size={14} weight="bold" />}
            </button>
          </div>

          {buyMsg && (
            <div
              className={`p-3.5 sm:p-4 rounded-xl text-xs font-medium ${
                buyMsg.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {buyMsg.text}
            </div>
          )}
        </section>

        {/* 6. VIP Referral Syndicate & Earning Command Center */}
        <section className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gift size={20} className="text-[#ea580c]" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                VIP Referral Syndicate
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-2xl">
              Earn 25% Drive Credits on every friend ticket purchase. Acquire 25 tickets to unlock direct cash commissions.
            </p>
          </div>

          {/* Cash Commission Unlock Milestone Card */}
          <div className="rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 bg-gradient-to-r from-zinc-50 via-white to-orange-50/20 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCashUnlocked ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
              }`}>
                {isCashUnlocked ? <ShieldCheck size={20} weight="bold" /> : <Lock size={18} />}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-zinc-950 text-xs sm:text-sm block">
                  {isCashUnlocked ? "VIP 25% Direct Cash Commission Unlocked!" : "Unlock 25% Direct Cash Commission"}
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-500 block mt-0.5 leading-relaxed">
                  {isCashUnlocked
                    ? "Every referral order deposits 25% direct cash in INR to your account in addition to 25% drive credits."
                    : `Buy ${ticketsNeededForCash} more tickets (₹${(ticketsNeededForCash * unitPrice).toLocaleString("en-IN")}) to unlock direct cash payouts.`}
                </span>
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="w-full md:w-auto md:min-w-[180px] text-left md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-500 font-medium">Milestone Progress</span>
                <span className="font-bold text-zinc-900 tabular-nums">{Math.min(25, ticketsBoughtTotal)} / 25</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isCashUnlocked ? "bg-emerald-500" : "bg-[#ea580c]"}`}
                  style={{ width: `${Math.min(100, Math.round((ticketsBoughtTotal / 25) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Referral Link & Sharing Station */}
          <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3.5 sm:p-6 space-y-3.5 sm:space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Your Exclusive Referral Link
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  25% Credit Match
                </span>
              </div>

              {/* Unified Link Box with Integrated Copy Button */}
              <div className="flex items-center gap-2 p-1.5 pl-3 sm:pl-4 rounded-xl bg-white border border-zinc-300 shadow-2xs">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm font-semibold text-zinc-900 select-all outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-9 px-3.5 sm:px-4 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                >
                  {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Action Buttons Row - Balanced Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! Enter the Win A Porsche 718 Cayman contest with 100% money back in drive credits. Use my referral link: ${referralUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors shrink-0"
                >
                  <ShareNetwork size={16} weight="bold" />
                  <span>Share on WhatsApp</span>
                </a>

                <div className="h-10 px-3.5 rounded-xl bg-white border border-zinc-300 text-xs font-semibold text-zinc-700 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 text-[11px]">Code:</span>
                    <strong className="text-zinc-950 font-black">{referralCode}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(referralCode)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>

            {/* Collapsible Live Referral Simulator (Kept clean & non-intrusive) */}
            <details className="group pt-3 border-t border-zinc-200/70">
              <summary className="text-xs font-bold text-zinc-500 hover:text-zinc-950 cursor-pointer flex items-center justify-between py-1 select-none">
                <span>Test Referral Simulation (Demo Mode)</span>
                <span className="text-[11px] text-zinc-400 font-normal group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="pt-3">
                <form onSubmit={handleSimulateReferral} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 mb-2">
                  <div className="flex-1">
                    <label className="block text-[11px] text-zinc-500 font-semibold mb-1">
                      Friend&apos;s Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white border border-zinc-300 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c] w-full font-medium"
                    />
                  </div>

                  <div className="w-full sm:w-28">
                    <label className="block text-[11px] text-zinc-500 font-semibold mb-1">
                      Tickets Bought
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={simTickets}
                      onChange={(e) => setSimTickets(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-10 px-3 rounded-xl bg-white border border-zinc-300 text-xs text-center font-bold text-zinc-950 focus:outline-none focus:border-[#ea580c] w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={simulating}
                    className="h-10 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs"
                  >
                    {simulating ? "Simulating..." : "Add Referral"}
                  </button>
                </form>

                <span className="text-[11px] text-zinc-500 block">
                  {simTickets} × ₹1,000 → you earn{" "}
                  <strong className="text-[#ea580c] font-bold">{simTickets * 250} credits</strong>{" "}
                  {isCashUnlocked ? `(+₹${(simTickets * 250).toLocaleString("en-IN")} direct cash)` : "(cash unlocked at 25 tickets)"}
                </span>

                {simMsg && (
                  <div
                    className={`p-2.5 rounded-xl text-xs mt-2 font-medium ${
                      simMsg.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {simMsg.text}
                  </div>
                )}
              </div>
            </details>
          </div>

          {/* Referrals Activity Ledger */}
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-950 mb-3">
              <Users size={16} className="text-zinc-600" />
              <span>Verified Referrals Log ({referrals.length})</span>
            </div>

            {referrals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 p-6 sm:p-8 text-center text-xs text-zinc-400">
                No referrals recorded yet. Share your link above to begin earning 25% commissions.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 overflow-hidden bg-white shadow-2xs">
                {referrals.map((ref) => (
                  <div key={ref.id} className="p-3.5 sm:p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-zinc-950 block">{ref.userName}</span>
                      <span className="text-[11px] text-zinc-400">
                        {ref.ticketCount} {ref.ticketCount === 1 ? "ticket" : "tickets"} (₹{ref.amountPaid.toLocaleString("en-IN")})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-600 font-bold block">
                        +{ref.creditsEarned.toLocaleString("en-IN")} Credits
                      </span>
                      {ref.cashEarned > 0 && (
                        <span className="text-[#ea580c] font-bold block">
                          +₹{ref.cashEarned.toLocaleString("en-IN")} Cash
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Admin Link Footer */}
      <footer className="py-8 text-center border-t border-zinc-200/50 bg-white/50">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-800 transition-colors"
        >
          <LockKey size={14} />
          <span>Admin Console</span>
        </Link>
      </footer>

    </div>
  )
}
