-- Fix publications schema to ensure proper display and ranking calculations

-- Ensure publications table has authors array column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'publications' AND column_name = 'authors') THEN
        ALTER TABLE publications ADD COLUMN authors text[] DEFAULT '{}';
    END IF;
END $$;

-- Update existing publications to have authors array if empty
UPDATE publications
SET authors = ARRAY[COALESCE((SELECT name FROM professors WHERE id = (SELECT professor_id FROM publication_authors WHERE publication_id = publications.id LIMIT 1)), 'Unknown Author')]
WHERE authors IS NULL OR array_length(authors, 1) IS NULL;

-- Create or replace function to calculate professor ranking points
CREATE OR REPLACE FUNCTION calculate_professor_ranking_points()
RETURNS TRIGGER AS $$
DECLARE
    total_points INTEGER := 0;
    pub RECORD;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    year_diff INTEGER;
    recency_factor FLOAT;
    pub_points INTEGER;
BEGIN
    -- Get all publications for this professor
    FOR pub IN 
        SELECT p.* 
        FROM publications p
        JOIN publication_authors pa ON p.id = pa.publication_id
        WHERE pa.professor_id = NEW.professor_id
    LOOP
        -- Base points for each publication
        pub_points := 10;
        
        -- Add points for citations
        pub_points := pub_points + COALESCE(pub.citation_count, 0);
        
        -- Apply recency factor
        year_diff := current_year - COALESCE(pub.publication_year, current_year);
        recency_factor := GREATEST(0.5, 1 - year_diff * 0.1);
        
        total_points := total_points + ROUND(pub_points * recency_factor);
    END LOOP;
    
    -- Update professor's ranking points
    UPDATE professors
    SET ranking_points = total_points
    WHERE id = NEW.professor_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update ranking points when publications are added or updated
DROP TRIGGER IF EXISTS update_professor_ranking_points ON publication_authors;
CREATE TRIGGER update_professor_ranking_points
AFTER INSERT OR UPDATE ON publication_authors
FOR EACH ROW
WHEN (NEW.professor_id IS NOT NULL)
EXECUTE FUNCTION calculate_professor_ranking_points();

-- Update all professor ranking points
DO $$
DECLARE
    prof RECORD;
    total_points INTEGER;
    pub RECORD;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    year_diff INTEGER;
    recency_factor FLOAT;
    pub_points INTEGER;
BEGIN
    FOR prof IN SELECT id FROM professors LOOP
        total_points := 0;
        
        -- Get all publications for this professor
        FOR pub IN 
            SELECT p.* 
            FROM publications p
            JOIN publication_authors pa ON p.id = pa.publication_id
            WHERE pa.professor_id = prof.id
        LOOP
            -- Base points for each publication
            pub_points := 10;
            
            -- Add points for citations
            pub_points := pub_points + COALESCE(pub.citation_count, 0);
            
            -- Apply recency factor
            year_diff := current_year - COALESCE(pub.publication_year, current_year);
            recency_factor := GREATEST(0.5, 1 - year_diff * 0.1);
            
            total_points := total_points + ROUND(pub_points * recency_factor);
        END LOOP;
        
        -- Update professor's ranking points
        UPDATE professors
        SET ranking_points = total_points
        WHERE id = prof.id;
    END LOOP;
END $$;

-- Fix get_professor_publications function to properly return publications
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
        COALESCE(p.journal_name, p.journal) as journal_name,
        p.publication_year,
        p.citation_count,
        p.url,
        COALESCE(p.publication_type, 'Research Article') as publication_type
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
            COALESCE(p.journal_name, p.journal) as journal_name,
            p.publication_year,
            p.citation_count,
            p.url,
            COALESCE(p.publication_type, 'Research Article') as publication_type
        FROM 
            publications p
        WHERE 
            p.professor_id = p_id
        ORDER BY 
            p.publication_year DESC, p.title;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fix get_student_publications function to properly return publications
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
        COALESCE(p.journal_name, p.journal) as journal_name,
        p.publication_year,
        p.citation_count,
        p.url,
        COALESCE(p.publication_type, 'Research Article') as publication_type
    FROM 
        publications p
    JOIN 
        publication_authors pa ON p.id = pa.publication_id
    WHERE 
        pa.student_id = s_id
    ORDER BY 
        p.publication_year DESC, p.title;
    
    -- If no results, also check the direct student_id column (legacy)
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            p.id,
            p.title,
            p.authors,
            COALESCE(p.journal_name, p.journal) as journal_name,
            p.publication_year,
            p.citation_count,
            p.url,
            COALESCE(p.publication_type, 'Research Article') as publication_type
        FROM 
            publications p
        WHERE 
            p.student_id = s_id
        ORDER BY 
            p.publication_year DESC, p.title;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update publication_authors table to ensure all publications have authors
DO $$
DECLARE
    pub RECORD;
BEGIN
    FOR pub IN SELECT id FROM publications LOOP
        -- Check if publication has any authors in publication_authors table
        IF NOT EXISTS (SELECT 1 FROM publication_authors WHERE publication_id = pub.id) THEN
            -- If publication has professor_id directly set (legacy), add to publication_authors
            IF EXISTS (SELECT 1 FROM publications WHERE id = pub.id AND professor_id IS NOT NULL) THEN
                INSERT INTO publication_authors (publication_id, professor_id, author_order)
                SELECT id, professor_id, 1 FROM publications WHERE id = pub.id AND professor_id IS NOT NULL;
            END IF;
        END IF;
    END LOOP;
END $$;

-- Update the sample data to ensure it's properly formatted
UPDATE publications
SET journal_name = journal
WHERE journal_name IS NULL AND journal IS NOT NULL;

-- Ensure all publications have a publication_type
UPDATE publications
SET publication_type = 'Research Article'
WHERE publication_type IS NULL;

-- Ensure all professors have research_interests array
UPDATE professors
SET research_interests = ARRAY(
    SELECT rk.keyword 
    FROM professor_research_keywords prk 
    JOIN research_keywords rk ON prk.research_keyword_id = rk.id 
    WHERE prk.professor_id = professors.id
)
WHERE research_interests IS NULL OR array_length(research_interests, 1) IS NULL;

-- Ensure all students have research_interests array
UPDATE students
SET research_interests = ARRAY(
    SELECT rk.keyword 
    FROM student_research_keywords srk 
    JOIN research_keywords rk ON srk.research_keyword_id = rk.id 
    WHERE srk.student_id = students.id
)
WHERE research_interests IS NULL OR array_length(research_interests, 1) IS NULL;
