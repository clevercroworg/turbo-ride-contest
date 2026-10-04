# Contest App — Design & Layout Rules

---

## 1. Spacing Rules

- **Base Unit**: Strictly follow a 4px grid rhythm (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).
- **Desktop Page Padding**: Outer main container must strictly use `px-6 lg:px-8`.
- **Desktop Section Gap**: Vertical space between major sections must strictly be `py-16` or `py-20` (64px–80px).
- **Desktop Card Padding**: Content cards must use `p-6` (24px) for regular cards and `p-8` (32px) for hero/feature cards.
- **Desktop Element Gaps**: Major card grids use `gap-6` (24px); list rows use `gap-4` (16px); icon-with-text uses `gap-2` or `gap-2.5` (8px–10px).
- **Form Spacing**: Form field vertical gap must be consistently `space-y-4` (16px) or `gap-4`. Never mix different spacing between inputs in the same form.
- **Section Heading Margin**: Heading margin-bottom must strictly be `mb-6` on mobile and `mb-8` to `mb-10` on desktop.

---

## 2. Mobile Spacing Rules

- **Mobile Page Padding**: Outer container must strictly use `px-4` (16px). Content must never touch the screen edge.
- **Mobile Section Gap**: Vertical section separation must drop to `py-8` to `py-12` (32px–48px).
- **Mobile Card Padding**: Card internal padding must reduce to `p-4` or `p-5` (16px–20px) to maximize usable content space.
- **Mobile Element Gaps**: Card grids drop to `gap-3` or `gap-4` (12px–16px).
- **Mobile Toolbar & Header Padding**: Mobile top navigation and action toolbars must strictly use `px-4 py-3`.

---

## 3. Mobile Viewport & Responsive Rules

- **Single-Column Collapse**: All multi-column grids, split layouts, and side-by-side forms must collapse to a vertical single column below `768px` (`md:`).
- **Touch Target Rule**: Every clickable element (buttons, links, inputs, checkboxes, tabs, close icons) must have a minimum touch target area of `44px × 44px`.
- **Zero Horizontal Overflow**: Page root and containers must strictly enforce `overflow-x-hidden`. No element, table, or card may cause horizontal page sway or scroll on mobile screens (375px–430px).
- **Mobile Sticky CTA Bar**: On transaction or conversion views (ticket purchase, checkout, draw entry), the primary action button must be pinned to the screen bottom (`fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t z-40`).
- **Table Responsive Adaptation**: Tables must be wrapped in an `overflow-x-auto` container with contained rounded borders so only the table content scrolls horizontally without breaking page width.
- **Modals & Drawers on Mobile**: Centered desktop modals must switch to bottom sheets or full-screen takeovers on mobile with sticky top headers and a 44px dismiss button.

---

## 4. Layout & Container Rules

- **Container Max-Widths**:
  - Main App & Showcase Pages: strictly `max-w-7xl` (1280px) centered with `mx-auto`.
  - Focused Forms, Login & Checkout: strictly `max-w-xl` (576px) or `max-w-2xl` (672px) centered.
  - Admin Split Panels (Inbox / Workspaces): 12-column grid (`grid-cols-12`) with 4-column left sidebar and 8-column right detail pane.
- **Grid Structure**:
  - Vehicle Drops / Catalog: 1 column on mobile (`grid-cols-1`), 2 columns on tablet (`md:grid-cols-2`), 3 columns on desktop (`lg:grid-cols-3`).
  - Metric / KPI Stats: 2 columns on mobile (`grid-cols-2`), 4 columns on desktop (`md:grid-cols-4`).
- **Alignment Rules**:
  - Content, labels, titles, and body paragraphs must always be left-aligned. Never center long body paragraphs.
  - Action buttons in forms and footers must be right-aligned or full-width on mobile.
- **No Overlapping**: No floating elements or overlapping text over graphics. Every element must occupy its own clear structural boundary.
- **No Sub-Heading Clutter**: Never place a redundant sub-heading immediately after a title that merely repeats what the title states.

---

## 5. Component Construction Rules

- **Corner Radii Hierarchy**:
  - Outer Containers & Shells: `rounded-3xl` (24px)
  - Cards & Modal Windows: `rounded-2xl` (16px)
  - Buttons, Inputs & Dropdowns: `rounded-xl` (12px)
  - Tags, Badges & Small Filters: `rounded-lg` (8px)
  - Status Indicators & Micro Pills: `rounded-full` (9999px)
- **Button Sizing & Padding**:
  - Primary / Secondary Action Buttons: height strictly `h-11` (44px), horizontal padding `px-5`, font-weight `font-semibold`.
  - Small / Table Action Buttons: height strictly `h-8` to `h-9` (32px–36px), horizontal padding `px-3`, text size `text-xs`.
- **Form Input Sizing**:
  - Input field height must strictly be `h-11` (44px) across both desktop and mobile.
  - Input internal padding must strictly be `px-3.5 py-2.5`.
  - Labels must sit directly above inputs with `mb-1.5`, never inline with text inputs on mobile.
- **Card Construction**:
  - Surface must be flat with a 1px border (`border border-zinc-200`) and subtle elevation (`shadow-sm`).
  - Card hover state must use micro-translate (`hover:-translate-y-0.5 transition-transform duration-150`).
- **Checkboxes & Multi-Select**:
  - Checkbox size strictly `h-4 w-4` inside a minimum 40px clickable tap cell.
  - When 1 or more items are selected, show a sticky/top action banner showing `[✓] N selected` with a primary bulk action button and a clear selection button.
  - Selected rows must have a subtle highlight background to visually confirm selection state.

---

## 6. Prohibited Anti-Patterns

- **No Card Nesting**: Never nest a card inside another card inside another card. Maximum 1 level of card elevation.
- **No Inconsistent Input Heights**: Never mix 36px, 40px, and 48px input fields across the same application flow.
- **No Hardcoded Widths**: Never use fixed pixel widths (e.g. `width: 500px`) that cause horizontal viewport overflow on mobile screens.
- **No Decorative Icons/Emojis in Core UI**: Do not use decorative emojis in button labels, table headers, or admin navigation items.
- **No Layout Shift on Load**: Loading skeletons and placeholder boxes must strictly match the exact dimensions of final loaded components.
