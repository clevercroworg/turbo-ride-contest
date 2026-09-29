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

## 🎨 UI, Spacing & Responsive Design System

The application adheres to a strict **Industrial-Brutalist Supercar Aesthetic**. Every component is engineered for razor-sharp visual authority, high-octane contrast, and complete responsive immunity from 320px mobile screens to 4K ultra-wide monitors.

### 1. Core Design Axioms
*   **Geometric Sharpness**: Strict `rounded-none` constraint across all containers, cards, buttons, badges, inputs, and drawers. Soft rounded pill borders (`rounded-full`, `rounded-xl`) and fuzzy drop-shadows are strictly forbidden. All geometry reflects the angular carbon-fiber chassis of modern hypercars.
*   **High-Contrast Automotive Palette**:
    *   **Brand Racing Orange**: `#ea580c` / `rgb(234, 88, 12)` (Hero canvas background, primary CTA buttons, active state indicators, telemetry accents).
    *   **Dark Racing Orange**: `#c2410c` / `rgb(194, 65, 12)` (Hero bottom vignette, hover states, border accents).
    *   **Jet Black**: `#09090b` / `text-zinc-950` / `bg-zinc-950` (Primary headlines, dark badges, primary CTA button in transparent navbar state).
    *   **Studio White**: `#ffffff` (Floating telemetry cards, specs panels, high-contrast inverted text, scrolled navbar background).
    *   **Escrow Slate**: `#fafafa` / `#f4f4f5` (Subtle alternate section background contrast).
    *   **Zinc Border Hierarchy**: `#e4e4e7` (`border-zinc-200`) for light cards, `#27272a` (`border-zinc-800`) for dark panels, and `#18181b` (`border-zinc-900`) for high-contrast outlines.
*   **Automotive Lighting Canvas**: The hero section features an engineered radial gradient simulating overhead studio spotlighting on a supercar unveiling stage:
    ```css
    radial-gradient(ellipse 85% 65% at 50% 35%, rgba(251, 146, 60, 0.45) 0%, rgba(234, 88, 12, 0.95) 55%, #c2410c 100%)
    ```

### 2. Spacing & Layout Token System
*   **Global Page Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
*   **Section Vertical Padding**:
    *   Hero Stage: `pt-28 sm:pt-30 md:pt-30 lg:pt-32 pb-12 sm:pb-14 md:pb-12 lg:pb-14`
    *   Standard Content Sections: `py-16 sm:py-20 lg:py-24`
    *   Compact Banner Sections: `py-10 sm:py-12 lg:py-14`
*   **Content Max-Width Constraints**:
    *   Section Headers: `max-w-3xl mx-auto text-center`
    *   Section Subtitles: `max-w-2xl mx-auto` (with mandatory mobile side padding `px-4 xs:px-6 sm:px-0`)
    *   Terminal & Calculators: `max-w-xl md:max-w-2xl lg:max-w-xl mx-auto`
    *   Hero Content (Tablet Portrait): `md:max-w-2xl mx-auto`
*   **Internal Card Paddings**:
    *   Compact Mobile Cards: `p-3.5 xs:p-4 sm:p-6`
    *   Standard Protocol Cards: `p-5 sm:p-6 lg:p-7`
    *   Large Telemetry Panels: `p-6 sm:p-8 lg:p-10`
*   **Component Gap Scales**:
    *   Protocol & Fleet Grids: `gap-4 sm:gap-6 lg:gap-8`
    *   Inline Badges & Pills: `gap-1.5 sm:gap-2`
    *   Metric Columns: `gap-3 sm:gap-4`

### 3. Fluid Typography Scale & Line-Wrapping Constraints
*   **Typography Hierarchy**:
    *   Primary Font: Sans-serif (Geist / Inter) with extreme weight contrast (`font-bold` weight 700 to `font-black` weight 900).
    *   Telemetry & Numbers: Monospace (`font-mono`) with tabular numerals (`tabular-nums`) for currency, ticket IDs, seed hashes, and technical specs.
    *   Section Over-titles: `text-xs font-mono font-bold tracking-widest text-[#ea580c] uppercase`
    *   Section Titles: `text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-zinc-950`
    *   Section Subtitles: `text-sm sm:text-base text-zinc-600 font-medium`
*   **Hero Headline Strict 2-Line Constraint**:
    *   The headline MUST NEVER break into 3 lines or wrap unpredictably. It is structured into two rigid blocks with `whitespace-nowrap`:
        ```tsx
        <h1 className="...">
          <span className="block whitespace-nowrap">WIN A PORSCHE 718</span>
          <span className="block whitespace-nowrap text-white">CAYMAN FOR ₹1,000.</span>
        </h1>
        ```
    *   **Fluid Scaling Formula**: Mobile is locked to **exactly +17%** over the original 23px baseline using CSS clamp:
        ```css
        text-[clamp(27px,8.4vw,36.3px)] sm:text-[38px] md:text-[44px] lg:text-[36px] xl:text-[48px] 2xl:text-[52px]
        ```
    *   **Breakpoint Rationale**:
        *   **Mobile (< 640px)**: The `27px` clamp floor guarantees 100% overflow immunity on ultra-narrow 320px screens (iPhone SE/5), scaling smoothly to `36.3px` on 430px screens (iPhone 16 Pro Max).
        *   **Phablet (640px–767px)**: `sm:text-[38px]`.
        *   **Tablet Portrait (`md:` 768px–1023px)**: Single column with `md:max-w-2xl` allows bold `md:text-[44px]` without text wrapping.
        *   **Tablet Landscape (`lg:` 1024px–1279px)**: Dual column (464px per column) requires `lg:text-[36px]` to prevent line break or column overflow.
        *   **Desktop (`xl:` 1280px+)**: Dual column (580px+ per column) scales up to `xl:text-[48px] 2xl:text-[52px]`.

### 4. Adaptive Contrast Navbar & Kinetic Menu Trigger
*   **Header Dimensions**: Fixed `h-20`, `px-3.5 sm:px-6 lg:px-8`.
*   **Dynamic Contrast States**:
    *   **Top Position (`scrollY <= 20`)**: `bg-transparent border-none`, white/black logo, white navigation links, solid jet black button (`bg-zinc-950 text-white border-zinc-900`).
    *   **Scrolled Position (`scrollY > 20`)**: `bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs`, black/orange logo, racing orange button (`bg-[#ea580c] text-white`).
*   **Brand Logo Typography**: `text-base xs:text-lg sm:text-xl md:text-2xl font-black tracking-tight`.
*   **Primary Action Button**: `px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] xs:text-xs sm:text-sm font-bold uppercase`.
*   **Kinetic 3-Blade Aero-Slats Menu Trigger (`lg:hidden`)**:
    *   Container: `w-9 h-9 sm:w-10 sm:h-10`, `rounded-none border`, `active:scale-90`.
    *   Inner Geometry: `w-[18px] h-[14px] flex flex-col justify-between items-center`.
    *   Top Blade: 18px horizontal bar (`h-[2px]`), rotates `+45°` and translates down `6px` on open.
    *   Middle Blade: 12px Racing Orange speed slat (`bg-[#ea580c]`), smoothly collapses (`w-0 opacity-0`) on open.
    *   Bottom Blade: 18px horizontal bar (`h-[2px]`), rotates `-45°` and translates up `6px` on open.
    *   Symmetrical Intersection: Top and bottom blades meet at exact center (y = 7px) forming a sharp, symmetrical mechanical `X`.
    *   **Cross-Platform Bug Fix**: Engineered with pure CSS-positioned elements rather than SVG `transform-origin` to eliminate Safari mobile center-shift defects.
*   **Supercar Cockpit Mobile Navigation Drawer**:
    *   Header: `NAVIGATION TELEMETRY · DRAW #01 · ZERO LOSS`.
    *   Numbered Monospace Index Items:
        *   `01 // HOW IT WORKS` (`1:1 Capital Returned in Buddh Circuit Credits`)
        *   `02 // THE CAR & SPECS` (`Porsche 718 Cayman · 300 BHP · ₹75L Option`)
        *   `03 // THE FLEET` (`Lamborghini, Ferrari & McLaren Drives`)
        *   `04 // REFER & EARN` (`25% Drive Credits & Cash Commission`)
        *   `05 // RULES & FAQ` (`Section 194B TDS & Seed Audit Protocol`)
    *   Bottom Deck: `My Member Garage` (with live credits), `Member Garage Login`, `Get Tickets · ₹1,000 (100% Back)`, and statutory links (`Terms · Regulations · Privacy`).

### 5. Hero Section Architecture & Spacing
*   **Vertical Canvas Padding**:
    *   Mobile: `pt-28 pb-12` (Generous vertical breathing space for high-impact mobile stage).
    *   Phablet: `sm:pt-30 sm:pb-14`.
    *   Tablet Portrait: `md:pt-30 md:pb-12`.
    *   Desktop: `lg:pt-32 lg:pb-14`.
*   **Top Minimalist Studio Strip**:
    *   Visibility: `hidden md:flex` (Enabled on tablets and desktops; hidden on compact mobile to save viewport height).
    *   Content: `TurboRide Supercar Club / Draw Cap: 10,000 Verified Entries` + `100% Capital Returned in Drive Credits` (ShieldCheck icon).
*   **Vehicle Stage & Spatial Clearance**:
    *   Car Sizing: `max-w-[420px] sm:max-w-[560px] md:max-w-[640px] lg:max-w-[760px] xl:max-w-[840px] mx-auto`.
    *   **Clearance Above Car**: Specs card bottom margin `mb-3.5 sm:mb-4 md:mb-4` + car container top padding `pt-4 sm:pt-5 md:pt-4 lg:py-2` provides ~30px of clean orange canvas above the Porsche roof.
    *   **Clearance Below Car**: Car container bottom padding `pb-7 sm:pb-8 md:pb-6 lg:py-2` with dual ground shadows (`-bottom-3` and `-bottom-1.5`) provides ~24px of separation before the delivery bar.
*   **Bottom Delivery & Cash Option Bar**:
    *   Left: Buddh Circuit Delivery (`text-xs xs:text-[13px] sm:text-sm font-black`) with gauge icon (`size={16}`).
    *   Right: `₹75 Lakh Cash Option` badge (`text-xs xs:text-[13px] sm:text-sm font-black bg-zinc-950 text-white`).
    *   Padding: `p-2.5 sm:p-3 md:p-3.5`.
    *   Responsive Labels: Full string `"Buddh Circuit Delivery Included"` on all screens >= 640px (`hidden sm:inline`); `"Or choose"` hidden on tablet landscape (`hidden md:inline lg:hidden xl:inline`).

### 6. Section Subtitle Side Padding Constraint
*   **Issue Prevented**: Centered paragraphs on narrow mobile screens (320px–390px) spanning wall-to-wall without visual breathing space.
*   **Enforced Rule**: All section subtitles across `components/fleet-showcase.tsx`, `components/referral-engine.tsx`, and `components/interactive-calculator.tsx` must include:
    `px-4 xs:px-6 sm:px-0 max-w-2xl mx-auto`
*   **Result**: Subtitles maintain an elegant 16px–24px symmetrical margin on both sides on mobile, then seamlessly relax to container bounds on desktop (`sm:px-0`).

### 7. "HOW IT WORKS" Protocol Cards
*   **Component**: `components/how-it-works.tsx`.
*   **Card Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6`.
*   **Main Heading Typography**: `text-[22px] xs:text-2xl sm:text-xl lg:text-2xl font-bold uppercase tracking-tight leading-tight`.
*   **Weight Calibration**: Explicitly tuned to **`font-bold` (weight 700)** rather than `font-black` (weight 900) to ensure crisp legibility and optical harmony with the large 22px–24px font size.
*   **Accompanying Icons**: Scaled to `size={25}` with `weight="bold"`.
*   **Step Detail Typography**: `text-[13px] sm:text-sm font-medium text-zinc-950 leading-relaxed`.
*   **Protocol Steps**:
    *   `01 // DEPOSIT ₹1,000` (Badge: `1:1 Value Ratio`)
    *   `02 // CHOOSE 5-DIGITS` (Badge: `Verifiable Seed`)
    *   `03 // LIVE STREAMED DRAW` (Badge: `10,000 Entry Cap`)
    *   `04 // ZERO CAPITAL LOSS` (Badge: `Permanent Credits`)

### 8. Entry Allocation Terminal
*   **Component**: `components/entry-allocation.tsx`.
*   **Card Styling**: `bg-white border-2 border-zinc-950 shadow-2xl p-3.5 xs:p-4 sm:p-7`.
*   **Preset Buttons**: 1, 5, 10 (Popular), 25 (+Cash), 50 (VIP Club) with responsive text `text-sm xs:text-base sm:text-xl` and subtitle `text-[9px] xs:text-[10px] sm:text-xs`.
*   **Tablet Alignment**: Card wrapper constrained to `max-w-xl md:max-w-2xl lg:max-w-xl mx-auto` so it symmetrically matches the 672px width of the Hero specs and car containers on iPad viewports.
*   **Escrow Math Box**: Prominent green guarantee card showcasing 100% Capital Returned in Drive Credits with live recalculation on preset change.

### 9. Comprehensive Responsive Breakpoint Matrix
| Breakpoint | Screen Width | Hero Layout | Headline Size | Car Stage | Navigation Bar | Subtitle Margins |
|---|---|---|---|---|---|---|
| **Mobile XS** | 320px–374px | Single col, `pt-28 pb-12` | `clamp(27px, 8.4vw, 36.3px)` | `max-w-[420px]` | Compact logo, 3-blade menu | `px-4` side padding |
| **Mobile Standard** | 375px–429px | Single col, `pt-28 pb-12` | `clamp(27px, 8.4vw, 36.3px)` | `max-w-[420px]` | Standard logo, 3-blade menu | `px-4` side padding |
| **Mobile Large / Pro Max**| 430px–639px | Single col, `pt-28 pb-12` | `36.3px` (clamp ceiling) | `max-w-[420px]` | Full mobile logo, 3-blade menu | `px-6` side padding |
| **Phablet (`sm:`)** | 640px–767px | Single col, `pt-30 pb-14` | `38px` | `max-w-[560px]` | Full logo, 3-blade menu | `sm:px-0` (container bounded)|
| **Tablet Portrait (`md:`)**| 768px–1023px | Single col, `max-w-2xl` | `44px` | `max-w-[640px]` | Studio strip on, 3-blade menu | `sm:px-0` |
| **Tablet Landscape (`lg:`)**| 1024px–1279px| Dual col (464px/col) | `36px` (prevents wrap) | `max-w-[760px]` | Full desktop links, no drawer | `sm:px-0` |
| **Desktop (`xl:`)** | 1280px–1535px| Dual col (580px/col) | `48px` | `max-w-[840px]` | Full desktop links + CTA | `sm:px-0` |
| **Ultra-Wide (`2xl:`)** | 1536px+ | Dual col (640px+/col) | `52px` | `max-w-[840px]` | Full desktop links + CTA | `sm:px-0` |

---

## 🔗 Shared Integrations

*   **Database**: Shared Neon PostgreSQL instance (`user_credits`, `credit_transactions`, `contests`, `contest_tickets`, `referral_profiles`, `reward_redemptions`).
*   **Booking Engine Integration**: Redemptions in `/members/rewards` debit credits and redirect to `${NEXT_PUBLIC_BOOKING_APP_URL}/checkout` with pre-filled parameters.
*   **Git Remote**: `https://github.com/clevercroworg/turbo-ride-contest.git` (branch `main`).
*   **Live Production URL**: `https://turbo-ride-contest.vercel.app`.
*   **Architecture Reference**: See `../PROJECT_STRUCTURE.md` for complete multi-project ecosystem documentation.
