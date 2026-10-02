import { getActiveContest } from "@/lib/contests"
import { getMemberSession } from "@/lib/auth"
import { getUserDriveCredits } from "@/lib/credits"
import { cookies } from "next/headers"
import { HomeClient } from "./home-client"

export const dynamic = "force-dynamic"

interface HomePageProps {
  searchParams?: Promise<{ ref?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const sParams = searchParams ? await searchParams : {}
  const refCode = sParams.ref?.trim().toUpperCase()
  if (refCode) {
    try {
      const cookieStore = await cookies()
      cookieStore.set("referral_code", refCode, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      })
    } catch {}
  }

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
