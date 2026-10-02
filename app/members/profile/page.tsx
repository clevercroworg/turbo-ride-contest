import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { ProfileClient } from "./profile-client"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/profile")
  }

  const credits = await getUserDriveCredits(session.email, session.phone)

  return (
    <ProfileClient session={session} credits={credits} />
  )
}
