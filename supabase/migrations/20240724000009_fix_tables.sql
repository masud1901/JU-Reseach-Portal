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

-- Create basic tables
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample departments
INSERT INTO departments (name) VALUES
('Computer Science and Engineering'),
('Physics'),
('Chemistry'),
('Mathematics'),
('Biology'),
('English'),
('History'),
('Electrical Engineering'),
('Economics'),
('Management')
ON CONFLICT DO NOTHING;

-- Create professors table
CREATE TABLE IF NOT EXISTS professors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT,
    department TEXT,
    research_interests TEXT[] DEFAULT '{}',
    bio TEXT,
    google_scholar_id TEXT UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    ranking_points INTEGER DEFAULT 0,
    seeking_students BOOLEAN DEFAULT FALSE,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT,
    department TEXT,
    research_interests TEXT[] DEFAULT '{}',
    bio TEXT,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create publications table
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    authors TEXT[] DEFAULT '{}',
    journal TEXT,
    year INTEGER,
    citation_count INTEGER DEFAULT 0,
    url TEXT,
    professor_id UUID REFERENCES professors(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create connection_requests table
CREATE TABLE IF NOT EXISTS connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES auth.users(id),
    to_user_id UUID REFERENCES auth.users(id),
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public read access for departments" ON departments;
CREATE POLICY "Public read access for departments" ON departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for professors" ON professors;
CREATE POLICY "Public read access for professors" ON professors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for students" ON students;
CREATE POLICY "Public read access for students" ON students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for publications" ON publications;
CREATE POLICY "Public read access for publications" ON publications FOR SELECT USING (true);

-- Connection requests policies
DROP POLICY IF EXISTS "Users can view their own connection requests" ON connection_requests;
CREATE POLICY "Users can view their own connection requests" ON connection_requests 
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

DROP POLICY IF EXISTS "Users can create connection requests" ON connection_requests;
CREATE POLICY "Users can create connection requests" ON connection_requests 
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

DROP POLICY IF EXISTS "Users can update their own connection requests" ON connection_requests;
CREATE POLICY "Users can update their own connection requests" ON connection_requests 
  FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE admin_users;
ALTER PUBLICATION supabase_realtime ADD TABLE departments;
ALTER PUBLICATION supabase_realtime ADD TABLE professors;
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE publications;
ALTER PUBLICATION supabase_realtime ADD TABLE connection_requests;