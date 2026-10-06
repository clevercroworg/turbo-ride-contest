# Coin Rush voucher API - reference

Two working versions of the API described in the Voucher API brief. Pick the one that matches your app, point two queries at your tables, and it is ready.

| File | For |
|---|---|
| `php/voucher-api.php` | PHP 7.4+ with PDO MySQL. Upload it, set the 4 constants at the top. Base URL = `https://your-site/<folder>/voucher-api.php` |
| `node/voucher-api.js` | Node.js with Express + mysql2. `app.use('/api', require('./voucher-api').router)`, env `VOUCHER_API_KEY` and `DATABASE_URL`. Base URL = `https://your-site/api`. In Next.js the same code works inside an API route. |
| `schema.sql` | Example `vouchers` and `users` tables with 13 test codes |

## What to change

- The two queries marked **ADAPT** (`find_voucher` / `use_voucher`, or `findVoucher` / `useVoucher`) so they read your own voucher table and your customer table. The game needs a customer id that never changes and a nickname for the public leaderboard.
- When a customer buys a voucher, insert a row with a code from `new_voucher_code()` / `newVoucherCode()` (format `7KQ4-M2XD-9PHA`, unique index on the column).

## Already tested

Both versions against MariaDB 11.4 and the Coin Rush game server: every status (active, used, expired, void, not found), codes typed in lowercase or with spaces, a redeem retried by the same session, a second session on a used code, 8 redeems of one code at the same moment (exactly one wins), and a wrong or missing key (401).

## When it is live

Send the base URL and the API key (one for testing, one for live) in the project chat.
