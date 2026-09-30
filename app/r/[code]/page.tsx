import { redirect } from "next/navigation"

interface ReferralPageProps {
  params: Promise<{ code: string }>
}

export default async function ReferralRedirectPage({ params }: ReferralPageProps) {
  const { code } = await params
  const cleanCode = code ? encodeURIComponent(code.trim().toUpperCase()) : ""
  redirect(cleanCode ? `/?ref=${cleanCode}` : "/")
}
