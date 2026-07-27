-- Run this once in phpMyAdmin if these admin columns do not exist yet.
-- Then change the email in the UPDATE query to your own admin login email.

ALTER TABLE users
ADD COLUMN role VARCHAR(20) DEFAULT 'user',
ADD COLUMN login_count INT DEFAULT 0,
ADD COLUMN last_login_at TIMESTAMP NULL;

UPDATE users
SET role = 'admin'
WHERE email = 'your_email@gmail.com';

SELECT user_id, display_name, email, role, login_count, last_login_at
FROM users;
