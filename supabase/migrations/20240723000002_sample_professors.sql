-- Insert sample professors
INSERT INTO professors (name, department, research_interests, bio, google_scholar_id, is_verified, ranking_points)
VALUES
  ('Dr. Md. Rahman', 'Computer Science and Engineering', ARRAY['Machine Learning', 'Artificial Intelligence', 'Computer Vision'], 'Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences.', 'ABC123XYZ', TRUE, 320),
  ('Dr. Fatima Ahmed', 'Physics', ARRAY['Quantum Physics', 'Theoretical Physics', 'Particle Physics'], 'Specializing in quantum mechanics and particle physics with a focus on experimental validation of theoretical models.', 'DEF456UVW', TRUE, 280),
  ('Dr. Anisur Khan', 'Mathematics', ARRAY['Number Theory', 'Cryptography', 'Algebraic Geometry'], 'Researching number theory applications in modern cryptography. Recipient of multiple research grants and awards.', 'GHI789RST', TRUE, 210),
  ('Dr. Nusrat Jahan', 'Chemistry', ARRAY['Organic Chemistry', 'Medicinal Chemistry', 'Natural Products'], 'Working on the isolation and characterization of bioactive compounds from native Bangladeshi plants with potential pharmaceutical applications.', 'JKL012MNO', FALSE, 175),
  ('Dr. Kamal Hossain', 'Environmental Science', ARRAY['Climate Change', 'Environmental Pollution', 'Sustainable Development'], 'Focused on climate change impacts in Bangladesh, particularly in coastal regions and the Sundarbans mangrove forest.', 'PQR345STU', TRUE, 230),
  ('Dr. Tahmina Begum', 'Economics', ARRAY['Development Economics', 'Microfinance', 'Poverty Alleviation'], 'Researching economic development strategies for rural Bangladesh with a focus on microfinance initiatives and their impact on poverty reduction.', 'VWX678YZA', FALSE, 190),
  ('Dr. Imran Ali', 'Business Administration', ARRAY['Marketing Strategy', 'Consumer Behavior', 'Digital Marketing'], 'Investigating the evolution of consumer behavior in the digital age and its implications for marketing strategies in developing economies.', 'BCD901EFG', TRUE, 150),
  ('Dr. Sadia Rahman', 'English', ARRAY['Postcolonial Literature', 'South Asian Writing', 'Feminist Theory'], 'Exploring the intersection of postcolonial literature, gender, and identity in contemporary South Asian writing.', 'HIJ234KLM', FALSE, 120),
  ('Dr. Zahir Uddin', 'Sociology', ARRAY['Urban Sociology', 'Social Inequality', 'Migration Studies'], 'Studying patterns of rural-urban migration in Bangladesh and their socioeconomic impacts on urban centers.', 'NOP567QRS', TRUE, 165),
  ('Dr. Nasreen Akter', 'Public Health', ARRAY['Epidemiology', 'Maternal Health', 'Infectious Diseases'], 'Leading research on maternal and child health interventions in rural Bangladesh, with a focus on reducing mortality rates through community-based approaches.', 'TUV890WXY', TRUE, 240);

-- Insert sample publications for professors
INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Deep Learning Approaches for Bengali Natural Language Processing',
  ARRAY['Md. Rahman', 'S. Ahmed', 'K. Islam'],
  'IEEE Transactions on Pattern Analysis and Machine Intelligence',
  2022,
  45,
  'https://example.com/publication1'
FROM professors p WHERE p.name = 'Dr. Md. Rahman';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Computer Vision Applications in Agriculture: A Case Study from Bangladesh',
  ARRAY['Md. Rahman', 'F. Hossain'],
  'Journal of Computer Vision Research',
  2021,
  32,
  'https://example.com/publication2'
FROM professors p WHERE p.name = 'Dr. Md. Rahman';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Quantum Entanglement in Multi-Particle Systems',
  ARRAY['Fatima Ahmed', 'R. Bohr', 'S. Hawking'],
  'Physical Review Letters',
  2020,
  78,
  'https://example.com/publication3'
FROM professors p WHERE p.name = 'Dr. Fatima Ahmed';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Novel Approaches to Prime Number Distribution',
  ARRAY['Anisur Khan', 'P. Erdos'],
  'Journal of Number Theory',
  2019,
  56,
  'https://example.com/publication4'
FROM professors p WHERE p.name = 'Dr. Anisur Khan';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Bioactive Compounds from Medicinal Plants of Bangladesh',
  ARRAY['Nusrat Jahan', 'M. Islam', 'S. Rahman'],
  'Journal of Natural Products',
  2021,
  28,
  'https://example.com/publication5'
FROM professors p WHERE p.name = 'Dr. Nusrat Jahan';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Climate Change Impacts on the Sundarbans Ecosystem',
  ARRAY['Kamal Hossain', 'A. Rahman'],
  'Environmental Science & Technology',
  2020,
  65,
  'https://example.com/publication6'
FROM professors p WHERE p.name = 'Dr. Kamal Hossain';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Microfinance and Women Empowerment in Rural Bangladesh',
  ARRAY['Tahmina Begum', 'S. Yunus'],
  'Journal of Development Economics',
  2018,
  82,
  'https://example.com/publication7'
FROM professors p WHERE p.name = 'Dr. Tahmina Begum';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Digital Marketing Strategies for SMEs in Developing Economies',
  ARRAY['Imran Ali', 'K. Kotler'],
  'Journal of Marketing Research',
  2022,
  24,
  'https://example.com/publication8'
FROM professors p WHERE p.name = 'Dr. Imran Ali';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Postcolonial Identities in Contemporary Bangladeshi Literature',
  ARRAY['Sadia Rahman', 'E. Said'],
  'Journal of Commonwealth Literature',
  2019,
  36,
  'https://example.com/publication9'
FROM professors p WHERE p.name = 'Dr. Sadia Rahman';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Rural-Urban Migration Patterns in Bangladesh',
  ARRAY['Zahir Uddin', 'M. Castells'],
  'Urban Studies',
  2020,
  42,
  'https://example.com/publication10'
FROM professors p WHERE p.name = 'Dr. Zahir Uddin';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Community-Based Interventions for Maternal Health in Rural Bangladesh',
  ARRAY['Nasreen Akter', 'W. Fawzi', 'M. Chan'],
  'The Lancet Global Health',
  2021,
  58,
  'https://example.com/publication11'
FROM professors p WHERE p.name = 'Dr. Nasreen Akter';

-- Add a second publication for each professor
INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Transformer Models for Low-Resource Languages: Application to Bengali',
  ARRAY['Md. Rahman', 'A. Vaswani', 'T. Khan'],
  'Proceedings of ACL',
  2023,
  18,
  'https://example.com/publication12'
FROM professors p WHERE p.name = 'Dr. Md. Rahman';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Experimental Verification of Quantum Tunneling in Mesoscopic Systems',
  ARRAY['Fatima Ahmed', 'N. Bohr'],
  'Nature Physics',
  2022,
  25,
  'https://example.com/publication13'
FROM professors p WHERE p.name = 'Dr. Fatima Ahmed';

INSERT INTO publications (professor_id, title, authors, journal, year, citation_count, url)
SELECT 
  p.id,
  'Elliptic Curve Cryptography: New Approaches for Secure Communication',
  ARRAY['Anisur Khan', 'R. Rivest'],
  'Journal of Cryptology',
  2021,
  30,
  'https://example.com/publication14'
FROM professors p WHERE p.name = 'Dr. Anisur Khan';

-- Run the update_professor_rankings function to calculate ranking points based on publications
-- This would typically be done via the edge function, but we're setting initial values here