"use server"

import { pool } from "./db"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { MemberSession } from "./types"

const MEMBER_COOKIE = "turboride_member_session"

export interface MemberProfileData {
  id?: string
  userName?: string
  userEmail?: string
  userPhone?: string
  referralCode?: string
  payoutMethod?: string
  payoutUpiId?: string
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  accountName?: string
  bankBranch?: string
  city?: string
  kycStatus?: string
}

export interface UpdateProfileParams {
  name: string
  phone?: string
  payoutMethod?: string
  upiId?: string
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  accountName?: string
  bankBranch?: string
  city?: string
}

export async function getMemberProfileDetails(
  email?: string,
  phone?: string
): Promise<MemberProfileData | null> {
  const cleanEmail = email ? email.toLowerCase().trim() : ""
  const digits = phone ? phone.replace(/\D/g, "") : ""
  if (!cleanEmail && !digits) return null

  try {
    const res = await pool.query(
      `SELECT id, user_name, user_email, user_phone, referral_code, 
              payout_method, payout_upi_id, bank_name, account_number, 
              ifsc_code, account_name, bank_branch, city, kyc_status
       FROM referral_profiles
       WHERE (LOWER(user_email) = $1 AND $1 != '') 
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $2)
       LIMIT 1`,
      [cleanEmail || "NOMATCH", `%${digits ? digits.slice(-10) : "NOMATCH"}`]
    )

    if (res.rows.length === 0) return null
    const row = res.rows[0]

    return {
      id: row.id,
      userName: row.user_name || "",
      userEmail: row.user_email || cleanEmail,
      userPhone: row.user_phone || digits,
      referralCode: row.referral_code || "",
      payoutMethod: row.payout_method || "PhonePe",
      payoutUpiId: row.payout_upi_id || "",
      bankName: row.bank_name || "",
      accountNumber: row.account_number || "",
      ifscCode: row.ifsc_code || "",
      accountName: row.account_name || row.user_name || "",
      bankBranch: row.bank_branch || "",
      city: row.city || "",
      kycStatus: row.kyc_status || "verified",
    }
  } catch (err) {
    console.error("[getMemberProfileDetails error]:", err)
    return null
  }
}

export async function updateMemberProfileAction(
  params: UpdateProfileParams
): Promise<{ ok: boolean; error?: string; session?: MemberSession }> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(MEMBER_COOKIE)?.value
    if (!raw) return { ok: false, error: "Authentication session expired. Please log in." }

    let session: MemberSession
    try {
      session = JSON.parse(raw)
    } catch {
      return { ok: false, error: "Invalid session" }
    }

    const cleanEmail = session.email ? session.email.toLowerCase().trim() : ""
    const digits = session.phone ? session.phone.replace(/\D/g, "") : ""

    const newName = params.name?.trim() || session.name || "Member"
    const newPhone = params.phone ? params.phone.replace(/\D/g, "") : digits

    // Update DB
    await pool.query(
      `UPDATE referral_profiles 
       SET user_name = $1, 
           user_phone = COALESCE($2, user_phone),
           payout_method = $3,
           payout_upi_id = $4,
           bank_name = $5,
           account_number = $6,
           ifsc_code = $7,
           account_name = $8,
           bank_branch = $9,
           city = $10,
           updated_at = NOW()
       WHERE (LOWER(user_email) = $11 AND $11 != '') 
          OR (user_phone IS NOT NULL AND user_phone != '' AND user_phone LIKE $12)`,
      [
        newName,
        newPhone || null,
        params.payoutMethod || "PhonePe",
        params.upiId?.trim() || null,
        params.bankName?.trim() || null,
        params.accountNumber?.trim() || null,
        params.ifscCode?.trim() || null,
        params.accountName?.trim() || newName,
        params.bankBranch?.trim() || null,
        params.city?.trim() || null,
        cleanEmail || "NOMATCH",
        `%${digits ? digits.slice(-10) : "NOMATCH"}`
      ]
    )

    // Update session cookie
    const updatedSession: MemberSession = {
      ...session,
      name: newName,
      phone: newPhone || session.phone,
    }

    cookieStore.set(MEMBER_COOKIE, JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 86400,
      path: "/",
      sameSite: "lax",
    })

    revalidatePath("/members")
    revalidatePath("/members/profile")
    revalidatePath("/members/rewards")
    revalidatePath("/members/transactions")

    return { ok: true, session: updatedSession }
  } catch (err: any) {
    console.error("[updateMemberProfileAction error]:", err)
    return { ok: false, error: err?.message || "Failed to save profile changes" }
  }
}
