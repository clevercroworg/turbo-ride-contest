import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { getMemberProfileDetails } from "@/lib/profile"
import { ProfileClient } from "./profile-client"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/profile")
  }

  const [credits, profile] = await Promise.all([
    getUserDriveCredits(session.email, session.phone),
    getMemberProfileDetails(session.email, session.phone),
  ])

  return (
    <ProfileClient
      session={session}
      credits={credits}
      initialProfile={profile}
    />
  )
}

