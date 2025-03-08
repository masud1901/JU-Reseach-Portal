-- Add authors array field to publications table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'publications' AND column_name = 'authors') THEN
        ALTER TABLE publications ADD COLUMN authors text[] DEFAULT '{}'::text[];
    END IF;
END
$$;

-- Update the get_professor_publications function to include authors
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
  SELECT p.id, p.title, p.authors, p.journal_name, p.publication_year, p.citation_count, p.url, p.publication_type
  FROM publications p
  JOIN publication_authors pa ON p.id = pa.publication_id
  WHERE pa.professor_id = p_id
  ORDER BY p.publication_year DESC;
END;
$$ LANGUAGE plpgsql;

-- Update the get_student_publications function to include authors
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
  SELECT p.id, p.title, p.authors, p.journal_name, p.publication_year, p.citation_count, p.url, p.publication_type
  FROM publications p
  JOIN publication_authors pa ON p.id = pa.publication_id
  WHERE pa.student_id = s_id
  ORDER BY p.publication_year DESC;
END;
$$ LANGUAGE plpgsql;