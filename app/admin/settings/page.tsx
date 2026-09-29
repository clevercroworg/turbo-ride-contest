import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { loadAdminFullProps } from "@/lib/admin"
import { AdminConsoleClient } from "../admin-console-client"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const adminSession = await getAdminSession()
  if (!adminSession) {
    redirect("/admin")
  }

  const props = await loadAdminFullProps()
  return <AdminConsoleClient {...props} adminSession={adminSession} initialTab="settings" />
}
