import { redirect } from "next/navigation"
import { cookies } from "next/headers"

interface ReferralPageProps {
  params: Promise<{ code: string }>
}

export default async function ReferralRedirectPage({ params }: ReferralPageProps) {
  const { code } = await params
  const cleanCode = code ? code.trim().toUpperCase() : ""
  if (cleanCode) {
    try {
      const cookieStore = await cookies()
      cookieStore.set("referral_code", cleanCode, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        sameSite: "lax",
      })
    } catch {}
    redirect(`/?ref=${encodeURIComponent(cleanCode)}`)
  }
  redirect("/")
}
