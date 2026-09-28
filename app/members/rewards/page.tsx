import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { REWARDS_CATALOG } from "@/lib/catalog"
import { getUserPendingVouchers } from "@/lib/rewards"
import { RewardsClient } from "./rewards-client"
import type { MemberSession } from "@/lib/types"

export const dynamic = "force-dynamic"

const DEMO_SESSION: MemberSession = {
  id: "MEM-DEMO-ROHAN",
  name: "Rohan Sharma",
  email: "rohan@turboride.club",
  phone: "+91 98765 43210",
  referralCode: "TRB4821",
}

export default async function RewardsPage() {
  const session = (await getMemberSession()) || DEMO_SESSION
  const [credits, pendingVouchers] = await Promise.all([
    getUserDriveCredits(session.email, session.phone),
    getUserPendingVouchers(session.email, session.phone),
  ])

  return (
    <RewardsClient
      session={session}
      credits={credits || 25000}
      catalog={REWARDS_CATALOG}
      initialVouchers={pendingVouchers}
    />
  )
}
