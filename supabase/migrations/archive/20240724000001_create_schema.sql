-- Create ENUMs
CREATE TYPE verification_badge_type_enum AS ENUM ('none', 'verified', 'top_researcher');
CREATE TYPE publication_type_enum AS ENUM ('journal_article', 'conference_paper', 'book_chapter', 'book', 'thesis', 'other');
CREATE TYPE connection_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- Create faculties table
CREATE TABLE IF NOT EXISTS faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS faculties_name_idx ON faculties(name);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS departments_faculty_id_idx ON departments(faculty_id);
CREATE INDEX IF NOT EXISTS departments_name_idx ON departments(name);

-- Create professors table
CREATE TABLE IF NOT EXISTS professors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  research_interests TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  google_scholar_id TEXT UNIQUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ranking_points INTEGER NOT NULL DEFAULT 0,
  seeking_students BOOLEAN NOT NULL DEFAULT FALSE,
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS professors_user_id_idx ON professors(user_id);
CREATE INDEX IF NOT EXISTS professors_name_idx ON professors(name);
CREATE INDEX IF NOT EXISTS professors_google_scholar_id_idx ON professors(google_scholar_id);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  research_interests TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS students_user_id_idx ON students(user_id);
CREATE INDEX IF NOT EXISTS students_name_idx ON students(name);

-- Create publications table
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  journal TEXT,
  year INTEGER,
  citation_count INTEGER NOT NULL DEFAULT 0,
  url TEXT,
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS publications_title_idx ON publications(title);
CREATE INDEX IF NOT EXISTS publications_professor_id_idx ON publications(professor_id);
CREATE INDEX IF NOT EXISTS publications_year_idx ON publications(year);

-- Create publication_authors table
CREATE TABLE IF NOT EXISTS publication_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  author_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT at_least_one_author CHECK (professor_id IS NOT NULL OR student_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS publication_authors_publication_id_idx ON publication_authors(publication_id);
CREATE INDEX IF NOT EXISTS publication_authors_professor_id_idx ON publication_authors(professor_id);
CREATE INDEX IF NOT EXISTS publication_authors_student_id_idx ON publication_authors(student_id);

-- Create connection_requests table
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS connection_requests_from_user_id_idx ON connection_requests(from_user_id);
CREATE INDEX IF NOT EXISTS connection_requests_to_user_id_idx ON connection_requests(to_user_id);

-- Create research_keywords table
CREATE TABLE IF NOT EXISTS research_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS research_keywords_keyword_idx ON research_keywords(keyword);

-- Create professor_research_keywords table
CREATE TABLE IF NOT EXISTS professor_research_keywords (
  professor_id UUID NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
  research_keyword_id UUID NOT NULL REFERENCES research_keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (professor_id, research_keyword_id)
);

-- Enable Row Level Security
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_research_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public read access for most tables
CREATE POLICY "Public read access for faculties" ON faculties FOR SELECT USING (true);
CREATE POLICY "Public read access for departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public read access for professors" ON professors FOR SELECT USING (true);
CREATE POLICY "Public read access for students" ON students FOR SELECT USING (true);
CREATE POLICY "Public read access for publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Public read access for publication_authors" ON publication_authors FOR SELECT USING (true);
CREATE POLICY "Public read access for research_keywords" ON research_keywords FOR SELECT USING (true);
CREATE POLICY "Public read access for professor_research_keywords" ON professor_research_keywords FOR SELECT USING (true);

-- Connection requests policies
CREATE POLICY "Users can view their own connection requests" ON connection_requests 
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create connection requests" ON connection_requests 
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their own connection requests" ON connection_requests 
  FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE faculties;
ALTER PUBLICATION supabase_realtime ADD TABLE departments;
ALTER PUBLICATION supabase_realtime ADD TABLE professors;
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE publications;
ALTER PUBLICATION supabase_realtime ADD TABLE publication_authors;
ALTER PUBLICATION supabase_realtime ADD TABLE connection_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE research_keywords;
ALTER PUBLICATION supabase_realtime ADD TABLE professor_research_keywords;
