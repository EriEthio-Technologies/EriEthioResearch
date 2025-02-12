-- Create function to execute SQL with parameters
CREATE OR REPLACE FUNCTION execute_sql(sql text, params text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    EXECUTE sql USING params[1], params[2], params[3], params[4];
END;
$$; 