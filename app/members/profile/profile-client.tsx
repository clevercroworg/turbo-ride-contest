"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  UserRound, 
  Mail, 
  Phone, 
  CreditCard, 
  Landmark, 
  ShieldCheck, 
  Upload, 
  Check, 
  Save, 
  Lock, 
  FileText,
  Smartphone,
  CheckCircle2
} from "lucide-react"
import { MembersHeader } from "@/components/members/members-header"
import { updateMemberProfileAction, type MemberProfileData } from "@/lib/profile"
import type { MemberSession } from "@/lib/types"

interface ProfileClientProps {
  session: MemberSession
  credits: number
  initialProfile?: MemberProfileData | null
}

export function ProfileClient({ session, credits, initialProfile }: ProfileClientProps) {
  // Personal Details
  const [fullName, setFullName] = useState(initialProfile?.userName || session.name || "")
  const [email, setEmail] = useState(initialProfile?.userEmail || session.email || "")
  const [phone, setPhone] = useState(initialProfile?.userPhone || session.phone || "")

  // Commission Payout
  const [payoutMethod, setPayoutMethod] = useState<"PhonePe" | "Google Pay">(
    (initialProfile?.payoutMethod as "PhonePe" | "Google Pay") || "PhonePe"
  )
  const [upiId, setUpiId] = useState(initialProfile?.payoutUpiId || "")

  // Bank Account Information
  const [bankName, setBankName] = useState(initialProfile?.bankName || "HDFC Bank")
  const [accountNumber, setAccountNumber] = useState(initialProfile?.accountNumber || "")
  const [ifscCode, setIfscCode] = useState(initialProfile?.ifscCode || "HDFC0001234")
  const [accountName, setAccountName] = useState(initialProfile?.accountName || initialProfile?.userName || session.name || "")
  const [bankBranch, setBankBranch] = useState(initialProfile?.bankBranch || "Koramangala")
  const [city, setCity] = useState(initialProfile?.city || "Bengaluru")

  // KYC Upload State
  const [panUploaded, setPanUploaded] = useState(Boolean(initialProfile?.kycStatus === "verified"))
  const [aadhaarUploaded, setAadhaarUploaded] = useState(Boolean(initialProfile?.kycStatus === "verified"))

  // Save State
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSaving(true)

    try {
      const res = await updateMemberProfileAction({
        name: fullName,
        phone,
        payoutMethod,
        upiId,
        bankName,
        accountNumber,
        ifscCode,
        accountName,
        bankBranch,
        city,
      })

      setSaving(false)
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 4000)
      } else {
        setErrorMsg(res.error || "Could not save profile details.")
      }
    } catch {
      setSaving(false)
      setErrorMsg("Network error saving profile. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans flex flex-col justify-between">
      <MembersHeader
        userName={fullName || session.name}
        userEmail={email}
        userPhone={phone}
        credits={credits}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            ← Back to garage
          </Link>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              ACCOUNT SETTINGS
            </p>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 mt-1">
              YOUR PROFILE
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-1.5 leading-relaxed">
              Keep your contact, payout, and KYC details ready so commissions and rewards reach you without delays.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold shrink-0">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Account Verified</span>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Profile details updated and saved to your account!</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* CARD 1: PERSONAL DETAILS */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <UserRound className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950">
                  PERSONAL DETAILS
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Use the same name and contact details used for your contest account.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t border-zinc-100">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  required
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Used for contest updates and receipts.
                </p>
              </div>

              <div className="sm:col-span-2 sm:w-1/2 sm:pr-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Phone number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  required
                />
              </div>
            </div>
          </section>

          {/* CARD 2: COMMISSION PAYOUT */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <CreditCard className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950">
                  COMMISSION PAYOUT
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Choose where referral commissions should be sent.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-zinc-100">
              {/* PhonePe Option */}
              <button
                type="button"
                onClick={() => setPayoutMethod("PhonePe")}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  payoutMethod === "PhonePe"
                    ? "border-rose-300 bg-rose-50/20 ring-1 ring-rose-400"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-[#5f259f] text-white flex items-center justify-center shrink-0">
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-950">PhonePe</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Pay using your registered PhonePe UPI
                    </p>
                  </div>
                </div>
                {payoutMethod === "PhonePe" && (
                  <Check className="size-4 text-rose-600 shrink-0" />
                )}
              </button>

              {/* Google Pay Option */}
              <button
                type="button"
                onClick={() => setPayoutMethod("Google Pay")}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  payoutMethod === "Google Pay"
                    ? "border-rose-300 bg-rose-50/20 ring-1 ring-rose-400"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-950">Google Pay</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Pay using your registered Google Pay UPI
                    </p>
                  </div>
                </div>
                {payoutMethod === "Google Pay" && (
                  <Check className="size-4 text-rose-600 shrink-0" />
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                UPI ID / number
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@oksbi"
                className="w-full sm:w-2/3 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Example: yourname@oksbi or yourname@upi
              </p>
            </div>
          </section>

          {/* CARD 3: BANK ACCOUNT INFORMATION */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Landmark className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950">
                  BANK ACCOUNT INFORMATION
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Add a verified bank account for commission settlement.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t border-zinc-100">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Bank name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Account number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  IFSC code
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-mono text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Account name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Bank branch
                </label>
                <input
                  type="text"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>
            </div>
          </section>

          {/* CARD 4: CUSTOMER KYC */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950">
                  CUSTOMER KYC
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Upload clear, valid documents for commission verification.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t border-zinc-100">
              {/* PAN card */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-950">PAN card</p>
                    <p className="text-xs text-zinc-500">PDF, JPG or PNG · Max 5 MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPanUploaded(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors shadow-xs cursor-pointer"
                >
                  <Upload className="size-3.5" />
                  {panUploaded ? "Document uploaded ✓" : "Upload document"}
                </button>
              </div>

              {/* Aadhaar card */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-950">Aadhaar card</p>
                    <p className="text-xs text-zinc-500">PDF, JPG or PNG · Max 5 MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAadhaarUploaded(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors shadow-xs cursor-pointer"
                >
                  <Upload className="size-3.5" />
                  {aadhaarUploaded ? "Document uploaded ✓" : "Upload document"}
                </button>
              </div>
            </div>

            {/* Security disclaimer note */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-100/80 text-xs text-zinc-600">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>
                Your documents and payment details are encrypted. Never share OTPs or passwords with anyone.
              </span>
            </div>
          </section>

          {/* BOTTOM FLOATING ACTION BAR */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm flex items-center justify-between">
            <span className="text-xs sm:text-sm text-zinc-600">
              Your payout method:{" "}
              <strong className="text-zinc-950 font-bold">{payoutMethod}</strong>
            </span>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c53030] hover:bg-[#9b2c2c] disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{saving ? "Saving changes..." : "Save profile"}</span>
            </button>
          </div>
        </form>

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
