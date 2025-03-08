-- Simple RLS setup for JU Research Portal
-- This file sets up basic Row Level Security policies that allow read access to all tables

-- First, drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "Anyone can read ' || r.tablename || '" ON ' || r.tablename;
        EXECUTE 'DROP POLICY IF EXISTS "Public read access for ' || r.tablename || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- Enable RLS for all tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE ' || r.tablename || ' ENABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;

-- Create read-only policies for all tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'CREATE POLICY "Anyone can read ' || r.tablename || '" ON ' || r.tablename || ' FOR SELECT USING (true)';
    END LOOP;
END $$;

-- Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant select privileges on all tables in the public schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated, service_role; 