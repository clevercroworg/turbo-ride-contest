const { Pool } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/DATABASE_URL=(.+)/);
const pool = new Pool({ connectionString: match[1].trim(), ssl: { rejectUnauthorized: false } });

async function sync() {
  const hash = await bcrypt.hash('TurboAdmin!2026', 10);
  const emails = ['admin@turboride.com', 'admin@dct.com'];

  for (const email of emails) {
    const existing = await pool.query('SELECT * FROM admins WHERE lower(email) = $1', [email]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO admins (id, email, name, role, password_hash, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
        [email, 'TurboRide Administrator', 'superadmin', hash]
      );
      console.log('Inserted admin:', email);
    } else {
      await pool.query('UPDATE admins SET password_hash = $1 WHERE lower(email) = $2', [hash, email]);
      console.log('Updated admin:', email);
    }
  }

  const all = await pool.query('SELECT email, role, last_login_at FROM admins');
  console.log('Admins in DB now:', all.rows);
  await pool.end();
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
