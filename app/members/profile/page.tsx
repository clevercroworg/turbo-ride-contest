import { redirect } from "next/navigation"
import { getMemberSession, getMemberReferralProfile } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { MembersHeader } from "@/components/members/members-header"
import { UserRound, Phone, Mail, ShieldCheck, Award, Share2, Sparkles, Building2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/profile")
  }

  const [credits, referralProfile] = await Promise.all([
    getUserDriveCredits(session.email, session.phone),
    getMemberReferralProfile(session.email, session.phone),
  ])

  const referralCode = referralProfile?.referralCode || session.referralCode || "TRB"
  const ticketsBought = referralProfile?.ticketsBought || 0
  const isCashUnlocked = referralProfile?.isCashUnlocked || ticketsBought >= 25

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
      <MembersHeader
        userName={session.name}
        userEmail={session.email}
        userPhone={session.phone}
        credits={credits}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Header Breadcrumb */}
        <div className="border-b border-border/60 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ea580c]">
            <UserRound className="size-4" />
            Member Profile
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-1">
            Garage Credentials & Status
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verified membership details, referral affiliation, and payout credentials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Member Card */}
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-4 border-b border-border/60 pb-6">
              <div className="size-14 rounded-2xl bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center font-black text-2xl">
                {session.name ? session.name[0].toUpperCase() : "M"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{session.name || "Verified Member"}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="size-3.5" />
                    Verified Garage Member
                  </span>
                  <span>·</span>
                  <span>ID: {session.id}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 p-4 bg-secondary/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Mail className="size-3.5 text-[#ea580c]" />
                  <span>Email Address</span>
                </div>
                <p className="text-sm font-bold text-foreground truncate">{session.email || "Not linked"}</p>
              </div>

              <div className="rounded-xl border border-border/70 p-4 bg-secondary/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Phone className="size-3.5 text-[#ea580c]" />
                  <span>Mobile Number</span>
                </div>
                <p className="text-sm font-bold text-foreground font-mono">{session.phone || "Not linked"}</p>
              </div>

              <div className="rounded-xl border border-border/70 p-4 bg-secondary/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Share2 className="size-3.5 text-[#ea580c]" />
                  <span>Affiliate Referral Code</span>
                </div>
                <p className="text-sm font-bold text-foreground font-mono text-[#ea580c]">{referralCode}</p>
              </div>

              <div className="rounded-xl border border-border/70 p-4 bg-secondary/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Award className="size-3.5 text-[#ea580c]" />
                  <span>Commission Tier</span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {isCashUnlocked ? "Tier 2: 25% Credits + 25% Cash" : "Tier 1: 25% Drive Credits"}
                </p>
              </div>
            </div>

            {/* Payout Information (Coming soon preview) */}
            <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#ea580c]" />
                  <h3 className="text-sm font-bold text-foreground">UPI & Bank Settlement Details</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border/60">
                  Coming soon
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct UPI ID and IMPS bank payout configurations are being integrated for instant automated cash commission disbursements.
              </p>
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="size-4 text-[#ea580c]" />
                Wallet Overview
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available Drive Credits</p>
                <p className="text-3xl font-black text-[#ea580c] tabular-nums mt-0.5">
                  {credits.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  1:1 INR Value Guarantee
                </p>
              </div>
              <div className="border-t border-border/60 pt-3">
                <p className="text-xs text-muted-foreground">Total Tickets Bought</p>
                <p className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                  {ticketsBought}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>TurboRide Zero-Loss Supercar Contest Platform</span>
        </div>
      </footer>
    </div>
  )
}
