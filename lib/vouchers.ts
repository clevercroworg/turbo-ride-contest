import { randomInt } from "crypto"
import { pool } from "./db"

// Unambiguous 32-character alphabet (no 0, O, 1, I, L)
export const VOUCHER_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

export interface GameVoucherRecord {
  id: number
  code: string
  normalizedCode: string
  userId: string
  playerId: string
  playerName: string
  contestId?: string
  orderId?: string
  status: "active" | "used" | "expired" | "void"
  createdAt: string
  expiresAt?: string | null
  usedAt?: string | null
  gameSessionId?: string | null
}

/**
 * Normalize any input code by stripping spaces, hyphens, and converting to uppercase.
 * e.g. "7kq4 m2xd-9pha" -> "7KQ4M2XD9PHA"
 */
export function normalizeVoucherCode(rawCode: string): string {
  if (!rawCode || typeof rawCode !== "string") return ""
  return rawCode.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
}

/**
 * Format a raw normalized 12-char code with hyphens: "XXXX-XXXX-XXXX"
 */
export function formatVoucherCode(cleanCode: string): string {
  const norm = normalizeVoucherCode(cleanCode)
  if (norm.length !== 12) return cleanCode.toUpperCase()
  return `${norm.slice(0, 4)}-${norm.slice(4, 8)}-${norm.slice(8, 12)}`
}

/**
 * Generate a cryptographically secure 12-char voucher code formatted as XXXX-XXXX-XXXX
 */
export function generateSingleVoucherCode(): { code: string; normalizedCode: string } {
  let result = ""
  for (let i = 0; i < 12; i++) {
    const idx = randomInt(0, VOUCHER_ALPHABET.length)
    result += VOUCHER_ALPHABET[idx]
  }
  return {
    code: formatVoucherCode(result),
    normalizedCode: result,
  }
}

/**
 * Format customer name for public leaderboard:
 * Plain text, max 20 chars, first name + last initial (e.g. "Rahul S")
 * NEVER exposes phone, email, or full surname.
 */
export function sanitizePlayerName(name?: string | null): string {
  if (!name || !name.trim()) return "Member"
  
  // Clean special characters
  const clean = name.trim().replace(/[^a-zA-Z0-9\s]/g, "").trim()
  if (!clean) return "Member"

  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return parts[0].slice(0, 20)
  }

  const firstName = parts[0]
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase()
  const formatted = `${firstName} ${lastInitial}`
  return formatted.slice(0, 20)
}

/**
 * Format stable player ID (max 64 chars) for score aggregation
 */
export function formatPlayerId(identifier: string): string {
  const clean = identifier.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase()
  if (clean.startsWith("u_")) return clean.slice(0, 64)
  return `u_${clean}`.slice(0, 64)
}

/**
 * Generate and store game vouchers for a completed contest purchase
 */
export async function createGameVouchersForOrder(params: {
  userId: string
  playerId?: string
  playerName?: string
  contestId: string
  orderId: string
  count: number
}): Promise<{ ok: boolean; vouchers: string[]; error?: string }> {
  const { userId, contestId, orderId, count } = params
  if (count <= 0) return { ok: true, vouchers: [] }

  const playerId = params.playerId || formatPlayerId(userId)
  const playerName = sanitizePlayerName(params.playerName)

  const createdCodes: string[] = []
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    for (let i = 0; i < count; i++) {
      let inserted = false
      let attempts = 0

      while (!inserted && attempts < 15) {
        attempts++
        const { code, normalizedCode } = generateSingleVoucherCode()

        try {
          await client.query(
            `INSERT INTO game_vouchers (
              code, normalized_code, user_id, player_id, player_name,
              contest_id, order_id, status, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW())`,
            [code, normalizedCode, userId, playerId, playerName, contestId, orderId]
          )
          createdCodes.push(code)
          inserted = true
        } catch (insertErr: any) {
          // Collision on unique constraint: retry loop
          if (insertErr.code === "23505") {
            continue
          }
          throw insertErr
        }
      }

      if (!inserted) {
        throw new Error("Failed to generate a unique voucher code after multiple attempts.")
      }
    }

    await client.query("COMMIT")
    return { ok: true, vouchers: createdCodes }
  } catch (err: any) {
    await client.query("ROLLBACK")
    console.error("[createGameVouchersForOrder error]:", err)
    return { ok: false, vouchers: [], error: err.message || "Failed to create vouchers." }
  } finally {
    client.release()
  }
}

/**
 * Fetch all game vouchers belonging to a customer
 */
export async function getUserGameVouchers(
  email?: string | null,
  phone?: string | null
): Promise<GameVoucherRecord[]> {
  const cleanEmail = email?.trim().toLowerCase() || ""
  const cleanPhone = phone?.replace(/\D/g, "") || ""

  if (!cleanEmail && !cleanPhone) return []

  try {
    const res = await pool.query(
      `SELECT gv.id, gv.code, gv.normalized_code as "normalizedCode",
              gv.user_id as "userId", gv.player_id as "playerId",
              gv.player_name as "playerName", gv.contest_id as "contestId",
              gv.order_id as "orderId", gv.status, gv.created_at as "createdAt",
              gv.expires_at as "expiresAt", gv.used_at as "usedAt",
              gv.game_session_id as "gameSessionId"
       FROM game_vouchers gv
       LEFT JOIN referral_profiles rp ON gv.user_id = rp.id
       WHERE gv.user_id = $1 
          OR (rp.user_email IS NOT NULL AND LOWER(rp.user_email) = $1)
          OR (rp.user_phone IS NOT NULL AND rp.user_phone LIKE $2)
          OR (LOWER(gv.user_id) = $1)
          OR (gv.user_id LIKE $2)
       ORDER BY gv.created_at DESC`,
      [cleanEmail || "NOMATCH", `%${cleanPhone ? cleanPhone.slice(-10) : "NOMATCH"}`]
    )
    return res.rows
  } catch (err) {
    console.error("[getUserGameVouchers error]:", err)
    return []
  }
}

/**
 * API Logic: Check voucher validity (Read-only, Endpoint 1)
 */
export async function checkVoucherValidity(rawCode: string): Promise<
  | { ok: true; status: "active"; voucher_id: string; player_id: string; player_name: string }
  | { ok: false; status: "used" | "expired" | "void" | "not_found" }
> {
  const normalized = normalizeVoucherCode(rawCode)
  if (!normalized) {
    return { ok: false, status: "not_found" }
  }

  try {
    const res = await pool.query(
      `SELECT id, status, player_id, player_name, expires_at
       FROM game_vouchers
       WHERE normalized_code = $1
       LIMIT 1`,
      [normalized]
    )

    if (res.rows.length === 0) {
      return { ok: false, status: "not_found" }
    }

    const v = res.rows[0]

    // Check expiration dynamically if status was still 'active'
    if (v.status === "active" && v.expires_at && new Date(v.expires_at).getTime() < Date.now()) {
      return { ok: false, status: "expired" }
    }

    if (v.status === "active") {
      return {
        ok: true,
        status: "active",
        voucher_id: String(v.id),
        player_id: v.player_id,
        player_name: v.player_name,
      }
    }

    return {
      ok: false,
      status: v.status as "used" | "expired" | "void",
    }
  } catch (err) {
    console.error("[checkVoucherValidity error]:", err)
    throw err
  }
}

/**
 * API Logic: Redeem voucher (Atomic State Transition, Endpoint 2)
 */
export async function redeemVoucherAtomic(params: {
  rawCode: string
  sessionId: string
  ipAddress?: string
  userAgent?: string
}): Promise<
  | { ok: true; status: "used"; voucher_id: string; player_id: string; player_name: string; used_at: string }
  | { ok: false; status: "used" | "expired" | "void" | "not_found" }
> {
  const { rawCode, sessionId, ipAddress, userAgent } = params
  const normalized = normalizeVoucherCode(rawCode)

  if (!normalized) {
    return { ok: false, status: "not_found" }
  }

  const client = await pool.connect()

  try {
    // 1. Atomic update to 'used' where status is currently 'active' and not expired
    const updateRes = await client.query(
      `UPDATE game_vouchers
       SET status = 'used',
           used_at = NOW(),
           game_session_id = $2
       WHERE normalized_code = $1
         AND status = 'active'
         AND (expires_at IS NULL OR expires_at > NOW())
       RETURNING id, code, player_id, player_name, used_at`,
      [normalized, sessionId]
    )

    if (updateRes.rows.length > 0) {
      const v = updateRes.rows[0]

      // Audit log the successful redemption
      await client.query(
        `INSERT INTO game_voucher_redemptions (
          voucher_id, code, game_session_id, player_id, player_name,
          ip_address, user_agent, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'success', NOW())`,
        [v.id, v.code, sessionId, v.player_id, v.player_name, ipAddress || null, userAgent || null]
      )

      return {
        ok: true,
        status: "used",
        voucher_id: String(v.id),
        player_id: v.player_id,
        player_name: v.player_name,
        used_at: new Date(v.used_at).toISOString(),
      }
    }

    // 2. Row was not updated. Check reason:
    // Case A: Idempotent network retry with the SAME session_id?
    const sameSessionRes = await client.query(
      `SELECT id, code, player_id, player_name, used_at
       FROM game_vouchers
       WHERE normalized_code = $1 AND game_session_id = $2 AND status = 'used'
       LIMIT 1`,
      [normalized, sessionId]
    )

    if (sameSessionRes.rows.length > 0) {
      const v = sameSessionRes.rows[0]
      // Log retry
      await client.query(
        `INSERT INTO game_voucher_redemptions (
          voucher_id, code, game_session_id, player_id, player_name,
          ip_address, user_agent, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'retry_idempotent', NOW())`,
        [v.id, v.code, sessionId, v.player_id, v.player_name, ipAddress || null, userAgent || null]
      )

      return {
        ok: true,
        status: "used",
        voucher_id: String(v.id),
        player_id: v.player_id,
        player_name: v.player_name,
        used_at: new Date(v.used_at).toISOString(),
      }
    }

    // Case B: Not found, used by another session, expired, or void
    const existingRes = await client.query(
      `SELECT id, code, status, expires_at, player_id, player_name
       FROM game_vouchers
       WHERE normalized_code = $1
       LIMIT 1`,
      [normalized]
    )

    if (existingRes.rows.length === 0) {
      return { ok: false, status: "not_found" }
    }

    const ex = existingRes.rows[0]
    let failStatus: "used" | "expired" | "void" = "used"

    if (ex.status === "active" && ex.expires_at && new Date(ex.expires_at).getTime() < Date.now()) {
      failStatus = "expired"
    } else if (ex.status === "void") {
      failStatus = "void"
    } else if (ex.status === "expired") {
      failStatus = "expired"
    } else {
      failStatus = "used"
    }

    // Audit log the failed redemption attempt
    await client.query(
      `INSERT INTO game_voucher_redemptions (
        voucher_id, code, game_session_id, player_id, player_name,
        ip_address, user_agent, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [ex.id, ex.code, sessionId, ex.player_id, ex.player_name, ipAddress || null, userAgent || null, failStatus]
    )

    return {
      ok: false,
      status: failStatus,
    }
  } catch (err) {
    console.error("[redeemVoucherAtomic error]:", err)
    throw err
  } finally {
    client.release()
  }
}
