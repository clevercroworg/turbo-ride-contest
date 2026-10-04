# TurboRide Contest App — Design & Structure System

---

## 1. Core Visual Foundations

- **Aesthetic Identity**: High-octane automotive precision engineering. Clean white/zinc background with high-contrast obsidian frames, technical hairline borders, and iconic Porsche Guards Red/Turbo Orange accents.
- **Surface Elevation**: Flat with 1px hairline borders (`border border-zinc-200`) and soft ambient shadows (`shadow-sm` or `shadow-md`). Heavy blur cards, saturated outer glows, and purple/blue neon gradients are strictly forbidden.
- **Corner Radii**:
  - App Shell / Containers: `rounded-3xl` (24px)
  - Cards & Modal Surfaces: `rounded-2xl` (16px)
  - Form Fields, Selects & Buttons: `rounded-xl` (12px)
  - Tags, Badges & Small Controls: `rounded-lg` (8px)
  - Status Indicators & Micro Pills: `rounded-full` (9999px)
- **Technical Accents**:
  - Hairline borders: `1px solid rgba(9, 9, 11, 0.08)` on light mode, `1px solid rgba(255, 255, 255, 0.12)` on dark mode.
  - Subtle background grids: 32px × 32px technical dot or subtle wireframe lines for hero vehicle showcase zones.

---

## 2. Color System & Token Rules

- **Canvas & Backgrounds**:
  - Primary Background: `#fafafa` (Zinc-50) — pure clean off-white
  - Secondary / Subtle Background: `#f4f4f5` (Zinc-100) — input tracks, disabled zones, segmented pill holders
  - Elevated Card Background: `#ffffff` — clean contrast against canvas
  - Dark Surface / Tech Frame: `#09090b` (Zinc-950) — vehicle detail panels, terminal cards, dark header bars
- **Primary Brand Accents**:
  - Primary Base: `#ea580c` (Turbo Orange / Porsche Red) — primary CTA buttons, active tabs, highlighted vehicle borders
  - Primary Hover: `#c2410c` (Zinc/Orange-700)
  - Primary Subtle / Glow: `rgba(234, 88, 12, 0.12)` — badge backgrounds, focus ring glows, selected item tints
- **Text & Foreground Hierarchy**:
  - Primary Text: `#09090b` (Zinc-950) — high contrast, 100% readable
  - Secondary Text: `#52525b` (Zinc-600) — section introductions, item descriptions, table secondary columns
  - Muted / Caption Text: `#71717a` (Zinc-500) — timestamps, helper tips, legal disclaimers
  - Inverted Text: `#ffffff` on `#09090b` or `#ea580c`
- **Semantic Status Tokens**:
  - Success / Active: `#10b981` (Emerald-500) text on `rgba(16, 185, 129, 0.1)` bg — active tickets, confirmed bookings, live status
  - Warning / Balance Due: `#f59e0b` (Amber-500) text on `rgba(245, 158, 11, 0.1)` bg — expiring validity, pending payouts
  - Destructive / Error: `#ef4444` (Red-500) text on `rgba(239, 68, 68, 0.1)` bg — cancellations, delete confirmations, hard limits
- **Color Restrictions**:
  - Multi-colored random gradients are banned.
  - Fluctuating between warm brown and cool blue neutrals is banned; Zinc is the single neutral baseline across all screens.

---

## 3. Typography Architecture

- **Font Families**:
  - Primary Sans: `Inter`, system-ui, -apple-system, sans-serif
  - Display / Headings: `Oswald`, `Inter`, sans-serif (for bold automotive titles, uppercase badges, pool metrics)
  - Monospace: UI Monospace, `JetBrains Mono`, `SFMono-Regular`, monospace (for ticket references, voucher codes, amounts, countdowns)
- **Typographic Scale & Tracking**:
  - Hero Headline: `text-3xl` (30px) on mobile, `text-5xl` to `text-6xl` (48px–60px) on desktop; line-height `leading-tight`; tracking `tracking-tight` (-0.02em)
  - Section Title: `text-xl` (20px) on mobile, `text-2xl` to `text-3xl` (24px–30px) on desktop; font-weight `font-bold` (700); uppercase tracking `tracking-wide` (0.02em)
  - Card Title: `text-base` to `text-lg` (16px–18px); font-weight `font-semibold` (600)
  - Body Text: `text-sm` (14px) or `text-base` (16px); line-height `leading-relaxed` (1.6); max line length 65 characters
  - Micro / Meta Text: `text-xs` (12px); font-weight `font-medium` (500)
- **Typography Rules**:
  - No heading directly followed by an redundant sub-heading that repeats the title's meaning.
  - All numeric prices, ticket numbers, and countdown counters must use `tabular-nums` (`font-variant-numeric: tabular-nums`).
  - Headings must never wrap to more than 3 lines on mobile viewports.

---

## 4. Spacing Scale & Rhythm

- **Base Unit**: 4px scale (Multiples of 4, 8, 12, 16, 24, 32, 48, 64)
- **Desktop Spacing Scale**:
  - Outer Page Container Padding: `px-6 lg:px-8`
  - Vertical Section Separation: `py-16 lg:py-24` (64px–96px)
  - Card Internal Padding: `p-6 lg:p-8` (24px–32px)
  - Component Internal Gaps: `gap-6` (24px) for major card grids, `gap-4` (16px) for item rows
  - Element Inline Spacing: `gap-2` to `gap-3` (8px–12px) between icon and label, badge and text
- **Mobile Spacing Scale**:
  - Outer Page Container Padding: `px-4` (16px) — never edge-to-edge text
  - Vertical Section Separation: `py-8 sm:py-12` (32px–48px)
  - Card Internal Padding: `p-4 sm:p-5` (16px–20px)
  - Component Internal Gaps: `gap-3 sm:gap-4` (12px–16px)
  - Header / Toolbar Gap: `py-3 px-4`
- **Spacing Invariants**:
  - Form field gap: consistently `space-y-4` or `gap-3.5`. Never vary form spacing between inputs within the same form.
  - Section header margin bottom: strictly `mb-6` on mobile, `mb-10` on desktop.

---

## 5. Layout & Container Rules

- **Maximum Widths**:
  - Full Page Layout: `max-w-7xl` (1280px) centered via `mx-auto`
  - Compact Reading / Checkout / Form Container: `max-w-xl` (576px) or `max-w-2xl` (672px)
  - Admin Master-Detail Views: 2-column grid (`grid-cols-12`) with 4-column sidebar/inbox (`col-span-4`) and 8-column workspace (`col-span-8`)
- **Grid Systems**:
  - Vehicle Drops / Catalog: 1 column on mobile (`grid-cols-1`), 2 columns on tablet (`md:grid-cols-2`), 3 columns on desktop (`lg:grid-cols-3`)
  - Metrics / KPI Cards: 2 columns on mobile (`grid-cols-2`), 4 columns on desktop (`md:grid-cols-4`)
  - Order / Ticket Tables: Full-width container with `overflow-x-auto` to prevent horizontal viewport break
- **Layout Invariants**:
  - CSS Grid must be preferred over manual flex percentage math.
  - No layout element may cause horizontal window scrolling (`overflow-x: hidden` enforced on page root).
  - Absolute positioning must never be used for structural text content.

---

## 6. Mobile Viewport & Responsive Rules

- **Mobile Viewport Target**: 375px to 430px (iPhone / Android baseline)
- **Single-Column Collapse**: All multi-column cards, form rows, and split hero sections must collapse to a vertical stack below `768px` (`md:` breakpoint).
- **Touch Target Requirement**: All buttons, links, checkbox controls, select options, and tap zones must have a minimum clickable area of `44px × 44px`.
- **Sticky Actions**: On mobile conversion screens (Ticket Checkout, Customizer, Payment), primary CTAs must pin to the screen bottom (`fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-zinc-200 z-40`).
- **Data Table Mobile Adaptation**:
  - Desktop data tables must either be horizontally scrollable within a contained rounded border, or convert to stacked card summaries on screens under 768px.
  - Checkbox selection columns on mobile must maintain a full 40px tap zone around the checkmark.
- **Drawer & Modal Mobile Behavior**:
  - Desktop: Centered modal dialog (`max-w-md` or `max-w-lg`) with backdrop blur.
  - Mobile: Bottom-sheet slide up or full-screen overlay with sticky header and bottom dismiss button.

---

## 7. Component Construction Rules

- **Buttons**:
  - Primary: Filled Turbo Orange (`bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-xl h-11 px-5 shadow-sm active:scale-[0.98] transition-all`)
  - Secondary: Neutral bordered (`bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-semibold rounded-xl h-11 px-5`)
  - Destructive: Red tint or fill (`bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl h-9 px-3 text-xs`)
  - Ghost: Borderless hover (`hover:bg-zinc-100 text-zinc-700 rounded-lg p-2`)
- **Checkboxes & Multi-Select**:
  - Rounded square box (`h-4 w-4 rounded border transition-colors`)
  - Checked: Solid emerald green (`bg-emerald-600 border-emerald-600 text-white`) with high-contrast check icon.
  - Unchecked: Neutral border (`border-zinc-300 bg-white hover:border-emerald-500`).
  - Action Banner: When ≥1 item selected, show prominent top banner with selected count, "Clear selection", and bulk action button.
- **Cards**:
  - High-precision border: `1px solid #e4e4e7` (light mode) or `1px solid #27272a` (dark mode)
  - Surface color: strictly `#ffffff` on light mode
  - Hover micro-interaction: subtle translate `hover:-translate-y-0.5` and shadow elevation `hover:shadow-md` (never scale above 1.02)
- **Form Inputs**:
  - Height: `h-11` (44px) on desktop and mobile
  - Border: `1px solid #e4e4e7`, active ring `ring-2 ring-[#ea580c]/20 border-[#ea580c]`
  - Label: `text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wide`
  - Helper/Error: `text-xs text-zinc-500 mt-1`, errors in `text-xs text-red-600 font-medium`

---

## 8. Anti-Patterns & Banned Conventions

- **Banned AI Tropes**:
  - No purple/indigo outer glows or neon cyber borders.
  - No decorative emojis in admin dashboards, action buttons, or table headers.
  - No meaningless floating shapes or background blob animations.
  - No decorative sub-headings that merely rephrase the main heading.
- **Banned Typography Patterns**:
  - No generic serif fonts (Times New Roman, Georgia) in application or contest flows.
  - No low-contrast gray text on dark backgrounds (`#71717a` text on `#18181b` surface).
  - No centered long-form body text. Body text must always be left-aligned.
- **Banned Layout Patterns**:
  - No nested card inside card inside card (maximum 1 level of card elevation).
  - No hardcoded pixel widths (`width: 400px`) that cause horizontal viewport overflow on mobile.
  - No layout shifts caused by dynamic content loading; reserved skeletons must match final element dimensions.
