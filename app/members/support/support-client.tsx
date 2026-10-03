"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  MessageSquare, 
  Send, 
  Lock, 
  AlertCircle, 
  CheckCircle2,
  Clock
} from "lucide-react"
import { MembersHeader } from "@/components/members/members-header"
import type { MemberSession } from "@/lib/types"
import { 
  createSupportTicketAction, 
  addMemberReplyAction, 
  type AdminSupportTicket 
} from "@/lib/admin"

interface SupportClientProps {
  session: MemberSession
  credits: number
  initialTickets?: AdminSupportTicket[]
}

function formatRelativeTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "Recently"
  const d = new Date(dateInput)
  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000))
  if (diffSec < 60) return "Just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} hr ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 30) return `${diffDays} days ago`
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export function SupportClient({ session, credits, initialTickets = [] }: SupportClientProps) {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>(initialTickets)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    initialTickets.length > 0 ? initialTickets[0].id : null
  )

  // New Ticket Form State
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)
  const [ticketSentMsg, setTicketSentMsg] = useState<string | null>(null)

  // Reply State for Active Ticket
  const [replyText, setReplyText] = useState("")
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [replySentMsg, setReplySentMsg] = useState<string | null>(null)

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null

  const handleStartTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) return

    setIsSubmittingTicket(true)
    try {
      const res = await createSupportTicketAction({
        userEmail: session.email,
        userName: session.name || "Member",
        userPhone: session.phone,
        subject: subject.trim(),
        description: description.trim(),
        category: "general",
      })

      if (res.ok) {
        const newTicket: AdminSupportTicket = {
          id: `tkt_${Date.now()}`,
          ticketCode: res.ticketCode || `WM-${Math.floor(1000 + Math.random() * 9000)}`,
          userEmail: session.email,
          userName: session.name || "Member",
          userPhone: session.phone || "",
          subject: subject.trim(),
          description: description.trim(),
          status: "open",
          category: "general",
          replies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setTickets((prev) => [newTicket, ...prev])
        setSelectedTicketId(newTicket.id)
        setSubject("")
        setDescription("")
        setTicketSentMsg("Support ticket submitted! Our team will reply shortly.")
        setTimeout(() => setTicketSentMsg(null), 5000)
      } else {
        alert(res.error || "Failed to submit ticket.")
      }
    } catch {
      alert("An error occurred while submitting ticket.")
    } finally {
      setIsSubmittingTicket(false)
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !activeTicket) return

    setIsSendingReply(true)
    try {
      const res = await addMemberReplyAction(
        activeTicket.id,
        session.email,
        replyText.trim(),
        session.name || "You"
      )

      if (res.ok) {
        const newReply = {
          id: `rep_${Date.now()}`,
          sender: "user" as const,
          senderName: "You",
          content: replyText.trim(),
          createdAt: new Date().toISOString(),
        }

        setTickets((prev) =>
          prev.map((t) =>
            t.id === activeTicket.id
              ? { ...t, replies: [...t.replies, newReply], status: "open", updatedAt: new Date().toISOString() }
              : t
          )
        )
        setReplyText("")
        setReplySentMsg("Reply sent to admin!")
        setTimeout(() => setReplySentMsg(null), 4000)
      } else {
        alert(res.error || "Failed to send reply.")
      }
    } catch {
      alert("An error occurred while sending reply.")
    } finally {
      setIsSendingReply(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans flex flex-col justify-between">
      <MembersHeader
        userName={session.name}
        userEmail={session.email}
        userPhone={session.phone}
        credits={credits}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            ← Back to dashboard
          </Link>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              CUSTOMER CARE
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 mt-1">
              Support centre
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-1.5 leading-relaxed">
              Send a ticket to the WINMYPORSCHE team. Admin replies will appear in this thread and on your dashboard.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 text-emerald-800 text-xs font-semibold shrink-0">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Usually replies within 24 hours</span>
          </div>
        </div>

        {/* 2-COLUMN GRID (CREATE TICKET + ACTIVE TICKET THREAD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: START A NEW TICKET */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <MessageSquare className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950">
                  Start a new ticket
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  We&apos;ll notify you when admin replies.
                </p>
              </div>
            </div>

            {ticketSentMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{ticketSentMsg}</span>
              </div>
            )}

            <form onSubmit={handleStartTicket} className="space-y-4 pt-1 border-t border-zinc-100">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about my tickets"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  How can we help?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what happened..."
                  rows={4}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 resize-y"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#c53030] hover:bg-[#9b2c2c] disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Send className="size-4" />
                <span>{isSubmittingTicket ? "Submitting..." : "Send support ticket"}</span>
              </button>
            </form>

            {/* Previous Tickets List if multiple */}
            {tickets.length > 1 && (
              <div className="pt-3 border-t border-zinc-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Your Tickets ({tickets.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {tickets.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        activeTicket?.id === t.id
                          ? "bg-orange-50 text-orange-950 font-bold border border-orange-200"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      <span className="truncate pr-2">{t.subject}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-zinc-600 shrink-0 font-mono">
                        {t.ticketCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: TICKET THREAD */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
            {activeTicket ? (
              <>
                {/* Ticket Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      <span>TICKET #{activeTicket.ticketCode}</span>
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        activeTicket.status.toLowerCase() === "open"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {activeTicket.status}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 mt-1">
                    {activeTicket.subject}
                  </h3>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-4 pt-2 border-t border-zinc-100">
                  {/* Customer's original message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 bg-zinc-200 text-zinc-800 font-mono">
                          {session.name ? session.name[0].toUpperCase() : "ME"}
                        </div>
                        <span className="text-xs font-bold text-zinc-900">
                          {activeTicket.userName || "You"}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {formatRelativeTime(activeTicket.createdAt)}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl text-xs sm:text-sm leading-relaxed bg-zinc-100/90 text-zinc-800">
                      {activeTicket.description}
                    </div>
                  </div>

                  {/* Replies from Admin or User */}
                  {activeTicket.replies && activeTicket.replies.map((msg) => {
                    const isSupport = msg.sender === "support" || msg.sender === "admin"
                    return (
                      <div key={msg.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                                isSupport
                                  ? "bg-[#ea580c] text-white font-mono"
                                  : "bg-zinc-200 text-zinc-800 font-mono"
                              }`}
                            >
                              {isSupport ? "WP" : (session.name ? session.name[0].toUpperCase() : "ME")}
                            </div>
                            <span className="text-xs font-bold text-zinc-900">
                              {msg.senderName || (isSupport ? "WINMYPORSCHE Support" : "You")}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-400">
                            {formatRelativeTime(msg.createdAt)}
                          </span>
                        </div>

                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isSupport
                              ? "bg-rose-50/50 border border-rose-100 text-zinc-800"
                              : "bg-zinc-100/90 text-zinc-800"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Status Alert Banner */}
                {activeTicket.replies && activeTicket.replies.some(r => r.sender === "support" || r.sender === "admin") ? (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/50 border border-rose-200/70 text-xs text-zinc-700">
                    <AlertCircle className="size-4 text-rose-600 shrink-0" />
                    <span>
                      <strong>Admin has replied to your ticket.</strong> You&apos;ll see every new response here.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
                    <Clock className="size-4 text-zinc-400 shrink-0" />
                    <span>Ticket received. Our support team typically replies within 24 hours.</span>
                  </div>
                )}

                {replySentMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>{replySentMsg}</span>
                  </div>
                )}

                {/* Reply to Admin Form */}
                <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-zinc-100">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">Reply to admin</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Keep the conversation going from here.
                    </p>
                  </div>

                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add more information or reply to the admin..."
                    rows={3}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 resize-y"
                    required
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-zinc-400">
                      Replies are sent directly to the admin console.
                    </p>
                    <button
                      type="submit"
                      disabled={isSendingReply || !replyText.trim()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c53030] hover:bg-[#9b2c2c] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      <Send className="size-3.5" />
                      <span>{isSendingReply ? "Sending..." : "Send reply"}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-16 text-center text-zinc-400 text-xs">
                No active support tickets. Use the form on the left to start a ticket.
              </div>
            )}
          </div>
        </div>

        {/* Footer Admin Link */}
        <div className="pt-4 pb-8 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <Lock className="size-3.5" />
            <span>Admin console</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
