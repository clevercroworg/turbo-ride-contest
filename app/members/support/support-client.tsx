"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  MessageSquare, 
  Send, 
  Lock, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react"
import { MembersHeader } from "@/components/members/members-header"
import type { MemberSession } from "@/lib/types"

interface SupportClientProps {
  session: MemberSession
  credits: number
}

interface Message {
  id: string
  sender: "user" | "support"
  senderName: string
  avatar: string
  timestamp: string
  content: string
}

export function SupportClient({ session, credits }: SupportClientProps) {
  // New Ticket Form State
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [ticketSent, setTicketSent] = useState(false)

  // Reply State for Existing Ticket
  const [replyText, setReplyText] = useState("")
  const [replySent, setReplySent] = useState(false)

  // Active Ticket Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "user",
      senderName: "You",
      avatar: "AR",
      timestamp: "Today, 10:24 AM",
      content:
        "I referred three friends but the referral credits have not appeared in my account yet. Could you please check this?",
    },
    {
      id: "msg-2",
      sender: "support",
      senderName: "WINMYPORSCHE support",
      avatar: "WP",
      timestamp: "Today, 12:06 PM",
      content:
        "Hi Arjun, we have checked your referral activity. The credits are being verified and will be added to your account within 24 hours. We will update you here once complete.",
    },
  ])

  const handleStartTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) return

    setTicketSent(true)
    setSubject("")
    setDescription("")
    setTimeout(() => setTicketSent(false), 4000)
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      senderName: "You",
      avatar: session.name ? session.name[0].toUpperCase() : "AR",
      timestamp: "Just now",
      content: replyText.trim(),
    }

    setMessages((prev) => [...prev, newMsg])
    setReplyText("")
    setReplySent(true)
    setTimeout(() => setReplySent(false), 3000)
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

            {ticketSent && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Support ticket submitted! Our team will reply shortly.</span>
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
                  placeholder="e.g. Credits not showing"
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
                  rows={5}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 resize-y"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#c53030] hover:bg-[#9b2c2c] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Send className="size-4" />
                Send support ticket
              </button>
            </form>
          </div>

          {/* RIGHT: TICKET #WM-1048 THREAD */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
            {/* Ticket Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-400">
                  TICKET #WM-1048
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  Open
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 mt-1">
                Referral credits pending
              </h3>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4 pt-2 border-t border-zinc-100">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1.5">
                  {/* Sender Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                          msg.sender === "user"
                            ? "bg-zinc-200 text-zinc-800 font-mono"
                            : "bg-[#c53030] text-white font-mono"
                        }`}
                      >
                        {msg.avatar}
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        {msg.senderName}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-zinc-100/90 text-zinc-800"
                        : "bg-rose-50/50 border border-rose-100 text-zinc-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Replying Alert Banner */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/50 border border-rose-200/70 text-xs text-zinc-700">
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
              <span>
                <strong>Admin has replied to your ticket.</strong> You&apos;ll see every new response here.
              </span>
            </div>

            {replySent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Reply sent to admin!</span>
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
                  Tickets close automatically after 3 days without a response.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c53030] hover:bg-[#9b2c2c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Send className="size-3.5" />
                  Send reply
                </button>
              </div>
            </form>
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
