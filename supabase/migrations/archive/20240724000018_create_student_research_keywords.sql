-- Create student_research_keywords junction table
CREATE TABLE IF NOT EXISTS student_research_keywords (
    student_id UUID REFERENCES students(id),
    research_keyword_id UUID REFERENCES research_keywords(id),
    PRIMARY KEY (student_id, research_keyword_id)
);

-- Enable RLS
ALTER TABLE student_research_keywords ENABLE ROW LEVEL SECURITY;

-- Create public read policy
DROP POLICY IF EXISTS "Public read access for student_research_keywords" ON student_research_keywords;
CREATE POLICY "Public read access for student_research_keywords" ON student_research_keywords FOR SELECT USING (true);

-- Create a function to get a student's research keywords
CREATE OR REPLACE FUNCTION get_student_keywords(student_id uuid)
RETURNS TABLE (keyword_id uuid, keyword text) AS $$
BEGIN
  RETURN QUERY 
  SELECT rk.id, rk.keyword 
  FROM research_keywords rk
  JOIN student_research_keywords srk ON rk.id = srk.research_keyword_id
  WHERE srk.student_id = $1
  ORDER BY rk.keyword;
END;
$$ LANGUAGE plpgsql;

-- Create a function to add a research keyword to a student
CREATE OR REPLACE FUNCTION add_student_keyword(s_id uuid, keyword_text text)
RETURNS void AS $$
DECLARE
  keyword_id uuid;
BEGIN
  -- First, check if the keyword exists, if not create it
  SELECT id INTO keyword_id FROM research_keywords WHERE keyword = keyword_text;
  
  IF keyword_id IS NULL THEN
    INSERT INTO research_keywords (keyword) VALUES (keyword_text) RETURNING id INTO keyword_id;
  END IF;
  
  -- Then add the relationship if it doesn't exist
  INSERT INTO student_research_keywords (student_id, research_keyword_id)
  VALUES (s_id, keyword_id)
  ON CONFLICT DO NOTHING;
 END;
$$ LANGUAGE plpgsql;

-- Enable realtime for the new table
ALTER PUBLICATION supabase_realtime ADD TABLE student_research_keywords;