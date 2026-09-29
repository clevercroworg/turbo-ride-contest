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

*   `/`: Public contest landing page (Hero with fluid +17% headline, live allocation progress, Entry Allocation terminal, How It Works, Porsche Specs, Fleet showcase, Prize tiers, Referral engine, FAQs, and ticket checkout modal).
*   `/terms`: Statutory Terms & Conditions (Section 194B TDS, 10,000 Cap, Buddh Delivery, ₹75 Lakh Cash Option).
*   `/draw-regulations`: Cryptographic Seed Verification, Live Draw Protocol & Audit Logs.
*   `/privacy`: Privacy Policy & Digital Personal Data Protection (DPDP) Act 2023 compliance.
*   `/login`: Passwordless phone / email login to Member Garage.
*   `/members`: Member Garage Dashboard (Ticket numbers list, manual/auto-pick, Drive Credits wallet, referral affiliate link & metrics, cash payout claims).
*   `/members/rewards`: Rewards garage for redeeming Drive Credits for Lamborghini, Ferrari, McLaren, Porsche track runs, or 4K drone reels.
*   `/admin`: Superadmin Console (Overview metrics, `/contests`, `/members`, `/orders`, `/referrals`, `/redemptions`, `/settings`).

---

## 🎨 UI & Responsive Design System

*   **Aesthetic Constraint**: Industrial-brutalist supercar aesthetic with sharp edges (`rounded-none`).
*   **Palette**: Brand Racing Orange (`#ea580c`), Jet Black (`text-zinc-950` / `bg-zinc-950`), Studio White (`#ffffff`).
*   **Headline Typography Rules**:
    *   Strict **2-line layout** with `<span className="block whitespace-nowrap">`.
    *   Mobile strictly locked at **+17%** over original baseline using CSS clamp: `text-[clamp(27px,8.4vw,36.3px)]`. The 27px floor ensures 100% overflow immunity on 320px screens.
    *   Breakpoints:
        *   Mobile (< 640px): `text-[clamp(27px,8.4vw,36.3px)]`
        *   Phablets (640px–767px): `sm:text-[38px]`
        *   Tablet Portrait (`md:` 768px–1023px, single column 672px max): `md:text-[44px]`
        *   Tablet Landscape (`lg:` 1024px–1279px, dual column 464px each): `lg:text-[36px]`
        *   Desktop (`xl:` 1280px+): `xl:text-[48px] 2xl:text-[52px]`
*   **Adaptive Navbar (`components/nav.tsx`)**:
    *   Top position (`scrollY <= 20`): `bg-transparent border-none`, white/black logo, white links, solid jet black button.
    *   Scrolled position (`scrollY > 20`): `bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs`, black/orange logo, orange button.
    *   Ultra-small screens (320px–360px): `px-3.5`, responsive logo `text-base xs:text-lg sm:text-xl md:text-2xl`, button `px-2.5 xs:px-3 text-[11px] xs:text-xs`.
*   **Bottom Delivery & Cash Option Bar**:
    *   Left: Buddh Circuit Delivery (`text-xs xs:text-[13px] sm:text-sm font-black`) with gauge icon (`size={16}`).
    *   Right: `₹75 Lakh Cash Option` badge (`text-xs xs:text-[13px] sm:text-sm font-black bg-zinc-950 text-white`).

---

## 🔗 Shared Integrations

*   **Database**: Shared Neon PostgreSQL instance (`user_credits`, `credit_transactions`, `contests`, `contest_tickets`, `referral_profiles`, `reward_redemptions`).
*   **Booking Engine Integration**: Redemptions in `/members/rewards` debit credits and redirect to `${NEXT_PUBLIC_BOOKING_APP_URL}/checkout` with pre-filled parameters.
*   **Git Remote**: `https://github.com/clevercroworg/turbo-ride-contest.git` (branch `main`).
*   **Live Production URL**: `https://turbo-ride-contest.vercel.app`.
*   **Architecture Reference**: See `../PROJECT_STRUCTURE.md` for complete multi-project ecosystem documentation.
