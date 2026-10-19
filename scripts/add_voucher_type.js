// Adds game_vouchers.voucher_type ("1" = ₹1,000 tier, "2" = ₹2,000 tier).
// Idempotent: safe to run more than once. Existing vouchers default to "1".
// Usage: node scripts/add_voucher_type.js
const { Pool } = require('pg');
const fs = require('fs');

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const env = fs.readFileSync('.env.local', 'utf8');
  const match = env.match(/^DATABASE_URL=(.+)$/m);
  return match[1].trim().replace(/^"|"$/g, '');
}

const pool = new Pool({ connectionString: databaseUrl(), ssl: { rejectUnauthorized: false } });

async function migrate() {
  await pool.query(
    `ALTER TABLE game_vouchers
     ADD COLUMN IF NOT EXISTS voucher_type VARCHAR(2) NOT NULL DEFAULT '1'`
  );
  await pool.query(
    `DO $$ BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'game_vouchers_voucher_type_check') THEN
         ALTER TABLE game_vouchers
         ADD CONSTRAINT game_vouchers_voucher_type_check CHECK (voucher_type IN ('1', '2'));
       END IF;
     END $$`
  );

  const counts = await pool.query(
    'SELECT voucher_type, COUNT(*)::int AS n FROM game_vouchers GROUP BY voucher_type ORDER BY voucher_type'
  );
  console.log('game_vouchers by voucher_type:', counts.rows);
  await pool.end();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
