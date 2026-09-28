import { getMemberSession, getMemberReferralProfile } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { getActiveContest, getUserTicketStats, getUserReferrals } from "@/lib/contests"
import { getUserPendingVouchers } from "@/lib/rewards"
import { MemberDashboardClient } from "./member-dashboard-client"
import type { MemberSession } from "@/lib/types"

export const dynamic = "force-dynamic"

const DEMO_SESSION: MemberSession = {
  id: "MEM-DEMO-ROHAN",
  name: "Rohan Sharma",
  email: "rohan@turboride.club",
  phone: "+91 98765 43210",
  referralCode: "TRB4821",
}

export default async function MembersPage() {
  const session = (await getMemberSession()) || DEMO_SESSION

  const contest = await getActiveContest()
  const [credits, ticketStats, referralProfile, pendingVouchers] = await Promise.all([
    getUserDriveCredits(session.email, session.phone),
    getUserTicketStats(session.email, session.phone, contest?.id || "porsche-718"),
    getMemberReferralProfile(session.email, session.phone),
    getUserPendingVouchers(session.email, session.phone),
  ])

  const refCode = referralProfile?.referralCode || session.referralCode || "TRB4821"
  const referrals = refCode ? await getUserReferrals(refCode) : []

  return (
    <MemberDashboardClient
      session={session}
      credits={credits}
      contest={contest}
      ticketStats={ticketStats}
      referralProfile={referralProfile}
      initialReferrals={referrals}
      initialVouchers={pendingVouchers}
    />
  )
}

