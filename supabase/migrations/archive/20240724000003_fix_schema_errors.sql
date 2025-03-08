-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own connection requests" ON connection_requests;

-- Create policies with IF NOT EXISTS
CREATE POLICY IF NOT EXISTS "Users can view their own connection requests" ON connection_requests 
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Create research_keywords table if it doesn't exist
CREATE TABLE IF NOT EXISTS research_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS research_keywords_keyword_idx ON research_keywords(keyword);

-- Create professor_research_keywords table if it doesn't exist
CREATE TABLE IF NOT EXISTS professor_research_keywords (
  professor_id UUID NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
  research_keyword_id UUID NOT NULL REFERENCES research_keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (professor_id, research_keyword_id)
);

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE research_keywords;
ALTER PUBLICATION supabase_realtime ADD TABLE professor_research_keywords;
