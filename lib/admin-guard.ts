import { getAdminSession } from "./auth"

/**
 * Server Functions are reachable by direct POST requests, not only through the admin UI,
 * so every admin action must check the session itself. Throws when no admin is signed in.
 */
export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}
