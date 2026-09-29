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
  CaretDown,
  Calendar,
  Ticket,
  List,
  SignOut,
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
import { logoutAdminAction, type AdminSession } from "@/lib/auth"
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
  adminSession?: AdminSession
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-100 text-xs">
      {/* Range indicator */}
      <div className="flex flex-wrap items-center justify-between sm:justify-start w-full sm:w-auto gap-2 text-zinc-500">
        <span>
          Showing <strong className="text-zinc-900 font-bold">{startItem}</strong>–<strong className="text-zinc-900 font-bold">{endItem}</strong> of{" "}
          <strong className="text-zinc-900 font-bold">{totalItems.toLocaleString("en-IN")}</strong>
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-zinc-200">
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
      <div className="flex items-center justify-center gap-1 w-full sm:w-auto">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-2.5 py-1 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-xs font-bold transition-colors"
        >
          Prev
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
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${currentPage === page
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

function formatMemberName(name?: string) {
  if (!name || name === "TurboAdmin!2026" || name.includes("Admin!")) return "TurboRide Admin"
  return name
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
  adminSession,
}: AdminConsoleProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAdminAction()
    router.refresh()
  }

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
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false)

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
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-2 ${toastMsg.type === "success"
            ? "bg-zinc-950 text-white border-zinc-800"
            : "bg-red-600 text-white border-red-700"
            }`}
        >
          {toastMsg.type === "success" ? <Check size={16} /> : <X size={16} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* MOBILE TOP BAR (visible on screens < lg) */}
      <div className="lg:hidden h-14 sm:h-16 border-b border-zinc-200 bg-white px-3.5 sm:px-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center">
          <span className="text-base sm:text-lg font-black tracking-tight text-zinc-950 uppercase font-sans">
            WINMY<span className="text-[#ea580c]">PORSCHE</span>
          </span>
          <span className="ml-2 text-[10px] uppercase bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-bold">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-800 hover:bg-zinc-100 cursor-pointer"
        >
          {mobileSidebarOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {/* MOBILE QUICK TABS SCROLLER */}
      <div className="lg:hidden border-b border-zinc-200 bg-white/95 backdrop-blur-md px-3 py-2 flex items-center gap-1.5 overflow-x-auto sticky top-14 sm:top-16 z-30 shadow-2xs">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => switchTab(item.id as TabType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${isActive
                ? "bg-[#ea580c] text-white shadow-2xs"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
            >
              <Icon size={14} weight={isActive ? "bold" : "regular"} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 top-14 sm:top-16 z-50 bg-black/40 lg:hidden flex flex-col" onClick={() => setMobileSidebarOpen(false)}>
          <div className="bg-white w-64 h-full p-4 space-y-2 shadow-2xl flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => switchTab(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
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
            <div className="pt-4 border-t border-zinc-100 space-y-1">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-950 p-2 rounded-lg"
              >
                <ArrowSquareOut size={15} />
                <span>View public site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 cursor-pointer"
              >
                <SignOut size={15} weight="bold" />
                <span>Sign Out</span>
              </button>
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
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase block font-bold">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
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
        <div className="p-4 border-t border-zinc-100 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors p-2 rounded-lg hover:bg-zinc-50"
          >
            <ArrowSquareOut size={15} />
            <span>View public site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 cursor-pointer"
          >
            <SignOut size={15} weight="bold" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT BODY */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Live Admin Header Strip inside main */}
        <div className="px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-200/70 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Database Connected
              </span>
              <span className="hidden sm:inline text-xs text-zinc-500">
                Neon PostgreSQL · {adminSession?.email || "admin@turboride.com"}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ea580c] text-white font-bold text-xs flex items-center justify-center tracking-wider shadow-2xs">
                  {(adminSession?.email?.slice(0, 2) || "AD").toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-zinc-800">
                  {adminSession?.email || "admin@turboride.com"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out of Admin Console"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
              >
                <SignOut size={14} weight="bold" />
                <span className="hidden xs:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                OVERVIEW
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Real-time snapshot of ticket entries, members, credits, and payouts.
              </p>
            </div>

            {/* 8 Metric KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <Receipt size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Tickets sold</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 block tracking-tight">
                    {initialOverview.stats.ticketsSold.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium mt-2 block">Across all contests</span>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <Receipt size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Gross revenue</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 block tracking-tight">
                    ₹{initialOverview.stats.grossRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold mt-2 block">1:1 Drive Credits backed</span>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <Users size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Active members</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 block tracking-tight">
                    {(initialOverview?.stats?.activeMembersCount ?? initialOverview?.stats?.activeMembers ?? 2184).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium mt-2 block">Registered garages</span>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <ArrowsClockwise size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Commission owed</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#ea580c] block tracking-tight">
                    ₹{(initialOverview?.stats?.cashCommissionOwed ?? 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[11px] text-orange-600 font-bold mt-2 block">Ready for payout</span>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <Gift size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Credits issued</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 block tracking-tight">
                    {(initialOverview?.stats?.totalCreditsIssued ?? initialOverview?.stats?.creditsIssued ?? 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium mt-2 block">In member wallets</span>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <Gift size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Credits redeemed</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 block tracking-tight">
                    {(initialOverview?.stats?.totalCreditsRedeemed ?? initialOverview?.stats?.creditsRedeemed ?? 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium mt-2 block">Track laps & rentals</span>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <Trophy size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Contest fill</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 block tracking-tight">
                    {initialOverview.stats.contestFill}%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium mt-2 block truncate">{activeContest?.carName || "Porsche 718"}</span>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1.5">
                    <Trophy size={14} className="shrink-0 text-zinc-400" />
                    <span className="truncate">Active drop</span>
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 block tracking-tight">
                    {initialOverview.stats.liveContestsCount || 1}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold mt-2 block">Live grand draw</span>
              </div>
            </div>

            {/* Quick Actions & Live Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-2xs space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-wider">
                    Recent Activity Feed
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-medium">Live updates</span>
                </div>
                <div className="space-y-2.5">
                  {(initialOverview.activities || initialOverview.activity || []).map((act: any) => (
                    <div key={act.id} className="flex items-center justify-between text-xs py-2 border-b border-zinc-50 last:border-b-0 gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span className="text-zinc-800 font-medium truncate">{act.title}</span>
                      </div>
                      <span className="text-zinc-400 text-[11px] shrink-0 font-medium">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-2xs space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-wider">
                    Admin Shortlinks
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-medium">Quick navigation</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => switchTab("contests")}
                    className="w-full text-left p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200 transition-colors flex items-center justify-between text-xs font-semibold text-zinc-800 cursor-pointer"
                  >
                    <span>Manage Car Drops</span>
                    <CaretRight size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={() => switchTab("redemptions")}
                    className="w-full text-left p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200 transition-colors flex items-center justify-between text-xs font-semibold text-zinc-800 cursor-pointer"
                  >
                    <span>Fulfill Drive Redemptions</span>
                    <CaretRight size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={() => switchTab("referrals")}
                    className="w-full text-left p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200 transition-colors flex items-center justify-between text-xs font-semibold text-zinc-800 cursor-pointer"
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
          <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                  SUPERCAR DROPS & CONTESTS
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Control active vehicle drops, ticket pools, pricing, and live homepage displays.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewContestOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus size={16} weight="bold" />
                  <span>New Contest Drop</span>
                </button>
              </div>
            </div>

            {/* HOMEPAGE DISPLAY & LIVE PRICING CONTROL CENTER */}
            <div className="rounded-2xl bg-white border border-zinc-200 p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-950">
                      Live Homepage Showcase & Pricing Control
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Instantly tune what visitors see on the homepage hero, live ticket price, and pool progress.
                  </p>
                </div>

                <div className="relative w-full sm:w-auto">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
                      Live Vehicle:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                      disabled={actionLoading}
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2.5 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="truncate">{activeContest?.carName || "Select Vehicle"}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full shrink-0">
                          Active Live
                        </span>
                      </div>
                      <CaretDown size={14} className={`text-zinc-500 transition-transform shrink-0 ${isVehicleDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {/* Custom Dropdown Popover */}
                  {isVehicleDropdownOpen && (
                    <>
                      {/* Transparent backdrop to close on outside tap */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsVehicleDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-full sm:w-80 bg-white rounded-2xl border border-zinc-200/90 shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95">
                        <div className="px-3 py-1.5 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          Select Homepage Showcase Vehicle
                        </div>
                        {contests.map((c) => {
                          const isSelected = activeContest?.id === c.id
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                handleSetActiveContest(c.id)
                                setIsVehicleDropdownOpen(false)
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${isSelected
                                ? "bg-orange-50/80 border border-orange-200/80 text-zinc-950 font-bold"
                                : "hover:bg-zinc-50 text-zinc-700"
                                }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${isSelected ? "border-[#ea580c] bg-[#ea580c] text-white" : "border-zinc-300"
                                  }`}>
                                  {isSelected && <Check size={10} weight="bold" />}
                                </div>
                                <div className="truncate">
                                  <div className="text-xs font-bold text-zinc-900 truncate">{c.carName}</div>
                                  <div className="text-[11px] text-zinc-400">{c.worthDisplay} · ₹{c.ticketPrice.toLocaleString("en-IN")}/tkt</div>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-2 ${c.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-zinc-100 text-zinc-600"
                                }`}>
                                {c.status === "active" ? "Active Live" : c.status}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Pricing Control Strip */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Ticket Price & Credit Multiplier
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      1 Ticket = ₹{Number(hpPrice).toLocaleString("en-IN")} + {Number(hpPrice).toLocaleString("en-IN")} permanent Drive Credits
                    </span>
                  </div>

                  {/* 1-Click Price Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
                    {[500, 1000, 1500, 2000, 2500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setHpPrice(preset)
                          if (activeContest) handleQuickUpdatePrice(activeContest.id, preset)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${Number(hpPrice) === preset
                          ? "bg-[#ea580c] text-white shadow-2xs"
                          : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                          }`}
                      >
                        ₹{preset.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-200/60">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                      Custom Ticket Price (₹)
                    </label>
                    <input
                      type="number"
                      value={hpPrice}
                      onChange={(e) => setHpPrice(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                      Target Pool Tickets
                    </label>
                    <input
                      type="number"
                      value={hpTarget}
                      onChange={(e) => setHpTarget(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                      Sold Tickets Counter
                    </label>
                    <input
                      type="number"
                      value={hpSold}
                      onChange={(e) => setHpSold(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage Hero Texts Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                    Homepage Title / Headline
                  </label>
                  <input
                    type="text"
                    value={hpTitle}
                    onChange={(e) => setHpTitle(e.target.value)}
                    placeholder="e.g. PORSCHE 718 CAYMAN"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                    Homepage Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={hpSubtitle}
                    onChange={(e) => setHpSubtitle(e.target.value)}
                    placeholder="e.g. The yellow mid-engine legend..."
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                    Market Valuation Text
                  </label>
                  <input
                    type="text"
                    value={hpWorth}
                    onChange={(e) => setHpWorth(e.target.value)}
                    placeholder="e.g. Worth over ₹1.6 Crore"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveHomepageSettings}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <Check size={16} weight="bold" />
                  <span>{actionLoading ? "Updating..." : "Save Homepage & Price Settings"}</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE SELECTOR: Vehicle Drops vs Tickets Ledger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 w-fit">
                <button
                  type="button"
                  onClick={() => setContestViewMode("cards")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${contestViewMode === "cards"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${contestViewMode === "tickets"
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                    }`}
                >
                  <Ticket size={14} weight="bold" />
                  <span>All Issued Tickets ({tickets.length.toLocaleString("en-IN")})</span>
                </button>
              </div>

              {contestViewMode === "tickets" && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                    />
                  </div>

                  <select
                    value={ticketContestFilter}
                    onChange={(e) => {
                      setTicketContestFilter(e.target.value)
                      setAdminTicketPage(1)
                    }}
                    className="h-9 px-3 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-700 cursor-pointer focus:outline-none"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {contests.map((c) => {
                  const fill = Math.round((c.soldTickets / c.targetTickets) * 100)
                  const isActive = c.status === "active"

                  return (
                    <div
                      key={c.id}
                      className={`rounded-2xl bg-white border p-4 sm:p-5 shadow-2xs transition-all flex flex-col justify-between ${isActive ? "border-orange-500 ring-2 ring-orange-500/10" : "border-zinc-200/90"
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                            }`}>
                            {isActive ? "LIVE ON SITE" : c.status.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-orange-600">
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
                        <p className="text-xs text-zinc-400 mb-4">
                          Slug: {c.id} · Draw: {c.drawDate || "30 Sep 2026"}
                        </p>

                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-xs">
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

                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-1 mb-4">
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
                          className="flex-1 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <PencilSimple size={14} />
                          <span>Edit Details</span>
                        </button>

                        {!isActive && (
                          <button
                            onClick={() => handleSetActiveContest(c.id)}
                            disabled={actionLoading}
                            className="flex-1 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
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

            {/* MODE 2: TICKETS LEDGER - DUAL REPRESENTATION (MOBILE CARDS + DESKTOP TABLE) */}
            {contestViewMode === "tickets" && (
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                      Issued Tickets Ledger
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Official ledger of every verified ticket entry issued across active and past draws.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#ea580c]">
                    {filteredAdminTickets.length.toLocaleString("en-IN")} Tickets Found
                  </span>
                </div>

                {/* MOBILE CARD VIEW (Visible on mobile only < md) */}
                <div className="md:hidden space-y-2.5">
                  {paginatedAdminTickets.map((t) => {
                    const contest = contests.find((c) => c.id === t.contestId)
                    const isWon = t.isWinner || (contest?.winnerTicketNumber === t.ticketNumber)
                    const isConcluded = contest?.status === "completed"

                    return (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl border border-zinc-200/90 bg-white space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Ticket</span>
                            <span className="text-base font-black text-zinc-950">#{t.ticketNumber}</span>
                          </div>
                          {isWon ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              ★ WINNER
                            </span>
                          ) : isConcluded ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-600">
                              CONCLUDED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              IN DRAW
                            </span>
                          )}
                        </div>

                        <div className="pt-1.5 border-t border-zinc-100 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 font-medium">Contest</span>
                            <span className="font-bold text-zinc-900">{contest?.carName || t.contestId}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 font-medium">Owner</span>
                            <span className="font-semibold text-zinc-900">{formatMemberName(t.userName)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 font-medium">Email</span>
                            <span className="text-zinc-600 truncate max-w-[200px]">{t.userEmail}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 font-medium">Phone</span>
                            <span className="text-zinc-700 font-semibold">{t.userPhone || "—"}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-zinc-100/60 text-[11px]">
                            <span className="text-zinc-400">Date Issued</span>
                            <span className="text-zinc-500">{t.createdAt ? t.createdAt.split("T")[0] : "2026-09-24"}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {paginatedAdminTickets.length === 0 && (
                    <div className="py-8 text-center text-zinc-400 italic text-xs">
                      No tickets found matching your query.
                    </div>
                  )}
                </div>

                {/* DESKTOP TABLE VIEW (Visible on md and above) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 font-semibold">Ticket #</th>
                        <th className="pb-3 font-semibold">Contest / Drop</th>
                        <th className="pb-3 font-semibold">Owner</th>
                        <th className="pb-3 font-semibold">Phone</th>
                        <th className="pb-3 font-semibold">Issued Date</th>
                        <th className="pb-3 font-semibold text-center">Status</th>
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
                              #{t.ticketNumber}
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
                              <span className="font-semibold text-zinc-900 block">{formatMemberName(t.userName)}</span>
                              <span className="text-[11px] text-zinc-400 block">{t.userEmail}</span>
                            </td>
                            <td className="py-3 text-zinc-600 font-medium">{t.userPhone || "—"}</td>
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
                          <td colSpan={6} className="py-8 text-center text-zinc-400 italic">
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
          <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                  MEMBERS
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  {members.length.toLocaleString("en-IN")} registered members · search, inspect wallets, and manage profiles.
                </p>
              </div>

              <button
                onClick={handleExportCsv}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <DownloadSimple size={16} />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Container */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(["all", "active", "kyc_pending", "flagged"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setMemberFilter(filter)
                        setMemberPage(1)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap cursor-pointer ${memberFilter === filter
                        ? "bg-[#ea580c] text-white shadow-2xs"
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
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* MOBILE CARD VIEW (Visible on mobile only < md) */}
              <div className="md:hidden space-y-3">
                {paginatedMembers.map((m) => {
                  const displayName = formatMemberName(m.name)
                  const isCurrentAdmin = m.name === "TurboAdmin!2026" || m.email === "admin@turboride.com"
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl border border-zinc-200/90 bg-white space-y-3 shadow-2xs"
                    >
                      {/* Top: Name, Status Pill */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-zinc-950 text-sm truncate">{displayName}</h4>
                            {isCurrentAdmin && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">{m.email}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">ID: {m.id} · Joined {m.joinedAt.split("T")[0]}</p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${m.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : m.status === "kyc_pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                          {m.status === "active" ? "Active" : m.status === "kyc_pending" ? "KYC Pending" : "Flagged"}
                        </span>
                      </div>

                      {/* 2x2 Stats Grid Inside Card */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
                        <div>
                          <span className="text-[11px] text-zinc-500 block font-medium">Tickets</span>
                          <span className="font-bold text-zinc-950 text-sm">{m.ticketsBought}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-zinc-500 block font-medium">Drive Credits</span>
                          <span className="font-bold text-emerald-600 text-sm">{m.creditsBalance.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-zinc-500 block font-medium">Referrals</span>
                          <span className="font-bold text-zinc-900 text-sm">{m.referralsCount}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-zinc-500 block font-medium">Cash Commission</span>
                          <span className="font-bold text-orange-600 text-sm">
                            {m.cashEarned > 0 ? `₹${m.cashEarned.toLocaleString("en-IN")}` : "₹0"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                        <button
                          onClick={() => setSelectedMember(m)}
                          className="flex-1 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          View Profile
                        </button>
                        {!isCurrentAdmin && (
                          <button
                            onClick={() => handleToggleMemberStatus(m.id, m.status)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${m.status === "active"
                              ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                              }`}
                          >
                            {m.status === "active" ? "Flag Account" : "Activate Account"}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {paginatedMembers.length === 0 && (
                  <div className="py-8 text-center text-zinc-400 italic text-xs">
                    No members found matching your search.
                  </div>
                )}
              </div>

              {/* DESKTOP TABLE VIEW (Visible on md and above) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3 font-semibold">Member</th>
                      <th className="pb-3 font-semibold">Joined</th>
                      <th className="pb-3 font-semibold text-right">Tickets</th>
                      <th className="pb-3 font-semibold text-right">Credits</th>
                      <th className="pb-3 font-semibold text-right">Referrals</th>
                      <th className="pb-3 font-semibold text-right">Cash Earned</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold text-center">Profile</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-zinc-50/50">
                        <td className="py-3.5">
                          <span className="font-bold text-zinc-950 block">{formatMemberName(m.name)}</span>
                          <span className="text-[11px] text-zinc-400 block">{m.email}</span>
                          <span className="text-[10px] text-zinc-300 block">{m.id}</span>
                        </td>
                        <td className="py-3.5 text-zinc-500">{m.joinedAt.split("T")[0]}</td>
                        <td className="py-3.5 text-right font-bold text-zinc-950">{m.ticketsBought}</td>
                        <td className="py-3.5 text-right font-semibold text-emerald-600">{m.creditsBalance.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 text-right text-zinc-700 font-medium">{m.referralsCount}</td>
                        <td className="py-3.5 text-right">
                          {m.cashEarned > 0 ? (
                            <span className="text-[#ea580c] font-black">₹{m.cashEarned.toLocaleString("en-IN")}</span>
                          ) : (
                            <span className="text-zinc-400">₹0</span>
                          )}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${m.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : m.status === "kyc_pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                            }`}>
                            {m.status === "active" ? "Active" : m.status === "kyc_pending" ? "KYC Pending" : "Flagged"}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => setSelectedMember(m)}
                            className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-[11px] text-zinc-700 transition-colors cursor-pointer"
                          >
                            View profile
                          </button>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleToggleMemberStatus(m.id, m.status)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${m.status === "active"
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
                        <td colSpan={9} className="py-8 text-center text-zinc-400 italic">
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
          <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                  ORDERS
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Complete ledger of contest ticket orders and payment transactions.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 font-bold">
                  Total Orders: {orders.length}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Paid: {orders.filter((o) => o.status === "completed" || (o.status as any) === "paid").length}
                </span>
              </div>
            </div>

            {/* Container */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(["all", "completed", "pending", "refunded"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setOrderFilter(filter)
                        setOrderPage(1)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap cursor-pointer ${orderFilter === filter
                        ? "bg-[#ea580c] text-white shadow-2xs"
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
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* MOBILE CARD VIEW (Visible on mobile only < md) */}
              <div className="md:hidden space-y-2.5">
                {paginatedOrders.map((o) => {
                  const isPaid = o.status === "completed" || (o.status as any) === "paid"
                  return (
                    <div
                      key={o.id}
                      className="p-3.5 rounded-xl border border-zinc-200/90 bg-white space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Order ID</span>
                          <span className="text-xs font-bold text-zinc-700">{o.id}</span>
                        </div>
                        <button
                          onClick={() => {
                            const nextStatus = o.status === "completed" ? "refunded" : "completed"
                            handleUpdateOrderStatus(o.id, nextStatus)
                          }}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${isPaid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : o.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          title="Tap to toggle status"
                        >
                          {isPaid ? "Paid" : o.status}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-zinc-400 text-[11px] block">Buyer</span>
                          <span className="font-bold text-zinc-950 truncate block">{formatMemberName(o.userName)}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[11px] block">Amount</span>
                          <span className="font-black text-zinc-950 block">₹{o.amountPaid.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[11px] block">Tickets</span>
                          <span className="font-bold text-zinc-900 block">{o.ticketCount} entries</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[11px] block">Gateway</span>
                          <span className="font-medium text-zinc-700 block">{o.paymentGateway || "UPI / Razorpay"}</span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-zinc-100/60 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Date & Time</span>
                        <span>{o.createdAt.replace("T", " ").slice(5, 16)}</span>
                      </div>
                    </div>
                  )
                })}
                {paginatedOrders.length === 0 && (
                  <div className="py-8 text-center text-zinc-400 italic text-xs">
                    No orders found matching your search.
                  </div>
                )}
              </div>

              {/* DESKTOP TABLE VIEW (Visible on md and above) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3 font-semibold">Order</th>
                      <th className="pb-3 font-semibold">Member</th>
                      <th className="pb-3 font-semibold text-right">Tickets</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                      <th className="pb-3 font-semibold">Method</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/50">
                        <td className="py-3.5 text-zinc-500 text-[11px]">{o.id}</td>
                        <td className="py-3.5 text-zinc-950 font-bold">{formatMemberName(o.userName)}</td>
                        <td className="py-3.5 text-right font-black text-zinc-950">{o.ticketCount}</td>
                        <td className="py-3.5 text-right font-bold text-zinc-900">₹{o.amountPaid.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 text-zinc-600 font-medium">{o.paymentGateway || "UPI"}</td>
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => {
                              const nextStatus = o.status === "completed" ? "refunded" : "completed"
                              handleUpdateOrderStatus(o.id, nextStatus)
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${o.status === "completed" || (o.status as any) === "paid"
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
                        <td className="py-3.5 text-right text-zinc-400 text-[11px]">
                          {o.createdAt.replace("T", " ").slice(5, 16)}
                        </td>
                      </tr>
                    ))}
                    {paginatedOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400 italic">
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
          <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight">
                REFERRAL PAYOUTS
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Members earn 25% cash commission after buying 25 tickets. Process live payouts.
              </p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <span className="text-zinc-500 text-xs font-semibold block mb-1">Due Now</span>
                <span className="text-2xl sm:text-3xl font-black text-[#ea580c] block">
                  ₹{payoutsData.stats.dueNow.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-zinc-400 mt-1 block">Awaiting settlement</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <span className="text-zinc-500 text-xs font-semibold block mb-1">Paid to Date</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">
                  ₹{payoutsData.stats.paidToDate.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-zinc-400 mt-1 block">Completed transfers</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
                <span className="text-zinc-500 text-xs font-semibold block mb-1">On Hold</span>
                <span className="text-2xl sm:text-3xl font-black text-zinc-950 block">
                  {payoutsData.stats.onHold}
                </span>
                <span className="text-xs text-zinc-400 mt-1 block">KYC / details needed</span>
              </div>
            </div>

            {/* Due Payouts Table */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Current Payout Batches
                  </h3>
                  <span className="text-xs text-zinc-400">
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
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                  />
                </div>
              </div>

              {/* Mobile View: Clean Card List */}
              <div className="md:hidden space-y-3">
                {paginatedCurrentPayouts.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200">
                        {p.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${p.status === "due" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-zinc-100 text-zinc-700"
                        }`}>
                        {p.status.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-zinc-950 text-sm">{formatMemberName(p.userName)}</div>
                      <div className="text-xs text-zinc-500">{p.userEmail}</div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-xs">
                      <div>
                        <span className="text-zinc-400 block text-[11px]">UPI / Bank:</span>
                        <span className="font-medium text-zinc-700">{p.upiId || p.bankAccount || "rohan@okhdfcbank"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-400 block text-[11px]">Commission:</span>
                        <span className="font-black text-base text-[#ea580c]">₹{p.amount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleProcessPayout(p.id, "paid")}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => handleProcessPayout(p.id, "hold")}
                        className="py-2 px-3 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer text-center bg-white"
                      >
                        Hold
                      </button>
                    </div>
                  </div>
                ))}
                {paginatedCurrentPayouts.length === 0 && (
                  <div className="py-8 text-center text-zinc-400 text-xs italic">
                    No pending payouts due right now.
                  </div>
                )}
              </div>

              {/* Desktop View: Full Analytical Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[11px] uppercase font-semibold">
                      <th className="pb-3 font-semibold">Payout ID</th>
                      <th className="pb-3 font-semibold">Member</th>
                      <th className="pb-3 font-semibold">UPI / Bank</th>
                      <th className="pb-3 font-semibold text-right">Commission Amount</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedCurrentPayouts.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50">
                        <td className="py-3.5 text-zinc-500 font-semibold">{p.id}</td>
                        <td className="py-3.5">
                          <span className="font-bold text-zinc-950 block">{formatMemberName(p.userName)}</span>
                          <span className="text-[11px] text-zinc-400 block">{p.userEmail}</span>
                        </td>
                        <td className="py-3.5 text-zinc-600">{p.upiId || p.bankAccount || "rohan@okhdfcbank"}</td>
                        <td className="py-3.5 text-right font-black text-orange-600">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${p.status === "due" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-zinc-100 text-zinc-700"
                            }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleProcessPayout(p.id, "paid")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => handleProcessPayout(p.id, "hold")}
                              className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Hold
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedCurrentPayouts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-400 italic">
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
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Payout History
                  </h3>
                  <span className="text-xs text-zinc-400">
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
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                  />
                </div>
              </div>

              {/* Mobile View: Clean Card List */}
              <div className="md:hidden space-y-3">
                {paginatedPayoutHistory.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200">
                        {p.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        PAID
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-zinc-950 text-sm">{formatMemberName(p.userName)}</div>
                      <div className="font-black text-emerald-600 text-base">₹{p.amount.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="text-xs text-zinc-400 pt-1 border-t border-zinc-100">
                      Settled: {p.paidAt ? p.paidAt.split("T")[0] : "2026-09-24"}
                    </div>
                  </div>
                ))}
                {paginatedPayoutHistory.length === 0 && (
                  <div className="py-8 text-center text-zinc-400 text-xs italic">
                    No historical payouts found.
                  </div>
                )}
              </div>

              {/* Desktop View: Full Analytical Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[11px] uppercase font-semibold">
                      <th className="pb-3 font-semibold">Payout ID</th>
                      <th className="pb-3 font-semibold">Member</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold text-right">Settled At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedPayoutHistory.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50">
                        <td className="py-3.5 text-zinc-500 font-semibold">{p.id}</td>
                        <td className="py-3.5 font-bold text-zinc-950">{formatMemberName(p.userName)}</td>
                        <td className="py-3.5 text-right font-black text-emerald-600">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            PAID
                          </span>
                        </td>
                        <td className="py-3.5 text-right text-zinc-500">
                          {p.paidAt ? p.paidAt.split("T")[0] : "2026-09-24"}
                        </td>
                      </tr>
                    ))}
                    {paginatedPayoutHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 italic">
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
          <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight">
                REDEMPTIONS
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Drive-credit bookings at Turboride venues. Manage bookings, schedule slots, and verify completions.
              </p>
            </div>

            {/* 3 Top Stat Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:gap-6">
              {/* Card 1: Requested */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-500 text-xs font-semibold">
                  <Ticket size={16} className="text-[#ea580c] shrink-0" />
                  <span className="truncate">Requested</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2 sm:mt-3 mb-1">
                  {requestedCount}
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 truncate">
                  Awaiting slot
                </div>
              </div>

              {/* Card 2: Scheduled */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-500 text-xs font-semibold">
                  <Calendar size={16} className="text-blue-600 shrink-0" />
                  <span className="truncate">Scheduled</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2 sm:mt-3 mb-1">
                  {scheduledCount}
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 truncate">
                  Track booked
                </div>
              </div>

              {/* Card 3: Fulfilled */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-500 text-xs font-semibold">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate">Fulfilled</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2 sm:mt-3 mb-1">
                  {fulfilledCount}
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 truncate">
                  Completed
                </div>
              </div>
            </div>

            {/* ALL REDEMPTIONS Table / Card View */}
            <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-xs uppercase tracking-wider text-zinc-900">
                    ALL REDEMPTIONS
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
                    {(["All", "Requested", "Scheduled", "Fulfilled"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setRedemptionFilter(tab)
                          setRedemptionPage(1)
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${redemptionFilter === tab
                          ? "bg-[#ea580c] text-white shadow-2xs"
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
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                  />
                </div>
              </div>

              {/* Mobile View: Dedicated Un-crowded Cards */}
              <div className="md:hidden space-y-3">
                {paginatedRedemptions.map((r) => {
                  const isScheduled = r.status.toLowerCase() === "scheduled"
                  const isFulfilled = r.status.toLowerCase() === "fulfilled"
                  const isRequested = r.status.toLowerCase() === "requested"

                  return (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-3"
                    >
                      {/* Top Bar: Reference ID & Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-700 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 shadow-2xs">
                          {r.refCode}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isScheduled
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : isFulfilled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      {/* Reward Title & Member */}
                      <div>
                        <h4 className="font-black text-zinc-950 text-base uppercase tracking-tight">
                          {r.rewardTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-1">
                          <span className="font-semibold text-zinc-800">{formatMemberName(r.userName)}</span>
                          <span className="text-zinc-300">•</span>
                          <span className="font-bold text-[#ea580c]">{r.creditsSpent.toLocaleString("en-IN")} Credits</span>
                        </div>
                      </div>

                      {/* Venue & Slot Details Box */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-zinc-200/80 shadow-2xs">
                        <div>
                          <span className="text-zinc-400 text-[11px] block font-medium">Venue</span>
                          <span className="font-semibold text-zinc-800 line-clamp-1">{r.venue || "Turboride Bengaluru"}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[11px] block font-medium">Track Slot</span>
                          <span className={`font-semibold ${r.slot ? "text-blue-700" : "text-zinc-400 italic"}`}>
                            {r.slot || "Unscheduled"}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isRequested && (
                        <button
                          onClick={() => handleOpenScheduleModal(r)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Calendar size={14} weight="bold" />
                          <span>Schedule Track Slot</span>
                        </button>
                      )}
                      {isScheduled && (
                        <button
                          onClick={() => handleMarkDone(r.id)}
                          className="w-full py-2.5 px-3 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-colors cursor-pointer text-center bg-white shadow-2xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle size={14} weight="bold" className="text-emerald-600" />
                          <span>Mark as Completed</span>
                        </button>
                      )}
                      {isFulfilled && (
                        <div className="text-center py-1 text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle size={14} weight="bold" />
                          <span>Experience Fulfilled</span>
                        </div>
                      )}
                    </div>
                  )
                })}
                {paginatedRedemptions.length === 0 && (
                  <div className="py-8 text-center text-zinc-400 text-xs italic">
                    No redemptions found.
                  </div>
                )}
              </div>

              {/* Desktop View: Full Analytical Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[850px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 text-[11px] uppercase font-semibold">
                      <th className="pb-3 font-semibold">REF</th>
                      <th className="pb-3 font-semibold">MEMBER</th>
                      <th className="pb-3 font-semibold">REWARD</th>
                      <th className="pb-3 font-semibold text-right">CREDITS</th>
                      <th className="pb-3 font-semibold">VENUE</th>
                      <th className="pb-3 font-semibold">SLOT</th>
                      <th className="pb-3 font-semibold text-center">STATUS</th>
                      <th className="pb-3 font-semibold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {paginatedRedemptions.map((r) => {
                      const isScheduled = r.status.toLowerCase() === "scheduled"
                      const isFulfilled = r.status.toLowerCase() === "fulfilled"
                      const isRequested = r.status.toLowerCase() === "requested"

                      return (
                        <tr key={r.id} className="hover:bg-zinc-50/50">
                          <td className="py-3.5 text-zinc-700 font-bold text-xs">{r.refCode}</td>
                          <td className="py-3.5 font-bold text-zinc-950">{formatMemberName(r.userName)}</td>
                          <td className="py-3.5 text-zinc-800 font-medium">{r.rewardTitle}</td>
                          <td className="py-3.5 text-right font-black text-zinc-900">
                            {r.creditsSpent.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 text-zinc-600">{r.venue || "Turboride Bengaluru"}</td>
                          <td className="py-3.5 text-zinc-700">{r.slot || "—"}</td>
                          <td className="py-3.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isScheduled
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
                                className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                              >
                                Mark done
                              </button>
                            )}
                            {isRequested && (
                              <button
                                onClick={() => handleOpenScheduleModal(r)}
                                className="px-3 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Schedule
                              </button>
                            )}
                            {isFulfilled && <span className="text-zinc-400 text-xs">—</span>}
                          </td>
                        </tr>
                      )
                    })}
                    {paginatedRedemptions.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-zinc-400 italic">
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

        {/* TAB 7: SETTINGS */}
        {activeTab === "settings" && (
          <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 uppercase tracking-tight">
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
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <>
                    <ArrowsClockwise size={15} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>

            {/* 4 Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              {/* CARD 1: PRICING & CREDITS */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900 mb-4">
                    PRICING & CREDITS
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Ticket price
                      </label>
                      <div className="flex items-center bg-zinc-100 rounded-xl px-3.5 py-2.5">
                        <span className="text-zinc-500 text-xs font-bold mr-2">₹</span>
                        <input
                          type="number"
                          value={settings.ticketPrice}
                          onChange={(e) => setSettings({ ...settings, ticketPrice: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none"
                        />
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Per ticket</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Credits per ticket
                      </label>
                      <div className="flex items-center justify-between bg-zinc-100 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.creditsPerTicket}
                          onChange={(e) => setSettings({ ...settings, creditsPerTicket: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-bold ml-2">cr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: REFERRAL ECONOMICS */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900 mb-4">
                    REFERRAL ECONOMICS
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Drive-credit reward
                      </label>
                      <div className="flex items-center justify-between bg-zinc-100 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.creditRewardPercent}
                          onChange={(e) => setSettings({ ...settings, creditRewardPercent: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-bold ml-2">%</span>
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Of referred buyer's credits</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Cash commission
                      </label>
                      <div className="flex items-center justify-between bg-zinc-100 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.cashCommissionPercent}
                          onChange={(e) => setSettings({ ...settings, cashCommissionPercent: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-bold ml-2">%</span>
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Of referred buyer's spend</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Cash unlock threshold
                    </label>
                    <div className="flex items-center justify-between bg-zinc-100 rounded-xl px-3.5 py-2.5">
                      <input
                        type="number"
                        value={settings.cashUnlockThreshold}
                        onChange={(e) => setSettings({ ...settings, cashUnlockThreshold: Number(e.target.value) })}
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none"
                      />
                      <span className="text-zinc-500 text-xs font-bold ml-2">tickets</span>
                    </div>
                    <span className="block text-[11px] text-zinc-400 mt-1">Buy to unlock cash commission</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: CONTEST RULES */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900 mb-4">
                    CONTEST RULES
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Fallback payout
                      </label>
                      <div className="flex items-center justify-between bg-zinc-100 rounded-xl px-3.5 py-2.5">
                        <input
                          type="number"
                          value={settings.fallbackPayoutPercent}
                          onChange={(e) => setSettings({ ...settings, fallbackPayoutPercent: Number(e.target.value) })}
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none"
                        />
                        <span className="text-zinc-500 text-xs font-bold ml-2">%</span>
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-1">Of collected amount if not sold out</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Draw type
                      </label>
                      <div className="flex items-center bg-zinc-100 rounded-xl px-3.5 py-2.5">
                        <input
                          type="text"
                          value={settings.drawType}
                          onChange={(e) => setSettings({ ...settings, drawType: e.target.value })}
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: DANGER ZONE */}
              <div className="rounded-2xl bg-white border border-zinc-200/90 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
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
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors ${settings.isPaused
                          ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
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
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors ${settings.isClosed
                          ? "bg-red-600 text-white border-red-700 shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-zinc-200 space-y-4 text-xs animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-zinc-950 uppercase">
                  Schedule Redemption
                </h3>
                <span className="text-[11px] text-zinc-400 font-medium">{schedulingItem.refCode} · {formatMemberName(schedulingItem.userName)}</span>
              </div>
              <button
                onClick={() => setSchedulingItem(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 cursor-pointer"
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
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {["22 Sep, 11:30", "24 Sep, 14:00", "26 Sep, 10:00", "28 Sep, 16:30"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setScheduleSlot(preset)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border cursor-pointer transition-colors ${scheduleSlot === preset
                      ? "bg-[#ea580c] text-white border-[#ea580c] shadow-2xs"
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
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                {actionLoading ? "Scheduling..." : "Confirm & Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CONTEST MODAL */}
      {editingContest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base sm:text-lg font-black uppercase text-zinc-950">
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
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Car Name (Title)
                </label>
                <input
                  type="text"
                  value={editingContest.carName}
                  onChange={(e) => setEditingContest({ ...editingContest, carName: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Worth Display Text
                  </label>
                  <input
                    type="text"
                    value={editingContest.worthDisplay}
                    onChange={(e) => setEditingContest({ ...editingContest, worthDisplay: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingContest.ticketPrice}
                    onChange={(e) => setEditingContest({ ...editingContest, ticketPrice: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Sold Tickets Count
                  </label>
                  <input
                    type="number"
                    value={editingContest.soldTickets}
                    onChange={(e) => setEditingContest({ ...editingContest, soldTickets: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Target Tickets (Total Pool)
                  </label>
                  <input
                    type="number"
                    value={editingContest.targetTickets}
                    onChange={(e) => setEditingContest({ ...editingContest, targetTickets: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingContest.status}
                    onChange={(e) => setEditingContest({ ...editingContest, status: e.target.value as any })}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                  >
                    <option value="active">Active (Live On Site)</option>
                    <option value="upcoming">Scheduled (Upcoming)</option>
                    <option value="completed">Completed (Archived)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Draw Date (Text / ISO)
                  </label>
                  <input
                    type="text"
                    value={editingContest.drawDate || ""}
                    onChange={(e) => setEditingContest({ ...editingContest, drawDate: e.target.value })}
                    placeholder="30 Sep 2026"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingContest(null)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base sm:text-lg font-black uppercase text-zinc-950">
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
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Unique Slug / ID (e.g. ferrari-296)
                </label>
                <input
                  type="text"
                  value={newContest.id}
                  onChange={(e) => setNewContest({ ...newContest, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  placeholder="e.g. lamborghini-huracan"
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Car Name (Title)
                </label>
                <input
                  type="text"
                  value={newContest.carName}
                  onChange={(e) => setNewContest({ ...newContest, carName: e.target.value, title: `Win A ${e.target.value}` })}
                  placeholder="e.g. Lamborghini Huracán Tecnica"
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Worth Display Text
                  </label>
                  <input
                    type="text"
                    value={newContest.worthDisplay}
                    onChange={(e) => setNewContest({ ...newContest, worthDisplay: e.target.value })}
                    placeholder="₹4.50 Cr Value"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newContest.ticketPrice}
                    onChange={(e) => setNewContest({ ...newContest, ticketPrice: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Target Pool Entries
                </label>
                <input
                  type="number"
                  value={newContest.targetTickets}
                  onChange={(e) => setNewContest({ ...newContest, targetTickets: Number(e.target.value) })}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsNewContestOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-zinc-200 space-y-4 text-xs animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-zinc-950 uppercase">
                  {formatMemberName(selectedMember.name)}
                </h3>
                <span className="text-[11px] text-zinc-400 font-medium">{selectedMember.email}</span>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Member ID:</span>
                <span className="font-bold text-zinc-900">{selectedMember.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Phone:</span>
                <span className="text-zinc-900 font-semibold">{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Referral Code:</span>
                <span className="font-bold text-[#ea580c]">{selectedMember.referralCode}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Tickets Purchased:</span>
                <span className="font-bold text-zinc-900">{selectedMember.ticketsBought}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Drive Credits Balance:</span>
                <span className="font-bold text-emerald-600">{selectedMember.creditsBalance.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Cash Commission Earned:</span>
                <span className="font-black text-[#ea580c]">₹{selectedMember.cashEarned.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500 font-medium">Account Status:</span>
                <span className="font-bold uppercase text-zinc-900">{selectedMember.status}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs cursor-pointer shadow-xs text-center"
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
