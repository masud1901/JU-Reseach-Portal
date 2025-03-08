-- Fix publications schema to ensure proper relationships

-- Add journal_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'publications' AND column_name = 'journal_name') THEN
        ALTER TABLE publications ADD COLUMN journal_name text;
        -- Copy data from journal column if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'publications' AND column_name = 'journal') THEN
            UPDATE publications SET journal_name = journal WHERE journal IS NOT NULL;
        END IF;
    END IF;
END $$;

-- Ensure publication_authors table has correct relationships
ALTER TABLE publication_authors DROP CONSTRAINT IF EXISTS publication_authors_publication_id_fkey;
ALTER TABLE publication_authors ADD CONSTRAINT publication_authors_publication_id_fkey 
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE;

ALTER TABLE publication_authors DROP CONSTRAINT IF EXISTS publication_authors_professor_id_fkey;
ALTER TABLE publication_authors ADD CONSTRAINT publication_authors_professor_id_fkey 
    FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE SET NULL;

ALTER TABLE publication_authors DROP CONSTRAINT IF EXISTS publication_authors_student_id_fkey;
ALTER TABLE publication_authors ADD CONSTRAINT publication_authors_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;

-- Create or replace the get_professor_publications function
CREATE OR REPLACE FUNCTION get_professor_publications(p_id uuid)
RETURNS TABLE (
    id uuid,
    title text,
    authors text[],
    journal_name text,
    publication_year integer,
    citation_count integer,
    url text,
    publication_type text
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
        p.publication_type::text
    FROM 
        publications p
    JOIN 
        publication_authors pa ON p.id = pa.publication_id
    WHERE 
        pa.professor_id = p_id
    ORDER BY 
        p.publication_year DESC, p.title;
    
    -- If no results, also check the direct professor_id column (legacy)
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
            p.publication_type::text
        FROM 
            publications p
        WHERE 
            p.professor_id = p_id
        ORDER BY 
            p.publication_year DESC, p.title;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the get_student_publications function
CREATE OR REPLACE FUNCTION get_student_publications(s_id uuid)
RETURNS TABLE (
    id uuid,
    title text,
    authors text[],
    journal_name text,
    publication_year integer,
    citation_count integer,
    url text,
    publication_type text
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
        p.publication_type::text
    FROM 
        publications p
    JOIN 
        publication_authors pa ON p.id = pa.publication_id
    WHERE 
        pa.student_id = s_id
    ORDER BY 
        p.publication_year DESC, p.title;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the get_professor_collaborators function
CREATE OR REPLACE FUNCTION get_professor_collaborators(p_id uuid)
RETURNS TABLE (
    student_id uuid,
    student_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        s.id AS student_id,
        s.name AS student_name
    FROM 
        students s
    JOIN 
        publication_authors pa_student ON s.id = pa_student.student_id
    JOIN 
        publications p ON pa_student.publication_id = p.id
    JOIN 
        publication_authors pa_professor ON p.id = pa_professor.publication_id
    WHERE 
        pa_professor.professor_id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the get_student_collaborators function
CREATE OR REPLACE FUNCTION get_student_collaborators(s_id uuid)
RETURNS TABLE (
    professor_id uuid,
    professor_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.id AS professor_id,
        p.name AS professor_name
    FROM 
        professors p
    JOIN 
        publication_authors pa_professor ON p.id = pa_professor.professor_id
    JOIN 
        publications pub ON pa_professor.publication_id = pub.id
    JOIN 
        publication_authors pa_student ON pub.id = pa_student.publication_id
    WHERE 
        pa_student.student_id = s_id;
END;
$$ LANGUAGE plpgsql;

-- Add sample publications if none exist
DO $$
DECLARE
    pub_count integer;
    prof_id uuid;
    student_id uuid;
    pub_id uuid;
BEGIN
    SELECT COUNT(*) INTO pub_count FROM publications;
    
    IF pub_count = 0 THEN
        -- Get a professor ID
        SELECT id INTO prof_id FROM professors LIMIT 1;
        
        -- Get a student ID
        SELECT id INTO student_id FROM students LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            -- Insert a sample publication
            INSERT INTO publications (title, authors, journal_name, publication_year, citation_count, url, publication_type)
            VALUES ('Machine Learning Applications in Academic Research', 
                   ARRAY['John Smith', 'Jane Doe'], 
                   'Journal of Computer Science', 
                   2023, 
                   15, 
                   'https://example.com/publication1', 
                   'Research Article')
            RETURNING id INTO pub_id;
            
            -- Link to professor
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1);
            
            -- Link to student if available
            IF student_id IS NOT NULL THEN
                INSERT INTO publication_authors (publication_id, student_id, author_order)
                VALUES (pub_id, student_id, 2);
            END IF;
            
            -- Insert another sample publication
            INSERT INTO publications (title, authors, journal_name, publication_year, citation_count, url, publication_type)
            VALUES ('Advances in Natural Language Processing', 
                   ARRAY['John Smith', 'Robert Johnson'], 
                   'IEEE Transactions on AI', 
                   2022, 
                   28, 
                   'https://example.com/publication2', 
                   'Conference Paper')
            RETURNING id INTO pub_id;
            
            -- Link to professor
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1);
        END IF;
    END IF;
END $$;