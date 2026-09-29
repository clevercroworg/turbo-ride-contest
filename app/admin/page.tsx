import { getAdminSession } from "@/lib/auth"
import { loadAdminFullProps } from "@/lib/admin"
import { AdminConsoleClient } from "./admin-console-client"
import { AdminLoginView } from "./admin-login-view"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const adminSession = await getAdminSession()
  if (!adminSession) {
    return <AdminLoginView />
  }

  const props = await loadAdminFullProps()
  return <AdminConsoleClient {...props} adminSession={adminSession} initialTab="overview" />
}
