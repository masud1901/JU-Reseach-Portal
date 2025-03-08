-- Proper RLS setup for JU Research Portal
-- This file sets up Row Level Security policies that balance security and functionality

-- Step 1: Enable RLS for all tables
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_research_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_research_keywords ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies to avoid conflicts
-- Drop policies for faculties
DROP POLICY IF EXISTS "Public read access for faculties" ON faculties;
DROP POLICY IF EXISTS "Anyone can read faculties" ON faculties;

-- Drop policies for departments
DROP POLICY IF EXISTS "Public read access for departments" ON departments;
DROP POLICY IF EXISTS "Anyone can read departments" ON departments;

-- Drop policies for professors
DROP POLICY IF EXISTS "Public read access for professors" ON professors;
DROP POLICY IF EXISTS "Anyone can read professors" ON professors;
DROP POLICY IF EXISTS "Users can update their own professor profile" ON professors;
DROP POLICY IF EXISTS "Professors can update their own profiles" ON professors;

-- Drop policies for students
DROP POLICY IF EXISTS "Public read access for students" ON students;
DROP POLICY IF EXISTS "Anyone can read students" ON students;
DROP POLICY IF EXISTS "Users can update their own student profile" ON students;
DROP POLICY IF EXISTS "Students can update their own profiles" ON students;

-- Drop policies for publications
DROP POLICY IF EXISTS "Public read access for publications" ON publications;
DROP POLICY IF EXISTS "Anyone can read publications" ON publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON publications;
DROP POLICY IF EXISTS "Authenticated users can insert publications" ON publications;

-- Drop policies for publication_authors
DROP POLICY IF EXISTS "Public read access for publication_authors" ON publication_authors;
DROP POLICY IF EXISTS "Anyone can read publication_authors" ON publication_authors;
DROP POLICY IF EXISTS "Users can update their own publication authors" ON publication_authors;
DROP POLICY IF EXISTS "Authenticated users can insert publication authors" ON publication_authors;

-- Drop policies for connection_requests
DROP POLICY IF EXISTS "Users can view their own connection requests" ON connection_requests;
DROP POLICY IF EXISTS "Users can create connection requests" ON connection_requests;
DROP POLICY IF EXISTS "Users can update their own connection requests" ON connection_requests;

-- Drop policies for research_keywords
DROP POLICY IF EXISTS "Public read access for research_keywords" ON research_keywords;
DROP POLICY IF EXISTS "Anyone can read research_keywords" ON research_keywords;
DROP POLICY IF EXISTS "Authenticated users can insert research keywords" ON research_keywords;

-- Drop policies for professor_research_keywords
DROP POLICY IF EXISTS "Public read access for professor_research_keywords" ON professor_research_keywords;
DROP POLICY IF EXISTS "Anyone can read professor_research_keywords" ON professor_research_keywords;
DROP POLICY IF EXISTS "Professors can add their own research keywords" ON professor_research_keywords;
DROP POLICY IF EXISTS "Professors can delete their own research keywords" ON professor_research_keywords;
DROP POLICY IF EXISTS "Users can add professor research keywords" ON professor_research_keywords;

-- Drop policies for student_research_keywords
DROP POLICY IF EXISTS "Public read access for student_research_keywords" ON student_research_keywords;
DROP POLICY IF EXISTS "Anyone can read student_research_keywords" ON student_research_keywords;
DROP POLICY IF EXISTS "Students can add their own research keywords" ON student_research_keywords;
DROP POLICY IF EXISTS "Students can delete their own research keywords" ON student_research_keywords;
DROP POLICY IF EXISTS "Users can add student research keywords" ON student_research_keywords;

-- Step 3: Create read-only policies for reference tables (available to everyone)
CREATE POLICY "Anyone can read faculties" ON faculties FOR SELECT USING (true);
CREATE POLICY "Anyone can read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Anyone can read research_keywords" ON research_keywords FOR SELECT USING (true);

-- Step 4: Create read-only policies for main data tables (available to everyone)
CREATE POLICY "Anyone can read professors" ON professors FOR SELECT USING (true);
CREATE POLICY "Anyone can read students" ON students FOR SELECT USING (true);
CREATE POLICY "Anyone can read publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Anyone can read publication_authors" ON publication_authors FOR SELECT USING (true);
CREATE POLICY "Anyone can read professor_research_keywords" ON professor_research_keywords FOR SELECT USING (true);
CREATE POLICY "Anyone can read student_research_keywords" ON student_research_keywords FOR SELECT USING (true);

-- Step 5: Create policies for authenticated users to modify their own data
-- Professors can update their own profiles
CREATE POLICY "Professors can update their own profiles" ON professors 
  FOR UPDATE USING (auth.uid() = user_id);

-- Students can update their own profiles
CREATE POLICY "Students can update their own profiles" ON students 
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 6: Create policies for connection requests
-- Users can view their own connection requests
CREATE POLICY "Users can view their own connection requests" ON connection_requests 
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Users can create connection requests
CREATE POLICY "Users can create connection requests" ON connection_requests 
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Users can update their own connection requests
CREATE POLICY "Users can update their own connection requests" ON connection_requests 
  FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Step 7: Create policies for research keywords
-- Professors can add their own research keywords
CREATE POLICY "Professors can add their own research keywords" ON professor_research_keywords 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM professors 
      WHERE professors.id = professor_research_keywords.professor_id 
      AND professors.user_id = auth.uid()
    )
  );

-- Students can add their own research keywords
CREATE POLICY "Students can add their own research keywords" ON student_research_keywords 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = student_research_keywords.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Professors can delete their own research keywords
CREATE POLICY "Professors can delete their own research keywords" ON professor_research_keywords 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM professors 
      WHERE professors.id = professor_research_keywords.professor_id 
      AND professors.user_id = auth.uid()
    )
  );

-- Students can delete their own research keywords
CREATE POLICY "Students can delete their own research keywords" ON student_research_keywords 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = student_research_keywords.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Step 8: Create policies for publications
-- Authenticated users can insert publications
CREATE POLICY "Authenticated users can insert publications" ON publications 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own publications
CREATE POLICY "Users can update their own publications" ON publications 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM publication_authors pa
      JOIN professors p ON pa.professor_id = p.id
      WHERE pa.publication_id = publications.id
      AND p.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM publication_authors pa
      JOIN students s ON pa.student_id = s.id
      WHERE pa.publication_id = publications.id
      AND s.user_id = auth.uid()
    )
  );

-- Step 9: Create policies for publication authors
-- Authenticated users can insert publication authors
CREATE POLICY "Authenticated users can insert publication authors" ON publication_authors 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own publication authors
CREATE POLICY "Users can update their own publication authors" ON publication_authors 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM professors p
      WHERE publication_authors.professor_id = p.id
      AND p.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM students s
      WHERE publication_authors.student_id = s.id
      AND s.user_id = auth.uid()
    )
  );

-- Step 10: Create policies for research keywords
-- Authenticated users can insert research keywords
CREATE POLICY "Authenticated users can insert research keywords" ON research_keywords 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 