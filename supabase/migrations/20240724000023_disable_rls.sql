-- Temporarily disable RLS for all tables to ensure data access

-- Disable RLS for all tables
ALTER TABLE faculties DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE professors DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE publications DISABLE ROW LEVEL SECURITY;
ALTER TABLE publication_authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE research_keywords DISABLE ROW LEVEL SECURITY;
ALTER TABLE professor_research_keywords DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_research_keywords DISABLE ROW LEVEL SECURITY;

-- Note: This is a temporary solution for development purposes.
-- In a production environment, you should use proper RLS policies instead of disabling RLS. 