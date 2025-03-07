-- Create research_keywords table
CREATE TABLE IF NOT EXISTS research_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS research_keywords_keyword_idx ON research_keywords(keyword);

-- Create professor_research_keywords table
CREATE TABLE IF NOT EXISTS professor_research_keywords (
  professor_id UUID NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
  research_keyword_id UUID NOT NULL REFERENCES research_keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (professor_id, research_keyword_id)
);

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE research_keywords;
ALTER PUBLICATION supabase_realtime ADD TABLE professor_research_keywords;
