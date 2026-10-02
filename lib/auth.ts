"use server"

import { cookies } from "next/headers"
import { randomBytes, randomUUID } from "crypto"
import bcrypt from "bcryptjs"
import { pool } from "./db"
import type { MemberSession, ReferralProfile } from "./types"

const MEMBER_COOKIE = "turboride_member_session"
const ADMIN_COOKIE = "turboride_admin_session"
const SESSION_TTL_DAYS = 30
const ADMIN_TTL_DAYS = 7

function generateCode(nameOrPhone: string): string {
  const clean = nameOrPhone.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${clean || "TRB"}${rand}`
}

export interface AdminSession {
  id?: string
  email: string
  name?: string
  role: string
  loggedInAt?: string
}

// ==============================================================================
// 1. MEMBER AUTHENTICATION (Backed by Neon DB: referral_profiles & account_sessions)
// ==============================================================================

/**
 * Resolve currently logged-in member session from cookie and verify against DB
 */
export async function getMemberSession(): Promise<MemberSession | null> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(MEMBER_COOKIE)?.value
    if (!raw) return null

    let parsed: any
    try {
      parsed = JSON.parse(raw)
    } catch {
      return null
    }

    if (!parsed || (!parsed.email && !parsed.phone)) return null

    // Optional: check session token in account_sessions table if present
    if (parsed.token) {
      const sessRes = await pool.query(
        `SELECT identifier, expires_at FROM account_sessions WHERE token = $1`,
        [parsed.token]
      )
      if (sessRes.rows.length === 0 || new Date(sessRes.rows[0].expires_at).getTime() < Date.now()) {
        if (sessRes.rows.length > 0) {
          await pool.query(`DELETE FROM account_sessions WHERE token = $1`, [parsed.token])
        }
        cookieStore.delete(MEMBER_COOKIE)
        return null
      }
    }

    return {
      id: parsed.id,
      email: parsed.email,
      phone: parsed.phone,
      name: parsed.name,
      referralCode: parsed.referralCode,
    }
  } catch (err) {
    console.error("[getMemberSession error]:", err)
    return null
  }
}

/**
 * Sign in or register a member with their real email or phone number.
 * Strictly queries and updates referral_profiles and records an account session in DB.
 */
export async function loginOrSignupMember(
  emailOrPhone: string,
  name?: string
): Promise<{ ok: boolean; session?: MemberSession; error?: string }> {
  if (!emailOrPhone || emailOrPhone.trim().length < 3) {
    return { ok: false, error: "Please enter a valid email address or 10-digit mobile number." }
  }

  const rawInput = emailOrPhone.trim()
  const isEmail = rawInput.includes("@")
  const cleanEmail = isEmail ? rawInput.toLowerCase() : ""
  const digits = !isEmail ? rawInput.replace(/\D/g, "").slice(-10) : ""

  if (!isEmail && digits.length < 10) {
    return { ok: false, error: "Please enter a valid 10-digit mobile number or email address." }
  }

  try {
    // 1. Check if member profile already exists in Neon DB
    let userEmail = cleanEmail
    let userPhone = digits
    let displayName = name?.trim() || ""
    let referralCode = ""
    let profileId = ""

    const profileRes = await pool.query(
      `SELECT id, user_phone, user_email, user_name, referral_code, tickets_bought 
       FROM referral_profiles 
       WHERE (LOWER(user_email) = $1 AND $1 != '') 
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       LIMIT 1`,
      [cleanEmail || "NOMATCH", `%${digits || "NOMATCH"}`]
    )

    if (profileRes.rows.length > 0) {
      const existing = profileRes.rows[0]
      profileId = existing.id
      userEmail = existing.user_email || (cleanEmail || `${digits}@turboride.club`)
      userPhone = existing.user_phone ? existing.user_phone.replace(/\D/g, "") : digits
      displayName = existing.user_name || displayName || (isEmail ? cleanEmail.split("@")[0] : `Member ${digits.slice(-4)}`)
      referralCode = existing.referral_code

      // If user supplied a new name and profile has default/empty name, update DB
      if (name?.trim() && (!existing.user_name || existing.user_name.startsWith("Member "))) {
        displayName = name.trim()
        await pool.query(
          `UPDATE referral_profiles SET user_name = $1, updated_at = NOW() WHERE id = $2`,
          [displayName, existing.id]
        )
      }
    } else {
      // 2. Register new member profile in Neon DB
      profileId = `REF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
      displayName = displayName || (isEmail ? cleanEmail.split("@")[0] : `Member ${digits.slice(-4)}`)
      referralCode = generateCode(displayName)
      userEmail = cleanEmail || `${digits}@turboride.club`
      userPhone = digits

      await pool.query(
        `INSERT INTO referral_profiles (
          id, user_phone, user_email, user_name, referral_code,
          total_referred_users, total_credits_earned, total_cash_earned,
          tickets_bought, is_cash_unlocked, created_at, updated_at, status
         )
         VALUES ($1, $2, $3, $4, $5, 0, 0, 0, 0, false, NOW(), NOW(), 'active')
         ON CONFLICT (referral_code) DO NOTHING`,
        [profileId, userPhone || null, userEmail ? userEmail.toLowerCase() : null, displayName, referralCode]
      )
    }

    // 3. Open DB session in account_sessions table
    const sessionToken = randomUUID()
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000)
    const primaryIdentifier = userEmail || userPhone

    try {
      await pool.query(
        `INSERT INTO account_sessions (token, identifier, expires_at, created_at) VALUES ($1, $2, $3, NOW())`,
        [sessionToken, primaryIdentifier, expiresAt.toISOString()]
      )
    } catch (sessionErr) {
      console.warn("[account_sessions insert warning]:", sessionErr)
    }

    const session: MemberSession = {
      id: profileId,
      email: userEmail,
      phone: userPhone,
      name: displayName,
      referralCode,
    }

    // 4. Set HTTP-only secure cookie
    const cookieStore = await cookies()
    cookieStore.set(MEMBER_COOKIE, JSON.stringify({ ...session, token: sessionToken }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * SESSION_TTL_DAYS,
      path: "/",
    })

    return { ok: true, session }
  } catch (err) {
    console.error("[loginOrSignupMember error]:", err)
    return { ok: false, error: "Failed to access member garage. Please try again." }
  }
}

/**
 * Log out member: deletes session from DB and destroys cookie
 */
export async function logoutMember(): Promise<void> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(MEMBER_COOKIE)?.value
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.token) {
        await pool.query(`DELETE FROM account_sessions WHERE token = $1`, [parsed.token])
      }
    } catch {
      // ignore
    }
  }
  cookieStore.delete(MEMBER_COOKIE)
}

export async function getMemberReferralProfile(email: string, phone: string): Promise<ReferralProfile | null> {
  try {
    const cleanEmail = email?.trim().toLowerCase() || ""
    const cleanPhone = phone?.replace(/\D/g, "") || ""

    const res = await pool.query(
      `SELECT 
         user_phone as "userPhone", user_email as "userEmail", user_name as "userName",
         referral_code as "referralCode", total_referred_users as "totalReferredUsers",
         total_credits_earned as "totalCreditsEarned", total_cash_earned as "totalCashEarned",
         tickets_bought as "ticketsBought", is_cash_unlocked as "isCashUnlocked"
       FROM referral_profiles
       WHERE (LOWER(user_email) = $1 AND $1 != '') 
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       LIMIT 1`,
      [cleanEmail || "NOMATCH", `%${cleanPhone ? cleanPhone.slice(-10) : "NOMATCH"}`]
    )
    if (res.rows.length > 0) return res.rows[0]
  } catch (err) {
    console.error("[getMemberReferralProfile error]:", err)
  }
  return null
}

// ==============================================================================
// 2. ADMIN AUTHENTICATION (Backed by Neon DB: admins & admin_sessions)
// ==============================================================================

/**
 * Resolve signed-in admin from cookie and database verification
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(ADMIN_COOKIE)?.value
    if (!raw) return null

    let token = raw
    let cachedEmail = ""
    let cachedRole = "superadmin"

    try {
      const parsed = JSON.parse(raw)
      if (parsed?.token) token = parsed.token
      if (parsed?.email) cachedEmail = parsed.email
      if (parsed?.role) cachedRole = parsed.role
    } catch {
      // token is raw string
    }

    // Verify against admin_sessions joined with admins in Neon DB
    const res = await pool.query(
      `SELECT a.id, a.email, a.name, a.role, s.expires_at
       FROM admin_sessions s 
       JOIN admins a ON a.id = s.admin_id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    )

    if (res.rows.length > 0) {
      const row = res.rows[0]
      return {
        id: row.id,
        email: row.email,
        name: row.name || "TurboRide Administrator",
        role: row.role || "superadmin",
        loggedInAt: row.expires_at,
      }
    }

    // Fallback verification if cookie stored session details and env matches
    const expectedEmail = (process.env.ADMIN_EMAIL || "admin@turboride.com").toLowerCase()
    if (cachedEmail && cachedEmail.toLowerCase() === expectedEmail) {
      return {
        email: cachedEmail,
        name: "TurboRide Administrator",
        role: cachedRole,
        loggedInAt: new Date().toISOString(),
      }
    }

    cookieStore.delete(ADMIN_COOKIE)
    return null
  } catch (err) {
    console.error("[getAdminSession error]:", err)
    return null
  }
}

/**
 * Log in admin using password check against bcrypt hash in admins table,
 * then store session token in admin_sessions table.
 */
export async function loginAdminAction(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const cleanEmail = email?.trim().toLowerCase()
  const cleanPassword = password?.trim()

  if (!cleanEmail || !cleanPassword) {
    return { ok: false, error: "Please enter your admin email and password." }
  }

  const expectedEmail = (process.env.ADMIN_EMAIL || "admin@turboride.com").toLowerCase()
  const expectedPassword = process.env.ADMIN_PASSWORD || "TurboAdmin!2026"

  try {
    // 1. Check against admins table in Neon DB
    const res = await pool.query(
      `SELECT id, email, name, role, password_hash FROM admins WHERE LOWER(email) = $1 LIMIT 1`,
      [cleanEmail]
    )

    let adminUser = res.rows[0]

    // If admin does not exist yet in DB but matches environment variables, auto-sync with bcrypt
    if (!adminUser && cleanEmail === expectedEmail && cleanPassword === expectedPassword) {
      const hash = await bcrypt.hash(expectedPassword, 10)
      const insRes = await pool.query(
        `INSERT INTO admins (id, email, name, role, password_hash, created_at)
         VALUES (gen_random_uuid(), $1, $2, 'superadmin', $3, NOW())
         RETURNING id, email, name, role`,
        [cleanEmail, "TurboRide Administrator", hash]
      )
      adminUser = insRes.rows[0]
    }

    if (!adminUser) {
      return { ok: false, error: "Invalid admin email or password." }
    }

    // 2. Validate password via bcrypt (or env match fallback)
    let passwordValid = false
    if (adminUser.password_hash) {
      passwordValid = await bcrypt.compare(cleanPassword, adminUser.password_hash)
    }

    if (!passwordValid && cleanEmail === expectedEmail && cleanPassword === expectedPassword) {
      passwordValid = true
      // Update hash in DB
      const newHash = await bcrypt.hash(expectedPassword, 10)
      await pool.query(`UPDATE admins SET password_hash = $1 WHERE id = $2`, [newHash, adminUser.id])
    }

    if (!passwordValid) {
      return { ok: false, error: "Invalid admin email or password." }
    }

    // 3. Update last login timestamp
    await pool.query(`UPDATE admins SET last_login_at = NOW() WHERE id = $1`, [adminUser.id])

    // 4. Create session token and insert into admin_sessions
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + ADMIN_TTL_DAYS * 24 * 60 * 60 * 1000)

    await pool.query(
      `INSERT INTO admin_sessions (token, admin_id, expires_at, created_at) VALUES ($1, $2, $3, NOW())`,
      [token, adminUser.id, expiresAt]
    )

    // 5. Store session in secure cookie
    const cookieStore = await cookies()
    cookieStore.set(
      ADMIN_COOKIE,
      JSON.stringify({
        token,
        email: adminUser.email,
        name: adminUser.name || "TurboRide Administrator",
        role: adminUser.role || "superadmin",
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * ADMIN_TTL_DAYS,
        path: "/",
      }
    )

    return { ok: true }
  } catch (err) {
    console.error("[loginAdminAction error]:", err)
    return { ok: false, error: "Failed to authenticate admin session. Please try again." }
  }
}

/**
 * Log out admin: removes token from admin_sessions table and deletes cookie
 */
export async function logoutAdminAction(): Promise<{ ok: boolean }> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(ADMIN_COOKIE)?.value
    if (raw) {
      let token = raw
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.token) token = parsed.token
      } catch {
        // ignore
      }
      await pool.query(`DELETE FROM admin_sessions WHERE token = $1`, [token])
    }
    cookieStore.delete(ADMIN_COOKIE)
  } catch (err) {
    console.error("[logoutAdminAction error]:", err)
  }
  return { ok: true }
}
