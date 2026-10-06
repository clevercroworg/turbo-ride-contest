<?php
/* Coin Rush voucher API - reference implementation of the Voucher API brief (PHP 7.4+, MySQL).
 *
 *   POST /voucher-api.php/vouchers/check    {"code": "7KQ4-M2XD-9PHA"}
 *   POST /voucher-api.php/vouchers/redeem   {"code": "7KQ4-M2XD-9PHA", "session_id": "gs_..."}
 *   Header: Authorization: Bearer <API_KEY>
 *
 * To plug it into your app: set the four constants, then change the two queries marked ADAPT
 * so they read your own voucher and customer tables. new_voucher_code() makes codes in the right format. */

const API_KEY = 'change-me-to-a-long-random-key';
const DB_DSN = 'mysql:host=localhost;dbname=yourapp;charset=utf8mb4';
const DB_USER = '';
const DB_PASS = '';

const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // no 0, O, 1, I or L

function reply(array $data, int $http = 200): void
{
    http_response_code($http);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// "7kq4 m2xd 9pha", "7KQ4M2XD9PHA" and "7KQ4-M2XD-9PHA" are the same code
function normalize_code(string $code): string
{
    $bare = strtoupper(preg_replace('/[\s-]+/', '', $code));
    return strlen($bare) === 12 ? implode('-', str_split($bare, 4)) : $bare;
}

// A new random code like 7KQ4-M2XD-9PHA. Keep a UNIQUE index on the column and try again on the rare clash.
function new_voucher_code(): string
{
    $c = '';
    for ($i = 0; $i < 12; $i++) $c .= CODE_ALPHABET[random_int(0, strlen(CODE_ALPHABET) - 1)];
    return implode('-', str_split($c, 4));
}

// ADAPT: one voucher with its owner, or null
function find_voucher(PDO $db, string $code): ?array
{
    $st = $db->prepare(
        'SELECT v.id AS voucher_id, v.status, v.used_at, v.game_session_id,
                (v.expires_at IS NOT NULL AND v.expires_at <= NOW()) AS is_expired,
                v.user_id AS player_id, u.nickname AS player_name
           FROM vouchers v
           JOIN users u ON u.id = v.user_id
          WHERE v.code = ?');
    $st->execute([$code]);
    $row = $st->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

// ADAPT: marks an active, unexpired voucher as used. True only for the one request that wins.
function use_voucher(PDO $db, string $code, string $session): bool
{
    $st = $db->prepare(
        "UPDATE vouchers SET status = 'used', used_at = NOW(), game_session_id = ?
          WHERE code = ? AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())");
    $st->execute([$session, $code]);
    return $st->rowCount() === 1;
}

function describe(array $v): string
{
    if ($v['status'] === 'active' && (int)$v['is_expired'] === 1) return 'expired';
    return in_array($v['status'], ['active', 'used', 'expired', 'void'], true) ? $v['status'] : 'void';
}

function owner(array $v): array
{
    return ['voucher_id' => (string)$v['voucher_id'], 'player_id' => (string)$v['player_id'], 'player_name' => (string)($v['player_name'] ?? '')];
}

// ---------- request ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(['ok' => false, 'status' => 'method'], 405);

$auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
if ($auth === '' && function_exists('getallheaders')) $auth = (string)(array_change_key_case(getallheaders())['authorization'] ?? '');
if (!hash_equals('Bearer ' . API_KEY, $auth)) reply(['ok' => false, 'status' => 'unauthorized'], 401);

$path = rtrim((string)($_SERVER['PATH_INFO'] ?? parse_url((string)($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH)), '/');
$action = substr($path, -16) === '/vouchers/redeem' ? 'redeem' : (substr($path, -15) === '/vouchers/check' ? 'check' : '');
if ($action === '') reply(['ok' => false, 'status' => 'not_found'], 404);

$body = json_decode((string)file_get_contents('php://input'), true);
$code = normalize_code((string)($body['code'] ?? ''));

try {
    $db = new PDO(DB_DSN, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
    $v = find_voucher($db, $code);
    if (!$v) reply(['ok' => false, 'status' => 'not_found']);

    if ($action === 'check') {
        $status = describe($v);
        reply($status === 'active' ? ['ok' => true, 'status' => 'active'] + owner($v) : ['ok' => false, 'status' => $status]);
    }

    $session = substr((string)($body['session_id'] ?? ''), 0, 40);
    if ($session === '') reply(['ok' => false, 'status' => 'bad_request'], 400);
    // the winner of the update, or the same session asking again after a network retry, gets the success answer
    if (use_voucher($db, $code, $session) || ($v['status'] === 'used' && $v['game_session_id'] === $session)) {
        $v = find_voucher($db, $code);
        reply(['ok' => true, 'status' => 'used'] + owner($v) + ['used_at' => gmdate('Y-m-d\TH:i:s\Z', (int)strtotime((string)$v['used_at']))]);
    }
    reply(['ok' => false, 'status' => describe(find_voucher($db, $code))]);
} catch (Throwable $e) {
    error_log('[voucher-api] ' . $e->getMessage());
    reply(['ok' => false, 'status' => 'error'], 500);
}
