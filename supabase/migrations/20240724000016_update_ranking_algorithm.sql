-- Create a function to calculate ranking points based on publications and citations
CREATE OR REPLACE FUNCTION calculate_ranking_points()
RETURNS VOID AS $$
DECLARE
    prof RECORD;
    pub_count INTEGER;
    citation_sum INTEGER;
    recent_pub_count INTEGER;
    verification_bonus INTEGER;
    total_points INTEGER;
BEGIN
    -- Loop through all professors
    FOR prof IN SELECT id, is_verified FROM professors LOOP
        -- Count publications
        SELECT COUNT(*) INTO pub_count
        FROM publication_authors
        WHERE professor_id = prof.id;
        
        -- Sum citations
        SELECT COALESCE(SUM(p.citation_count), 0) INTO citation_sum
        FROM publications p
        JOIN publication_authors pa ON p.id = pa.publication_id
        WHERE pa.professor_id = prof.id;
        
        -- Count recent publications (last 3 years)
        SELECT COUNT(*) INTO recent_pub_count
        FROM publications p
        JOIN publication_authors pa ON p.id = pa.publication_id
        WHERE pa.professor_id = prof.id
        AND p.publication_year >= EXTRACT(YEAR FROM CURRENT_DATE) - 3;
        
        -- Verification bonus
        verification_bonus := CASE WHEN prof.is_verified THEN 20 ELSE 0 END;
        
        -- Calculate total points
        -- Base formula: (10 points per publication) + (1 point per citation) + (5 points per recent publication) + verification bonus
        total_points := (pub_count * 10) + citation_sum + (recent_pub_count * 5) + verification_bonus;
        
        -- Update professor's ranking points
        UPDATE professors
        SET ranking_points = total_points
        WHERE id = prof.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the function to update all ranking points
SELECT calculate_ranking_points();

-- Create a trigger to automatically update ranking points when publications change
CREATE OR REPLACE FUNCTION update_ranking_on_publication_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If a publication is added, updated, or deleted, recalculate ranking points
    PERFORM calculate_ranking_points();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS publication_ranking_trigger ON publications;
DROP TRIGGER IF EXISTS publication_authors_ranking_trigger ON publication_authors;

-- Create triggers
CREATE TRIGGER publication_ranking_trigger
AFTER INSERT OR UPDATE OR DELETE ON publications
FOR EACH STATEMENT EXECUTE FUNCTION update_ranking_on_publication_change();

CREATE TRIGGER publication_authors_ranking_trigger
AFTER INSERT OR UPDATE OR DELETE ON publication_authors
FOR EACH STATEMENT EXECUTE FUNCTION update_ranking_on_publication_change();