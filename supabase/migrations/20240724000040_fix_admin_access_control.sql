-- Fix admin_users table and ensure proper role-based access

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Public read access for admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can modify admin_users" ON admin_users;

-- Create new policies
CREATE POLICY "Public read access for admin_users"
ON admin_users
FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify admin_users" 
ON admin_users 
FOR ALL 
USING (auth.email() IN (SELECT email FROM admin_users));

-- Enable realtime for admin_users
ALTER PUBLICATION supabase_realtime ADD TABLE admin_users;

-- Update user_id for existing admin users
UPDATE admin_users 
SET user_id = auth.users.id 
FROM auth.users 
WHERE admin_users.email = auth.users.email AND admin_users.user_id IS NULL;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.user_id = $1
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if a user is a professor
CREATE OR REPLACE FUNCTION is_professor(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM professors WHERE professors.user_id = $1
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if a user is a student
CREATE OR REPLACE FUNCTION is_student(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM students WHERE students.user_id = $1
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  role_name text;
BEGIN
  IF EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = $1) THEN
    role_name := 'admin';
  ELSIF EXISTS (SELECT 1 FROM professors WHERE professors.user_id = $1) THEN
    role_name := 'professor';
  ELSIF EXISTS (SELECT 1 FROM students WHERE students.user_id = $1) THEN
    role_name := 'student';
  ELSE
    role_name := 'unknown';
  END IF;
  
  RETURN role_name;
END;
$$ LANGUAGE plpgsql;