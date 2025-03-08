-- Remove the problematic connection requests with non-existent user IDs
DELETE FROM connection_requests WHERE from_user_id = '00000000-0000-0000-0000-000000000001' OR to_user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM connection_requests WHERE from_user_id = '00000000-0000-0000-0000-000000000002' OR to_user_id = '00000000-0000-0000-0000-000000000002';
DELETE FROM connection_requests WHERE from_user_id = '00000000-0000-0000-0000-000000000003' OR to_user_id = '00000000-0000-0000-0000-000000000003';
DELETE FROM connection_requests WHERE from_user_id = '00000000-0000-0000-0000-000000000004' OR to_user_id = '00000000-0000-0000-0000-000000000004';
DELETE FROM connection_requests WHERE from_user_id = '00000000-0000-0000-0000-000000000005' OR to_user_id = '00000000-0000-0000-0000-000000000005';

-- Create sample connection requests using professor IDs instead of user IDs
INSERT INTO connection_requests (from_user_id, to_user_id, message, status)
SELECT 
  p1.user_id, 
  p2.user_id, 
  'I am interested in your research on machine learning and would like to discuss potential collaboration.',
  'pending'
FROM professors p1, professors p2
WHERE p1.name = 'Dr. Md. Rahman' AND p2.name = 'Dr. Fatima Ahmed'
AND p1.user_id IS NOT NULL AND p2.user_id IS NOT NULL
LIMIT 1;

INSERT INTO connection_requests (from_user_id, to_user_id, message, status)
SELECT 
  p1.user_id, 
  p2.user_id, 
  'I would like to join your research group as a PhD student.',
  'accepted'
FROM professors p1, professors p2
WHERE p1.name = 'Dr. Anisur Khan' AND p2.name = 'Dr. Nasreen Akter'
AND p1.user_id IS NOT NULL AND p2.user_id IS NOT NULL
LIMIT 1;