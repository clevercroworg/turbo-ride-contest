import { NextRequest, NextResponse } from "next/server"
import { checkGameAuthAndRateLimit } from "@/lib/game-auth"
import { redeemVoucherAtomic } from "@/lib/vouchers"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  // 1. Auth & Rate-limit verification
  const auth = checkGameAuthAndRateLimit(req)
  if (!auth.authorized || auth.rateLimited) {
    return auth.errorResponse!
  }

  // 2. Parse request body
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, status: "not_found" },
      { status: 200 }
    )
  }

  const rawCode = body?.code
  const sessionId = body?.session_id

  if (!rawCode || typeof rawCode !== "string") {
    return NextResponse.json(
      { ok: false, status: "not_found" },
      { status: 200 }
    )
  }

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing required session_id parameter." },
      { status: 400 }
    )
  }

  // Extract client metadata for audit logging
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || ""
  const userAgent = req.headers.get("user-agent") || ""

  // 3. Perform atomic state transition and idempotency check
  try {
    const result = await redeemVoucherAtomic({
      rawCode,
      sessionId,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error("[POST /api/vouchers/redeem error]:", err)
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
