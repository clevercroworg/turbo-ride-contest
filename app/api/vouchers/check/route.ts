import { NextRequest, NextResponse } from "next/server"
import { checkGameAuthAndRateLimit } from "@/lib/game-auth"
import { checkVoucherValidity } from "@/lib/vouchers"

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
  if (!rawCode || typeof rawCode !== "string") {
    return NextResponse.json(
      { ok: false, status: "not_found" },
      { status: 200 }
    )
  }

  // 3. Query voucher status
  try {
    const result = await checkVoucherValidity(rawCode)
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error("[POST /api/vouchers/check error]:", err)
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
