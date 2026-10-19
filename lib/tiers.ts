import type { PoolClient } from "pg"
import type { TicketTier, TicketTierSettings } from "./types"

// Ticket tiers: customers can buy either tier; each has its own price, credits,
// vouchers, per-customer cap and prize. The tier is also the Coin Rush voucher_type
// ("1" or "2"), which the game uses to route scores to separate leaderboards.
// Stored in site_settings; Tier 1 keeps the original price/credit keys.

type Queryable = Pick<PoolClient, "query">

export const TICKET_TIERS: TicketTier[] = ["1", "2"]

export const TIER_SETTING_KEYS: Record<TicketTier, Record<keyof TicketTierSettings, string>> = {
  "1": {
    price: "contest_ticket_price",
    creditsPerTicket: "contest_credit_multiplier",
    vouchersPerTicket: "contest_tier1_vouchers_per_ticket",
    maxTicketsPerCustomer: "contest_tier1_max_tickets",
    prizeTitle: "contest_tier1_prize_title",
    prizeDescription: "contest_tier1_prize_desc",
  },
  "2": {
    price: "contest_tier2_price",
    creditsPerTicket: "contest_tier2_credits_per_ticket",
    vouchersPerTicket: "contest_tier2_vouchers_per_ticket",
    maxTicketsPerCustomer: "contest_tier2_max_tickets",
    prizeTitle: "contest_tier2_prize_title",
    prizeDescription: "contest_tier2_prize_desc",
  },
}

export const TIER_DEFAULTS: Record<TicketTier, TicketTierSettings> = {
  "1": {
    price: 1000,
    creditsPerTicket: 1000,
    vouchersPerTicket: 1,
    maxTicketsPerCustomer: 0,
    prizeTitle: "Free Supercar Rides",
    prizeDescription: "Win free TurboRide supercar drive experiences.",
  },
  "2": {
    price: 2000,
    creditsPerTicket: 2000,
    vouchersPerTicket: 1,
    maxTicketsPerCustomer: 0,
    prizeTitle: "Apple iPhone",
    prizeDescription: "Win a brand-new Apple iPhone.",
  },
}

/** Credits a buyer must purchase to unlock cash referral commission. */
export const CASH_UNLOCK_CREDITS_KEY = "contest_cash_unlock_credits"
export const DEFAULT_CASH_UNLOCK_CREDITS = 25000

export function isTicketTier(value: unknown): value is TicketTier {
  return value === "1" || value === "2"
}

/** Builds tier settings from a site_settings key/value map, falling back to defaults. */
export function tiersFromSettingsMap(map: Map<string, string>): Record<TicketTier, TicketTierSettings> {
  const build = (tier: TicketTier): TicketTierSettings => {
    const keys = TIER_SETTING_KEYS[tier]
    const d = TIER_DEFAULTS[tier]
    const price = Number(map.get(keys.price)) || d.price
    const vouchers = Number(map.get(keys.vouchersPerTicket))
    const max = Number(map.get(keys.maxTicketsPerCustomer))
    return {
      price,
      creditsPerTicket: Number(map.get(keys.creditsPerTicket)) || price,
      vouchersPerTicket: Number.isInteger(vouchers) && vouchers >= 1 ? vouchers : d.vouchersPerTicket,
      maxTicketsPerCustomer: Number.isInteger(max) && max >= 0 ? max : d.maxTicketsPerCustomer,
      prizeTitle: map.get(keys.prizeTitle) ?? d.prizeTitle,
      prizeDescription: map.get(keys.prizeDescription) ?? d.prizeDescription,
    }
  }
  return { "1": build("1"), "2": build("2") }
}

/** All site_settings keys the tier helpers read. */
export const ALL_TIER_KEYS = [
  ...Object.values(TIER_SETTING_KEYS["1"]),
  ...Object.values(TIER_SETTING_KEYS["2"]),
  CASH_UNLOCK_CREDITS_KEY,
]

export async function readTierSettings(db: Queryable): Promise<Record<TicketTier, TicketTierSettings>> {
  const res = await db.query(`SELECT key, value FROM site_settings WHERE key = ANY($1)`, [ALL_TIER_KEYS])
  return tiersFromSettingsMap(new Map(res.rows.map((r: { key: string; value: string }) => [r.key, r.value])))
}

export async function readCashUnlockCredits(db: Queryable): Promise<number> {
  const res = await db.query(`SELECT value FROM site_settings WHERE key = $1 LIMIT 1`, [CASH_UNLOCK_CREDITS_KEY])
  const v = Number(res.rows[0]?.value)
  return Number.isFinite(v) && v >= 0 && res.rows.length > 0 ? v : DEFAULT_CASH_UNLOCK_CREDITS
}
