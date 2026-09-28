import { getActiveContest } from "@/lib/contests"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { HomeClient } from "./home-client"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const contest = await getActiveContest()
  const session = await getMemberSession()
  const userCredits = session ? await getUserDriveCredits(session.email, session.phone) : 0

  return (
    <HomeClient
      contest={contest}
      memberEmail={session?.email}
      userCredits={userCredits}
    />
  )
}
