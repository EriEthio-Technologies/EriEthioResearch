-- Replace 'user@example.com' with the email you used to create the admin user
UPDATE profiles
SET role = 'admin'
WHERE email = 'user@example.com';

-- Verify the update
SELECT id, email, role, created_at
FROM profiles
WHERE email = 'user@example.com'; 