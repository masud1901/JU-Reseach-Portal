-- Insert sample professors
INSERT INTO professors (name, department, research_interests, bio, google_scholar_id, is_verified, ranking_points, seeking_students) VALUES
('Dr. Md. Rahman', 'Computer Science and Engineering', ARRAY['Machine Learning', 'Artificial Intelligence', 'Computer Vision'], 'Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences.', 'ABC123XYZ', TRUE, 320, TRUE),
('Dr. Fatima Ahmed', 'Physics', ARRAY['Quantum Physics', 'Theoretical Physics', 'Particle Physics'], 'Quantum physics researcher with focus on theoretical models of particle interactions.', 'DEF456UVW', TRUE, 280, FALSE),
('Dr. Anisur Khan', 'Mathematics', ARRAY['Number Theory', 'Cryptography', 'Algebraic Geometry'], 'Mathematics professor specializing in number theory and its applications to cryptography.', 'GHI789RST', TRUE, 210, TRUE),
('Dr. Nasreen Akter', 'Biology', ARRAY['Molecular Biology', 'Genetics', 'Biotechnology'], 'Molecular biologist researching genetic mechanisms in tropical diseases.', 'JKL012MNO', FALSE, 240, TRUE),
('Dr. Kamal Hossain', 'Chemistry', ARRAY['Organic Chemistry', 'Medicinal Chemistry', 'Natural Products'], 'Chemistry professor focusing on natural product isolation and characterization.', 'PQR345STU', TRUE, 230, FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample publications
INSERT INTO publications (title, authors, journal, year, citation_count, professor_id) 
SELECT 
  'Deep Learning Approaches for Bengali Natural Language Processing', 
  ARRAY['Md. Rahman', 'S. Ahmed', 'K. Islam'], 
  'IEEE Transactions on Pattern Analysis and Machine Intelligence', 
  2022, 
  45, 
  id 
FROM professors WHERE name = 'Dr. Md. Rahman'
ON CONFLICT DO NOTHING;

INSERT INTO publications (title, authors, journal, year, citation_count, professor_id) 
SELECT 
  'Computer Vision Applications in Agriculture: A Case Study from Bangladesh', 
  ARRAY['Md. Rahman', 'F. Hossain'], 
  'Journal of Computer Vision Research', 
  2021, 
  32, 
  id 
FROM professors WHERE name = 'Dr. Md. Rahman'
ON CONFLICT DO NOTHING;

INSERT INTO publications (title, authors, journal, year, citation_count, professor_id) 
SELECT 
  'Quantum Entanglement in Multi-Particle Systems', 
  ARRAY['Fatima Ahmed', 'J. Doe'], 
  'Physical Review Letters', 
  2022, 
  28, 
  id 
FROM professors WHERE name = 'Dr. Fatima Ahmed'
ON CONFLICT DO NOTHING;

INSERT INTO publications (title, authors, journal, year, citation_count, professor_id) 
SELECT 
  'Novel Approaches to Prime Number Distribution', 
  ARRAY['Anisur Khan', 'P. Smith'], 
  'Journal of Number Theory', 
  2021, 
  15, 
  id 
FROM professors WHERE name = 'Dr. Anisur Khan'
ON CONFLICT DO NOTHING;

INSERT INTO publications (title, authors, journal, year, citation_count, professor_id) 
SELECT 
  'Isolation and Characterization of Bioactive Compounds from Medicinal Plants of Bangladesh', 
  ARRAY['Kamal Hossain', 'R. Begum'], 
  'Journal of Natural Products', 
  2023, 
  8, 
  id 
FROM professors WHERE name = 'Dr. Kamal Hossain'
ON CONFLICT DO NOTHING;