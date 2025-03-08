-- Create publication_type_enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_type_enum') THEN
        CREATE TYPE publication_type_enum AS ENUM (
            'Research Article',
            'Conference Paper',
            'Journal Article',
            'Review Article',
            'Book Chapter',
            'Thesis'
        );
    ELSE
        -- If the enum already exists, make sure it has all the values we need
        -- Check if 'Research Article' exists in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'publication_type_enum' AND e.enumlabel = 'Research Article'
        ) THEN
            -- Add 'Research Article' to the enum
            ALTER TYPE publication_type_enum ADD VALUE 'Research Article';
        END IF;
        
        -- Check if 'Conference Paper' exists in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'publication_type_enum' AND e.enumlabel = 'Conference Paper'
        ) THEN
            -- Add 'Conference Paper' to the enum
            ALTER TYPE publication_type_enum ADD VALUE 'Conference Paper';
        END IF;
        
        -- Check if 'Journal Article' exists in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'publication_type_enum' AND e.enumlabel = 'Journal Article'
        ) THEN
            -- Add 'Journal Article' to the enum
            ALTER TYPE publication_type_enum ADD VALUE 'Journal Article';
        END IF;
        
        -- Check if 'Review Article' exists in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'publication_type_enum' AND e.enumlabel = 'Review Article'
        ) THEN
            -- Add 'Review Article' to the enum
            ALTER TYPE publication_type_enum ADD VALUE 'Review Article';
        END IF;
        
        -- Check if 'Book Chapter' exists in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'publication_type_enum' AND e.enumlabel = 'Book Chapter'
        ) THEN
            -- Add 'Book Chapter' to the enum
            ALTER TYPE publication_type_enum ADD VALUE 'Book Chapter';
        END IF;
        
        -- Check if 'Thesis' exists in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'publication_type_enum' AND e.enumlabel = 'Thesis'
        ) THEN
            -- Add 'Thesis' to the enum
            ALTER TYPE publication_type_enum ADD VALUE 'Thesis';
        END IF;
    END IF;
END$$;

-- Modify the publications table to use text for publication_type instead of enum
ALTER TABLE publications ALTER COLUMN publication_type TYPE text;

-- Update existing publications to have a valid publication_type
UPDATE publications
SET publication_type = 'Research Article'
WHERE publication_type IS NULL OR publication_type = '';

-- Fix the issue with multiple rows in subquery
DO $$
DECLARE
    pub RECORD;
    prof_id uuid;
BEGIN
    FOR pub IN SELECT id FROM publications LOOP
        -- Get the first professor_id for this publication
        SELECT professor_id INTO prof_id FROM publication_authors 
        WHERE publication_id = pub.id AND professor_id IS NOT NULL 
        LIMIT 1;
        
        -- Update the publication's professor_id if found
        IF prof_id IS NOT NULL THEN
            UPDATE publications SET professor_id = prof_id WHERE id = pub.id;
        END IF;
    END LOOP;
END$$;

-- Update professor ranking points
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
END$$;