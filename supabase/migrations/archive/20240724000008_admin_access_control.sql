-- Create admin_users table to track admin access
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the developer as admin (using a placeholder UUID that will be updated later)
INSERT INTO admin_users (user_id, email) 
SELECT id, email FROM auth.users WHERE email = 'akmolmasud5@gmail.com'
ON CONFLICT DO NOTHING;

-- Create RLS policy for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin_users"
ON admin_users
FOR SELECT
USING (
    auth.email() IN (SELECT email FROM admin_users)
);

-- Enable realtime for admin_users
ALTER PUBLICATION supabase_realtime ADD TABLE admin_users;