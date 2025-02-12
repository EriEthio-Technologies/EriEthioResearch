-- Create function to verify users
CREATE OR REPLACE FUNCTION verify_users(user_ids UUID[])
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW(),
      confirmed_at = NOW()
  WHERE id = ANY(user_ids);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER; 