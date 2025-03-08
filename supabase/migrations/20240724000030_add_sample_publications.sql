-- Add sample publications for students
INSERT INTO publications (id, title, authors, journal_name, publication_year, citation_count, url, publication_type)
VALUES 
  ('d1a2b3c4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Novel Vaccine Candidates for Tropical Diseases', ARRAY['Fariha Islam', 'Dr. Sadia Rahman'], 'Journal of Immunology Research', 2023, 12, 'https://example.com/vaccine-research', 'Research Article'),
  ('e2b3c4d5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Immunological Response to Dengue Virus Variants', ARRAY['Fariha Islam', 'Dr. Imran Hossain', 'Dr. Sadia Rahman'], 'Tropical Medicine Journal', 2022, 8, 'https://example.com/dengue-research', 'Research Article'),
  ('f3c4d5e6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Cybersecurity Vulnerabilities in IoT Medical Devices', ARRAY['Tahmid Khan', 'Dr. Nazia Begum'], 'Journal of Medical Cybersecurity', 2023, 5, 'https://example.com/iot-security', 'Conference Paper'),
  ('a4b5c6d7-e8f9-7d0e-1f2a-3b4c5d6e7f8a', 'Refugee Rights in South Asian Context', ARRAY['Arif Rahman', 'Dr. Imran Hossain'], 'International Journal of Human Rights', 2022, 3, 'https://example.com/refugee-rights', 'Journal Article')
ON CONFLICT (id) DO NOTHING;

-- Link publications to students through publication_authors table
INSERT INTO publication_authors (publication_id, student_id, professor_id, author_order)
VALUES
  ('d1a2b3c4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '2a7a2992-03eb-4869-aa08-148af4199d69', '38f34f49-8c3c-4772-b3b7-729835201479', 1),
  ('e2b3c4d5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', '2a7a2992-03eb-4869-aa08-148af4199d69', '38f34f49-8c3c-4772-b3b7-729835201479', 1),
  ('e2b3c4d5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', '2a7a2992-03eb-4869-aa08-148af4199d69', '505c283a-1bd5-4951-aad8-60218fa975d7', 2),
  ('f3c4d5e6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', '55765d78-dd20-45dc-8654-7c28f75d57ce', '417a9609-1bf7-427a-a40d-f73b3fcc9158', 1),
  ('a4b5c6d7-e8f9-7d0e-1f2a-3b4c5d6e7f8a', '327c6db6-f1ea-4f43-8d29-4abc4a99ddcd', '505c283a-1bd5-4951-aad8-60218fa975d7', 1)
ON CONFLICT DO NOTHING;