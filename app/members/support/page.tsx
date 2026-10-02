import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { SupportClient } from "./support-client"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/support")
  }

  const credits = await getUserDriveCredits(session.email, session.phone)

  return (
    <SupportClient session={session} credits={credits} />
  )
}
