-- Add ranking_points column to students table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'ranking_points') THEN
        ALTER TABLE students ADD COLUMN ranking_points integer DEFAULT 0;
    END IF;
END $$;

-- Create or replace function to calculate student ranking points
CREATE OR REPLACE FUNCTION calculate_student_ranking_points()
RETURNS TRIGGER AS $$
DECLARE
    total_points INTEGER := 0;
    pub RECORD;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    year_diff INTEGER;
    recency_factor FLOAT;
    pub_points INTEGER;
BEGIN
    -- Get all publications for this student
    FOR pub IN 
        SELECT p.* 
        FROM publications p
        JOIN publication_authors pa ON p.id = pa.publication_id
        WHERE pa.student_id = NEW.student_id
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
    
    -- Update student's ranking points
    UPDATE students
    SET ranking_points = total_points
    WHERE id = NEW.student_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update ranking points when publications are added or updated
DROP TRIGGER IF EXISTS update_student_ranking_points ON publication_authors;
CREATE TRIGGER update_student_ranking_points
AFTER INSERT OR UPDATE ON publication_authors
FOR EACH ROW
WHEN (NEW.student_id IS NOT NULL)
EXECUTE FUNCTION calculate_student_ranking_points();

-- Update all student ranking points
DO $$
DECLARE
    student RECORD;
    total_points INTEGER;
    pub RECORD;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    year_diff INTEGER;
    recency_factor FLOAT;
    pub_points INTEGER;
BEGIN
    FOR student IN SELECT id FROM students LOOP
        total_points := 0;
        
        -- Get all publications for this student
        FOR pub IN 
            SELECT p.* 
            FROM publications p
            JOIN publication_authors pa ON p.id = pa.publication_id
            WHERE pa.student_id = student.id
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
        
        -- Update student's ranking points
        UPDATE students
        SET ranking_points = total_points
        WHERE id = student.id;
    END LOOP;
END $$;

-- Create a combined leaderboard view
CREATE OR REPLACE VIEW combined_leaderboard AS
SELECT 
    id,
    name,
    'professor' as role,
    department_id,
    ranking_points,
    is_verified
FROM professors
UNION ALL
SELECT 
    id,
    name,
    'student' as role,
    department_id,
    ranking_points,
    false as is_verified
FROM students;

-- Create function to get combined leaderboard
CREATE OR REPLACE FUNCTION get_combined_leaderboard(limit_count integer DEFAULT 10)
RETURNS TABLE (
    id uuid,
    name text,
    role text,
    department_id uuid,
    department_name text,
    ranking_points integer,
    is_verified boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cl.id,
        cl.name,
        cl.role,
        cl.department_id,
        d.name as department_name,
        cl.ranking_points,
        cl.is_verified
    FROM 
        combined_leaderboard cl
    LEFT JOIN
        departments d ON cl.department_id = d.id
    ORDER BY 
        cl.ranking_points DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;