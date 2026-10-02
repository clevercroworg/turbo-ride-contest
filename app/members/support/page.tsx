import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { MembersHeader } from "@/components/members/members-header"
import { HelpCircle, MessageSquare, Phone, Mail, ShieldCheck, ExternalLink, Clock, FileText } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/support")
  }

  const credits = await getUserDriveCredits(session.email, session.phone)

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
            <HelpCircle className="size-4" />
            Concierge & Assistance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-1">
            Member Support & Helpdesk
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with the TurboRide executive team for ticket allocation queries, Buddha Circuit delivery, or drive bookings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Support Options */}
          <div className="md:col-span-2 space-y-4">
            {/* WhatsApp VIP Concierge */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Official WhatsApp VIP Concierge</h3>
                    <p className="text-xs text-muted-foreground">Instant priority chat support with our Bangalore track team</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                  Online
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reach out for ticket verification, 5-digit number queries, track scheduling on Dobaspet expressway, or Buddha Circuit car delivery assistance.
              </p>
              <a
                href="https://wa.me/919980600886?text=Hi%20TurboRide%20Team%2C%20I%20need%20assistance%20with%20my%20WinMyPorsche%20Member%20Garage."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase transition-colors shadow-xs"
              >
                Chat on WhatsApp (+91 99806 00886)
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            {/* Direct Email Support */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Email Helpdesk</h4>
                  <p className="text-xs text-muted-foreground">turboridemarketing@gmail.com</p>
                </div>
              </div>
              <a
                href="mailto:turboridemarketing@gmail.com?subject=TurboRide%20Contest%20Inquiry"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors"
              >
                Send Email
              </a>
            </div>

            {/* Direct Phone Support */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-xl bg-orange-500/10 text-[#ea580c] flex items-center justify-center shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Direct Telemetry Line</h4>
                  <p className="text-xs text-muted-foreground">+91 99806 00886 · 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
              <a
                href="tel:+919980600886"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors"
              >
                Call Hotline
              </a>
            </div>
          </div>

          {/* Quick FAQ / Policies */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <FileText className="size-4 text-[#ea580c]" />
                Key Contest Policies
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                <div>
                  <p className="font-bold text-foreground">Zero-Loss Guarantee</p>
                  <p className="mt-0.5">Every ₹1,000 ticket deposits 1,000 Drive Credits into your wallet with permanent validity.</p>
                </div>
                <div className="border-t border-border/50 pt-2.5">
                  <p className="font-bold text-foreground">Section 194B TDS</p>
                  <p className="mt-0.5">Taxes on grand prize winnings are settled compliant with statutory Indian lottery laws.</p>
                </div>
                <div className="border-t border-border/50 pt-2.5">
                  <p className="font-bold text-foreground">₹75 Lakh Cash Alternative</p>
                  <p className="mt-0.5">Winners can elect to receive ₹75,00,000 direct bank transfer instead of physical car delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>TurboRide Supercars · Dedicated Concierge</span>
        </div>
      </footer>
    </div>
  )
}
