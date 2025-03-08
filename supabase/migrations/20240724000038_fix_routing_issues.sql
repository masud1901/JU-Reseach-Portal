-- This migration ensures that the database has the necessary tables and data for routing

-- Make sure the professors table exists
CREATE TABLE IF NOT EXISTS professors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name TEXT NOT NULL,
    department_id UUID REFERENCES departments(id),
    bio TEXT,
    google_scholar_id TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    ranking_points INTEGER DEFAULT 0,
    research_interests TEXT[] DEFAULT '{}',
    seeking_students BOOLEAN DEFAULT FALSE,
    verification_badge_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make sure the students table exists
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name TEXT NOT NULL,
    department_id UUID REFERENCES departments(id),
    bio TEXT,
    badge TEXT,
    ranking_points INTEGER DEFAULT 0,
    research_interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make sure the publications table exists
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authors TEXT[],
    journal_name TEXT,
    publisher TEXT,
    publication_year INTEGER,
    publication_date DATE,
    citation_count INTEGER DEFAULT 0,
    url TEXT,
    publication_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make sure the publication_authors table exists
CREATE TABLE IF NOT EXISTS publication_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publication_id UUID REFERENCES publications(id),
    professor_id UUID REFERENCES professors(id),
    student_id UUID REFERENCES students(id),
    author_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT publication_authors_professor_or_student CHECK (
        (professor_id IS NOT NULL AND student_id IS NULL) OR
        (professor_id IS NULL AND student_id IS NOT NULL)
    )
);

-- Ensure RLS is disabled for testing
ALTER TABLE professors DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE publications DISABLE ROW LEVEL SECURITY;
ALTER TABLE publication_authors DISABLE ROW LEVEL SECURITY;

-- Create or replace the get_professor_publications function
CREATE OR REPLACE FUNCTION get_professor_publications(p_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    authors TEXT[],
    journal_name TEXT,
    publication_year INTEGER,
    citation_count INTEGER,
    url TEXT,
    publication_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.authors,
        p.journal_name,
        p.publication_year,
        p.citation_count,
        p.url,
        p.publication_type
    FROM 
        publications p
    JOIN 
        publication_authors pa ON p.id = pa.publication_id
    WHERE 
        pa.professor_id = p_id
    ORDER BY 
        p.publication_year DESC;
    
    -- If no results, try the legacy approach
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            p.id,
            p.title,
            p.authors,
            p.journal_name,
            p.publication_year,
            p.citation_count,
            p.url,
            p.publication_type
        FROM 
            publications p
        WHERE 
            p.id IN (
                SELECT publication_id 
                FROM publication_authors 
                WHERE professor_id = p_id
            )
        ORDER BY 
            p.publication_year DESC;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the get_student_publications function
CREATE OR REPLACE FUNCTION get_student_publications(s_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    authors TEXT[],
    journal_name TEXT,
    publication_year INTEGER,
    citation_count INTEGER,
    url TEXT,
    publication_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.authors,
        p.journal_name,
        p.publication_year,
        p.citation_count,
        p.url,
        p.publication_type
    FROM 
        publications p
    JOIN 
        publication_authors pa ON p.id = pa.publication_id
    WHERE 
        pa.student_id = s_id
    ORDER BY 
        p.publication_year DESC;
    
    -- If no results, try the legacy approach
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            p.id,
            p.title,
            p.authors,
            p.journal_name,
            p.publication_year,
            p.citation_count,
            p.url,
            p.publication_type
        FROM 
            publications p
        WHERE 
            p.id IN (
                SELECT publication_id 
                FROM publication_authors 
                WHERE student_id = s_id
            )
        ORDER BY 
            p.publication_year DESC;
    END IF;
END;
$$ LANGUAGE plpgsql;