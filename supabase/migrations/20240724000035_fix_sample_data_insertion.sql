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

-- Insert sample professors one by one to avoid conflicts
DO $$
DECLARE
    dept_id uuid;
BEGIN
    -- Dr. Sadia Rahman
    SELECT id INTO dept_id FROM departments WHERE name = 'Medicine' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Sadia Rahman', dept_id, 'Professor of Medicine specializing in infectious diseases with over 15 years of research experience.', TRUE, TRUE, ARRAY['Public Health', 'Epidemiology'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Kamal Hossain
    SELECT id INTO dept_id FROM departments WHERE name = 'Pharmacy' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Kamal Hossain', dept_id, 'Associate Professor of Pharmacy with expertise in drug discovery and development.', TRUE, FALSE, ARRAY['Pharmaceutical Research', 'Drug Development'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Nasreen Akter
    SELECT id INTO dept_id FROM departments WHERE name = 'Law' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Nasreen Akter', dept_id, 'Professor of Law specializing in constitutional law and human rights.', TRUE, TRUE, ARRAY['Constitutional Law', 'Human Rights'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Anisur Khan
    SELECT id INTO dept_id FROM departments WHERE name = 'Management' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Anisur Khan', dept_id, 'Professor of Management with research focus on organizational behavior.', FALSE, TRUE, ARRAY['Marketing Strategy'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Fatima Ahmed
    SELECT id INTO dept_id FROM departments WHERE name = 'Finance' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Fatima Ahmed', dept_id, 'Associate Professor of Finance specializing in corporate finance and investment.', TRUE, FALSE, ARRAY['Corporate Finance'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Md. Rahman
    SELECT id INTO dept_id FROM departments WHERE name = 'Computer Science' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Md. Rahman', dept_id, 'Professor of Computer Science with expertise in artificial intelligence and machine learning.', TRUE, TRUE, ARRAY['Artificial Intelligence', 'Machine Learning'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Tahmid Islam
    SELECT id INTO dept_id FROM departments WHERE name = 'Physics' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Tahmid Islam', dept_id, 'Professor of Physics specializing in quantum mechanics and theoretical physics.', TRUE, TRUE, ARRAY['Quantum Physics'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Nusrat Jahan
    SELECT id INTO dept_id FROM departments WHERE name = 'English' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Nusrat Jahan', dept_id, 'Professor of English Literature with focus on postcolonial literature.', FALSE, FALSE, ARRAY['Literary Theory'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Dr. Rafiq Uddin
    SELECT id INTO dept_id FROM departments WHERE name = 'History' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO professors (name, department_id, bio, is_verified, seeking_students, research_interests)
        VALUES ('Dr. Rafiq Uddin', dept_id, 'Professor of History specializing in medieval South Asian history.', TRUE, TRUE, ARRAY['Medieval History'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
END$$;

-- Insert sample students one by one to avoid conflicts
DO $$
DECLARE
    dept_id uuid;
BEGIN
    -- Tahmid Khan
    SELECT id INTO dept_id FROM departments WHERE name = 'Medicine' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Tahmid Khan', dept_id, 'Medical student interested in infectious disease research and public health.', ARRAY['Public Health', 'Epidemiology'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Nadia Islam
    SELECT id INTO dept_id FROM departments WHERE name = 'Pharmacy' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Nadia Islam', dept_id, 'Pharmacy student focusing on drug development and clinical trials.', ARRAY['Pharmaceutical Research', 'Drug Development'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Rahim Ahmed
    SELECT id INTO dept_id FROM departments WHERE name = 'Law' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Rahim Ahmed', dept_id, 'Law student with interest in human rights and constitutional law.', ARRAY['Constitutional Law', 'Human Rights'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Sabina Akter
    SELECT id INTO dept_id FROM departments WHERE name = 'Management' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Sabina Akter', dept_id, 'Management student researching organizational behavior and leadership.', ARRAY['Marketing Strategy'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Karim Uddin
    SELECT id INTO dept_id FROM departments WHERE name = 'Finance' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Karim Uddin', dept_id, 'Finance student interested in corporate finance and investment analysis.', ARRAY['Corporate Finance'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Farida Begum
    SELECT id INTO dept_id FROM departments WHERE name = 'Computer Science' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Farida Begum', dept_id, 'Computer Science student focusing on artificial intelligence and machine learning.', ARRAY['Artificial Intelligence', 'Machine Learning'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Imran Hossain
    SELECT id INTO dept_id FROM departments WHERE name = 'Physics' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Imran Hossain', dept_id, 'Physics student researching quantum mechanics and theoretical physics.', ARRAY['Quantum Physics'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Samira Rahman
    SELECT id INTO dept_id FROM departments WHERE name = 'English' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Samira Rahman', dept_id, 'English Literature student with interest in postcolonial literature.', ARRAY['Literary Theory'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
    
    -- Jahid Hassan
    SELECT id INTO dept_id FROM departments WHERE name = 'History' LIMIT 1;
    IF dept_id IS NOT NULL THEN
        INSERT INTO students (name, department_id, bio, research_interests)
        VALUES ('Jahid Hassan', dept_id, 'History student focusing on medieval South Asian history.', ARRAY['Medieval History'])
        ON CONFLICT (name) DO NOTHING;
    END IF;
END$$;

-- Insert sample publications one by one
DO $$
DECLARE
    pub_id uuid;
    prof_id uuid;
    student_id uuid;
BEGIN
    -- Publication 1
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Emerging Infectious Diseases in Bangladesh: A Public Health Perspective', 'Journal of Public Health', 2023, 25, 'https://example.com/pub1', 'Research Article', ARRAY['Dr. Sadia Rahman', 'Tahmid Khan'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Sadia Rahman' LIMIT 1;
        SELECT id INTO student_id FROM students WHERE name = 'Tahmid Khan' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
        
        IF student_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, student_id, author_order)
            VALUES (pub_id, student_id, 2)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 2
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Novel Drug Delivery Systems for Tropical Diseases', 'Journal of Pharmaceutical Research', 2022, 18, 'https://example.com/pub2', 'Research Article', ARRAY['Dr. Kamal Hossain', 'Nadia Islam'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Kamal Hossain' LIMIT 1;
        SELECT id INTO student_id FROM students WHERE name = 'Nadia Islam' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
        
        IF student_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, student_id, author_order)
            VALUES (pub_id, student_id, 2)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 3
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Constitutional Reforms in South Asia: A Comparative Study', 'Journal of Constitutional Law', 2023, 15, 'https://example.com/pub3', 'Research Article', ARRAY['Dr. Nasreen Akter', 'Rahim Ahmed'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Nasreen Akter' LIMIT 1;
        SELECT id INTO student_id FROM students WHERE name = 'Rahim Ahmed' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
        
        IF student_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, student_id, author_order)
            VALUES (pub_id, student_id, 2)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 4
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Leadership Styles in Bangladeshi Organizations', 'Journal of Management Studies', 2022, 12, 'https://example.com/pub4', 'Research Article', ARRAY['Dr. Anisur Khan'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Anisur Khan' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 5
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Corporate Finance Practices in Emerging Markets', 'Journal of Finance', 2023, 20, 'https://example.com/pub5', 'Research Article', ARRAY['Dr. Fatima Ahmed'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Fatima Ahmed' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 6
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Machine Learning Applications in Natural Language Processing', 'Journal of Artificial Intelligence', 2022, 30, 'https://example.com/pub6', 'Research Article', ARRAY['Dr. Md. Rahman', 'Farida Begum'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Md. Rahman' LIMIT 1;
        SELECT id INTO student_id FROM students WHERE name = 'Farida Begum' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
        
        IF student_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, student_id, author_order)
            VALUES (pub_id, student_id, 2)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 7
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Quantum Entanglement: Theory and Applications', 'Journal of Physics', 2023, 22, 'https://example.com/pub7', 'Research Article', ARRAY['Dr. Tahmid Islam', 'Imran Hossain'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Tahmid Islam' LIMIT 1;
        SELECT id INTO student_id FROM students WHERE name = 'Imran Hossain' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
        
        IF student_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, student_id, author_order)
            VALUES (pub_id, student_id, 2)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 8
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Postcolonial Literature in South Asia', 'Journal of Literary Studies', 2022, 14, 'https://example.com/pub8', 'Research Article', ARRAY['Dr. Nusrat Jahan'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Nusrat Jahan' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    -- Publication 9
    INSERT INTO publications (title, journal_name, publication_year, citation_count, url, publication_type, authors)
    VALUES ('Medieval Trade Routes in South Asia', 'Journal of Historical Research', 2023, 16, 'https://example.com/pub9', 'Research Article', ARRAY['Dr. Rafiq Uddin', 'Jahid Hassan'])
    ON CONFLICT DO NOTHING
    RETURNING id INTO pub_id;
    
    IF pub_id IS NOT NULL THEN
        SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Rafiq Uddin' LIMIT 1;
        SELECT id INTO student_id FROM students WHERE name = 'Jahid Hassan' LIMIT 1;
        
        IF prof_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, professor_id, author_order)
            VALUES (pub_id, prof_id, 1)
            ON CONFLICT DO NOTHING;
        END IF;
        
        IF student_id IS NOT NULL THEN
            INSERT INTO publication_authors (publication_id, student_id, author_order)
            VALUES (pub_id, student_id, 2)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END$$;

-- Link professors to research keywords
DO $$
DECLARE
    prof_id uuid;
    keyword_id uuid;
BEGIN
    -- Dr. Sadia Rahman - Public Health
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Sadia Rahman' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Public Health' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Sadia Rahman - Epidemiology
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Sadia Rahman' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Epidemiology' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Kamal Hossain - Pharmaceutical Research
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Kamal Hossain' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Pharmaceutical Research' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Kamal Hossain - Drug Development
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Kamal Hossain' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Drug Development' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Nasreen Akter - Constitutional Law
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Nasreen Akter' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Constitutional Law' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Nasreen Akter - Human Rights
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Nasreen Akter' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Human Rights' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Anisur Khan - Marketing Strategy
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Anisur Khan' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Marketing Strategy' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Fatima Ahmed - Corporate Finance
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Fatima Ahmed' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Corporate Finance' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Md. Rahman - Artificial Intelligence
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Md. Rahman' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Artificial Intelligence' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Md. Rahman - Machine Learning
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Md. Rahman' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Machine Learning' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Tahmid Islam - Quantum Physics
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Tahmid Islam' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Quantum Physics' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Nusrat Jahan - Literary Theory
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Nusrat Jahan' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Literary Theory' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Dr. Rafiq Uddin - Medieval History
    SELECT id INTO prof_id FROM professors WHERE name = 'Dr. Rafiq Uddin' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Medieval History' LIMIT 1;
    IF prof_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
        VALUES (prof_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
END$$;

-- Link students to research keywords
DO $$
DECLARE
    student_id uuid;
    keyword_id uuid;
BEGIN
    -- Tahmid Khan - Public Health
    SELECT id INTO student_id FROM students WHERE name = 'Tahmid Khan' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Public Health' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Tahmid Khan - Epidemiology
    SELECT id INTO student_id FROM students WHERE name = 'Tahmid Khan' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Epidemiology' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Nadia Islam - Pharmaceutical Research
    SELECT id INTO student_id FROM students WHERE name = 'Nadia Islam' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Pharmaceutical Research' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Nadia Islam - Drug Development
    SELECT id INTO student_id FROM students WHERE name = 'Nadia Islam' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Drug Development' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Rahim Ahmed - Constitutional Law
    SELECT id INTO student_id FROM students WHERE name = 'Rahim Ahmed' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Constitutional Law' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Rahim Ahmed - Human Rights
    SELECT id INTO student_id FROM students WHERE name = 'Rahim Ahmed' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Human Rights' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Sabina Akter - Marketing Strategy
    SELECT id INTO student_id FROM students WHERE name = 'Sabina Akter' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Marketing Strategy' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Karim Uddin - Corporate Finance
    SELECT id INTO student_id FROM students WHERE name = 'Karim Uddin' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Corporate Finance' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Farida Begum - Artificial Intelligence
    SELECT id INTO student_id FROM students WHERE name = 'Farida Begum' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Artificial Intelligence' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Farida Begum - Machine Learning
    SELECT id INTO student_id FROM students WHERE name = 'Farida Begum' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Machine Learning' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Imran Hossain - Quantum Physics
    SELECT id INTO student_id FROM students WHERE name = 'Imran Hossain' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Quantum Physics' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Samira Rahman - Literary Theory
    SELECT id INTO student_id FROM students WHERE name = 'Samira Rahman' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Literary Theory' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Jahid Hassan - Medieval History
    SELECT id INTO student_id FROM students WHERE name = 'Jahid Hassan' LIMIT 1;
    SELECT id INTO keyword_id FROM research_keywords WHERE keyword = 'Medieval History' LIMIT 1;
    IF student_id IS NOT NULL AND keyword_id IS NOT NULL THEN
        INSERT INTO student_research_keywords (student_id, research_keyword_id)
        VALUES (student_id, keyword_id)
        ON CONFLICT DO NOTHING;
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