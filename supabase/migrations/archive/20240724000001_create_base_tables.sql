-- Create faculties table
CREATE TABLE faculties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_faculties_name ON faculties(name);

-- Create departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES faculties(id),
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_departments_name ON departments(name);

-- We assume auth_users table exists in the auth schema
-- If it doesn't, uncomment this:
-- CREATE TABLE auth_users (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- );

-- Create professors table
CREATE TABLE professors (
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
CREATE INDEX idx_professors_name ON professors(name);

-- Create students table
CREATE TABLE students (
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
CREATE INDEX idx_students_name ON students(name);

-- Create publications table
CREATE TABLE publications (
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
CREATE INDEX idx_publications_title ON publications(title);
CREATE INDEX idx_publications_year ON publications(year);

-- Create publication_authors junction table
CREATE TABLE publication_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID REFERENCES publications(id),
    professor_id UUID REFERENCES professors(id),
    student_id UUID REFERENCES students(id),
    author_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_author_type CHECK (
        (professor_id IS NOT NULL AND student_id IS NULL) OR
        (professor_id IS NULL AND student_id IS NOT NULL)
    )
);

-- Create connection_requests table
CREATE TABLE connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES auth.users(id),
    to_user_id UUID REFERENCES auth.users(id),
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create research_keywords table
CREATE TABLE research_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_research_keywords_keyword ON research_keywords(keyword);

-- Create professor_research_keywords junction table
CREATE TABLE professor_research_keywords (
    professor_id UUID REFERENCES professors(id),
    research_keyword_id UUID REFERENCES research_keywords(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
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