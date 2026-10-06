-- Example tables for the voucher API reference (MySQL / MariaDB).
-- Your app already has a customers table: keep yours and point the queries at it.
-- What the game needs from it: a stable id and a nickname to show on the leaderboard.

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nickname VARCHAR(40) NOT NULL
);

CREATE TABLE vouchers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code CHAR(14) NOT NULL UNIQUE,              -- XXXX-XXXX-XXXX, uppercase
  user_id INT NOT NULL,                       -- the customer who bought it
  status ENUM('active', 'used', 'expired', 'void') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NULL,                   -- optional contest end
  used_at DATETIME NULL,
  game_session_id VARCHAR(40) NULL,
  KEY vouchers_user (user_id)
);

-- Test data: two customers, five codes each, plus one used, one expired and one void code
INSERT INTO users (id, nickname) VALUES (1, 'Rahul S'), (2, 'Priya K');
INSERT INTO vouchers (code, user_id) VALUES
  ('7KQ4-M2XD-9PHA', 1), ('7KQ4-M2XD-9PHB', 1), ('7KQ4-M2XD-9PHC', 1), ('7KQ4-M2XD-9PHD', 1), ('7KQ4-M2XD-9PHE', 1),
  ('4RWN-8TJY-3CGF', 2), ('4RWN-8TJY-3CGH', 2), ('4RWN-8TJY-3CGJ', 2), ('4RWN-8TJY-3CGK', 2), ('4RWN-8TJY-3CGM', 2);
INSERT INTO vouchers (code, user_id, status, used_at) VALUES ('USED-2222-2222', 1, 'used', NOW());
INSERT INTO vouchers (code, user_id, expires_at) VALUES ('EXPD-2222-2222', 2, NOW() - INTERVAL 1 DAY);
INSERT INTO vouchers (code, user_id, status) VALUES ('VOID-2222-2222', 2, 'void');
