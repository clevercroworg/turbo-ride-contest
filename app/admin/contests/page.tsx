import { loadAdminFullProps } from "@/lib/admin"
import { AdminConsoleClient } from "../admin-console-client"

export const dynamic = "force-dynamic"

export default async function AdminContestsPage() {
  const props = await loadAdminFullProps()
  return <AdminConsoleClient {...props} initialTab="contests" />
}
