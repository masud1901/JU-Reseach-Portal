CREATE TABLE IF NOT EXISTS professors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  research_interests TEXT[] NOT NULL,
  bio TEXT,
  google_scholar_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  ranking_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  journal TEXT,
  year INTEGER,
  citation_count INTEGER DEFAULT 0,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Policies for professors table
DROP POLICY IF EXISTS "Professors are viewable by everyone" ON professors;
CREATE POLICY "Professors are viewable by everyone" 
ON professors FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own professor profile" ON professors;
CREATE POLICY "Users can insert their own professor profile" 
ON professors FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own professor profile" ON professors;
CREATE POLICY "Users can update their own professor profile" 
ON professors FOR UPDATE 
USING (auth.uid() = user_id);

-- Policies for publications table
DROP POLICY IF EXISTS "Publications are viewable by everyone" ON publications;
CREATE POLICY "Publications are viewable by everyone" 
ON publications FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert publications to their profile" ON publications;
CREATE POLICY "Users can insert publications to their profile" 
ON publications FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM professors 
  WHERE professors.id = publications.professor_id 
  AND professors.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can update their own publications" ON publications;
CREATE POLICY "Users can update their own publications" 
ON publications FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM professors 
  WHERE professors.id = publications.professor_id 
  AND professors.user_id = auth.uid()
));

-- Policies for departments table
DROP POLICY IF EXISTS "Departments are viewable by everyone" ON departments;
CREATE POLICY "Departments are viewable by everyone" 
ON departments FOR SELECT 
USING (true);

-- Add some initial departments
INSERT INTO departments (name) VALUES
('Computer Science and Engineering'),
('Physics'),
('Chemistry'),
('Mathematics'),
('Biology'),
('Economics'),
('Business Administration'),
('English'),
('Bangla'),
('History'),
('Geography'),
('Anthropology'),
('Sociology'),
('Political Science'),
('Law'),
('Pharmacy'),
('Public Health'),
('Statistics'),
('Environmental Science')
ON CONFLICT (name) DO NOTHING;

-- Enable realtime
alter publication supabase_realtime add table professors;
alter publication supabase_realtime add table publications;
alter publication supabase_realtime add table departments;