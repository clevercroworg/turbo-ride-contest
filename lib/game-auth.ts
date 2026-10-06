import { NextRequest, NextResponse } from "next/server"

// In-memory sliding window rate limiter: 60 requests per 60 seconds per API key
interface RateLimitBucket {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitBucket>()

export function checkGameAuthAndRateLimit(req: NextRequest): {
  authorized: boolean
  rateLimited?: boolean
  errorResponse?: NextResponse
  apiKey?: string
  isTest?: boolean
} {
  const authHeader = req.headers.get("authorization") || ""
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { ok: false, error: "Missing or invalid Authorization header. Expected Bearer token." },
        { status: 401 }
      ),
    }
  }

  const token = authHeader.slice(7).trim()
  const liveKey = process.env.GAME_API_KEY_LIVE || "trb_live_cr_9a87f2e13d4b6c890e51"
  const testKey = process.env.GAME_API_KEY_TEST || "trb_test_cr_4c81d09e7a2b5f631d82"

  const isLive = token === liveKey
  const isTest = token === testKey

  if (!isLive && !isTest) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { ok: false, error: "Unauthorized: Invalid API key." },
        { status: 401 }
      ),
    }
  }

  // Rate Limiting: 600 requests per minute (allows high-concurrency game server traffic)
  const RATE_LIMIT_PER_MINUTE = Number(process.env.GAME_API_RATE_LIMIT) || 600
  const now = Date.now()
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "global"
  const bucketKey = `${token}_${clientIp}`
  let bucket = rateLimitMap.get(bucketKey)

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 1, resetAt: now + 60_000 }
    rateLimitMap.set(bucketKey, bucket)
  } else {
    bucket.count++
  }

  if (bucket.count > RATE_LIMIT_PER_MINUTE) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    return {
      authorized: true,
      rateLimited: true,
      errorResponse: NextResponse.json(
        { ok: false, error: `Too many requests. Rate limit is ${RATE_LIMIT_PER_MINUTE} requests per minute.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      ),
    }
  }

  return {
    authorized: true,
    apiKey: token,
    isTest,
  }
}
