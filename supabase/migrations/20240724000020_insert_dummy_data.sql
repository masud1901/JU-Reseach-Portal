-- Insert sample faculties
INSERT INTO faculties (name) VALUES
('Faculty of Medical Sciences'),
('Faculty of Law'),
('Faculty of Business Studies'),
('Faculty of Science'),
('Faculty of Arts')
ON CONFLICT (name) DO NOTHING;

-- Insert sample departments
INSERT INTO departments (faculty_id, name) VALUES
((SELECT id FROM faculties WHERE name = 'Faculty of Medical Sciences'), 'Medicine'),
((SELECT id FROM faculties WHERE name = 'Faculty of Medical Sciences'), 'Pharmacy'),
((SELECT id FROM faculties WHERE name = 'Faculty of Law'), 'Law'),
((SELECT id FROM faculties WHERE name = 'Faculty of Business Studies'), 'Management'),
((SELECT id FROM faculties WHERE name = 'Faculty of Business Studies'), 'Finance'),
((SELECT id FROM faculties WHERE name = 'Faculty of Science'), 'Computer Science'),
((SELECT id FROM faculties WHERE name = 'Faculty of Science'), 'Physics'),
((SELECT id FROM faculties WHERE name = 'Faculty of Arts'), 'English'),
((SELECT id FROM faculties WHERE name = 'Faculty of Arts'), 'History')
ON CONFLICT DO NOTHING;

-- Insert sample research keywords
INSERT INTO research_keywords (keyword) VALUES
('Public Health'),
('Epidemiology'),
('Clinical Trials'),
('Pharmaceutical Research'),
('Drug Development'),
('Constitutional Law'),
('Human Rights'),
('Corporate Finance'),
('Marketing Strategy'),
('Artificial Intelligence'),
('Machine Learning'),
('Quantum Physics'),
('Literary Theory'),
('Medieval History')
ON CONFLICT (keyword) DO NOTHING;

-- Insert sample professors
INSERT INTO professors (name, department_id, bio, is_verified, seeking_students) VALUES
('Dr. Sadia Rahman', (SELECT id FROM departments WHERE name = 'Medicine'), 'Professor of Medicine specializing in infectious diseases with over 15 years of research experience.', TRUE, TRUE),
('Dr. Kamal Hossain', (SELECT id FROM departments WHERE name = 'Pharmacy'), 'Associate Professor of Pharmacy with expertise in drug discovery and development.', TRUE, FALSE),
('Dr. Nasreen Akter', (SELECT id FROM departments WHERE name = 'Law'), 'Professor of Law specializing in constitutional law and human rights.', TRUE, TRUE),
('Dr. Anisur Khan', (SELECT id FROM departments WHERE name = 'Management'), 'Professor of Management with research focus on organizational behavior.', FALSE, TRUE),
('Dr. Fatima Ahmed', (SELECT id FROM departments WHERE name = 'Finance'), 'Associate Professor of Finance specializing in corporate finance and investment.', TRUE, FALSE),
('Dr. Md. Rahman', (SELECT id FROM departments WHERE name = 'Computer Science'), 'Professor of Computer Science with expertise in artificial intelligence and machine learning.', TRUE, TRUE),
('Dr. Tahmid Islam', (SELECT id FROM departments WHERE name = 'Physics'), 'Professor of Physics specializing in quantum mechanics and theoretical physics.', TRUE, TRUE),
('Dr. Nusrat Jahan', (SELECT id FROM departments WHERE name = 'English'), 'Professor of English Literature with focus on postcolonial literature.', FALSE, FALSE),
('Dr. Rafiq Uddin', (SELECT id FROM departments WHERE name = 'History'), 'Professor of History specializing in medieval South Asian history.', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample students
INSERT INTO students (name, department_id, bio) VALUES
('Tahmid Khan', (SELECT id FROM departments WHERE name = 'Medicine'), 'Medical student interested in infectious disease research and public health.'),
('Nadia Islam', (SELECT id FROM departments WHERE name = 'Pharmacy'), 'Pharmacy student focusing on drug development and clinical trials.'),
('Rahim Ahmed', (SELECT id FROM departments WHERE name = 'Law'), 'Law student with interest in human rights and constitutional law.'),
('Sabina Akter', (SELECT id FROM departments WHERE name = 'Management'), 'Management student researching organizational behavior and leadership.'),
('Karim Uddin', (SELECT id FROM departments WHERE name = 'Finance'), 'Finance student interested in corporate finance and investment analysis.'),
('Farida Begum', (SELECT id FROM departments WHERE name = 'Computer Science'), 'Computer Science student focusing on artificial intelligence and machine learning.'),
('Imran Hossain', (SELECT id FROM departments WHERE name = 'Physics'), 'Physics student researching quantum mechanics and theoretical physics.'),
('Samira Rahman', (SELECT id FROM departments WHERE name = 'English'), 'English Literature student with interest in postcolonial literature.'),
('Jahid Hassan', (SELECT id FROM departments WHERE name = 'History'), 'History student focusing on medieval South Asian history.')
ON CONFLICT DO NOTHING;

-- Insert sample publications
INSERT INTO publications (title, journal, publication_year, citation_count, url) VALUES
('Emerging Infectious Diseases in Bangladesh: A Public Health Perspective', 'Journal of Public Health', 2023, 25, 'https://example.com/pub1'),
('Novel Drug Delivery Systems for Tropical Diseases', 'Journal of Pharmaceutical Research', 2022, 18, 'https://example.com/pub2'),
('Constitutional Reforms in South Asia: A Comparative Study', 'Journal of Constitutional Law', 2023, 15, 'https://example.com/pub3'),
('Leadership Styles in Bangladeshi Organizations', 'Journal of Management Studies', 2022, 12, 'https://example.com/pub4'),
('Corporate Finance Practices in Emerging Markets', 'Journal of Finance', 2023, 20, 'https://example.com/pub5'),
('Machine Learning Applications in Natural Language Processing', 'Journal of Artificial Intelligence', 2022, 30, 'https://example.com/pub6'),
('Quantum Entanglement: Theory and Applications', 'Journal of Physics', 2023, 22, 'https://example.com/pub7'),
('Postcolonial Literature in South Asia', 'Journal of Literary Studies', 2022, 14, 'https://example.com/pub8'),
('Medieval Trade Routes in South Asia', 'Journal of Historical Research', 2023, 16, 'https://example.com/pub9')
ON CONFLICT DO NOTHING;

-- Link publications to authors (professors)
INSERT INTO publication_authors (publication_id, professor_id, author_order) VALUES
((SELECT id FROM publications WHERE title = 'Emerging Infectious Diseases in Bangladesh: A Public Health Perspective'), 
 (SELECT id FROM professors WHERE name = 'Dr. Sadia Rahman'), 1),
((SELECT id FROM publications WHERE title = 'Novel Drug Delivery Systems for Tropical Diseases'), 
 (SELECT id FROM professors WHERE name = 'Dr. Kamal Hossain'), 1),
((SELECT id FROM publications WHERE title = 'Constitutional Reforms in South Asia: A Comparative Study'), 
 (SELECT id FROM professors WHERE name = 'Dr. Nasreen Akter'), 1),
((SELECT id FROM publications WHERE title = 'Leadership Styles in Bangladeshi Organizations'), 
 (SELECT id FROM professors WHERE name = 'Dr. Anisur Khan'), 1),
((SELECT id FROM publications WHERE title = 'Corporate Finance Practices in Emerging Markets'), 
 (SELECT id FROM professors WHERE name = 'Dr. Fatima Ahmed'), 1),
((SELECT id FROM publications WHERE title = 'Machine Learning Applications in Natural Language Processing'), 
 (SELECT id FROM professors WHERE name = 'Dr. Md. Rahman'), 1),
((SELECT id FROM publications WHERE title = 'Quantum Entanglement: Theory and Applications'), 
 (SELECT id FROM professors WHERE name = 'Dr. Tahmid Islam'), 1),
((SELECT id FROM publications WHERE title = 'Postcolonial Literature in South Asia'), 
 (SELECT id FROM professors WHERE name = 'Dr. Nusrat Jahan'), 1),
((SELECT id FROM publications WHERE title = 'Medieval Trade Routes in South Asia'), 
 (SELECT id FROM professors WHERE name = 'Dr. Rafiq Uddin'), 1)
ON CONFLICT DO NOTHING;

-- Link publications to authors (students)
INSERT INTO publication_authors (publication_id, student_id, author_order) VALUES
((SELECT id FROM publications WHERE title = 'Emerging Infectious Diseases in Bangladesh: A Public Health Perspective'), 
 (SELECT id FROM students WHERE name = 'Tahmid Khan'), 2),
((SELECT id FROM publications WHERE title = 'Novel Drug Delivery Systems for Tropical Diseases'), 
 (SELECT id FROM students WHERE name = 'Nadia Islam'), 2),
((SELECT id FROM publications WHERE title = 'Constitutional Reforms in South Asia: A Comparative Study'), 
 (SELECT id FROM students WHERE name = 'Rahim Ahmed'), 2),
((SELECT id FROM publications WHERE title = 'Machine Learning Applications in Natural Language Processing'), 
 (SELECT id FROM students WHERE name = 'Farida Begum'), 2),
((SELECT id FROM publications WHERE title = 'Quantum Entanglement: Theory and Applications'), 
 (SELECT id FROM students WHERE name = 'Imran Hossain'), 2),
((SELECT id FROM publications WHERE title = 'Medieval Trade Routes in South Asia'), 
 (SELECT id FROM students WHERE name = 'Jahid Hassan'), 2)
ON CONFLICT DO NOTHING;

-- Link professors to research keywords
INSERT INTO professor_research_keywords (professor_id, research_keyword_id) VALUES
((SELECT id FROM professors WHERE name = 'Dr. Sadia Rahman'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Public Health')),
((SELECT id FROM professors WHERE name = 'Dr. Sadia Rahman'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Epidemiology')),
((SELECT id FROM professors WHERE name = 'Dr. Kamal Hossain'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Pharmaceutical Research')),
((SELECT id FROM professors WHERE name = 'Dr. Kamal Hossain'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Drug Development')),
((SELECT id FROM professors WHERE name = 'Dr. Nasreen Akter'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Constitutional Law')),
((SELECT id FROM professors WHERE name = 'Dr. Nasreen Akter'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Human Rights')),
((SELECT id FROM professors WHERE name = 'Dr. Anisur Khan'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Marketing Strategy')),
((SELECT id FROM professors WHERE name = 'Dr. Fatima Ahmed'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Corporate Finance')),
((SELECT id FROM professors WHERE name = 'Dr. Md. Rahman'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Artificial Intelligence')),
((SELECT id FROM professors WHERE name = 'Dr. Md. Rahman'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Machine Learning')),
((SELECT id FROM professors WHERE name = 'Dr. Tahmid Islam'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Quantum Physics')),
((SELECT id FROM professors WHERE name = 'Dr. Nusrat Jahan'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Literary Theory')),
((SELECT id FROM professors WHERE name = 'Dr. Rafiq Uddin'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Medieval History'))
ON CONFLICT DO NOTHING;

-- Link students to research keywords
INSERT INTO student_research_keywords (student_id, research_keyword_id) VALUES
((SELECT id FROM students WHERE name = 'Tahmid Khan'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Public Health')),
((SELECT id FROM students WHERE name = 'Tahmid Khan'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Epidemiology')),
((SELECT id FROM students WHERE name = 'Nadia Islam'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Pharmaceutical Research')),
((SELECT id FROM students WHERE name = 'Nadia Islam'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Drug Development')),
((SELECT id FROM students WHERE name = 'Rahim Ahmed'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Constitutional Law')),
((SELECT id FROM students WHERE name = 'Rahim Ahmed'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Human Rights')),
((SELECT id FROM students WHERE name = 'Sabina Akter'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Marketing Strategy')),
((SELECT id FROM students WHERE name = 'Karim Uddin'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Corporate Finance')),
((SELECT id FROM students WHERE name = 'Farida Begum'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Artificial Intelligence')),
((SELECT id FROM students WHERE name = 'Farida Begum'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Machine Learning')),
((SELECT id FROM students WHERE name = 'Imran Hossain'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Quantum Physics')),
((SELECT id FROM students WHERE name = 'Samira Rahman'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Literary Theory')),
((SELECT id FROM students WHERE name = 'Jahid Hassan'), 
 (SELECT id FROM research_keywords WHERE keyword = 'Medieval History'))
ON CONFLICT DO NOTHING;

/* 
-- Insert sample connection requests (using placeholder user IDs - you'll need to replace these with actual user IDs)
-- Commented out because these user IDs don't exist in the auth.users table
-- To use this, replace the UUIDs with actual user IDs from your auth.users table
INSERT INTO connection_requests (from_user_id, to_user_id, message, status) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'I am interested in your research on public health and would like to discuss potential collaboration.', 'pending'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'I would like to join your research group as a PhD student.', 'accepted'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'I am working on a similar research topic and would like to discuss potential collaboration.', 'rejected')
ON CONFLICT DO NOTHING;
*/ 