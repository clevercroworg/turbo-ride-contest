"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  SquaresFour,
  Trophy,
  Users,
  Receipt,
  ArrowsClockwise,
  Gift,
  Gear,
  ArrowSquareOut,
  MagnifyingGlass,
  Plus,
  PencilSimple,
  Check,
  X,
  ShieldCheck,
  Warning,
  CheckCircle,
  Clock,
  DownloadSimple,
  CaretRight,
  Calendar,
  Ticket,
  List,
} from "@phosphor-icons/react"
import {
  type AdminContest,
  type AdminMember,
  type AdminOrder,
  type AdminPayout,
  type AdminRedemption,
  type AdminTicket,
  updateContestAction,
  setActiveContestAction,
  createContestAction,
  updateMemberStatusAction,
  updateOrderStatusAction,
  processPayoutAction,
  updateRedemptionStatusAction,
  saveAdminSettingsAction,
} from "@/lib/admin"
import type { AdminPlatformSettings } from "@/lib/types"

interface AdminConsoleProps {
  initialOverview: any
  initialContests: AdminContest[]
  initialMembers: AdminMember[]
  initialOrders: AdminOrder[]
  initialPayouts: {
    currentPayouts: AdminPayout[]
    payoutHistory: AdminPayout[]
    stats: { dueNow: number; paidToDate: number; onHold: number }
  }
  initialRedemptions: AdminRedemption[]
  initialTickets?: AdminTicket[]
  initialSettings?: AdminPlatformSettings
  initialTab?: TabType
}

type TabType = "overview" | "contests" | "members" | "orders" | "referrals" | "redemptions" | "settings"

const routeMap: Record<TabType, string> = {
  overview: "/admin",
  contests: "/admin/contests",
  members: "/admin/members",
  orders: "/admin/orders",
  referrals: "/admin/referrals",
  redemptions: "/admin/redemptions",
  settings: "/admin/settings",
}

// Reusable Table Pagination Component
function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
}: {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 text-xs font-mono">
      {/* Range indicator */}
      <div className="flex flex-wrap items-center gap-3 text-zinc-500">
        <span>
          Showing <strong className="text-zinc-900 font-bold">{startItem}</strong> to{" "}
          <strong className="text-zinc-900 font-bold">{endItem}</strong> of{" "}
          <strong className="text-zinc-900 font-bold">{totalItems.toLocaleString("en-IN")}</strong> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-zinc-200">
            <span className="text-[11px] text-zinc-400">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                onPageChange(1)
              }}
              className="bg-zinc-100 hover:bg-zinc-200 border-none rounded-lg px-2 py-1 text-xs font-bold text-zinc-800 cursor-pointer focus:outline-none"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page navigation controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-2.5 py-1 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-xs font-bold transition-colors"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((page, idx, arr) => {
            const prev = arr[idx - 1]
            return (
              <span key={page} className="flex items-center">
                {prev && page - prev > 1 && <span className="px-1 text-zinc-400">…</span>}
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                    currentPage === page
                      ? "bg-[#ea580c] text-white shadow-2xs"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {page}
                </button>
              </span>
            )
          })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-xs font-bold transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export function AdminConsoleClient({
  initialOverview,
  initialContests,
  initialMembers,
  initialOrders,
  initialPayouts,
  initialRedemptions,
  initialTickets = [],
  initialSettings,
  initialTab = "overview",
}: AdminConsoleProps) {
  const router = useRouter()

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const switchTab = (tab: TabType) => {
    setActiveTab(tab)
    setMobileSidebarOpen(false)
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", routeMap[tab])
    }
  }

  // Listen to popstate for back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      for (const [tab, rPath] of Object.entries(routeMap)) {
        if (path === rPath) {
          setActiveTab(tab as TabType)
          break
        }
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Live Data States
  const [contests, setContests] = useState<AdminContest[]>(initialContests)
  const [members, setMembers] = useState<AdminMember[]>(initialMembers)
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders)
  const [payoutsData, setPayoutsData] = useState(initialPayouts)
  const [redemptions, setRedemptions] = useState<AdminRedemption[]>(initialRedemptions)
  const [tickets, setTickets] = useState<AdminTicket[]>(initialTickets)

  // Contest Management & Tickets Ledger States
  const [contestViewMode, setContestViewMode] = useState<"cards" | "tickets">("cards")
  const [ticketSearch, setTicketSearch] = useState("")
  const [ticketContestFilter, setTicketContestFilter] = useState("all")
  const [adminTicketPage, setAdminTicketPage] = useState(1)
  const [adminTicketPageSize, setAdminTicketPageSize] = useState(15)

  // Payouts Pagination States
  const [payoutPage, setPayoutPage] = useState(1)
  const [payoutPageSize, setPayoutPageSize] = useState(10)
  const [payoutSearch, setPayoutSearch] = useState("")
  const [historyPage, setHistoryPage] = useState(1)
  const [historyPageSize, setHistoryPageSize] = useState(10)
  const [historySearch, setHistorySearch] = useState("")

  // Active Contest & Homepage Display Controls
  const activeContest = useMemo(
    () => contests.find((c) => c.status === "active") || contests[0],
    [contests]
  )
  const [hpTitle, setHpTitle] = useState(activeContest?.title || "PORSCHE 718 CAYMAN")
  const [hpSubtitle, setHpSubtitle] = useState(activeContest?.subtitle || "The yellow mid-engine legend. One lucky entry drives it home.")
  const [hpWorth, setHpWorth] = useState(activeContest?.worthDisplay || "Worth over ₹1.6 Crore")
  const [hpPrice, setHpPrice] = useState(activeContest?.ticketPrice || 1000)
  const [hpTarget, setHpTarget] = useState(activeContest?.targetTickets || 10000)
  const [hpSold, setHpSold] = useState(activeContest?.soldTickets || 6362)

  useEffect(() => {
    if (activeContest) {
      setHpTitle(activeContest.title)
      setHpSubtitle(activeContest.subtitle)
      setHpWorth(activeContest.worthDisplay)
      setHpPrice(activeContest.ticketPrice)
      setHpTarget(activeContest.targetTickets)
      setHpSold(activeContest.soldTickets)
    }
  }, [activeContest])

  // Filters & Search
  const [memberSearch, setMemberSearch] = useState("")
  const [memberFilter, setMemberFilter] = useState<"all" | "active" | "kyc_pending" | "flagged">("all")
  const [memberPage, setMemberPage] = useState(1)
  const [memberPageSize, setMemberPageSize] = useState(10)

  const [orderSearch, setOrderSearch] = useState("")
  const [orderFilter, setOrderFilter] = useState<"all" | "completed" | "pending" | "refunded">("all")
  const [orderPage, setOrderPage] = useState(1)
  const [orderPageSize, setOrderPageSize] = useState(10)

  // Redemptions Filter & Pagination State
  const [redemptionSearch, setRedemptionSearch] = useState("")
  const [redemptionFilter, setRedemptionFilter] = useState<"All" | "Requested" | "Scheduled" | "Fulfilled">("All")
  const [redemptionPage, setRedemptionPage] = useState(1)
  const [redemptionPageSize, setRedemptionPageSize] = useState(5)
  const [schedulingItem, setSchedulingItem] = useState<AdminRedemption | null>(null)
  const [scheduleSlot, setScheduleSlot] = useState("24 Sep, 14:00")

  // Modals & Drawers
  const [editingContest, setEditingContest] = useState<AdminContest | null>(null)
  const [isNewContestOpen, setIsNewContestOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null)
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // New Contest Form State
  const [newContest, setNewContest] = useState({
    id: "",
    carName: "",
    title: "",
    subtitle: "",
    worthDisplay: "",
    ticketPrice: 1000,
    targetTickets: 10000,
    imageUrl: "/prizes/porsche-718.jpg",
    status: "upcoming",
  })

  // Settings State matching Screenshot 2 (Persisted to PostgreSQL)
  const [settings, setSettings] = useState<AdminPlatformSettings>(
    initialSettings || {
      ticketPrice: 1000,
      creditsPerTicket: 1000,
      creditRewardPercent: 25,
      cashCommissionPercent: 25,
      cashUnlockThreshold: 25,
      fallbackPayoutPercent: 70,
      drawType: "Provably Fair Digital Draw",
      isPaused: false,
      isClosed: false,
    }
  )
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text })
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleSaveSettings = async () => {
    setIsSavingSettings(true)
    try {
      const res = await saveAdminSettingsAction(settings)
      if (!res.ok) throw new Error(res.error)
      showToast("Platform settings persisted live to PostgreSQL database!")
      router.refresh()
    } catch (err: any) {
      showToast(err.message || "Failed to save settings to database.", "error")
    } finally {
      setIsSavingSettings(false)
    }
  }

  // CONTEST ACTIONS
  const handleSaveContest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingContest) return
    setActionLoading(true)

    const res = await updateContestAction(editingContest.id, {
      carName: editingContest.carName,
      title: editingContest.title,
      subtitle: editingContest.subtitle,
      worthDisplay: editingContest.worthDisplay,
      ticketPrice: Number(editingContest.ticketPrice),
      targetTickets: Number(editingContest.targetTickets),
      soldTickets: Number(editingContest.soldTickets),
      status: editingContest.status,
      drawDate: editingContest.drawDate,
      imageUrl: editingContest.imageUrl,
      winnerName: editingContest.winnerName,
      winnerTicketNumber: editingContest.winnerTicketNumber,
    })

    if (res.ok) {
      setContests((prev) =>
        prev.map((c) => (c.id === editingContest.id ? { ...editingContest } : c))
      )
      if (activeContest?.id === editingContest.id) {
        setHpTitle(editingContest.title)
        setHpSubtitle(editingContest.subtitle)
        setHpWorth(editingContest.worthDisplay)
        setHpPrice(Number(editingContest.ticketPrice))
        setHpTarget(Number(editingContest.targetTickets))
        setHpSold(Number(editingContest.soldTickets))
      }
      setEditingContest(null)
      showToast(`Contest "${editingContest.carName}" updated! Public site reflects new pricing & details.`)
      router.refresh()
    } else {
      showToast(res.error || "Failed to save contest.", "error")
    }
    setActionLoading(false)
  }

  const handleSaveHomepageSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!activeContest) return
    setActionLoading(true)
    try {
      const res = await updateContestAction(activeContest.id, {
        title: hpTitle,
        subtitle: hpSubtitle,
        worthDisplay: hpWorth,
        ticketPrice: Number(hpPrice),
        targetTickets: Number(hpTarget),
        soldTickets: Number(hpSold),
      })
      if (!res.ok) throw new Error(res.error)

      setContests((prev) =>
        prev.map((c) =>
          c.id === activeContest.id
            ? {
                ...c,
                title: hpTitle,
                subtitle: hpSubtitle,
                worthDisplay: hpWorth,
                ticketPrice: Number(hpPrice),
                targetTickets: Number(hpTarget),
                soldTickets: Number(hpSold),
              }
            : c
        )
      )
      showToast("Homepage hero text, price & display settings saved successfully!")
      router.refresh()
    } catch (err: any) {
      showToast(err.message || "Failed to update homepage settings.", "error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleQuickUpdatePrice = async (contestId: string, newPrice: number) => {
    setActionLoading(true)
    try {
      const res = await updateContestAction(contestId, { ticketPrice: newPrice })
      if (!res.ok) throw new Error(res.error)

      setContests((prev) =>
        prev.map((c) => (c.id === contestId ? { ...c, ticketPrice: newPrice, creditsPerTicket: newPrice } : c))
      )
      if (activeContest?.id === contestId) {
        setHpPrice(newPrice)
      }
      showToast(`Ticket price updated to ₹${newPrice.toLocaleString("en-IN")}! Public site reflects change.`)
      router.refresh()
    } catch (err: any) {
      showToast(err.message || "Failed to update price.", "error")
    } finally {
      setActionLoading(false)
    }
  }

  // Filtered Admin Tickets
  const filteredAdminTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchContest = ticketContestFilter === "all" || t.contestId === ticketContestFilter
      if (!matchContest) return false
      if (!ticketSearch.trim()) return true
      const q = ticketSearch.trim().toLowerCase()
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q) ||
        t.userPhone.includes(q) ||
        (t.userName && t.userName.toLowerCase().includes(q))
      )
    })
  }, [tickets, ticketContestFilter, ticketSearch])

  const paginatedAdminTickets = useMemo(() => {
    const start = (adminTicketPage - 1) * adminTicketPageSize
    return filteredAdminTickets.slice(start, start + adminTicketPageSize)
  }, [filteredAdminTickets, adminTicketPage, adminTicketPageSize])

  // Payouts Pagination
  const filteredCurrentPayouts = useMemo(() => {
    if (!payoutSearch.trim()) return payoutsData.currentPayouts
    const q = payoutSearch.trim().toLowerCase()
    return payoutsData.currentPayouts.filter(
      (p) =>
        p.userName.toLowerCase().includes(q) ||
        p.userEmail.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.payoutCode && p.payoutCode.toLowerCase().includes(q))
    )
  }, [payoutsData.currentPayouts, payoutSearch])

  const paginatedCurrentPayouts = useMemo(() => {
    const start = (payoutPage - 1) * payoutPageSize
    return filteredCurrentPayouts.slice(start, start + payoutPageSize)
  }, [filteredCurrentPayouts, payoutPage, payoutPageSize])

  const filteredPayoutHistory = useMemo(() => {
    if (!historySearch.trim()) return payoutsData.payoutHistory
    const q = historySearch.trim().toLowerCase()
    return payoutsData.payoutHistory.filter(
      (p) =>
        p.userName.toLowerCase().includes(q) ||
        p.userEmail.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    )
  }, [payoutsData.payoutHistory, historySearch])

  const paginatedPayoutHistory = useMemo(() => {
    const start = (historyPage - 1) * historyPageSize
    return filteredPayoutHistory.slice(start, start + historyPageSize)
  }, [filteredPayoutHistory, historyPage, historyPageSize])

  const handleSetActiveContest = async (contestId: string) => {
    setActionLoading(true)
    const res = await setActiveContestAction(contestId)
    if (res.ok) {
      setContests((prev) =>
        prev.map((c) => ({
          ...c,
          status: c.id === contestId ? "active" : "upcoming",
        }))
      )
      showToast("Live contest switched! Public home page and member portal updated.")
    } else {
      showToast(res.error || "Failed to switch active contest.", "error")
    }
    setActionLoading(false)
  }

  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    const res = await createContestAction({
      id: newContest.id.trim(),
      carName: newContest.carName.trim(),
      title: newContest.title.trim(),
      worthDisplay: newContest.worthDisplay.trim(),
      ticketPrice: Number(newContest.ticketPrice),
      targetTickets: Number(newContest.targetTickets),
      imageUrl: newContest.imageUrl,
      status: newContest.status,
    })

    if (res.ok) {
      setContests((prev) => [
        ...prev,
        {
          id: newContest.id,
          carName: newContest.carName,
          title: newContest.title,
          subtitle: "Official TurboRide Grand Draw",
          worthDisplay: newContest.worthDisplay,
          ticketPrice: Number(newContest.ticketPrice),
          creditsPerTicket: Number(newContest.ticketPrice),
          soldTickets: 0,
          targetTickets: Number(newContest.targetTickets),
          imageUrl: newContest.imageUrl,
          status: newContest.status as any,
          drawDate: "TBD",
        },
      ])
      setIsNewContestOpen(false)
      showToast(`New drop "${newContest.carName}" created successfully!`)
    } else {
      showToast(res.error || "Failed to create contest.", "error")
    }
    setActionLoading(false)
  }

  // MEMBER ACTIONS
  const handleToggleMemberStatus = async (memberId: string, currentStatus: "active" | "kyc_pending" | "flagged") => {
    const nextStatus = currentStatus === "active" ? "flagged" : "active"
    const res = await updateMemberStatusAction(memberId, nextStatus)
    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: nextStatus } : m))
      )
      showToast(`Member #${memberId} marked as ${nextStatus}.`)
    } else {
      showToast(res.error || "Failed to update member.", "error")
    }
  }

  const handleExportCsv = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Status", "TicketsBought", "CreditsBalance", "CashEarned", "JoinedAt"]
    const rows = filteredMembers.map((m) => [
      m.id,
      m.name,
      m.email,
      m.phone,
      m.status,
      m.ticketsBought,
      m.creditsBalance,
      m.cashEarned,
      m.joinedAt,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `turboride_members_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Exported members CSV successfully!")
  }

  // ORDER ACTIONS
  const handleUpdateOrderStatus = async (orderId: string, status: "completed" | "pending" | "refunded") => {
    const res = await updateOrderStatusAction(orderId, status)
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
      showToast(`Order #${orderId} marked as ${status}.`)
    } else {
      showToast(res.error || "Failed to update order.", "error")
    }
  }

  // PAYOUT ACTIONS
  const handleProcessPayout = async (payoutId: string, newStatus: "paid" | "hold" | "due") => {
    const res = await processPayoutAction(payoutId, newStatus)
    if (res.ok) {
      setPayoutsData((prev) => {
        let current = [...prev.currentPayouts]
        let history = [...prev.payoutHistory]
        const target = current.find((p) => p.id === payoutId) || history.find((p) => p.id === payoutId)

        if (!target) return prev

        const updatedTarget = { ...target, status: newStatus, paidAt: newStatus === "paid" ? new Date().toISOString() : undefined }

        if (newStatus === "paid") {
          current = current.filter((p) => p.id !== payoutId)
          history = [updatedTarget, ...history]
        } else if (newStatus === "hold" || newStatus === "due") {
          current = current.map((p) => (p.id === payoutId ? updatedTarget : p))
        }

        const dueNow = current.filter((p) => p.status === "due").reduce((sum, p) => sum + p.amount, 0)
        const paidToDate = history.reduce((sum, p) => sum + p.amount, 0)
        const onHold = current.filter((p) => p.status === "hold").length

        return {
          currentPayouts: current,
          payoutHistory: history,
          stats: { dueNow, paidToDate, onHold },
        }
      })
      showToast(`Payout ${payoutId} updated to ${newStatus.toUpperCase()}.`)
    } else {
      showToast(res.error || "Failed to process payout.", "error")
    }
  }

  // REDEMPTION ACTIONS
  const handleMarkDone = async (id: string) => {
    setActionLoading(true)
    const res = await updateRedemptionStatusAction(id, "Fulfilled")
    if (res.ok) {
      setRedemptions((prev) =>
        prev.map((r) => (r.id === id || r.refCode === id ? { ...r, status: "Fulfilled" } : r))
      )
      showToast("Redemption marked as fulfilled.")
    } else {
      showToast(res.error || "Failed to mark fulfilled.", "error")
    }
    setActionLoading(false)
  }

  const handleOpenScheduleModal = (item: AdminRedemption) => {
    setSchedulingItem(item)
    setScheduleSlot(item.slot && item.slot !== "—" ? item.slot : "24 Sep, 14:00")
  }

  const handleConfirmSchedule = async () => {
    if (!schedulingItem) return
    setActionLoading(true)
    const res = await updateRedemptionStatusAction(schedulingItem.id, "Scheduled", scheduleSlot)
    if (res.ok) {
      setRedemptions((prev) =>
        prev.map((r) =>
          r.id === schedulingItem.id || r.refCode === schedulingItem.refCode
            ? { ...r, status: "Scheduled", slot: scheduleSlot }
            : r
        )
      )
      showToast(`Slot scheduled for ${schedulingItem.userName} (${scheduleSlot})`)
      setSchedulingItem(null)
    } else {
      showToast(res.error || "Failed to schedule slot.", "error")
    }
    setActionLoading(false)
  }

  // Filtered Members with Pagination
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const query = memberSearch.trim().toLowerCase()
      const matchesSearch =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.phone.includes(query) ||
        m.id.toLowerCase().includes(query)
      const matchesStatus = memberFilter === "all" || m.status === memberFilter
      return matchesSearch && matchesStatus
    })
  }, [members, memberSearch, memberFilter])

  const paginatedMembers = useMemo(() => {
    const start = (memberPage - 1) * memberPageSize
    return filteredMembers.slice(start, start + memberPageSize)
  }, [filteredMembers, memberPage, memberPageSize])

  // Filtered Orders with Pagination
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !orderSearch.trim() ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.userName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.userEmail.toLowerCase().includes(orderSearch.toLowerCase())

      const matchesStatus =
        orderFilter === "all" ||
        (orderFilter === "completed" && (o.status === "completed" || (o.status as any) === "paid")) ||
        o.status === orderFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, orderSearch, orderFilter])

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * orderPageSize
    return filteredOrders.slice(start, start + orderPageSize)
  }, [filteredOrders, orderPage, orderPageSize])

  // Filtered Redemptions with Pagination
  const filteredRedemptions = useMemo(() => {
    return redemptions.filter((r) => {
      const q = redemptionSearch.trim().toLowerCase()
      const matchesSearch =
        !q ||
        r.refCode.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.rewardTitle.toLowerCase().includes(q) ||
        (r.venue && r.venue.toLowerCase().includes(q))
      const matchesStatus = redemptionFilter === "All" || r.status.toLowerCase() === redemptionFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [redemptions, redemptionSearch, redemptionFilter])

  const paginatedRedemptions = useMemo(() => {
    const start = (redemptionPage - 1) * redemptionPageSize
    return filteredRedemptions.slice(start, start + redemptionPageSize)
  }, [filteredRedemptions, redemptionPage, redemptionPageSize])

  const requestedCount = useMemo(() => redemptions.filter((r) => r.status.toLowerCase() === "requested").length, [redemptions])
  const scheduledCount = useMemo(() => redemptions.filter((r) => r.status.toLowerCase() === "scheduled").length, [redemptions])
  const fulfilledCount = useMemo(() => redemptions.filter((r) => r.status.toLowerCase() === "fulfilled").length, [redemptions])

  const navItems = [
    { id: "overview", label: "Overview", icon: SquaresFour },
    { id: "contests", label: "Contests", icon: Trophy },
    { id: "members", label: "Members", icon: Users },
    { id: "orders", label: "Orders", icon: Receipt },
    { id: "referrals", label: "Referral payouts", icon: ArrowsClockwise },
    { id: "redemptions", label: "Redemptions", icon: Gift },
    { id: "settings", label: "Settings", icon: Gear },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 flex flex-col lg:flex-row font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-mono flex items-center gap-2 animate-in slide-in-from-top-2 ${
            toastMsg.type === "success"
              ? "bg-zinc-950 text-white border-zinc-800"
              : "bg-red-600 text-white border-red-700"
          }`}
        >
          {toastMsg.type === "success" ? <Check size={16} /> : <X size={16} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* MOBILE TOP BAR (visible on screens < lg) */}
      <div className="lg:hidden h-16 border-b border-zinc-200 bg-white px-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center">
          <span className="text-lg font-black tracking-tight text-zinc-950 uppercase font-sans">
            WINMY<span className="text-[#ea580c]">PORSCHE</span>
          </span>
          <span className="ml-2 text-[10px] font-mono uppercase bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-bold">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-800 hover:bg-zinc-100 cursor-pointer"
        >
          {mobileSidebarOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-black/40 lg:hidden flex flex-col" onClick={() => setMobileSidebarOpen(false)}>
          <div className="bg-white w-64 h-full p-4 space-y-2 shadow-2xl flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => switchTab(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#ea580c] text-white shadow-xs font-bold"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70"
                    }`}
                  >
                    <Icon size={17} weight={isActive ? "bold" : "regular"} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
            <div className="pt-4 border-t border-zinc-100">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-950 p-2 rounded-lg"
              >
                <ArrowSquareOut size={15} />
                <span>View public site</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-zinc-200/90 flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen">
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 pb-5 border-b border-zinc-100">
            <Link href="/" className="block">
              <span className="text-xl font-black tracking-tight text-zinc-950 uppercase font-sans">
                WINMY<span className="text-[#ea580c]">PORSCHE</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block font-semibold">
                ADMIN CONSOLE
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => switchTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ea580c] text-white shadow-xs font-bold"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70"
                  }`}
                >
                  <Icon size={17} weight={isActive ? "bold" : "regular"} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* View Public Site Footer */}
        <div className="p-4 border-t border-zinc-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-950 transition-colors p-2 rounded-lg hover:bg-zinc-50"
          >
            <ArrowSquareOut size={15} />
            <span>View public site</span>
          </Link>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT BODY */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Prototype Header Strip inside main matching Screenshot 1 & 2 */}
        <div className="px-6 sm:px-8 lg:px-10 pt-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/70 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#fef3c7] text-[#92400e]">
                Prototype
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Mock data — no live actions
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#ea580c] text-white font-bold text-xs flex items-center justify-center font-mono tracking-wider">
              AD
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                OVERVIEW
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Live snapshot of ticket sales, members, credits, and payouts.
              </p>
            </div>

            {/* 8 Metric KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <Receipt size={14} />
                  <span>Tickets sold</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 block">
                  {initialOverview.stats.ticketsSold.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Across all contests</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <Receipt size={14} />
                  <span>Gross ticket revenue</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 block">
                  ₹{initialOverview.stats.grossRevenue.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-emerald-600 font-mono font-bold">100% credit backed</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <Users size={14} />
                  <span>Active members</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 block">
                  {(initialOverview?.stats?.activeMembersCount ?? initialOverview?.stats?.activeMembers ?? 2184).toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Registered garages</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <ArrowsClockwise size={14} />
                  <span>Cash commission owed</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#ea580c] block">
                  ₹{(initialOverview?.stats?.cashCommissionOwed ?? 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Ready for payout</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <Gift size={14} />
                  <span>Drive credits issued</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 block">
                  {(initialOverview?.stats?.totalCreditsIssued ?? initialOverview?.stats?.creditsIssued ?? 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Permanent ledger</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <Gift size={14} />
                  <span>Credits redeemed</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 block">
                  {(initialOverview?.stats?.totalCreditsRedeemed ?? initialOverview?.stats?.creditsRedeemed ?? 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Track laps & rentals</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <Trophy size={14} />
                  <span>Active contest fill</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 block">
                  {initialOverview.stats.contestFill}%
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">{activeContest?.carName || "Porsche 718"}</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mb-1">
                  <Trophy size={14} />
                  <span>Active contests</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 block">
                  {initialOverview.stats.liveContestsCount}
                </span>
                <span className="text-[11px] text-emerald-600 font-mono font-bold">Live grand draw</span>
              </div>
            </div>

            {/* Quick Actions & Live Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-white border border-zinc-200/90 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-mono">
                    Recent Activity Feed
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">Live updates</span>
                </div>
                <div className="space-y-3">
                  {(initialOverview.activities || initialOverview.activity || []).map((act: any) => (
                    <div key={act.id} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-50 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        <span className="text-zinc-800">{act.title}</span>
                      </div>
                      <span className="text-zinc-400 text-[11px]">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-zinc-200/90 p-6 shadow-2xs space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-mono">
                    Admin Shortlinks
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">Instant jump</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => switchTab("contests")}
                    className="w-full text-left p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-colors flex items-center justify-between text-xs font-mono cursor-pointer"
                  >
                    <span>Manage Car Drops</span>
                    <CaretRight size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={() => switchTab("redemptions")}
                    className="w-full text-left p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-colors flex items-center justify-between text-xs font-mono cursor-pointer"
                  >
                    <span>Fulfill Drive Redemptions</span>
                    <CaretRight size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={() => switchTab("referrals")}
                    className="w-full text-left p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-colors flex items-center justify-between text-xs font-mono cursor-pointer"
                  >
                    <span>Process Due Cash Payouts</span>
                    <CaretRight size={14} className="text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* TAB 2: CONTESTS */}
        {activeTab === "contests" && (
          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                  SUPERCAR DROPS & CONTESTS
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Control live active vehicle, adjust pool sizes, target tickets, ticket pricing, and homepage displays.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewContestOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors font-mono"
                >
                  <Plus size={16} weight="bold" />
                  <span>New Contest Drop</span>
                </button>
              </div>
            </div>

            {/* HOMEPAGE DISPLAY & LIVE PRICING CONTROL CENTER */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-950">
                      Live Homepage Showcase & Pricing Control
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Instantly tune what visitors see on the homepage hero, live ticket price, and pool progress.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400">Live Vehicle:</span>
                  <select
                    value={activeContest?.id || ""}
                    onChange={(e) => handleSetActiveContest(e.target.value)}
                    disabled={actionLoading}
                    className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-zinc-900 cursor-pointer focus:outline-none"
                  >
                    {contests.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.carName} {c.status === "active" ? "(Active Live)" : `(${c.status})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Pricing Control Strip */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Ticket Price & Credit Multiplier
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      1 Ticket = ₹{Number(hpPrice).toLocaleString("en-IN")} + {Number(hpPrice).toLocaleString("en-IN")} permanent Drive Credits
                    </span>
                  </div>

                  {/* 1-Click Price Presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[500, 1000, 1500, 2000, 2500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setHpPrice(preset)
                          if (activeContest) handleQuickUpdatePrice(activeContest.id, preset)
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          Number(hpPrice) === preset
                            ? "bg-[#ea580c] text-white shadow-2xs"
                            : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        ₹{preset.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-200/60">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Custom Ticket Price (₹)
                    </label>
                    <input
                      type="number"
                      value={hpPrice}
                      onChange={(e) => setHpPrice(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Target Pool Tickets
                    </label>
                    <input
                      type="number"
                      value={hpTarget}
                      onChange={(e) => setHpTarget(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Sold Tickets Counter
                    </label>
                    <input
                      type="number"
                      value={hpSold}
                      onChange={(e) => setHpSold(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage Hero Texts Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Homepage Title / Headline
                  </label>
                  <input
                    type="text"
                    value={hpTitle}
                    onChange={(e) => setHpTitle(e.target.value)}
                    placeholder="e.g. PORSCHE 718 CAYMAN"
                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Homepage Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={hpSubtitle}
                    onChange={(e) => setHpSubtitle(e.target.value)}
                    placeholder="e.g. The yellow mid-engine legend..."
                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Market Valuation Text
                  </label>
                  <input
                    type="text"
                    value={hpWorth}
                    onChange={(e) => setHpWorth(e.target.value)}
                    placeholder="e.g. Worth over ₹1.6 Crore"
                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveHomepageSettings}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <Check size={16} weight="bold" />
                  <span>{actionLoading ? "Updating..." : "Save Homepage & Price Settings"}</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE SELECTOR: Vehicle Drops vs Tickets Ledger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 w-fit">
                <button
                  type="button"
                  onClick={() => setContestViewMode("cards")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    contestViewMode === "cards"
                      ? "bg-white text-zinc-950 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <Trophy size={14} weight="bold" />
                  <span>Vehicle Drops ({contests.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContestViewMode("tickets")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    contestViewMode === "tickets"
                      ? "bg-white text-zinc-950 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <Ticket size={14} weight="bold" />
                  <span>All Issued Tickets ({tickets.length.toLocaleString("en-IN")})</span>
                </button>
              </div>

              {contestViewMode === "tickets" && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={ticketSearch}
                      onChange={(e) => {
                        setTicketSearch(e.target.value)
                        setAdminTicketPage(1)
                      }}
                      placeholder="Search ticket #, email, phone..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                    />
                  </div>

                  <select
                    value={ticketContestFilter}
                    onChange={(e) => {
                      setTicketContestFilter(e.target.value)
                      setAdminTicketPage(1)
                    }}
                    className="h-9 px-3 rounded-lg border border-zinc-200 text-xs font-mono bg-white text-zinc-700 cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Contests</option>
                    {contests.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.carName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* MODE 1: CONTEST DROPS CARDS */}
            {contestViewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((c) => {
                  const fill = Math.round((c.soldTickets / c.targetTickets) * 100)
                  const isActive = c.status === "active"

                  return (
                    <div
                      key={c.id}
                      className={`rounded-2xl bg-white border p-5 shadow-2xs transition-all flex flex-col justify-between ${
                        isActive ? "border-orange-500 ring-2 ring-orange-500/10" : "border-zinc-200/90"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}>
                            {isActive ? "LIVE ON SITE" : c.status.toUpperCase()}
                          </span>
                          <span className="text-xs font-mono font-bold text-orange-600">
                            {c.worthDisplay}
                          </span>
                        </div>

                        <div className="relative h-32 w-full rounded-xl bg-zinc-50 flex items-center justify-center p-2 mb-4 overflow-hidden border border-zinc-100">
                          <Image
                            src={c.imageUrl || "/cars/car-718.png"}
                            alt={c.carName}
                            width={240}
                            height={100}
                            className="object-contain max-h-full"
                          />
                        </div>

                        <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight">
                          {c.carName}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono mb-4">
                          Slug: {c.id} · Draw: {c.drawDate || "30 Sep 2026"}
                        </p>

                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-500">Allocation</span>
                            <span className="font-bold text-zinc-900">{fill}% ({c.soldTickets.toLocaleString("en-IN")} / {c.targetTickets.toLocaleString("en-IN")})</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isActive ? "bg-orange-500" : "bg-zinc-400"}`}
                              style={{ width: `${Math.min(fill, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs font-mono space-y-1 mb-4">
                          <div className="flex justify-between text-zinc-500">
                            <span>Ticket Price:</span>
                            <span className="font-bold text-zinc-950">₹{c.ticketPrice.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between text-zinc-500">
                            <span>Pool Potential:</span>
                            <span className="font-bold text-zinc-950">₹{(c.ticketPrice * c.targetTickets).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                        <button
                          onClick={() => setEditingContest(c)}
                          className="flex-1 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold font-mono text-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <PencilSimple size={14} />
                          <span>Edit Details</span>
                        </button>

                        {!isActive && (
                          <button
                            onClick={() => handleSetActiveContest(c.id)}
                            disabled={actionLoading}
                            className="flex-1 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold font-mono transition-colors cursor-pointer"
                          >
                            Make Active
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* MODE 2: TICKETS LEDGER TABLE WITH PAGINATION */}
            {contestViewMode === "tickets" && (
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 font-mono">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                      Issued Tickets Ledger
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Complete cryptographic record of every draw entry sold across all supercar drops.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#ea580c]">
                    {filteredAdminTickets.length.toLocaleString("en-IN")} Tickets Found
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase">
                        <th className="pb-3 font-medium">Ticket #</th>
                        <th className="pb-3 font-medium">Contest / Drop</th>
                        <th className="pb-3 font-medium">Owner</th>
                        <th className="pb-3 font-medium">Phone</th>
                        <th className="pb-3 font-medium">Issued Date</th>
                        <th className="pb-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {paginatedAdminTickets.map((t) => {
                        const contest = contests.find((c) => c.id === t.contestId)
                        const isWon = t.isWinner || (contest?.winnerTicketNumber === t.ticketNumber)
                        const isConcluded = contest?.status === "completed"

                        return (
                          <tr key={t.id} className="hover:bg-zinc-50/50">
                            <td className="py-3 font-black text-zinc-950 tracking-tight">
                              {t.ticketNumber}
                            </td>
                            <td className="py-3">
                              <span className="font-bold text-zinc-900 block">
                                {contest?.carName || t.contestId}
                              </span>
                              <span className="text-[10px] text-zinc-400 block">
                                {t.contestId}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="font-medium text-zinc-900 block">{t.userName || "TurboRide Member"}</span>
                              <span className="text-[11px] text-zinc-400 block">{t.userEmail}</span>
                            </td>
                            <td className="py-3 text-zinc-600">{t.userPhone || "—"}</td>
                            <td className="py-3 text-zinc-500 text-[11px]">
                              {t.createdAt ? t.createdAt.split("T")[0] : "2026-09-24"}
                            </td>
                            <td className="py-3 text-center">
                              {isWon ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  ★ WINNER
                                </span>
                              ) : isConcluded ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600">
                                  CONCLUDED
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  IN DRAW
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                      {paginatedAdminTickets.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-zinc-400 font-mono italic">
                            No tickets found matching your query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Component */}
                <TablePagination
                  currentPage={adminTicketPage}
                  pageSize={adminTicketPageSize}
                  totalItems={filteredAdminTickets.length}
                  onPageChange={(p) => setAdminTicketPage(p)}
                  onPageSizeChange={(size) => setAdminTicketPageSize(size)}
                  pageSizeOptions={[10, 15, 25, 50, 100]}
                />
              </div>
            )}
          </main>
        )}

        {/* TAB 3: MEMBERS */}
        {activeTab === "members" && (
          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                  MEMBERS
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {members.length.toLocaleString("en-IN")} registered members · search, inspect wallets, and manage profiles.
                </p>
              </div>

              <button
                onClick={handleExportCsv}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors self-start sm:self-auto font-mono"
              >
                <DownloadSimple size={16} />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Table Container */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5">
                  {(["all", "active", "kyc_pending", "flagged"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setMemberFilter(filter)
                        setMemberPage(1)
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-colors cursor-pointer ${
                        memberFilter === filter
                          ? "bg-[#ea580c] text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {filter === "kyc_pending" ? "KYC Pending" : filter}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => {
                      setMemberSearch(e.target.value)
                      setMemberPage(1)
                    }}
                    placeholder="Search members..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase">
                      <th className="pb-3 font-medium">Member</th>
                      <th className="pb-3 font-medium">Joined</th>
                      <th className="pb-3 font-medium text-right">Tickets</th>
                      <th className="pb-3 font-medium text-right">Credits</th>
                      <th className="pb-3 font-medium text-right">Referrals</th>
                      <th className="pb-3 font-medium text-right">Cash Earned</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-center">Profile</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-zinc-50/50">
                        <td className="py-3">
                          <span className="font-bold text-zinc-950 block">{m.name}</span>
                          <span className="text-[11px] text-zinc-400 block">{m.email}</span>
                          <span className="text-[10px] text-zinc-300 block">{m.id}</span>
                        </td>
                        <td className="py-3 text-zinc-500">{m.joinedAt.split("T")[0]}</td>
                        <td className="py-3 text-right font-bold text-zinc-950">{m.ticketsBought}</td>
                        <td className="py-3 text-right text-zinc-700">{m.creditsBalance.toLocaleString("en-IN")}</td>
                        <td className="py-3 text-right text-zinc-700">{m.referralsCount}</td>
                        <td className="py-3 text-right">
                          {m.cashEarned > 0 ? (
                            <span className="text-[#ea580c] font-black">₹{m.cashEarned.toLocaleString("en-IN")}</span>
                          ) : (
                            <span className="text-zinc-400">locked</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            m.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : m.status === "kyc_pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {m.status === "active" ? "Active" : m.status === "kyc_pending" ? "Kyc Pending" : "Flagged"}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => setSelectedMember(m)}
                            className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-[11px] font-mono text-zinc-700 transition-colors cursor-pointer"
                          >
                            View profile
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleToggleMemberStatus(m.id, m.status)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              m.status === "active"
                                ? "bg-red-50 hover:bg-red-100 text-red-700"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {m.status === "active" ? "Flag" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginatedMembers.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-zinc-400 font-mono italic">
                          No members found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Members Pagination */}
              <TablePagination
                currentPage={memberPage}
                pageSize={memberPageSize}
                totalItems={filteredMembers.length}
                onPageChange={setMemberPage}
                onPageSizeChange={setMemberPageSize}
                pageSizeOptions={[10, 25, 50, 100]}
              />
            </div>
          </main>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === "orders" && (
          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                  ORDERS
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Complete ledger of contest ticket orders and deposit payments.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 font-bold">
                  Total Orders: {orders.length}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                  Paid: {orders.filter((o) => o.status === "completed" || (o.status as any) === "paid").length}
                </span>
              </div>
            </div>

            {/* Table Container */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5">
                  {(["all", "completed", "pending", "refunded"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setOrderFilter(filter)
                        setOrderPage(1)
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-colors cursor-pointer ${
                        orderFilter === filter
                          ? "bg-[#ea580c] text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {filter === "completed" ? "Paid" : filter}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => {
                      setOrderSearch(e.target.value)
                      setOrderPage(1)
                    }}
                    placeholder="Search orders..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase">
                      <th className="pb-3 font-medium">Order</th>
                      <th className="pb-3 font-medium">Member</th>
                      <th className="pb-3 font-medium text-right">Tickets</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 font-medium">Method</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/50">
                        <td className="py-3 text-zinc-400 text-[11px]">{o.id}</td>
                        <td className="py-3 text-zinc-950 font-bold">{o.userName}</td>
                        <td className="py-3 text-right font-black text-zinc-950">{o.ticketCount}</td>
                        <td className="py-3 text-right font-bold">₹{o.amountPaid.toLocaleString("en-IN")}</td>
                        <td className="py-3 text-zinc-500">{o.paymentGateway || "UPI"}</td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => {
                              const nextStatus = o.status === "completed" ? "refunded" : "completed"
                              handleUpdateOrderStatus(o.id, nextStatus)
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              o.status === "completed" || (o.status as any) === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : o.status === "pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                            }`}
                            title="Click to toggle status"
                          >
                            {o.status === "completed" ? "Paid" : o.status}
                          </button>
                        </td>
                        <td className="py-3 text-right text-zinc-400 text-[11px]">
                          {o.createdAt.replace("T", " ").slice(5, 16)}
                        </td>
                      </tr>
                    ))}
                    {paginatedOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400 font-mono italic">
                          No orders found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Orders Pagination */}
              <TablePagination
                currentPage={orderPage}
                pageSize={orderPageSize}
                totalItems={filteredOrders.length}
                onPageChange={setOrderPage}
                onPageSizeChange={setOrderPageSize}
                pageSizeOptions={[10, 25, 50]}
              />
            </div>
          </main>
        )}

        {/* TAB 5: REFERRAL PAYOUTS */}
        {activeTab === "referrals" && (
          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                REFERRAL PAYOUTS
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Members earn 25% cash commission after buying 25 tickets. Process live payouts.
              </p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <span className="text-zinc-400 text-xs font-mono font-medium block mb-1">Due Now</span>
                <span className="text-3xl font-black font-mono text-[#ea580c] block">
                  ₹{payoutsData.stats.dueNow.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Awaiting settlement</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <span className="text-zinc-400 text-xs font-mono font-medium block mb-1">Paid to Date</span>
                <span className="text-3xl font-black font-mono text-emerald-600 block">
                  ₹{payoutsData.stats.paidToDate.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Completed transfers</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <span className="text-zinc-400 text-xs font-mono font-medium block mb-1">On Hold</span>
                <span className="text-3xl font-black font-mono text-zinc-950 block">
                  {payoutsData.stats.onHold}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">KYC / details needed</span>
              </div>
            </div>

            {/* Due Payouts Table */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3 font-mono">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Current Payout Batches
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {filteredCurrentPayouts.length} pending settlement
                  </span>
                </div>

                <div className="relative w-full sm:w-64">
                  <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={payoutSearch}
                    onChange={(e) => {
                      setPayoutSearch(e.target.value)
                      setPayoutPage(1)
                    }}
                    placeholder="Search pending payouts..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg border border-zinc-200 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase">
                      <th className="pb-3 font-medium">Payout ID</th>
                      <th className="pb-3 font-medium">Member</th>
                      <th className="pb-3 font-medium">UPI / Bank</th>
                      <th className="pb-3 font-medium text-right">Commission Amount</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedCurrentPayouts.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 text-zinc-400 text-[11px]">{p.id}</td>
                        <td className="py-3">
                          <span className="font-bold text-zinc-950 block">{p.userName}</span>
                          <span className="text-[11px] text-zinc-400 block">{p.userEmail}</span>
                        </td>
                        <td className="py-3 text-zinc-600">{p.upiId || p.bankAccount || "rohan@okhdfcbank"}</td>
                        <td className="py-3 text-right font-black text-orange-600">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === "due" ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-700"
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleProcessPayout(p.id, "paid")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => handleProcessPayout(p.id, "hold")}
                              className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[11px] cursor-pointer"
                            >
                              Hold
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedCurrentPayouts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-zinc-400 font-mono italic">
                          No pending payouts due right now.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Current Payouts Pagination */}
              <TablePagination
                currentPage={payoutPage}
                pageSize={payoutPageSize}
                totalItems={filteredCurrentPayouts.length}
                onPageChange={(p) => setPayoutPage(p)}
                onPageSizeChange={(size) => setPayoutPageSize(size)}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </div>

            {/* Payout History Table */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3 font-mono">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Payout History
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {filteredPayoutHistory.length} completed
                  </span>
                </div>

                <div className="relative w-full sm:w-64">
                  <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => {
                      setHistorySearch(e.target.value)
                      setHistoryPage(1)
                    }}
                    placeholder="Search payout history..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg border border-zinc-200 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase">
                      <th className="pb-3 font-medium">Payout ID</th>
                      <th className="pb-3 font-medium">Member</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-right">Settled At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedPayoutHistory.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 text-zinc-400 text-[11px]">{p.id}</td>
                        <td className="py-3 font-bold text-zinc-950">{p.userName}</td>
                        <td className="py-3 text-right font-black text-emerald-600">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            PAID
                          </span>
                        </td>
                        <td className="py-3 text-right text-zinc-400 text-[11px]">
                          {p.paidAt ? p.paidAt.split("T")[0] : "2026-09-24"}
                        </td>
                      </tr>
                    ))}
                    {paginatedPayoutHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-zinc-400 font-mono italic">
                          No historical payouts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* History Pagination */}
              <TablePagination
                currentPage={historyPage}
                pageSize={historyPageSize}
                totalItems={filteredPayoutHistory.length}
                onPageChange={(p) => setHistoryPage(p)}
                onPageSizeChange={(size) => setHistoryPageSize(size)}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </div>
          </main>
        )}

        {/* TAB 6: REDEMPTIONS (Matching Screenshot 1 exactly) */}
        {activeTab === "redemptions" && (
          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
                REDEMPTIONS
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Drive-credit bookings at Turboride venues. Scheduling and completion actions are mock only.
              </p>
            </div>

            {/* 3 Top Stat Cards matching Screenshot 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1: Requested */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold">
                  <Ticket size={16} />
                  <span>Requested</span>
                </div>
                <div className="text-3xl font-black text-zinc-950 mt-3 mb-1">
                  {requestedCount}
                </div>
                <div className="text-xs text-zinc-400">
                  Awaiting scheduling
                </div>
              </div>

              {/* Card 2: Scheduled */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold">
                  <Calendar size={16} />
                  <span>Scheduled</span>
                </div>
                <div className="text-3xl font-black text-zinc-950 mt-3 mb-1">
                  {scheduledCount}
                </div>
                <div className="text-xs text-zinc-400 min-h-[16px]"></div>
              </div>

              {/* Card 3: Fulfilled */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold">
                  <CheckCircle size={16} />
                  <span>Fulfilled</span>
                </div>
                <div className="text-3xl font-black text-zinc-950 mt-3 mb-1">
                  {fulfilledCount}
                </div>
                <div className="text-xs text-zinc-400 min-h-[16px]"></div>
              </div>
            </div>

            {/* ALL REDEMPTIONS Table Card matching Screenshot 1 */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs uppercase tracking-wider text-zinc-900">
                    ALL REDEMPTIONS
                  </span>
                  <div className="flex items-center gap-1 pl-2">
                    {(["All", "Requested", "Scheduled", "Fulfilled"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setRedemptionFilter(tab)
                          setRedemptionPage(1)
                        }}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                          redemptionFilter === tab
                            ? "bg-[#ea580c] text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={redemptionSearch}
                    onChange={(e) => {
                      setRedemptionSearch(e.target.value)
                      setRedemptionPage(1)
                    }}
                    placeholder="Search redemptions..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg border border-zinc-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase">
                      <th className="pb-3 font-medium">REF</th>
                      <th className="pb-3 font-medium">MEMBER</th>
                      <th className="pb-3 font-medium">REWARD</th>
                      <th className="pb-3 font-medium text-right">CREDITS</th>
                      <th className="pb-3 font-medium">VENUE</th>
                      <th className="pb-3 font-medium">SLOT</th>
                      <th className="pb-3 font-medium text-center">STATUS</th>
                      <th className="pb-3 font-medium text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedRedemptions.map((r) => {
                      const isScheduled = r.status.toLowerCase() === "scheduled"
                      const isFulfilled = r.status.toLowerCase() === "fulfilled"
                      const isRequested = r.status.toLowerCase() === "requested"

                      return (
                        <tr key={r.id} className="hover:bg-zinc-50/50">
                          <td className="py-3.5 text-zinc-600 font-bold text-xs">{r.refCode}</td>
                          <td className="py-3.5 font-bold text-zinc-950">{r.userName}</td>
                          <td className="py-3.5 text-zinc-800">{r.rewardTitle}</td>
                          <td className="py-3.5 text-right font-black text-zinc-900">
                            {r.creditsSpent.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 text-zinc-600">{r.venue || "Turboride Bengaluru"}</td>
                          <td className="py-3.5 text-zinc-700">{r.slot || "—"}</td>
                          <td className="py-3.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                isScheduled
                                  ? "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                                  : isFulfilled
                                  ? "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]"
                                  : "bg-[#fffbeb] text-[#b45309] border-[#fde68a]"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {isScheduled && (
                              <button
                                onClick={() => handleMarkDone(r.id)}
                                className="px-3 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                              >
                                Mark done
                              </button>
                            )}
                            {isRequested && (
                              <button
                                onClick={() => handleOpenScheduleModal(r)}
                                className="px-3 py-1 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Schedule
                              </button>
                            )}
                            {isFulfilled && <span className="text-zinc-400">—</span>}
                          </td>
                        </tr>
                      )
                    })}
                    {paginatedRedemptions.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-zinc-400 font-mono italic">
                          No redemptions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Redemptions Pagination */}
              <TablePagination
                currentPage={redemptionPage}
                pageSize={redemptionPageSize}
                totalItems={filteredRedemptions.length}
                onPageChange={setRedemptionPage}
                onPageSizeChange={setRedemptionPageSize}
                pageSizeOptions={[5, 10, 25]}
              />
            </div>
          </main>
        )}

        {/* TAB 7: SETTINGS (Matching Screenshot 2 exactly) */}
        {activeTab === "settings" && (
          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
                  SETTINGS
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Pricing, credits, and referral economics. Persisted live to PostgreSQL database.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer self-start sm:self-auto disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingSettings ? (
                  <>
                    <ArrowsClockwise size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>

            {/* 4 Cards in 2x2 Grid matching Screenshot 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: PRICING & CREDITS */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900 mb-4">
                    PRICING & CREDITS
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Ticket price
                      </label>
                      <div className="flex items-center bg-[#f4f4f5]/80 rounded-xl px-3.5 py-2.5">
                        <span className="text-zinc-500 text-xs font-mono mr-2">₹</span>
                        <input
                          type="number"
                          value={settings.ticketPrice}
                          onChange={(e) => setSettings({ ...settings, ticketPrice: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Per ticket</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Credits per ticket
                      </label>
                      <div className="flex items-center justify-between bg-[#f4f4f5]/80 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.creditsPerTicket}
                          onChange={(e) => setSettings({ ...settings, creditsPerTicket: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-mono ml-2">cr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: REFERRAL ECONOMICS */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900 mb-4">
                    REFERRAL ECONOMICS
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Drive-credit reward
                      </label>
                      <div className="flex items-center justify-between bg-[#f4f4f5]/80 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.creditRewardPercent}
                          onChange={(e) => setSettings({ ...settings, creditRewardPercent: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-mono ml-2">%</span>
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Of referred buyer's credits</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Cash commission
                      </label>
                      <div className="flex items-center justify-between bg-[#f4f4f5]/80 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.cashCommissionPercent}
                          onChange={(e) => setSettings({ ...settings, cashCommissionPercent: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-mono ml-2">%</span>
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Of referred buyer's spend</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Cash unlock threshold
                    </label>
                    <div className="flex items-center justify-between bg-[#f4f4f5]/80 rounded-xl px-3.5 py-2.5">
                      <input
                        type="number"
                        value={settings.cashUnlockThreshold}
                        onChange={(e) => setSettings({ ...settings, cashUnlockThreshold: Number(e.target.value) })}
                        className="w-full bg-transparent text-xs font-mono text-zinc-900 focus:outline-none"
                      />
                      <span className="text-zinc-500 text-xs font-mono ml-2">tickets</span>
                    </div>
                    <span className="block text-[11px] text-zinc-400 mt-1">Buy to unlock cash commission</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: CONTEST RULES */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900 mb-4">
                    CONTEST RULES
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Fallback payout
                      </label>
                      <div className="flex items-center justify-between bg-[#f4f4f5]/80 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.fallbackPayoutPercent}
                          onChange={(e) => setSettings({ ...settings, fallbackPayoutPercent: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-mono ml-2">%</span>
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Of collected amount if not sold out</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Draw type
                      </label>
                      <div className="flex items-center bg-[#f4f4f5]/80 rounded-xl px-3.5 py-2.5">
                        <input
                          type="text"
                          value={settings.drawType}
                          onChange={(e) => setSettings({ ...settings, drawType: e.target.value })}
                          className="w-full bg-transparent text-xs font-mono text-zinc-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: DANGER ZONE */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900 mb-4">
                    DANGER ZONE
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <div className="font-bold text-xs text-zinc-900">Pause ticket sales</div>
                        <div className="text-xs text-zinc-400">Preview state only. No purchases are affected.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSettings({ ...settings, isPaused: !settings.isPaused })
                          showToast(!settings.isPaused ? "Ticket sales paused (Demo preview)." : "Ticket sales resumed.")
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                          settings.isPaused
                            ? "bg-amber-500 text-white border-amber-600"
                            : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {settings.isPaused ? "Resume demo" : "Pause demo"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-zinc-900">Close contest</div>
                        <div className="text-xs text-zinc-400">Simulates locking entries; does not trigger a draw.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSettings({ ...settings, isClosed: !settings.isClosed })
                          showToast(!settings.isClosed ? "Contest locked (Demo preview)." : "Contest reopened.")
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                          settings.isClosed
                            ? "bg-red-600 text-white border-red-700"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {settings.isClosed ? "Reopen demo" : "Close demo"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        )}

      </div>

      {/* SCHEDULING MODAL FOR REDEMPTIONS */}
      {schedulingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4 font-mono text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-zinc-950 uppercase">
                  Schedule Redemption
                </h3>
                <span className="text-[11px] text-zinc-400">{schedulingItem.refCode} · {schedulingItem.userName}</span>
              </div>
              <button
                onClick={() => setSchedulingItem(null)}
                className="p-1 text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-zinc-500 block mb-1">Selected Reward:</span>
                <span className="font-bold text-zinc-900 text-sm">{schedulingItem.rewardTitle}</span>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Venue:</span>
                <span className="font-bold text-zinc-800">{schedulingItem.venue || "Turboride Bengaluru"}</span>
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1.5">
                  Select Track / Experience Slot:
                </label>
                <input
                  type="text"
                  value={scheduleSlot}
                  onChange={(e) => setScheduleSlot(e.target.value)}
                  placeholder="e.g. 24 Sep, 14:00"
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {["22 Sep, 11:30", "24 Sep, 14:00", "26 Sep, 10:00", "28 Sep, 16:30"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setScheduleSlot(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${
                      scheduleSlot === preset
                        ? "bg-[#ea580c] text-white border-[#ea580c]"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSchedulingItem(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                {actionLoading ? "Scheduling..." : "Confirm & Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CONTEST MODAL */}
      {editingContest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-black uppercase text-zinc-950 font-mono">
                Edit Contest: {editingContest.carName}
              </h3>
              <button
                onClick={() => setEditingContest(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveContest} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                  Car Name (Title)
                </label>
                <input
                  type="text"
                  value={editingContest.carName}
                  onChange={(e) => setEditingContest({ ...editingContest, carName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Worth Display Text
                  </label>
                  <input
                    type="text"
                    value={editingContest.worthDisplay}
                    onChange={(e) => setEditingContest({ ...editingContest, worthDisplay: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingContest.ticketPrice}
                    onChange={(e) => setEditingContest({ ...editingContest, ticketPrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Sold Tickets Count
                  </label>
                  <input
                    type="number"
                    value={editingContest.soldTickets}
                    onChange={(e) => setEditingContest({ ...editingContest, soldTickets: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Target Tickets (Total Pool)
                  </label>
                  <input
                    type="number"
                    value={editingContest.targetTickets}
                    onChange={(e) => setEditingContest({ ...editingContest, targetTickets: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Status
                  </label>
                  <select
                    value={editingContest.status}
                    onChange={(e) => setEditingContest({ ...editingContest, status: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs bg-white"
                  >
                    <option value="active">Active (Live On Site)</option>
                    <option value="upcoming">Scheduled (Upcoming)</option>
                    <option value="completed">Completed (Archived)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Draw Date (Text / ISO)
                  </label>
                  <input
                    type="text"
                    value={editingContest.drawDate || ""}
                    onChange={(e) => setEditingContest({ ...editingContest, drawDate: e.target.value })}
                    placeholder="30 Sep 2026"
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingContest(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CONTEST MODAL */}
      {isNewContestOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-black uppercase text-zinc-950 font-mono">
                Create New Supercar Drop
              </h3>
              <button
                onClick={() => setIsNewContestOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateContest} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                  Unique Slug / ID (e.g. ferrari-296)
                </label>
                <input
                  type="text"
                  value={newContest.id}
                  onChange={(e) => setNewContest({ ...newContest, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  placeholder="e.g. lamborghini-huracan"
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                  Car Name (Title)
                </label>
                <input
                  type="text"
                  value={newContest.carName}
                  onChange={(e) => setNewContest({ ...newContest, carName: e.target.value, title: `Win A ${e.target.value}` })}
                  placeholder="e.g. Lamborghini Huracán Tecnica"
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Worth Display Text
                  </label>
                  <input
                    type="text"
                    value={newContest.worthDisplay}
                    onChange={(e) => setNewContest({ ...newContest, worthDisplay: e.target.value })}
                    placeholder="₹4.50 Cr Value"
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                    Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newContest.ticketPrice}
                    onChange={(e) => setNewContest({ ...newContest, ticketPrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-600 mb-1">
                  Target Pool Entries
                </label>
                <input
                  type="number"
                  value={newContest.targetTickets}
                  onChange={(e) => setNewContest({ ...newContest, targetTickets: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-300 font-mono text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsNewContestOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {actionLoading ? "Creating..." : "Create Contest"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER PROFILE DRAWER / MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4 font-mono text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-zinc-950 uppercase">
                  {selectedMember.name}
                </h3>
                <span className="text-[11px] text-zinc-400">{selectedMember.email}</span>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-zinc-50">
                <span className="text-zinc-500">Member ID:</span>
                <span className="font-bold text-zinc-900">{selectedMember.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50">
                <span className="text-zinc-500">Phone:</span>
                <span className="text-zinc-900">{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50">
                <span className="text-zinc-500">Referral Code:</span>
                <span className="font-bold text-[#ea580c]">{selectedMember.referralCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50">
                <span className="text-zinc-500">Tickets Purchased:</span>
                <span className="font-bold text-zinc-900">{selectedMember.ticketsBought}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50">
                <span className="text-zinc-500">Drive Credits Balance:</span>
                <span className="font-bold text-emerald-600">{selectedMember.creditsBalance.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50">
                <span className="text-zinc-500">Cash Commission Earned:</span>
                <span className="font-black text-[#ea580c]">₹{selectedMember.cashEarned.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50">
                <span className="text-zinc-500">Account Status:</span>
                <span className="font-bold uppercase text-zinc-900">{selectedMember.status}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
