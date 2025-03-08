-- Fix Row Level Security (RLS) policies for all tables

-- Enable RLS for all tables (if not already enabled)
ALTER TABLE IF EXISTS faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS publication_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS research_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS professor_research_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_research_keywords ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for faculties" ON faculties;
DROP POLICY IF EXISTS "Public read access for departments" ON departments;
DROP POLICY IF EXISTS "Public read access for professors" ON professors;
DROP POLICY IF EXISTS "Public read access for students" ON students;
DROP POLICY IF EXISTS "Public read access for publications" ON publications;
DROP POLICY IF EXISTS "Public read access for publication_authors" ON publication_authors;
DROP POLICY IF EXISTS "Public read access for research_keywords" ON research_keywords;
DROP POLICY IF EXISTS "Public read access for professor_research_keywords" ON professor_research_keywords;
DROP POLICY IF EXISTS "Public read access for student_research_keywords" ON student_research_keywords;

-- Create public read access policies for all tables
CREATE POLICY "Public read access for faculties" ON faculties FOR SELECT USING (true);
CREATE POLICY "Public read access for departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public read access for professors" ON professors FOR SELECT USING (true);
CREATE POLICY "Public read access for students" ON students FOR SELECT USING (true);
CREATE POLICY "Public read access for publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Public read access for publication_authors" ON publication_authors FOR SELECT USING (true);
CREATE POLICY "Public read access for research_keywords" ON research_keywords FOR SELECT USING (true);
CREATE POLICY "Public read access for professor_research_keywords" ON professor_research_keywords FOR SELECT USING (true);
CREATE POLICY "Public read access for student_research_keywords" ON student_research_keywords FOR SELECT USING (true);

-- Create policies for authenticated users to modify their own data
DROP POLICY IF EXISTS "Users can update their own professor profile" ON professors;
CREATE POLICY "Users can update their own professor profile" ON professors 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own student profile" ON students;
CREATE POLICY "Users can update their own student profile" ON students 
  FOR UPDATE USING (auth.uid() = user_id);

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

-- Allow authenticated users to add research keywords
DROP POLICY IF EXISTS "Users can add professor research keywords" ON professor_research_keywords;
CREATE POLICY "Users can add professor research keywords" ON professor_research_keywords 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM professors 
      WHERE professors.id = professor_research_keywords.professor_id 
      AND professors.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can add student research keywords" ON student_research_keywords;
CREATE POLICY "Users can add student research keywords" ON student_research_keywords 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = student_research_keywords.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Allow authenticated users to delete their own research keywords
DROP POLICY IF EXISTS "Users can delete professor research keywords" ON professor_research_keywords;
CREATE POLICY "Users can delete professor research keywords" ON professor_research_keywords 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM professors 
      WHERE professors.id = professor_research_keywords.professor_id 
      AND professors.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete student research keywords" ON student_research_keywords;
CREATE POLICY "Users can delete student research keywords" ON student_research_keywords 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = student_research_keywords.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Allow anonymous access for all tables (this is important for your app to work without login)
DROP POLICY IF EXISTS "Allow anonymous access for faculties" ON faculties;
CREATE POLICY "Allow anonymous access for faculties" ON faculties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for departments" ON departments;
CREATE POLICY "Allow anonymous access for departments" ON departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for professors" ON professors;
CREATE POLICY "Allow anonymous access for professors" ON professors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for students" ON students;
CREATE POLICY "Allow anonymous access for students" ON students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for publications" ON publications;
CREATE POLICY "Allow anonymous access for publications" ON publications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for publication_authors" ON publication_authors;
CREATE POLICY "Allow anonymous access for publication_authors" ON publication_authors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for research_keywords" ON research_keywords;
CREATE POLICY "Allow anonymous access for research_keywords" ON research_keywords FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for professor_research_keywords" ON professor_research_keywords;
CREATE POLICY "Allow anonymous access for professor_research_keywords" ON professor_research_keywords FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous access for student_research_keywords" ON student_research_keywords;
CREATE POLICY "Allow anonymous access for student_research_keywords" ON student_research_keywords FOR SELECT USING (true); 