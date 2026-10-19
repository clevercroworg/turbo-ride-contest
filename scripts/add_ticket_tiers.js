// Adds a ticket tier ("1" or "2") to contest_orders and contest_tickets.
// Idempotent: safe to run more than once. Existing rows default to "1".
// Usage: node scripts/add_ticket_tiers.js
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
  for (const table of ['contest_orders', 'contest_tickets']) {
    await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS tier VARCHAR(2) NOT NULL DEFAULT '1'`);
    await pool.query(
      `DO $$ BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${table}_tier_check') THEN
           ALTER TABLE ${table} ADD CONSTRAINT ${table}_tier_check CHECK (tier IN ('1', '2'));
         END IF;
       END $$`
    );
    const counts = await pool.query(`SELECT tier, COUNT(*)::int AS n FROM ${table} GROUP BY tier ORDER BY tier`);
    console.log(`${table} by tier:`, counts.rows);
  }
  await pool.end();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
