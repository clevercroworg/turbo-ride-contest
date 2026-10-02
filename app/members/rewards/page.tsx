import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { REWARDS_CATALOG } from "@/lib/catalog"
import { RewardsClient } from "./rewards-client"

export const dynamic = "force-dynamic"

export default async function RewardsPage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/rewards")
  }

  const credits = await getUserDriveCredits(session.email, session.phone)

  return (
    <RewardsClient
      session={session}
      credits={credits}
      catalog={REWARDS_CATALOG}
    />
  )
}

