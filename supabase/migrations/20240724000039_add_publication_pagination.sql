-- Add functions for publication pagination

-- Function to get professor publication count
CREATE OR REPLACE FUNCTION get_professor_publication_count(p_id UUID)
RETURNS INTEGER AS $$
DECLARE
    publication_count INTEGER;
BEGIN
    -- Count publications through publication_authors table
    SELECT COUNT(*) INTO publication_count
    FROM publication_authors pa
    WHERE pa.professor_id = p_id;
    
    -- If no results, try the legacy approach
    IF publication_count = 0 THEN
        SELECT COUNT(*) INTO publication_count
        FROM publications p
        WHERE p.professor_id = p_id;
    END IF;
    
    RETURN publication_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get student publication count
CREATE OR REPLACE FUNCTION get_student_publication_count(s_id UUID)
RETURNS INTEGER AS $$
DECLARE
    publication_count INTEGER;
BEGIN
    -- Count publications through publication_authors table
    SELECT COUNT(*) INTO publication_count
    FROM publication_authors pa
    WHERE pa.student_id = s_id;
    
    RETURN publication_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get paginated professor publications
CREATE OR REPLACE FUNCTION get_professor_publications_paginated(
    p_id UUID,
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 5
)
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
DECLARE
    offset_val INTEGER := (page_number - 1) * page_size;
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
        p.publication_year DESC, p.citation_count DESC
    LIMIT page_size
    OFFSET offset_val;
    
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
            p.professor_id = p_id
        ORDER BY 
            p.publication_year DESC, p.citation_count DESC
        LIMIT page_size
        OFFSET offset_val;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get paginated student publications
CREATE OR REPLACE FUNCTION get_student_publications_paginated(
    s_id UUID,
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 5
)
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
DECLARE
    offset_val INTEGER := (page_number - 1) * page_size;
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
        p.publication_year DESC, p.citation_count DESC
    LIMIT page_size
    OFFSET offset_val;
    
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
            p.publication_year DESC, p.citation_count DESC
        LIMIT page_size
        OFFSET offset_val;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update the edge function to support pagination
COMMENT ON FUNCTION get_professor_publications IS 'Get all publications for a professor';
COMMENT ON FUNCTION get_student_publications IS 'Get all publications for a student';
COMMENT ON FUNCTION get_professor_publications_paginated IS 'Get paginated publications for a professor';
COMMENT ON FUNCTION get_student_publications_paginated IS 'Get paginated publications for a student';
COMMENT ON FUNCTION get_professor_publication_count IS 'Get total publication count for a professor';
COMMENT ON FUNCTION get_student_publication_count IS 'Get total publication count for a student';