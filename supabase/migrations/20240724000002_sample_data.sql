-- Insert sample faculties
INSERT INTO faculties (name) VALUES
('Faculty of Science'),
('Faculty of Arts'),
('Faculty of Engineering'),
('Faculty of Social Sciences'),
('Faculty of Business Studies')
ON CONFLICT (name) DO NOTHING;

-- Insert sample departments
INSERT INTO departments (faculty_id, name) VALUES
((SELECT id FROM faculties WHERE name = 'Faculty of Science'), 'Computer Science and Engineering'),
((SELECT id FROM faculties WHERE name = 'Faculty of Science'), 'Physics'),
((SELECT id FROM faculties WHERE name = 'Faculty of Science'), 'Chemistry'),
((SELECT id FROM faculties WHERE name = 'Faculty of Science'), 'Mathematics'),
((SELECT id FROM faculties WHERE name = 'Faculty of Science'), 'Biology'),
((SELECT id FROM faculties WHERE name = 'Faculty of Arts'), 'English'),
((SELECT id FROM faculties WHERE name = 'Faculty of Arts'), 'History'),
((SELECT id FROM faculties WHERE name = 'Faculty of Engineering'), 'Electrical Engineering'),
((SELECT id FROM faculties WHERE name = 'Faculty of Social Sciences'), 'Economics'),
((SELECT id FROM faculties WHERE name = 'Faculty of Business Studies'), 'Management')
ON CONFLICT DO NOTHING;

-- Insert sample professors
INSERT INTO professors (name, department, research_interests, bio, google_scholar_id, is_verified, ranking_points, seeking_students) VALUES
('Dr. Md. Rahman', 'Computer Science and Engineering', ARRAY['Machine Learning', 'Artificial Intelligence', 'Computer Vision'], 'Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences.', 'ABC123XYZ', TRUE, 320, TRUE),
('Dr. Fatima Ahmed', 'Physics', ARRAY['Quantum Physics', 'Theoretical Physics', 'Particle Physics'], 'Quantum physics researcher with focus on theoretical models of particle interactions.', 'DEF456UVW', TRUE, 280, FALSE),
('Dr. Anisur Khan', 'Mathematics', ARRAY['Number Theory', 'Cryptography', 'Algebraic Geometry'], 'Mathematics professor specializing in number theory and its applications to cryptography.', 'GHI789RST', TRUE, 210, TRUE),
('Dr. Nasreen Akter', 'Biology', ARRAY['Molecular Biology', 'Genetics', 'Biotechnology'], 'Molecular biologist researching genetic mechanisms in tropical diseases.', 'JKL012MNO', FALSE, 240, TRUE),
('Dr. Kamal Hossain', 'Chemistry', ARRAY['Organic Chemistry', 'Medicinal Chemistry', 'Natural Products'], 'Chemistry professor focusing on natural product isolation and characterization.', 'PQR345STU', TRUE, 230, FALSE)
ON CONFLICT DO NOTHING;

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

-- Link professors to research keywords
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

-- Insert sample publications
INSERT INTO publications (title, authors, journal, year, citation_count, professor_id) VALUES
('Deep Learning Approaches for Bengali Natural Language Processing', ARRAY['Md. Rahman', 'S. Ahmed', 'K. Islam'], 'IEEE Transactions on Pattern Analysis and Machine Intelligence', 2022, 45, (SELECT id FROM professors WHERE name = 'Dr. Md. Rahman')),
('Computer Vision Applications in Agriculture: A Case Study from Bangladesh', ARRAY['Md. Rahman', 'F. Hossain'], 'Journal of Computer Vision Research', 2021, 32, (SELECT id FROM professors WHERE name = 'Dr. Md. Rahman')),
('Quantum Entanglement in Multi-Particle Systems', ARRAY['Fatima Ahmed', 'J. Doe'], 'Physical Review Letters', 2022, 28, (SELECT id FROM professors WHERE name = 'Dr. Fatima Ahmed')),
('Novel Approaches to Prime Number Distribution', ARRAY['Anisur Khan', 'P. Smith'], 'Journal of Number Theory', 2021, 15, (SELECT id FROM professors WHERE name = 'Dr. Anisur Khan')),
('Isolation and Characterization of Bioactive Compounds from Medicinal Plants of Bangladesh', ARRAY['Kamal Hossain', 'R. Begum'], 'Journal of Natural Products', 2023, 8, (SELECT id FROM professors WHERE name = 'Dr. Kamal Hossain'))
ON CONFLICT DO NOTHING;