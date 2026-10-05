import { redirect } from "next/navigation"
import { getMemberSession, getMemberReferralProfile } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { getActiveContest, getContests, getUserTicketStats, getUserReferrals } from "@/lib/contests"
import { getUserPendingVouchers } from "@/lib/rewards"
import { getAdminSettingsAction } from "@/lib/admin"
import { getUserGameVouchers } from "@/lib/vouchers"
import { MemberDashboardClient } from "./member-dashboard-client"

export const dynamic = "force-dynamic"

export default async function MembersPage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members")
  }

  const contest = await getActiveContest()
  const [allDbContests, credits, ticketStats, referralProfile, pendingVouchers, adminSettings, gameVouchers] = await Promise.all([
    getContests(),
    getUserDriveCredits(session.email, session.phone),
    getUserTicketStats(session.email, session.phone, contest?.id || "porsche-718"),
    getMemberReferralProfile(session.email, session.phone),
    getUserPendingVouchers(session.email, session.phone),
    getAdminSettingsAction(),
    getUserGameVouchers(session.email, session.phone),
  ])

  const refCode = referralProfile?.referralCode || session.referralCode || ""
  const referrals = refCode ? await getUserReferrals(refCode) : []

  return (
    <MemberDashboardClient
      session={session}
      credits={credits}
      contest={contest}
      allContests={allDbContests}
      ticketStats={ticketStats}
      referralProfile={referralProfile}
      initialReferrals={referrals}
      initialVouchers={pendingVouchers}
      adminSettings={adminSettings}
      gameVouchers={gameVouchers}
    />
  )
}


