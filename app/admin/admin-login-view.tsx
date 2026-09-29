"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockKey, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle } from "@phosphor-icons/react"
import { loginAdminAction } from "@/lib/auth"

export function AdminLoginView() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await loginAdminAction(email, password)
      if (!res.ok) {
        setError(res.error || "Invalid admin credentials.")
        setLoading(false)
        return
      }

      setSuccess("Admin authenticated! Launching Supercar Drops Console...")
      setTimeout(() => {
        router.refresh()
      }, 350)
    } catch {
      setError("Failed to connect to authentication server. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-zinc-950 text-white font-sans selection:bg-[#ea580c] selection:text-white">
      
      {/* Top Header Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ea580c] to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-xs group-hover:scale-105 transition-transform">
              TR
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white uppercase font-sans">
                TurboRide Supercars
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#ea580c] uppercase font-bold">
                Admin Gateway
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Return to Site</span>
          </Link>
        </div>
      </header>

      {/* Main Login Stage */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            
            {/* Ambient orange top glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ea580c]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Lock Header */}
            <div className="text-center mb-8 relative">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-[#ea580c] flex items-center justify-center mx-auto mb-4 shadow-inner">
                <LockKey size={28} weight="fill" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                Admin Console Login
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Access live contest controls, ticket pricing, pool allocations, member ledger, and payouts.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle size={16} weight="fill" className="text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Admin Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@turboride.com"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:border-[#ea580c] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:border-[#ea580c] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Admin Credentials...</span>
                  </>
                ) : (
                  <>
                    <LockKey size={15} weight="bold" />
                    <span>ACCESS ADMIN CONSOLE</span>
                  </>
                )}
              </button>
            </form>

            {/* Neon DB Indicator */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-zinc-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Neon PostgreSQL · Live Database Connected</span>
            </div>

          </div>

          <div className="text-center mt-6 text-zinc-500 text-xs font-mono">
            <span>Restricted area for authorized TurboRide operators only</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 px-4 text-center text-xs text-zinc-500 font-mono">
        © 2026 TurboRide Supercars · Administration Suite
      </footer>
    </div>
  )
}
