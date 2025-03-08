-- Create a function to get matching professors for a student based on research interests
CREATE OR REPLACE FUNCTION get_matching_professors_for_student(student_id uuid)
RETURNS TABLE (
  professor_id uuid,
  professor_name text,
  department_id uuid,
  department_name text,
  match_count bigint,
  is_verified boolean,
  seeking_students boolean
) AS $$
BEGIN
  RETURN QUERY 
  WITH student_keywords AS (
    SELECT research_keyword_id
    FROM student_research_keywords
    WHERE student_id = $1
  ),
  professor_matches AS (
    SELECT 
      p.id AS professor_id,
      p.name AS professor_name,
      p.department_id,
      d.name AS department_name,
      COUNT(prk.research_keyword_id) AS match_count,
      p.is_verified,
      p.seeking_students
    FROM professors p
    JOIN professor_research_keywords prk ON p.id = prk.professor_id
    JOIN departments d ON p.department_id = d.id
    WHERE prk.research_keyword_id IN (SELECT research_keyword_id FROM student_keywords)
    GROUP BY p.id, p.name, p.department_id, d.name, p.is_verified, p.seeking_students
    ORDER BY match_count DESC
  )
  SELECT * FROM professor_matches;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get matching students for a professor based on research interests
CREATE OR REPLACE FUNCTION get_matching_students_for_professor(professor_id uuid)
RETURNS TABLE (
  student_id uuid,
  student_name text,
  department_id uuid,
  department_name text,
  match_count bigint
) AS $$
BEGIN
  RETURN QUERY 
  WITH professor_keywords AS (
    SELECT research_keyword_id
    FROM professor_research_keywords
    WHERE professor_id = $1
  ),
  student_matches AS (
    SELECT 
      s.id AS student_id,
      s.name AS student_name,
      s.department_id,
      d.name AS department_name,
      COUNT(srk.research_keyword_id) AS match_count
    FROM students s
    JOIN student_research_keywords srk ON s.id = srk.student_id
    JOIN departments d ON s.department_id = d.id
    WHERE srk.research_keyword_id IN (SELECT research_keyword_id FROM professor_keywords)
    GROUP BY s.id, s.name, s.department_id, d.name
    ORDER BY match_count DESC
  )
  SELECT * FROM student_matches;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get research keywords for a professor
CREATE OR REPLACE FUNCTION get_professor_keywords(professor_id uuid)
RETURNS TABLE (keyword_id uuid, keyword text) AS $$
BEGIN
  RETURN QUERY 
  SELECT rk.id, rk.keyword 
  FROM research_keywords rk
  JOIN professor_research_keywords prk ON rk.id = prk.research_keyword_id
  WHERE prk.professor_id = $1
  ORDER BY rk.keyword;
END;
$$ LANGUAGE plpgsql;

-- Create a function to remove a research keyword from a student
CREATE OR REPLACE FUNCTION remove_student_keyword(s_id uuid, keyword_id uuid)
RETURNS void AS $$
BEGIN
  DELETE FROM student_research_keywords
  WHERE student_id = s_id AND research_keyword_id = keyword_id;
END;
$$ LANGUAGE plpgsql; 