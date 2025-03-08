# Supabase Configuration for JU Research Portal

This directory contains the Supabase configuration for the JU Research Portal, including database migrations, Edge Functions, and authentication setup.

## Database Migrations

The `migrations` directory contains SQL files that define the database schema and functions. These migrations should be applied in order to set up the database correctly.

### Applying Migrations

To apply the migrations, you can use the Supabase Dashboard:

1. Log in to your Supabase project at https://app.supabase.com
2. Navigate to the SQL Editor
3. Copy and paste the contents of each migration file in order
4. Run the SQL to create the tables, functions, and sample data

Alternatively, if you have the Supabase CLI installed, you can run:

```bash
supabase db push
```

### Important Migrations

- `20240724000021_consolidated_schema.sql`: Contains all the essential schema and functions needed for the application
- `20240724000020_insert_dummy_data.sql`: Inserts comprehensive dummy data for testing
- `20240724000018_create_student_research_keywords.sql`: Creates the student_research_keywords table and related functions
- `20240724000019_create_matching_functions.sql`: Creates functions for matching professors and students based on research interests

### Quick Setup

For a quick setup of your database, you can use the consolidated migration files:

1. First, apply the consolidated schema:
   ```sql
   -- Run in SQL Editor
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   
   -- Then run the consolidated schema file
   -- Copy and paste the contents of 20240724000021_consolidated_schema.sql
   ```

2. Then, insert the dummy data:
   ```sql
   -- Run in SQL Editor
   -- Copy and paste the contents of 20240724000020_insert_dummy_data.sql
   ```

This will give you a clean database with all the necessary tables, functions, and sample data for testing.

## Edge Functions

The `functions` directory contains Edge Functions that provide serverless functionality for the application.

### Deploying Edge Functions

To deploy the Edge Functions, you can use the Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Deploy all functions
supabase functions deploy

# Or deploy a specific function
supabase functions deploy add_student_keywords
supabase functions deploy remove_student_keyword
```

Alternatively, you can deploy the functions manually through the Supabase Dashboard:

1. Log in to your Supabase project at https://app.supabase.com
2. Navigate to Edge Functions
3. Click "Create a new function"
4. Enter the function name (e.g., "add_student_keywords")
5. Copy and paste the contents of the function file (e.g., `functions/add_student_keywords/index.ts`)
6. Click "Create function"

### Important Edge Functions

- `add_student_keywords`: Adds research keywords to a student profile
- `remove_student_keyword`: Removes a research keyword from a student profile
- `add_professor_keywords`: Adds research keywords to a professor profile
- `update_student_badges`: Updates student badges based on their activity

## Authentication

The `auth.tsx` file contains the authentication context for the application, which provides user authentication functionality using Supabase Auth.

## Testing

To test if the SQL functions are working correctly, you can run the check-functions.js script:

```bash
# First, make sure you have the required dependencies installed
npm install dotenv @supabase/supabase-js

# Run the script
node tools/check-functions.js
```

This script will test the following functions:
- `get_matching_professors_for_student`
- `get_matching_students_for_professor`
- `get_professor_keywords`

## Troubleshooting

If you encounter any issues with the Supabase setup, check the following:

1. Make sure your `.env` file contains the correct Supabase URL and anon key
2. Verify that all migrations have been applied successfully
3. Check that the Edge Functions have been deployed correctly
4. Look for any error messages in the browser console or server logs

You can use the check-env.js script to verify your environment variables:

```bash
# First, make sure you have the required dependencies installed
npm install dotenv

# Run the script
node tools/check-env.js
```

### Common Issues

#### "supabaseUrl is required" Error

If you see this error in your browser console, it means that the Supabase URL is not being properly loaded. Check the following:

1. Make sure your `.env` file contains the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values
2. If running in Docker, make sure the environment variables are being passed to the container
3. Rebuild the application after making changes to environment variables:
   ```bash
   npm run build
   # or if using Docker
   ./docker-run.sh build
   ```
4. You can also test the Supabase connection directly in your browser by opening:
   ```
   http://localhost:3000/check-supabase.html
   ``` 