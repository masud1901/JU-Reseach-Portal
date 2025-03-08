-- Insert more sample faculties if needed
INSERT INTO faculties (name) VALUES
('Faculty of Medical Sciences'),
('Faculty of Law'),
('Faculty of Fine Arts')
ON CONFLICT (name) DO NOTHING;

-- Insert more sample departments
INSERT INTO departments (faculty_id, name) VALUES
((SELECT id FROM faculties WHERE name = 'Faculty of Medical Sciences'), 'Medicine'),
((SELECT id FROM faculties WHERE name = 'Faculty of Medical Sciences'), 'Pharmacy'),
((SELECT id FROM faculties WHERE name = 'Faculty of Law'), 'Law'),
((SELECT id FROM faculties WHERE name = 'Faculty of Fine Arts'), 'Music'),
((SELECT id FROM faculties WHERE name = 'Faculty of Fine Arts'), 'Painting')
ON CONFLICT DO NOTHING;

-- Insert more sample professors
INSERT INTO professors (name, department_id, research_interests, bio, google_scholar_id, is_verified, ranking_points, seeking_students, verification_badge_type) VALUES
('Dr. Sadia Rahman', (SELECT id FROM departments WHERE name = 'Medicine'), ARRAY['Public Health', 'Epidemiology', 'Infectious Diseases'], 'Medical researcher specializing in public health interventions for infectious diseases in Bangladesh.', 'MED123XYZ', TRUE, 185, TRUE, 'verified'),
('Dr. Imran Hossain', (SELECT id FROM departments WHERE name = 'Law'), ARRAY['Constitutional Law', 'Human Rights', 'Environmental Law'], 'Legal scholar with focus on constitutional and environmental law in South Asia.', 'LAW456UVW', TRUE, 150, FALSE, 'verified'),
('Dr. Nazia Begum', (SELECT id FROM departments WHERE name = 'Music'), ARRAY['Ethnomusicology', 'Bengali Folk Music', 'Music Therapy'], 'Ethnomusicologist studying traditional Bengali folk music and its therapeutic applications.', 'MUS789RST', FALSE, 120, TRUE, NULL)
ON CONFLICT DO NOTHING;

-- Insert more sample students
INSERT INTO students (name, department_id, research_interests, bio, badge) VALUES
('Tahmid Khan', (SELECT id FROM departments WHERE name = 'Computer Science and Engineering'), ARRAY['Cybersecurity', 'Network Security', 'Ethical Hacking'], 'Graduate student researching network security vulnerabilities in IoT devices.', 'Security Specialist'),
('Fariha Islam', (SELECT id FROM departments WHERE name = 'Medicine'), ARRAY['Virology', 'Vaccine Development', 'Immunology'], 'PhD student working on novel vaccine development for tropical diseases.', 'Research Excellence'),
('Arif Rahman', (SELECT id FROM departments WHERE name = 'Law'), ARRAY['International Law', 'Human Rights', 'Refugee Law'], 'Law student focusing on international refugee law and human rights.', NULL)
ON CONFLICT DO NOTHING;

-- Insert more sample publications
INSERT INTO publications (title, journal_name, publisher, publication_year, publication_date, citation_count, url, publication_type) VALUES
('Epidemiological Patterns of COVID-19 in Bangladesh', 'Journal of Global Health', 'Edinburgh University Global Health Society', 2022, '2022-05-20', 42, 'https://example.com/publication9', 'Research Article'),
('Constitutional Challenges in Environmental Protection: A Bangladesh Perspective', 'Asian Journal of Law', 'Asian Law Institute', 2021, '2021-11-15', 18, 'https://example.com/publication10', 'Review Article'),
('Therapeutic Applications of Bengali Folk Music in Mental Health Treatment', 'Journal of Music Therapy', 'American Music Therapy Association', 2023, '2023-01-10', 5, 'https://example.com/publication11', 'Case Study'),
('Network Security Vulnerabilities in IoT Healthcare Devices', 'Journal of Cybersecurity', 'Oxford University Press', 2023, '2023-03-22', 14, 'https://example.com/publication12', 'Research Article')
ON CONFLICT DO NOTHING;

-- Link publications to authors (professors)
INSERT INTO publication_authors (publication_id, professor_id, author_order)
SELECT 
  (SELECT id FROM publications WHERE title = 'Epidemiological Patterns of COVID-19 in Bangladesh'),
  (SELECT id FROM professors WHERE name = 'Dr. Sadia Rahman'),
  1
ON CONFLICT DO NOTHING;

INSERT INTO publication_authors (publication_id, professor_id, author_order)
SELECT 
  (SELECT id FROM publications WHERE title = 'Constitutional Challenges in Environmental Protection: A Bangladesh Perspective'),
  (SELECT id FROM professors WHERE name = 'Dr. Imran Hossain'),
  1
ON CONFLICT DO NOTHING;

INSERT INTO publication_authors (publication_id, professor_id, author_order)
SELECT 
  (SELECT id FROM publications WHERE title = 'Therapeutic Applications of Bengali Folk Music in Mental Health Treatment'),
  (SELECT id FROM professors WHERE name = 'Dr. Nazia Begum'),
  1
ON CONFLICT DO NOTHING;

-- Link publications to authors (students)
INSERT INTO publication_authors (publication_id, student_id, author_order)
SELECT 
  (SELECT id FROM publications WHERE title = 'Network Security Vulnerabilities in IoT Healthcare Devices'),
  (SELECT id FROM students WHERE name = 'Tahmid Khan'),
  1
ON CONFLICT DO NOTHING;

INSERT INTO publication_authors (publication_id, student_id, author_order)
SELECT 
  (SELECT id FROM publications WHERE title = 'Epidemiological Patterns of COVID-19 in Bangladesh'),
  (SELECT id FROM students WHERE name = 'Fariha Islam'),
  2
ON CONFLICT DO NOTHING;

-- Insert more research keywords
INSERT INTO research_keywords (keyword) VALUES
('Public Health'),
('Epidemiology'),
('Constitutional Law'),
('Human Rights'),
('Ethnomusicology'),
('Cybersecurity'),
('Vaccine Development')
ON CONFLICT (keyword) DO NOTHING;

-- Link professors to research keywords
INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
SELECT 
  (SELECT id FROM professors WHERE name = 'Dr. Sadia Rahman'),
  (SELECT id FROM research_keywords WHERE keyword = 'Public Health')
ON CONFLICT DO NOTHING;

INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
SELECT 
  (SELECT id FROM professors WHERE name = 'Dr. Imran Hossain'),
  (SELECT id FROM research_keywords WHERE keyword = 'Constitutional Law')
ON CONFLICT DO NOTHING;

INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
SELECT 
  (SELECT id FROM professors WHERE name = 'Dr. Imran Hossain'),
  (SELECT id FROM research_keywords WHERE keyword = 'Human Rights')
ON CONFLICT DO NOTHING;

-- Insert sample connection requests between professors and students
INSERT INTO connection_requests (from_user_id, to_user_id, message, status)
SELECT 
  p.user_id,
  s.user_id,
  'I am interested in your research on cybersecurity and would like to discuss potential collaboration.',
  'pending'
FROM professors p, students s
WHERE p.name = 'Dr. Md. Rahman' AND s.name = 'Tahmid Khan'
AND p.user_id IS NOT NULL AND s.user_id IS NOT NULL
LIMIT 1;

INSERT INTO connection_requests (from_user_id, to_user_id, message, status)
SELECT 
  s.user_id,
  p.user_id,
  'I am a student researcher in epidemiology and would like to join your research group.',
  'accepted'
FROM professors p, students s
WHERE p.name = 'Dr. Sadia Rahman' AND s.name = 'Fariha Islam'
AND p.user_id IS NOT NULL AND s.user_id IS NOT NULL
LIMIT 1;