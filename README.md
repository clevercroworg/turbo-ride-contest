# TurboRide Contest & Supercar Giveaway Platform

The official **Zero-Loss Guarantee** Supercar Contest & Member Garage platform for TurboRide Supercars.

---

## 🏎️ Core Mechanics

1. **Zero-Loss Guarantee**:
   - Tickets cost ₹1,000 each to enter the draw for a Porsche 718 Cayman (worth ₹1.6 Cr).
   - Every ticket purchase automatically deposits **1,000 Drive Credits (1:1 INR value)** into the member's account.
   - Credits never expire and can be redeemed for real supercar track/highway drive laps or media experiences on the TurboRide booking engine.

2. **Custom 5-Digit Ticket System**:
   - Members can manually select their lucky 5-digit number (e.g. `40821`) or use the server-side Auto-Pick generator.
   - Strictly enforced uniqueness per contest at the database level.

3. **2-Tier Referral Engine**:
   - **Tier 1**: 25% Drive Credits bonus on all referred ticket purchases.
   - **Tier 2**: Upon buying 25 tickets, members unlock **25% Cash Commission** (`is_cash_unlocked = true`) withdrawable directly to UPI or bank accounts.

---

## 🗺️ Route Structure

*   `/`: Public contest landing page (Hero, live ticket progress bar, Zero Loss Manifesto, Fleet showcase, Prize tiers, Referral engine, FAQs, and ticket checkout modal).
*   `/login`: Passwordless phone / email login to Member Garage.
*   `/members`: Member Garage Dashboard (Ticket numbers list, manual/auto-pick, Drive Credits wallet, referral affiliate link & metrics, cash payout claims).
*   `/members/rewards`: Rewards garage for redeeming Drive Credits for Lamborghini, Ferrari, McLaren, Porsche track runs, or 4K drone reels.
*   `/admin`: Superadmin Console (Overview metrics, `/contests`, `/members`, `/orders`, `/referrals`, `/redemptions`, `/settings`).

---

## 🔗 Shared Integrations

*   **Database**: Shared Neon PostgreSQL instance (`user_credits`, `credit_transactions`, `contests`, `contest_tickets`, `referral_profiles`, `reward_redemptions`).
*   **Booking Engine Integration**: Redemptions in `/members/rewards` debit credits and redirect to `${NEXT_PUBLIC_BOOKING_APP_URL}/checkout` with pre-filled parameters.
*   **Architecture Reference**: See `../PROJECT_STRUCTURE.md` for complete ecosystem documentation.
