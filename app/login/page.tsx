"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, User, ShieldCheck, ArrowRight, Gauge, CheckCircle } from "@phosphor-icons/react"
import { loginOrSignupMember } from "@/lib/auth"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTarget = searchParams.get("redirect") || "/members"

  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await loginOrSignupMember(emailOrPhone, name || undefined)
      if (!res.ok) {
        setError(res.error || "Failed to access your member garage.")
        setLoading(false)
        return
      }

      setSuccess("Garage access granted! Loading your lucky tickets & wallet...")
      setTimeout(() => {
        router.push(redirectTarget)
        router.refresh()
      }, 350)
    } catch {
      setError("Network connection issue. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-[#fafafa] text-zinc-950 font-sans">
      
      {/* Top Header Bar */}
      <header className="border-b border-zinc-200/80 bg-white py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ea580c] to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-xs group-hover:scale-105 transition-transform">
              TR
            </div>
            <span className="text-sm font-black tracking-tight text-zinc-950 uppercase font-mono">
              TurboRide Supercar Club
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Return to Site</span>
          </Link>
        </div>
      </header>

      {/* Main Login Form Stage */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-900/5 p-6 sm:p-8">
            
            {/* Header Icon & Title */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#ea580c] flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <Gauge size={28} weight="fill" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight font-sans">
                Access Member Garage
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Enter your registered mobile number or email to view your allocated lucky tickets, live drive credits, and member rewards.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Member Login Form */}
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. 9876543210 or driver@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1.5">
                  Full Name <span className="text-zinc-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Your Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Garage Session...</span>
                  </>
                ) : (
                  <>
                    <span>ACCESS MEMBER GARAGE</span>
                    <ArrowRight size={15} weight="bold" />
                  </>
                )}
              </button>
            </form>

            {/* Zero Loss Badge */}
            <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center gap-2 text-zinc-500 text-xs font-mono">
              <ShieldCheck size={16} weight="bold" className="text-emerald-600" />
              <span>1:1 Drive Credits · Zero Loss Guarantee</span>
            </div>

          </div>

          {/* Bottom Security Note */}
          <div className="text-center mt-6 text-zinc-400 text-xs font-mono">
            <span>Passwordless access secured via encrypted session token</span>
          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-4 px-4 text-center text-xs text-zinc-400 font-mono">
        © 2026 TurboRide Supercars. All rights reserved.
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="w-6 h-6 border-2 border-[#ea580c]/30 border-t-[#ea580c] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
