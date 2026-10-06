/* Coin Rush voucher API - reference implementation of the Voucher API brief (Node.js, Express + mysql2).
 *
 *   POST /vouchers/check    {"code": "7KQ4-M2XD-9PHA"}
 *   POST /vouchers/redeem   {"code": "7KQ4-M2XD-9PHA", "session_id": "gs_..."}
 *   Header: Authorization: Bearer <VOUCHER_API_KEY>
 *
 * Mount it:  app.use('/api', require('./voucher-api').router)   ->  {base} = https://your-site/api
 * Env:       VOUCHER_API_KEY, DATABASE_URL (mysql://user:pass@host/db)
 * Change the two queries marked ADAPT so they read your own voucher and customer tables.
 * newVoucherCode() makes codes in the right format. */
'use strict';

const crypto = require('crypto');
const express = require('express');
const mysql = require('mysql2/promise');

const API_KEY = process.env.VOUCHER_API_KEY || '';
const db = mysql.createPool(process.env.DATABASE_URL || 'mysql://user:pass@localhost/yourapp');
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // no 0, O, 1, I or L

// "7kq4 m2xd 9pha", "7KQ4M2XD9PHA" and "7KQ4-M2XD-9PHA" are the same code
function normalizeCode(code) {
  const bare = String(code || '').toUpperCase().replace(/[\s-]+/g, '');
  return bare.length === 12 ? bare.match(/.{4}/g).join('-') : bare;
}

// A new random code like 7KQ4-M2XD-9PHA. Keep a UNIQUE index on the column and try again on the rare clash.
function newVoucherCode() {
  let c = '';
  for (let i = 0; i < 12; i++) c += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return c.match(/.{4}/g).join('-');
}

// ADAPT: one voucher with its owner, or null
async function findVoucher(code) {
  const [rows] = await db.execute(
    `SELECT v.id AS voucher_id, v.status, v.used_at, v.game_session_id,
            (v.expires_at IS NOT NULL AND v.expires_at <= NOW()) AS is_expired,
            v.user_id AS player_id, u.nickname AS player_name
       FROM vouchers v
       JOIN users u ON u.id = v.user_id
      WHERE v.code = ?`, [code]);
  return rows[0] || null;
}

// ADAPT: marks an active, unexpired voucher as used. True only for the one request that wins.
async function useVoucher(code, session) {
  const [r] = await db.execute(
    `UPDATE vouchers SET status = 'used', used_at = NOW(), game_session_id = ?
      WHERE code = ? AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())`, [session, code]);
  return r.affectedRows === 1;
}

function describe(v) {
  if (v.status === 'active' && Number(v.is_expired) === 1) return 'expired';
  return ['active', 'used', 'expired', 'void'].includes(v.status) ? v.status : 'void';
}

function owner(v) {
  return { voucher_id: String(v.voucher_id), player_id: String(v.player_id), player_name: v.player_name || '' };
}

function authorized(req) {
  const got = Buffer.from(req.get('authorization') || '');
  const want = Buffer.from('Bearer ' + API_KEY);
  return API_KEY !== '' && got.length === want.length && crypto.timingSafeEqual(got, want);
}

const router = express.Router();
router.use(express.json());
router.use((req, res, next) => (authorized(req) ? next() : res.status(401).json({ ok: false, status: 'unauthorized' })));

router.post('/vouchers/check', async (req, res, next) => {
  try {
    const v = await findVoucher(normalizeCode(req.body.code));
    if (!v) return res.json({ ok: false, status: 'not_found' });
    const status = describe(v);
    res.json(status === 'active' ? { ok: true, status, ...owner(v) } : { ok: false, status });
  } catch (e) { next(e); }
});

router.post('/vouchers/redeem', async (req, res, next) => {
  try {
    const code = normalizeCode(req.body.code);
    const session = String(req.body.session_id || '').slice(0, 40);
    if (!session) return res.status(400).json({ ok: false, status: 'bad_request' });
    let v = await findVoucher(code);
    if (!v) return res.json({ ok: false, status: 'not_found' });
    // the winner of the update, or the same session asking again after a network retry, gets the success answer
    if (await useVoucher(code, session) || (v.status === 'used' && v.game_session_id === session)) {
      v = await findVoucher(code);
      return res.json({ ok: true, status: 'used', ...owner(v), used_at: new Date(v.used_at).toISOString() });
    }
    res.json({ ok: false, status: describe(await findVoucher(code)) });
  } catch (e) { next(e); }
});

router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[voucher-api]', err.message);
  res.status(500).json({ ok: false, status: 'error' });
});

module.exports = { router, newVoucherCode, normalizeCode };
