# Supabase Database Checker Scripts

This folder contains various scripts to help you check what's in your Supabase database. Each script serves the same purpose but is implemented for different environments.

## Files in this folder:

1. **check-supabase.html**
   - **Type**: HTML + JavaScript
   - **Purpose**: A standalone web page that lets you enter your Supabase credentials and view your database structure and content
   - **How to use**: Open this file in any web browser, enter your Supabase URL and anon key, then click "Check Database"
   - **Best for**: Users who prefer a visual interface and don't want to install anything

2. **check-supabase-browser.js**
   - **Type**: JavaScript (Browser)
   - **Purpose**: A script to run in your browser's console when your application is already running
   - **How to use**: Copy and paste this script into your browser's developer console while your app is open
   - **Best for**: Developers who already have their application running and want a quick check

3. **check-supabase-node.js**
   - **Type**: JavaScript (Node.js)
   - **Purpose**: A command-line script to check your Supabase database
   - **How to use**: Run with `node check-supabase-node.js YOUR_SUPABASE_URL YOUR_SUPABASE_ANON_KEY`
   - **Best for**: Developers comfortable with the command line who have Node.js installed

4. **check-supabase.js**
   - **Type**: JavaScript (ES Modules)
   - **Purpose**: A modern JavaScript module to check your Supabase database
   - **How to use**: Import and use in a JavaScript project that supports ES modules
   - **Best for**: Integration into modern JavaScript projects

5. **check-supabase.ts**
   - **Type**: TypeScript
   - **Purpose**: A TypeScript version of the database checker
   - **How to use**: Run with `npx ts-node check-supabase.ts` after setting environment variables or editing the file
   - **Best for**: TypeScript projects or developers who prefer type safety

## Getting Started

For detailed instructions on how to use each script, please refer to the [README.md](./README.md) file in this folder.

## Security Note

Remember that while these scripts only read data (not modify it), you should still be careful with your Supabase credentials. Don't commit any files with your credentials hardcoded. 