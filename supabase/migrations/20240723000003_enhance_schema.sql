-- Add students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  research_interests TEXT[] NOT NULL,
  bio TEXT,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add connection requests table
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- Add faculty table for department categorization
CREATE TABLE IF NOT EXISTS faculties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add faculty_id to departments
ALTER TABLE departments ADD COLUMN IF NOT EXISTS faculty_id UUID REFERENCES faculties(id);

-- Add seeking_students flag to professors
ALTER TABLE professors ADD COLUMN IF NOT EXISTS seeking_students BOOLEAN DEFAULT FALSE;

-- Add badges to professors
ALTER TABLE professors ADD COLUMN IF NOT EXISTS badge TEXT;

-- Enable RLS on new tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;

-- Policies for students table
DROP POLICY IF EXISTS "Students are viewable by everyone" ON students;
CREATE POLICY "Students are viewable by everyone" 
ON students FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own student profile" ON students;
CREATE POLICY "Users can insert their own student profile" 
ON students FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own student profile" ON students;
CREATE POLICY "Users can update their own student profile" 
ON students FOR UPDATE 
USING (auth.uid() = user_id);

-- Policies for connection_requests table
DROP POLICY IF EXISTS "Users can view their own connection requests" ON connection_requests;
CREATE POLICY "Users can view their own connection requests" 
ON connection_requests FOR SELECT 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

DROP POLICY IF EXISTS "Users can insert their own connection requests" ON connection_requests;
CREATE POLICY "Users can insert their own connection requests" 
ON connection_requests FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);

DROP POLICY IF EXISTS "Users can update their own connection requests" ON connection_requests;
CREATE POLICY "Users can update their own connection requests" 
ON connection_requests FOR UPDATE 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Policies for faculties table
DROP POLICY IF EXISTS "Faculties are viewable by everyone" ON faculties;
CREATE POLICY "Faculties are viewable by everyone" 
ON faculties FOR SELECT 
USING (true);

-- Add sample faculties
INSERT INTO faculties (name) VALUES
('Faculty of Science'),
('Faculty of Arts and Humanities'),
('Faculty of Social Sciences'),
('Faculty of Business Studies'),
('Faculty of Biological Sciences')
ON CONFLICT (name) DO NOTHING;

-- Update departments with faculty_id
UPDATE departments SET faculty_id = (SELECT id FROM faculties WHERE name = 'Faculty of Science')
WHERE name IN ('Computer Science and Engineering', 'Physics', 'Mathematics', 'Chemistry', 'Statistics', 'Environmental Science');

UPDATE departments SET faculty_id = (SELECT id FROM faculties WHERE name = 'Faculty of Arts and Humanities')
WHERE name IN ('English', 'Bangla', 'History');

UPDATE departments SET faculty_id = (SELECT id FROM faculties WHERE name = 'Faculty of Social Sciences')
WHERE name IN ('Economics', 'Sociology', 'Anthropology', 'Political Science', 'Law');

UPDATE departments SET faculty_id = (SELECT id FROM faculties WHERE name = 'Faculty of Business Studies')
WHERE name IN ('Business Administration');

UPDATE departments SET faculty_id = (SELECT id FROM faculties WHERE name = 'Faculty of Biological Sciences')
WHERE name IN ('Biology', 'Pharmacy', 'Public Health');

-- Add sample students
INSERT INTO students (name, department, research_interests, bio, badge, user_id)
VALUES
  ('Rahima Khan', 'Computer Science and Engineering', ARRAY['Machine Learning', 'Natural Language Processing'], 'Graduate student researching applications of NLP in Bangla language processing.', 'Rising Star', (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)),
  ('Kamal Ahmed', 'Physics', ARRAY['Quantum Computing', 'Theoretical Physics'], 'Undergraduate student interested in quantum computing applications.', NULL, (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)),
  ('Nusrat Islam', 'Business Administration', ARRAY['Digital Marketing', 'Entrepreneurship'], 'MBA student researching digital transformation of small businesses in Bangladesh.', 'Innovator', (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1));

-- Update some professors to be seeking students
UPDATE professors SET seeking_students = TRUE WHERE name IN ('Dr. Md. Rahman', 'Dr. Fatima Ahmed', 'Dr. Kamal Hossain');

-- Add badges to some professors
UPDATE professors SET badge = 'Distinguished Researcher' WHERE name IN ('Dr. Md. Rahman', 'Dr. Fatima Ahmed');
UPDATE professors SET badge = 'Mentor' WHERE name IN ('Dr. Kamal Hossain', 'Dr. Nasreen Akter');

-- Enable realtime for new tables
alter publication supabase_realtime add table students;
alter publication supabase_realtime add table connection_requests;
alter publication supabase_realtime add table faculties;