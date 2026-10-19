"use server"

import { pool } from "./db"
import { revalidatePath } from "next/cache"
import { loginOrSignupMember } from "./auth"
import { cookies } from "next/headers"
import {
  MAX_TICKETS_PER_ORDER,
  checkPurchaseLimit,
  checkRazorpayPayment,
  checkTierTicketLimit,
  isContestOpen,
  isValidRazorpaySignature,
  purchaseFromOrderNotes,
  settleTicketPurchase,
  type RazorpayOrderRecord,
  type RazorpayPaymentRecord,
} from "./ticket-settlement"
import { isTicketTier, readTierSettings } from "./tiers"
import type { TicketTier } from "./types"

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {}
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_TVcBqxdRYHZ9A2"
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "7i70nClf4o63ct8YZynPpRly"

function authHeader(): string {
  return "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
}

async function razorpayGet<T>(path: string): Promise<T | null> {
  const res = await fetch(`https://api.razorpay.com/v1/${path}`, {
    headers: { Authorization: authHeader() },
    cache: "no-store",
  })
  if (!res.ok) return null
  return (await res.json().catch(() => null)) as T | null
}

/**
 * 1. Create a server-side Razorpay Order for ticket checkout.
 * The amount is always computed here from the tier's price in Settings; the browser only
 * says which tier and how many tickets it wants. What was bought is stored in the order's notes, which
 * only the server can write, and settlement later reads it back from Razorpay.
 */
export async function createRazorpayOrderAction(params: {
  contestId: string
  tier?: TicketTier
  ticketCount: number
  userEmail: string
  userPhone: string
  userName?: string
  referralCodeUsed?: string
  autoAssign?: boolean
}): Promise<{
  ok: boolean
  orderId?: string
  amount?: number
  currency?: string
  keyId?: string
  error?: string
}> {
  try {
    const ticketCount = Number(params.ticketCount)
    if (!Number.isInteger(ticketCount) || ticketCount < 1 || ticketCount > MAX_TICKETS_PER_ORDER) {
      return { ok: false, error: "Please select a valid number of tickets." }
    }
    const userEmail = (params.userEmail || "").trim().toLowerCase()
    const userPhone = (params.userPhone || "").trim()
    if (!userEmail && !userPhone) {
      return { ok: false, error: "Please enter your email or phone to receive tickets." }
    }

    const tier: TicketTier = params.tier ?? "1"
    if (!isTicketTier(tier)) {
      return { ok: false, error: "Please choose a valid ticket tier." }
    }
    if (!(await isContestOpen(pool, params.contestId))) {
      return { ok: false, error: "This contest is not open for entries." }
    }
    const pricing = (await readTierSettings(pool))[tier]
    const cost = ticketCount * pricing.price

    const tierLimitError = await checkTierTicketLimit(pool, {
      contestId: params.contestId,
      tier,
      userEmail,
      userPhone,
      ticketCount,
      maxTickets: pricing.maxTicketsPerCustomer,
    })
    if (tierLimitError) {
      return { ok: false, error: tierLimitError }
    }

    const limitError = await checkPurchaseLimit(pool, { userEmail, userPhone, cost })
    if (limitError) {
      return { ok: false, error: limitError }
    }

    // Resolve referral code from the form, falling back to the 30-day referral cookie
    let referralCode = (params.referralCodeUsed || "").trim().toUpperCase()
    if (!referralCode) {
      try {
        const cookieStore = await cookies()
        referralCode = (cookieStore.get("referral_code")?.value || "").trim().toUpperCase()
      } catch {}
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify({
        amount: cost * 100,
        currency: "INR",
        receipt: `RCP-${Date.now()}`,
        notes: {
          contestId: params.contestId,
          tier,
          ticketCount: String(ticketCount),
          ticketPrice: String(pricing.price),
          creditsPerTicket: String(pricing.creditsPerTicket),
          vouchersPerTicket: String(pricing.vouchersPerTicket),
          userEmail,
          userPhone,
          userName: (params.userName || "").trim().slice(0, 100),
          referralCode: referralCode.slice(0, 32),
          autoAssign: params.autoAssign ? "1" : "0",
        },
      }),
      cache: "no-store",
    })

    const json = (await res.json().catch(() => ({}))) as {
      id?: string
      amount?: number
      currency?: string
      error?: { description?: string }
    }

    if (!res.ok || !json.id) {
      return {
        ok: false,
        error: json.error?.description || `Razorpay order creation failed (${res.status})`,
      }
    }

    return {
      ok: true,
      orderId: json.id,
      amount: json.amount,
      currency: json.currency,
      keyId: RAZORPAY_KEY_ID,
    }
  } catch (err: any) {
    console.error("[createRazorpayOrderAction error]:", err)
    return { ok: false, error: err.message || "Failed to initiate Razorpay payment." }
  }
}

/**
 * 2. Verify Razorpay Payment and Settle Contest Tickets & Drive Credits.
 * Requires a valid checkout signature, then confirms with Razorpay that the payment is
 * completed, belongs to this order and covers its full amount. Tickets, credits and
 * vouchers are issued from the order's server-written notes, never from browser input.
 */
export async function verifyAndCompleteRazorpayPaymentAction(params: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): Promise<{ ok: boolean; orderId?: string; ticketCount?: number; creditsAdded?: number; vouchers?: string[]; error?: string }> {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return { ok: false, error: "Missing Razorpay payment details." }
  }

  if (!isValidRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, RAZORPAY_KEY_SECRET)) {
    return { ok: false, error: "Razorpay payment verification failed." }
  }

  const [order, payment] = await Promise.all([
    razorpayGet<RazorpayOrderRecord>(`orders/${encodeURIComponent(razorpayOrderId)}`),
    razorpayGet<RazorpayPaymentRecord>(`payments/${encodeURIComponent(razorpayPaymentId)}`),
  ])
  if (!order || !payment) {
    return { ok: false, error: "Unable to confirm payment with Razorpay. Please contact support." }
  }
  const paymentError = checkRazorpayPayment(order, payment)
  if (paymentError) {
    return { ok: false, error: paymentError }
  }
  const purchase = purchaseFromOrderNotes(order)
  if (!purchase) {
    return { ok: false, error: "This payment is not linked to a ticket order. Please contact support." }
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await settleTicketPurchase(client, {
      ...purchase,
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      gateway: "razorpay",
    })
    await client.query("COMMIT")

    // Auto-login buyer into Member Garage session
    try {
      await loginOrSignupMember(purchase.userEmail || purchase.userPhone, purchase.userName)
    } catch {}

    safeRevalidate("/")
    safeRevalidate("/members")
    safeRevalidate("/members/transactions")
    return {
      ok: true,
      orderId: razorpayOrderId,
      ticketCount: purchase.ticketCount,
      creditsAdded: result.creditsIssued,
      vouchers: result.vouchers,
    }
  } catch (err: any) {
    await client.query("ROLLBACK")
    console.error("[verifyAndCompleteRazorpayPaymentAction error]:", err)
    return { ok: false, error: "Failed to finalize ticket purchase. Please contact support." }
  } finally {
    client.release()
  }
}
