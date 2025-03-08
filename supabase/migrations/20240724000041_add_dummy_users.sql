-- Add dummy users for each role

-- Create dummy users in auth.users if they don't exist
DO $$
DECLARE
  admin_user_id UUID;
  professor_user_id UUID;
  student_user_id UUID;
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1;
  
  -- Create admin user if not exists
  IF admin_user_id IS NULL THEN
    INSERT INTO auth.users (email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      'admin@example.com',
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}',
      NOW(),
      NOW()
    )
    RETURNING id INTO admin_user_id;
  END IF;
  
  -- Check if professor user exists
  SELECT id INTO professor_user_id FROM auth.users WHERE email = 'professor@example.com' LIMIT 1;
  
  -- Create professor user if not exists
  IF professor_user_id IS NULL THEN
    INSERT INTO auth.users (email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      'professor@example.com',
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Professor User"}',
      NOW(),
      NOW()
    )
    RETURNING id INTO professor_user_id;
  END IF;
  
  -- Check if student user exists
  SELECT id INTO student_user_id FROM auth.users WHERE email = 'student@example.com' LIMIT 1;
  
  -- Create student user if not exists
  IF student_user_id IS NULL THEN
    INSERT INTO auth.users (email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      'student@example.com',
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Student User"}',
      NOW(),
      NOW()
    )
    RETURNING id INTO student_user_id;
  END IF;
  
  -- Add admin user to admin_users table if not exists
  INSERT INTO admin_users (user_id, email)
  VALUES (admin_user_id, 'admin@example.com')
  ON CONFLICT (email) DO UPDATE SET user_id = admin_user_id;
  
  -- Add professor user to professors table if not exists
  INSERT INTO professors (user_id, name, department_id, research_interests, is_verified, ranking_points, seeking_students)
  SELECT 
    professor_user_id, 
    'Professor Example', 
    (SELECT id FROM departments ORDER BY RANDOM() LIMIT 1), 
    ARRAY['Machine Learning', 'Artificial Intelligence', 'Data Science'], 
    TRUE, 
    100, 
    TRUE
  WHERE NOT EXISTS (SELECT 1 FROM professors WHERE user_id = professor_user_id);
  
  -- Add student user to students table if not exists
  INSERT INTO students (user_id, name, department_id, research_interests)
  SELECT 
    student_user_id, 
    'Student Example', 
    (SELECT id FROM departments ORDER BY RANDOM() LIMIT 1), 
    ARRAY['Machine Learning', 'Computer Vision', 'Natural Language Processing']
  WHERE NOT EXISTS (SELECT 1 FROM students WHERE user_id = student_user_id);
  
END;
$$;