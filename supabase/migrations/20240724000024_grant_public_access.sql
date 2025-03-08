-- Grant public access to all tables
-- This is a more direct approach than using RLS policies

-- Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant all privileges on all tables in the public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Disable RLS for all tables
ALTER TABLE IF EXISTS faculties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS professors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS publications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS publication_authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS connection_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS research_keywords DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS professor_research_keywords DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_research_keywords DISABLE ROW LEVEL SECURITY;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO anon, authenticated, service_role; 