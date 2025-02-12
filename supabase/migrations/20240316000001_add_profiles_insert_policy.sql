-- Add policy for inserting profiles
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Add policy for service role to manage profiles
CREATE POLICY "Service role can manage all profiles"
    ON profiles FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role'); 