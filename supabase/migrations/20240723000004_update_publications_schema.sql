-- Add student_id to publications table to allow students to add publications
ALTER TABLE publications ADD COLUMN student_id UUID REFERENCES students(id);

-- Update the RLS policies for publications to allow students to manage their publications
DROP POLICY IF EXISTS "Users can insert publications to their profile" ON publications;
CREATE POLICY "Users can insert publications to their profile" 
ON publications FOR INSERT 
WITH CHECK (
  (professor_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM professors 
    WHERE professors.id = publications.professor_id 
    AND professors.user_id = auth.uid()
  )) OR
  (student_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = publications.student_id 
    AND students.user_id = auth.uid()
  ))
);

DROP POLICY IF EXISTS "Users can update their own publications" ON publications;
CREATE POLICY "Users can update their own publications" 
ON publications FOR UPDATE 
USING (
  (professor_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM professors 
    WHERE professors.id = publications.professor_id 
    AND professors.user_id = auth.uid()
  )) OR
  (student_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = publications.student_id 
    AND students.user_id = auth.uid()
  ))
);

-- Add faculty_id to students table
ALTER TABLE students ADD COLUMN faculty_id UUID REFERENCES faculties(id);

-- Update existing students with faculty_id based on their department
UPDATE students SET faculty_id = (
  SELECT faculties.id FROM faculties
  JOIN departments ON departments.faculty_id = faculties.id
  WHERE departments.name = students.department
  LIMIT 1
);

-- Enable realtime for updated tables
alter publication supabase_realtime add table publications;
