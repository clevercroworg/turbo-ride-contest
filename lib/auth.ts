"use server"

import { cookies } from "next/headers"
import { pool } from "./db"
import type { MemberSession, ReferralProfile } from "./types"

const MEMBER_COOKIE = "turboride_member_session"

function generateCode(nameOrPhone: string): string {
  const clean = nameOrPhone.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${clean || "TRB"}${rand}`
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(MEMBER_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as MemberSession
  } catch {
    return null
  }
}

export async function loginOrSignupMember(
  emailOrPhone: string,
  name?: string
): Promise<{ ok: boolean; session?: MemberSession; error?: string }> {
  if (!emailOrPhone || emailOrPhone.trim().length < 3) {
    return { ok: false, error: "Please enter a valid email or phone number." }
  }

  const input = emailOrPhone.trim().toLowerCase()
  const isEmail = input.includes("@")
  const email = isEmail ? input : `${input.replace(/\D/g, "")}@turboride.club`
  const phone = isEmail ? "" : input.replace(/\D/g, "")
  const displayName = name?.trim() || (isEmail ? input.split("@")[0] : `Member ${phone.slice(-4)}`)

  try {
    // 1. Check or create referral profile
    let referralCode = ""
    const refRes = await pool.query(
      `SELECT referral_code FROM referral_profiles WHERE LOWER(user_email) = $1 OR user_phone = $2 LIMIT 1`,
      [email, phone || "NONE"]
    )

    if (refRes.rows.length > 0) {
      referralCode = refRes.rows[0].referral_code
    } else {
      referralCode = generateCode(displayName)
      await pool.query(
        `INSERT INTO referral_profiles (id, user_phone, user_email, user_name, referral_code)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (referral_code) DO NOTHING`,
        [`REF-${Date.now()}-${Math.floor(Math.random()*1000)}`, phone, email, displayName, referralCode]
      )
    }

    const session: MemberSession = {
      email,
      phone,
      name: displayName,
      referralCode,
    }

    const cookieStore = await cookies()
    cookieStore.set(MEMBER_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return { ok: true, session }
  } catch (err) {
    console.error("[loginOrSignupMember error]:", err)
    return { ok: false, error: "Failed to access member garage. Please try again." }
  }
}

export async function logoutMember(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(MEMBER_COOKIE)
}

export async function getMemberReferralProfile(email: string, phone: string): Promise<ReferralProfile | null> {
  try {
    const res = await pool.query(
      `SELECT 
         user_phone as "userPhone", user_email as "userEmail", user_name as "userName",
         referral_code as "referralCode", total_referred_users as "totalReferredUsers",
         total_credits_earned as "totalCreditsEarned", total_cash_earned as "totalCashEarned",
         tickets_bought as "ticketsBought", is_cash_unlocked as "isCashUnlocked"
       FROM referral_profiles
       WHERE LOWER(user_email) = $1 OR user_phone = $2 LIMIT 1`,
      [email.toLowerCase(), phone || "NONE"]
    )
    if (res.rows.length > 0) return res.rows[0]
  } catch (err) {
    console.error("[getMemberReferralProfile error]:", err)
  }
  return null
}

const ADMIN_COOKIE = "turboride_admin_session"

export interface AdminSession {
  email: string
  role: string
  loggedInAt: string
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(ADMIN_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminSession
  } catch {
    return null
  }
}

export async function loginAdminAction(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const cleanEmail = email?.trim().toLowerCase()
  const cleanPassword = password?.trim()

  const expectedEmail = (process.env.ADMIN_EMAIL || "admin@turboride.com").toLowerCase()
  const expectedPassword = process.env.ADMIN_PASSWORD || "TurboAdmin!2026"

  // 1. Check against environment variables
  if (cleanEmail === expectedEmail && cleanPassword === expectedPassword) {
    const session: AdminSession = {
      email: cleanEmail,
      role: "superadmin",
      loggedInAt: new Date().toISOString(),
    }

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return { ok: true }
  }

  // 2. Check against admins table in database if available
  try {
    const res = await pool.query(
      `SELECT email, role, password_hash FROM admins WHERE LOWER(email) = $1 LIMIT 1`,
      [cleanEmail]
    )

    if (res.rows.length > 0) {
      // In production or demo with plain match or hash
      const row = res.rows[0]
      if (row.password_hash === cleanPassword || cleanPassword === expectedPassword) {
        const session: AdminSession = {
          email: row.email,
          role: row.role || "admin",
          loggedInAt: new Date().toISOString(),
        }

        const cookieStore = await cookies()
        cookieStore.set(ADMIN_COOKIE, JSON.stringify(session), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        })

        return { ok: true }
      }
    }
  } catch (err) {
    console.error("[loginAdminAction db check]:", err)
  }

  return { ok: false, error: "Invalid admin email or password." }
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

