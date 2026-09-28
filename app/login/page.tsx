"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, User, ShieldCheck, ArrowRight, LockKey, Sparkle, CheckCircle } from "@phosphor-icons/react"
import { loginOrSignupMember, loginAdminAction } from "@/lib/auth"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "admin" ? "admin" : "member"

  const [tab, setTab] = useState<"member" | "admin">(initialTab)

  // Member state
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [name, setName] = useState("")

  // Admin state
  const [adminEmail, setAdminEmail] = useState("admin@turboride.com")
  const [adminPassword, setAdminPassword] = useState("TurboAdmin!2026")

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
        setError(res.error || "Failed to access your garage.")
        setLoading(false)
        return
      }

      setSuccess("Garage access granted! Loading your tickets & credits...")
      setTimeout(() => {
        router.push("/members")
        router.refresh()
      }, 400)
    } catch {
      setError("Network connection issue. Please try again.")
      setLoading(false)
    }
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await loginAdminAction(adminEmail, adminPassword)
      if (!res.ok) {
        setError(res.error || "Invalid admin credentials.")
        setLoading(false)
        return
      }

      setSuccess("Admin authenticated! Launching Supercar Drops Console...")
      setTimeout(() => {
        router.push("/admin")
        router.refresh()
      }, 400)
    } catch {
      setError("Failed to authenticate admin session.")
      setLoading(false)
    }
  }

  const handleQuickDemoMember = () => {
    setEmailOrPhone("7338514739")
    setName("sanjaykumar")
  }

  const handleQuickDemoAdmin = () => {
    setAdminEmail("admin@turboride.com")
    setAdminPassword("TurboAdmin!2026")
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-[#fafafa] text-zinc-950 font-sans">
      
      {/* Top Header Bar */}
      <header className="border-b border-zinc-200/80 bg-white py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ea580c] to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-xs">
              TR
            </div>
            <span className="text-sm font-black tracking-tight text-zinc-950 uppercase font-mono">
              TurboRide Supercar Club
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Drop Showcase</span>
          </Link>
        </div>
      </header>

      {/* Main Center Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          
          {/* Dual-Tab Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-100 font-mono text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setTab("member")
                setError(null)
                setSuccess(null)
              }}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                tab === "member"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <User size={15} weight={tab === "member" ? "bold" : "regular"} />
              <span>Member Garage</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("admin")
                setError(null)
                setSuccess(null)
              }}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                tab === "admin"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <LockKey size={15} weight={tab === "admin" ? "bold" : "regular"} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* TAB 1: MEMBER LOGIN */}
          {tab === "member" && (
            <>
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ea580c] border border-orange-200 flex items-center justify-center mb-3 shadow-xs">
                  <User size={22} weight="bold" />
                </div>
                <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
                  Member Garage Access
                </h1>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-mono">
                  Enter your phone or email to inspect your draw tickets, live Drive Credits balance, and track bookings.
                </p>
              </div>

              {/* Demo Member Quick Fill */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Test Account</span>
                  <span className="font-bold text-zinc-900">Sanjay Kumar (50 Tickets)</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoMember}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Sparkle size={13} className="text-[#ea580c]" />
                  <span>Auto Fill</span>
                </button>
              </div>

              <form onSubmit={handleMemberSubmit} className="flex flex-col gap-4 font-mono">
                <div>
                  <label className="block text-[11px] uppercase text-zinc-600 mb-1.5 font-bold">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7338514739 or sanjay@gmail.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-zinc-600 mb-1.5 font-bold">
                    Full Name (Optional for first-time members)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sanjay Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
                    <CheckCircle size={15} weight="bold" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                  <span>{loading ? "Verifying..." : "Enter Member Garage"}</span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: ADMIN LOGIN */}
          {tab === "admin" && (
            <>
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-3 shadow-xs">
                  <LockKey size={22} weight="bold" />
                </div>
                <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
                  Admin Console Login
                </h1>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-mono">
                  Access live contest controls, ticket pricing, pool allocations, member ledger, and payouts.
                </p>
              </div>

              {/* Demo Admin Quick Fill */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Default Admin</span>
                  <span className="font-bold text-zinc-900">admin@turboride.com</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Sparkle size={13} className="text-[#ea580c]" />
                  <span>Auto Fill</span>
                </button>
              </div>

              <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4 font-mono">
                <div>
                  <label className="block text-[11px] uppercase text-zinc-600 mb-1.5 font-bold">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-zinc-600 mb-1.5 font-bold">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
                    <CheckCircle size={15} weight="bold" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                  <LockKey size={16} weight="bold" />
                  <span>{loading ? "Authenticating..." : "Access Admin Console"}</span>
                </button>
              </form>
            </>
          )}

          {/* Value Guarantee */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
            <ShieldCheck size={15} weight="fill" className="text-emerald-600" />
            <span>Shared Wallet with TurboRide Supercars</span>
          </div>

        </div>
      </main>

      {/* Clean Bottom Footer */}
      <footer className="border-t border-zinc-200 bg-white py-5 px-4 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>© {new Date().getFullYear()} TurboRide Supercar Club. 100% Zero-Loss Loyalty System.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-950 transition-colors">Supercar Drop</Link>
            <Link href="/members" className="hover:text-zinc-950 transition-colors">Member Garage</Link>
            <Link href="/admin" className="hover:text-zinc-950 transition-colors">Admin Console</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#fafafa]" />}>
      <LoginContent />
    </Suspense>
  )
}

