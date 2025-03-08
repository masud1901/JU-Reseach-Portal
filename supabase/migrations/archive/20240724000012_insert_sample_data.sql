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

-- Insert sample professors
INSERT INTO professors (name, department_id, research_interests, bio, google_scholar_id, is_verified, ranking_points, seeking_students, verification_badge_type) VALUES
('Dr. Md. Rahman', (SELECT id FROM departments WHERE name = 'Computer Science and Engineering'), ARRAY['Machine Learning', 'Artificial Intelligence', 'Computer Vision'], 'Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences.', 'ABC123XYZ', TRUE, 320, TRUE, 'verified'),
('Dr. Fatima Ahmed', (SELECT id FROM departments WHERE name = 'Physics'), ARRAY['Quantum Physics', 'Theoretical Physics', 'Particle Physics'], 'Quantum physics researcher with focus on theoretical models of particle interactions.', 'DEF456UVW', TRUE, 280, FALSE, 'verified'),
('Dr. Anisur Khan', (SELECT id FROM departments WHERE name = 'Mathematics'), ARRAY['Number Theory', 'Cryptography', 'Algebraic Geometry'], 'Mathematics professor specializing in number theory and its applications to cryptography.', 'GHI789RST', TRUE, 210, TRUE, 'verified'),
('Dr. Nasreen Akter', (SELECT id FROM departments WHERE name = 'Biology'), ARRAY['Molecular Biology', 'Genetics', 'Biotechnology'], 'Molecular biologist researching genetic mechanisms in tropical diseases.', 'JKL012MNO', FALSE, 240, TRUE, NULL),
('Dr. Kamal Hossain', (SELECT id FROM departments WHERE name = 'Chemistry'), ARRAY['Organic Chemistry', 'Medicinal Chemistry', 'Natural Products'], 'Chemistry professor focusing on natural product isolation and characterization.', 'PQR345STU', TRUE, 230, FALSE, 'verified')
ON CONFLICT DO NOTHING;

-- Insert sample students
INSERT INTO students (name, department_id, research_interests, bio, badge) VALUES
('Rahima Khan', (SELECT id FROM departments WHERE name = 'Computer Science and Engineering'), ARRAY['Machine Learning', 'Natural Language Processing'], 'Graduate student researching applications of NLP in Bangla language processing.', 'Rising Star'),
('Ahmed Hassan', (SELECT id FROM departments WHERE name = 'Physics'), ARRAY['Quantum Computing', 'Theoretical Physics'], 'PhD student working on quantum computing algorithms.', NULL),
('Nusrat Jahan', (SELECT id FROM departments WHERE name = 'Biology'), ARRAY['Genetics', 'Bioinformatics'], 'Research student focusing on genetic markers for tropical diseases.', 'Research Excellence'),
('Karim Ali', (SELECT id FROM departments WHERE name = 'Mathematics'), ARRAY['Number Theory', 'Cryptography'], 'Masters student studying cryptographic applications of number theory.', NULL),
('Sadia Rahman', (SELECT id FROM departments WHERE name = 'Chemistry'), ARRAY['Medicinal Chemistry', 'Drug Discovery'], 'PhD candidate researching novel antimicrobial compounds from natural sources.', 'Innovation Award')
ON CONFLICT DO NOTHING;

-- Insert sample publications
INSERT INTO publications (title, journal_name, publisher, publication_year, publication_date, citation_count, url, publication_type) VALUES
('Deep Learning Approaches for Bengali Natural Language Processing', 'IEEE Transactions on Pattern Analysis and Machine Intelligence', 'IEEE', 2022, '2022-03-15', 45, 'https://example.com/publication1', 'Journal Article'),
('Computer Vision Applications in Agriculture: A Case Study from Bangladesh', 'Journal of Computer Vision Research', 'Elsevier', 2021, '2021-08-22', 32, 'https://example.com/publication2', 'Journal Article'),
('Quantum Entanglement in Multi-Particle Systems', 'Physical Review Letters', 'APS', 2022, '2022-01-10', 28, 'https://example.com/publication3', 'Journal Article'),
('Novel Approaches to Prime Number Distribution', 'Journal of Number Theory', 'Academic Press', 2021, '2021-05-18', 15, 'https://example.com/publication4', 'Journal Article'),
('Isolation and Characterization of Bioactive Compounds from Medicinal Plants of Bangladesh', 'Journal of Natural Products', 'ACS', 2023, '2023-02-05', 8, 'https://example.com/publication5', 'Journal Article'),
('Machine Learning for Climate Prediction: A Review', 'Environmental Data Science', 'Cambridge University Press', 2023, '2023-04-12', 12, 'https://example.com/publication6', 'Review Article'),
('Genetic Diversity in Bengal Tiger Populations', 'Conservation Biology', 'Wiley', 2022, '2022-09-30', 18, 'https://example.com/publication7', 'Research Article'),
('Cryptographic Protocols for Secure Communication', 'Journal of Cryptography', 'Springer', 2021, '2021-11-05', 22, 'https://example.com/publication8', 'Journal Article')
ON CONFLICT DO NOTHING;

-- Link publications to authors (professors)
INSERT INTO publication_authors (publication_id, professor_id, author_order) VALUES
((SELECT id FROM publications WHERE title = 'Deep Learning Approaches for Bengali Natural Language Processing'), (SELECT id FROM professors WHERE name = 'Dr. Md. Rahman'), 1),
((SELECT id FROM publications WHERE title = 'Computer Vision Applications in Agriculture: A Case Study from Bangladesh'), (SELECT id FROM professors WHERE name = 'Dr. Md. Rahman'), 1),
((SELECT id FROM publications WHERE title = 'Quantum Entanglement in Multi-Particle Systems'), (SELECT id FROM professors WHERE name = 'Dr. Fatima Ahmed'), 1),
((SELECT id FROM publications WHERE title = 'Novel Approaches to Prime Number Distribution'), (SELECT id FROM professors WHERE name = 'Dr. Anisur Khan'), 1),
((SELECT id FROM publications WHERE title = 'Isolation and Characterization of Bioactive Compounds from Medicinal Plants of Bangladesh'), (SELECT id FROM professors WHERE name = 'Dr. Kamal Hossain'), 1),
((SELECT id FROM publications WHERE title = 'Machine Learning for Climate Prediction: A Review'), (SELECT id FROM professors WHERE name = 'Dr. Md. Rahman'), 1),
((SELECT id FROM publications WHERE title = 'Genetic Diversity in Bengal Tiger Populations'), (SELECT id FROM professors WHERE name = 'Dr. Nasreen Akter'), 1),
((SELECT id FROM publications WHERE title = 'Cryptographic Protocols for Secure Communication'), (SELECT id FROM professors WHERE name = 'Dr. Anisur Khan'), 1)
ON CONFLICT DO NOTHING;

-- Link publications to authors (students)
INSERT INTO publication_authors (publication_id, student_id, author_order) VALUES
((SELECT id FROM publications WHERE title = 'Deep Learning Approaches for Bengali Natural Language Processing'), (SELECT id FROM students WHERE name = 'Rahima Khan'), 2),
((SELECT id FROM publications WHERE title = 'Quantum Entanglement in Multi-Particle Systems'), (SELECT id FROM students WHERE name = 'Ahmed Hassan'), 2),
((SELECT id FROM publications WHERE title = 'Genetic Diversity in Bengal Tiger Populations'), (SELECT id FROM students WHERE name = 'Nusrat Jahan'), 2),
((SELECT id FROM publications WHERE title = 'Cryptographic Protocols for Secure Communication'), (SELECT id FROM students WHERE name = 'Karim Ali'), 2),
((SELECT id FROM publications WHERE title = 'Isolation and Characterization of Bioactive Compounds from Medicinal Plants of Bangladesh'), (SELECT id FROM students WHERE name = 'Sadia Rahman'), 2)
ON CONFLICT DO NOTHING;

-- Link professors to research keywords
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

INSERT INTO professor_research_keywords (professor_id, research_keyword_id) 
SELECT p.id, k.id
FROM professors p, research_keywords k
WHERE p.name = 'Dr. Fatima Ahmed' AND k.keyword = 'Quantum Physics'
ON CONFLICT DO NOTHING;

INSERT INTO professor_research_keywords (professor_id, research_keyword_id) 
SELECT p.id, k.id
FROM professors p, research_keywords k
WHERE p.name = 'Dr. Anisur Khan' AND k.keyword = 'Cryptography'
ON CONFLICT DO NOTHING;

-- Insert sample connection requests
INSERT INTO connection_requests (from_user_id, to_user_id, message, status) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'I am interested in your research on machine learning and would like to discuss potential collaboration.', 'pending'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'I would like to join your research group as a PhD student.', 'accepted'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'I am working on a similar research topic and would like to discuss potential collaboration.', 'rejected')
ON CONFLICT DO NOTHING;