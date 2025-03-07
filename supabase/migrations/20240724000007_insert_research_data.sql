-- Insert sample research keywords
INSERT INTO research_keywords (keyword) VALUES
('Machine Learning'),
('Artificial Intelligence'),
('Computer Vision'),
('Quantum Physics'),
('Theoretical Physics'),
('Particle Physics'),
('Number Theory'),
('Cryptography'),
('Molecular Biology'),
('Genetics'),
('Organic Chemistry'),
('Medicinal Chemistry')
ON CONFLICT (keyword) DO NOTHING;

-- Link professors to research keywords (only if both tables exist and have data)
DO $$
BEGIN
  IF EXISTS (SELECT FROM professors WHERE name = 'Dr. Md. Rahman') AND 
     EXISTS (SELECT FROM research_keywords WHERE keyword = 'Machine Learning') THEN
    
    INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
    SELECT p.id, k.id
    FROM professors p, research_keywords k
    WHERE p.name = 'Dr. Md. Rahman' AND k.keyword = 'Machine Learning'
    ON CONFLICT DO NOTHING;
    
    INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
    SELECT p.id, k.id
    FROM professors p, research_keywords k
    WHERE p.name = 'Dr. Md. Rahman' AND k.keyword = 'Artificial Intelligence'
    ON CONFLICT DO NOTHING;
    
    INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
    SELECT p.id, k.id
    FROM professors p, research_keywords k
    WHERE p.name = 'Dr. Md. Rahman' AND k.keyword = 'Computer Vision'
    ON CONFLICT DO NOTHING;
  END IF;
END
$$;
