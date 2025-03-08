-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own connection requests" ON connection_requests;

-- Create policies without IF NOT EXISTS (PostgreSQL doesn't support this syntax for policies)
CREATE POLICY "Users can view their own connection requests" ON connection_requests 
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
