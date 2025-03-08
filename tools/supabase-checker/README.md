# Supabase Database Checker

This folder contains several scripts to help you check what's in your Supabase database. All scripts have been pre-configured with your Supabase URL and anon key from your `.env` file, so you can run them directly without any additional setup.

## 1. HTML Method (Easiest)

1. Open the `check-supabase.html` file in your browser
2. The Supabase URL and anon key are already pre-filled
3. Click "Check Database"
4. The page will display all tables and sample data from each table

## 2. Browser Console Method

If your application is already running:

1. Open your application in the browser
2. Open the browser's developer console (F12 or right-click > Inspect > Console)
3. Copy and paste the contents of `check-supabase-browser.js` into the console
4. Press Enter to run the script
5. The console will display all tables and sample data

## 3. Node.js Method

If you have Node.js installed:

1. Install the Supabase JS client if you haven't already:
   ```
   npm install @supabase/supabase-js
   ```

2. Run the script:
   ```
   node check-supabase-node.js
   ```
   
   The script will automatically read your Supabase credentials from the `.env` file.

## 4. TypeScript Method

If you're using TypeScript:

1. Install the Supabase JS client if you haven't already:
   ```
   npm install @supabase/supabase-js
   ```

2. Install ts-node if you haven't already:
   ```
   npm install -g ts-node
   ```

3. Run the TypeScript script:
   ```
   npx ts-node check-supabase.ts
   ```
   
   The script will automatically read your Supabase credentials from the `.env` file.

## Your Supabase Configuration

Your Supabase configuration has been automatically detected:

- **Supabase URL**: `https://zzciimqdmffilxwwadwj.supabase.co`
- **Project API Key**: Already configured in the scripts

## Security Note

The anon key is designed to be public, but be careful not to share these scripts with your keys hardcoded if you plan to share them outside your organization. The scripts are designed to only read data, not modify it, but it's still best practice to keep your keys secure.

## Troubleshooting

If you encounter CORS errors with the HTML method, you may need to:
1. Add your local file URL to the allowed origins in your Supabase dashboard
2. Or host the HTML file on a simple local server

If you have issues with the Node.js or TypeScript scripts:
1. Make sure you have the required dependencies installed
2. Check that your `.env` file is in the root directory of your project 