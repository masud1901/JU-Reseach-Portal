-- Fix the infinite recursion in admin_users policy
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;

-- Create a simpler policy that doesn't cause recursion
CREATE POLICY "Public read access for admin_users"
ON admin_users
FOR SELECT
USING (true);

-- Create a policy for insert/update/delete that only allows admins
CREATE POLICY "Only admins can modify admin_users"
ON admin_users
FOR ALL
USING (auth.email() IN (SELECT email FROM admin_users));

-- Create a function to simplify research interests management
CREATE OR REPLACE FUNCTION get_research_keywords()
RETURNS TABLE (id uuid, keyword text) AS $$
BEGIN
  RETURN QUERY SELECT research_keywords.id, research_keywords.keyword FROM research_keywords ORDER BY keyword;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get a professor's research keywords
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

-- Create a function to add a research keyword to a professor
CREATE OR REPLACE FUNCTION add_professor_keyword(p_id uuid, keyword_text text)
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
  INSERT INTO professor_research_keywords (professor_id, research_keyword_id)
  VALUES (p_id, keyword_id)
  ON CONFLICT DO NOTHING;
 END;
$$ LANGUAGE plpgsql;