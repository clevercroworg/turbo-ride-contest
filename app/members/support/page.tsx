import { redirect } from "next/navigation"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { getMemberSupportTickets } from "@/lib/admin"
import { SupportClient } from "./support-client"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
  const session = await getMemberSession()
  if (!session) {
    redirect("/login?redirect=/members/support")
  }

  const [credits, tickets] = await Promise.all([
    getUserDriveCredits(session.email, session.phone),
    getMemberSupportTickets(session.email),
  ])

  return (
    <SupportClient session={session} credits={credits} initialTickets={tickets} />
  )
}

