-- Drop existing admin_users table if it exists
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the developer as admin
INSERT INTO admin_users (email) 
VALUES ('akmolmasud5@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Create RLS policy for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
CREATE POLICY "Only admins can view admin_users"
ON admin_users
FOR SELECT
USING (
    auth.email() IN (SELECT email FROM admin_users)
);

-- Enable realtime for admin_users
ALTER PUBLICATION supabase_realtime ADD TABLE admin_users;