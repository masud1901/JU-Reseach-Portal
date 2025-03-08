-- Fix the issue with professors table not having a unique constraint on name

-- First, check if there are any duplicate professor names
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT name, COUNT(*)
        FROM professors
        GROUP BY name
        HAVING COUNT(*) > 1
    ) AS duplicates;
    
    IF duplicate_count > 0 THEN
        RAISE NOTICE 'There are % professors with duplicate names. Cannot add unique constraint.', duplicate_count;
    ELSE
        -- Add unique constraint if no duplicates exist
        ALTER TABLE professors ADD CONSTRAINT professors_name_key UNIQUE (name);
        RAISE NOTICE 'Added unique constraint on professors.name';
    END IF;
END$$;

-- Fix the sample data insertion to avoid the unique constraint error
DO $$
DECLARE
    dept_id uuid;
    prof_count INTEGER;
    prof_id uuid;
BEGIN
    -- Dr. Sadia Rahman
    SELECT COUNT(*) INTO prof_count FROM professors WHERE name = 'Dr. Sadia Rahman';
    IF prof_count = 0 THEN
        SELECT id INTO dept_id FROM departments WHERE name = 'Medicine' LIMIT 1;
        IF dept_id IS NOT NULL THEN
            INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
            VALUES ('Dr. Sadia Rahman', dept_id, 'Professor of Medicine specializing in infectious diseases with over 15 years of research experience.', TRUE, TRUE, ARRAY['Public Health', 'Epidemiology'])
            RETURNING id INTO prof_id;
            
            -- Link professor to research keywords
            INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
            SELECT prof_id, id FROM research_keywords WHERE keyword = 'Public Health'
            ON CONFLICT DO NOTHING;
            
            INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
            SELECT prof_id, id FROM research_keywords WHERE keyword = 'Epidemiology'
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Dr. Kamal Hossain
    SELECT COUNT(*) INTO prof_count FROM professors WHERE name = 'Dr. Kamal Hossain';
    IF prof_count = 0 THEN
        SELECT id INTO dept_id FROM departments WHERE name = 'Pharmacy' LIMIT 1;
        IF dept_id IS NOT NULL THEN
            INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
            VALUES ('Dr. Kamal Hossain', dept_id, 'Associate Professor of Pharmacy with expertise in drug discovery and development.', TRUE, FALSE, ARRAY['Pharmaceutical Research', 'Drug Development'])
            RETURNING id INTO prof_id;
            
            -- Link professor to research keywords
            INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
            SELECT prof_id, id FROM research_keywords WHERE keyword = 'Pharmaceutical Research'
            ON CONFLICT DO NOTHING;
            
            INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
            SELECT prof_id, id FROM research_keywords WHERE keyword = 'Drug Development'
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Dr. Nasreen Akter
    SELECT COUNT(*) INTO prof_count FROM professors WHERE name = 'Dr. Nasreen Akter';
    IF prof_count = 0 THEN
        SELECT id INTO dept_id FROM departments WHERE name = 'Law' LIMIT 1;
        IF dept_id IS NOT NULL THEN
            INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
            VALUES ('Dr. Nasreen Akter', dept_id, 'Professor of Law specializing in constitutional law and human rights.', TRUE, TRUE, ARRAY['Constitutional Law', 'Human Rights'])
            RETURNING id INTO prof_id;
            
            -- Link professor to research keywords
            INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
            SELECT prof_id, id FROM research_keywords WHERE keyword = 'Constitutional Law'
            ON CONFLICT DO NOTHING;
            
            INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
            SELECT prof_id, id FROM research_keywords WHERE keyword = 'Human Rights'
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
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