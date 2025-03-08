# Supabase Database Checker Scripts

This folder contains various scripts to help you check what's in your Supabase database. Each script serves the same purpose but is implemented for different environments.

## Files in this folder:

1. **check-supabase-direct.js** (RECOMMENDED)
   - **Type**: JavaScript (Node.js)
   - **Purpose**: A simplified script that directly checks for known tables in your database
   - **How to use**: Run with `node check-supabase-direct.js`
   - **Best for**: Quick and reliable database checks without any complex queries

2. **check-supabase.html**
   - **Type**: HTML + JavaScript
   - **Purpose**: A standalone web page that lets you enter your Supabase credentials and view your database structure and content
   - **How to use**: Open this file in any web browser, enter your Supabase URL and anon key, then click "Check Database"
   - **Best for**: Users who prefer a visual interface and don't want to install anything

3. **check-supabase-browser.js**
   - **Type**: JavaScript (Browser)
   - **Purpose**: A script to run in your browser's console when your application is already running
   - **How to use**: Copy and paste this script into your browser's developer console while your app is open
   - **Best for**: Developers who already have their application running and want a quick check

4. **check-supabase-node.js**
   - **Type**: JavaScript (Node.js)
   - **Purpose**: A command-line script to check your Supabase database
   - **How to use**: Run with `node check-supabase-node.js`
   - **Best for**: Developers comfortable with the command line who have Node.js installed

5. **check-supabase.js**
   - **Type**: JavaScript (ES Modules)
   - **Purpose**: A modern JavaScript module to check your Supabase database
   - **How to use**: Import and use in a JavaScript project that supports ES modules
   - **Best for**: Integration into modern JavaScript projects

6. **check-supabase.ts**
   - **Type**: TypeScript
   - **Purpose**: A TypeScript version of the database checker
   - **How to use**: Run with `npx ts-node check-supabase.ts` after setting environment variables or editing the file
   - **Best for**: TypeScript projects or developers who prefer type safety

## Your Supabase Database Contents

Based on our check, your Supabase database contains the following tables:

1. **faculties** - Faculty information (Faculty of Medical Sciences, Faculty of Law, etc.)
2. **departments** - Department information linked to faculties (Medicine, Pharmacy, Law, etc.)
3. **professors** - Professor information with research interests, bio, and verification status
4. **students** - Student information with research interests and bio
5. **publications** - Research publications with title, journal, year, and citation count
6. **research_keywords** - Keywords for research areas (Public Health, Epidemiology, etc.)
7. **professor_research_keywords** - Junction table linking professors to research keywords
8. **connection_requests** - Requests for connections between users (currently empty)
9. **publication_authors** - Junction table linking publications to professors and students

## Getting Started

For detailed instructions on how to use each script, please refer to the [README.md](./README.md) file in this folder.

## Security Note

Remember that while these scripts only read data (not modify it), you should still be careful with your Supabase credentials. Don't commit any files with your credentials hardcoded. 