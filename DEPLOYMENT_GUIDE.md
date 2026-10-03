# TurboRide Supercar Contest App - Cross-Repository & Vercel Deployment Guide

This repository contains the standalone **TurboRide Supercar Contest & Grand Prize Platform** (`win.turboridesupercars.com` / `winmyporsche.in`), built to operate alongside the main **TurboRide Track Booking Engine** (`book.turboridesupercars.com`).

---

## 🏗️ Architecture Overview

| Component | Contest Platform (This Repo) | Main Booking Engine (`turbo-ride`) |
| :--- | :--- | :--- |
| **Repository** | Separate GitHub Repo (`turboride-contest-app`) | Primary Repo (`turbo-ride`) |
| **Vercel Account** | **Same Vercel Account / Team** | **Same Vercel Account / Team** |
| **Production Domain** | `win.turboridesupercars.com` (or `winmyporsche.in`) | `book.turboridesupercars.com` |
| **Database** | **Shared Neon PostgreSQL** (`neondb`) | **Shared Neon PostgreSQL** (`neondb`) |
| **Credits & Escrow** | Reads & writes 1:1 `user_credits` & `reward_redemptions` | Reads & debits `user_credits` & validates `vouchers` |
| **Ticket Ledgers** | `contest_orders`, `contest_tickets`, `contests` | Main track booking tables |

---

## ⚡ 1. Pushing to a Separate GitHub Repository

This directory `/turboride-contest-app` is already initialized with its own Git repository on branch `main`.

To push to your new GitHub repository:
```bash
# 1. Create a new repository on GitHub named 'turboride-contest-app'
# 2. In this folder (/turboride-contest-app), stage and commit all files:
git add .
git commit -m "feat: complete functional supercar contest app with escrow vouchers & admin controls"

# 3. Add your GitHub remote:
git remote add origin https://github.com/YOUR_ORG_OR_USERNAME/turboride-contest-app.git

# 4. Push to main:
git branch -M main
git push -u origin main
```

---

## 🚀 2. Deploying on Vercel Under the Same Account

Both your booking site and contest site run on the same Vercel account for unified billing, teams, and domain management.

1. Go to your **Vercel Dashboard** (under your existing login).
2. Click **Add New...** → **Project**.
3. Select the new GitHub repository **`turboride-contest-app`**.
4. Framework Preset: **Next.js** (Root Directory: `./`).
5. In **Environment Variables**, paste the values from `.env.example`:
   - `DATABASE_URL` (Use the exact same Neon connection string as the booking app)
   - `DATABASE_URL_UNPOOLED`
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://win.turboridesupercars.com`)
   - `NEXT_PUBLIC_BOOKING_APP_URL` (`https://book.turboridesupercars.com`)
   - `ADMIN_EMAIL` (`admin@turboride.com`)
   - `ADMIN_PASSWORD` (Your secure admin password)
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
6. Click **Deploy**.

---

## 🛡️ 3. Direct Shared Database Credits Architecture

### The Workflow:
- Both `turboride-contest-app` and `turboride-booking-app` connect to the **exact same Neon PostgreSQL database** (`user_credits` table).
- When a user purchases contest tickets or earns referral bonuses, credits are deposited directly into `user_credits` under their mobile number and email.
- When clicking **"Redeem"** on `/members/rewards`, the member is routed straight to `https://book.turboridesupercars.com/experience` with pre-filled identification parameters (`email`, `phone`, `car`).
- At booking checkout on `book.turboridesupercars.com`, the customer's live credit balance is automatically recognized by email/phone and applied to their reservation.
- **Zero vouchers or coupons needed, zero escrow confusion, zero lost credits.**

---

## 🎛️ 4. Admin Management

- **Admin Login**: `/login` (Switch to Admin Portal tab)
- **Demo Credentials**: `admin@turboride.com` / `TurboAdmin!2026`
- **Console Routes**:
  - `/admin`: KPI Overview (Tickets, Gross Revenue, Drive Credits Issued/Redeemed, Fill Rate)
  - `/admin/contests`: Live Homepage Showcase & Pricing Control Center (update headline, valuation, ticket price, target/sold counts, plus **4 Gallery Image URLs + 1 YouTube Video URL**)
  - `/admin/members`: Member list, KYC status, tickets bought, credits balance
  - `/admin/orders`: Complete order ledger with search and pagination
  - `/admin/referrals`: Commission payouts (Mark Paid / Hold) and payout history
  - `/admin/redemptions`: Track pass redemptions, fulfillment status
  - `/admin/settings`: Pricing & credit multipliers, referral economics, gateway toggle (persisted directly to Neon PostgreSQL `site_settings` table)
