-- Create function to set up test users
CREATE OR REPLACE FUNCTION setup_test_users(
    users JSONB
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    test_user_id UUID;
    test_user_email TEXT;
    test_user_name TEXT;
    admin_user_id UUID;
    admin_user_email TEXT;
    admin_user_name TEXT;
BEGIN
    -- Extract values from JSON
    test_user_id := (users->>'test_user_id')::UUID;
    test_user_email := users->>'test_user_email';
    test_user_name := users->>'test_user_name';
    admin_user_id := (users->>'admin_user_id')::UUID;
    admin_user_email := users->>'admin_user_email';
    admin_user_name := users->>'admin_user_name';

    -- Delete existing profiles if they exist
    DELETE FROM profiles WHERE email IN (test_user_email, admin_user_email);

    -- Insert new profiles
    INSERT INTO profiles (id, email, full_name, role)
    VALUES
        (test_user_id, test_user_email, test_user_name, 'user'),
        (admin_user_id, admin_user_email, admin_user_name, 'admin');
END;
$$; 