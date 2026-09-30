"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { X, Ticket, CheckCircle, ArrowRight, ShieldCheck } from "@phosphor-icons/react"
import { buyContestTicketsAction } from "@/lib/credits"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  initialCount?: number
  contestId?: string
  ticketPrice?: number
  carName?: string
  defaultEmail?: string
  defaultPhone?: string
}

export function TicketCheckoutModal({
  isOpen,
  onClose,
  initialCount = 10,
  contestId = "porsche-718",
  ticketPrice = 1000,
  carName = "Porsche 718 Cayman",
  defaultEmail = "",
  defaultPhone = "",
}: CheckoutModalProps) {
  const [ticketCount, setTicketCount] = useState<number>(initialCount)
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>(defaultEmail)
  const [userPhone, setUserPhone] = useState<string>(defaultPhone)
  const [referralCode, setReferralCode] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successOrder, setSuccessOrder] = useState<{ orderId: string; credits: number } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      const urlRef = new URLSearchParams(window.location.search).get("ref")
      const savedRef = sessionStorage.getItem("turboride_ref")
      const activeCode = urlRef || savedRef
      if (activeCode && !referralCode) {
        setReferralCode(activeCode.toUpperCase())
      }
      if (urlRef) {
        sessionStorage.setItem("turboride_ref", urlRef.toUpperCase())
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await buyContestTicketsAction({
        contestId,
        ticketCount,
        userEmail,
        userPhone,
        userName,
        referralCodeUsed: referralCode.trim() || undefined,
        autoAssign: true,
      })

      if (!res.ok) {
        setError(res.error || "Failed to process ticket request.")
        setLoading(false)
        return
      }

      setSuccessOrder({
        orderId: res.orderId || "COMPLETED",
        credits: res.creditsAdded || ticketCount * ticketPrice,
      })

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch {
        // ignore confetti errors
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const presets = [1, 5, 10, 25, 50, 100]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-zinc-200 p-5 sm:p-8 shadow-2xl max-h-[92dvh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {successOrder ? (
          /* Success Screen */
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200">
              <CheckCircle size={36} weight="fill" />
            </div>

            <h3 className="text-2xl font-black text-zinc-950 tracking-tight mb-2">
              Tickets & Credits Locked In!
            </h3>
            <p className="text-sm text-zinc-600 max-w-sm mb-6">
              Your order <span className="text-zinc-950 font-bold">{successOrder.orderId}</span> is confirmed. <span className="text-emerald-600 font-bold">+{successOrder.credits.toLocaleString("en-IN")} Drive Credits</span> have been added to your wallet.
            </p>

            <div className="w-full p-4 rounded-2xl bg-zinc-50 border border-zinc-200 mb-6 text-left text-xs">
              <div className="flex justify-between py-1 text-zinc-500 font-medium">
                <span>Tickets Allocated:</span>
                <span className="text-zinc-950 font-bold">{ticketCount} Tickets</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-500 font-medium">
                <span>Draw Active:</span>
                <span className="text-[#ea580c] font-bold">{carName}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-500 font-medium">
                <span>Wallet Balance:</span>
                <span className="text-emerald-600 font-bold">+{successOrder.credits.toLocaleString("en-IN")} Credits</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a
                href="/members"
                className="flex-1 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>Go To Garage</span>
                <ArrowRight size={16} weight="bold" />
              </a>
              <button
                onClick={onClose}
                className="py-3.5 px-6 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-5 sm:mb-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#ea580c] block mb-1">
                Official Entry
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                Deposit & Claim Tickets
              </h3>
              <p className="text-sm text-zinc-950 font-medium mt-1">
                100% of your deposit is credited as TurboRide Drive Credits.
              </p>
            </div>

            <form onSubmit={handleCheckout} className="flex flex-col gap-5">
              
              {/* Ticket Quantity Stepper */}
              <div>
                <label className="block text-xs uppercase text-zinc-950 font-black mb-2">
                  Select Tickets (₹{ticketPrice.toLocaleString("en-IN")} each)
                </label>
                <div className="grid grid-cols-6 gap-1.5 mb-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketCount(p)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        ticketCount === p
                          ? "bg-[#ea580c] text-white font-black shadow-xs"
                          : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200 border border-zinc-200 font-bold"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Summary Strip */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-950 font-black block">Total Due</span>
                  <span className="text-lg font-black text-zinc-950 tabular-nums">₹{(ticketCount * ticketPrice).toLocaleString("en-IN")}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-950 font-black block">Credits Received</span>
                  <span className="text-base font-black text-emerald-600 tabular-nums">+{(ticketCount * ticketPrice).toLocaleString("en-IN")} Credits</span>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-zinc-950 font-bold mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Raghav Sharma"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-950 text-sm font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-zinc-950 font-bold mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-950 text-sm font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-zinc-950 font-bold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="raghav@gmail.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-950 text-sm font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-zinc-950 font-bold mb-1">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="TRB100"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-950 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c] uppercase font-bold"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket size={18} weight="fill" />
                <span>
                  {loading
                    ? "Locking In Your Tickets..."
                    : `Deposit ₹${(ticketCount * ticketPrice).toLocaleString("en-IN")} & Get ${ticketCount} ${ticketCount === 1 ? "Ticket" : "Tickets"}`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-950 font-bold">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" weight="fill" />
                <span>100% Capital Protected · ₹{ticketPrice.toLocaleString("en-IN")} = {ticketPrice.toLocaleString("en-IN")} Drive Credits</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  )
}
