# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Environment Setup

This project requires environment variables to connect to Supabase. Follow these steps to set up your environment:

1. Copy the `.env.example` file to a new file named `.env`:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```

3. The `.env` file is gitignored to keep your credentials secure. Never commit your actual `.env` file to version control.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# Supabase Database Checker

This folder contains several scripts to help you check what's in your Supabase database. All scripts have been pre-configured with your Supabase URL and anon key from your `.env` file, so you can run them directly without any additional setup.

## Quick Start (Recommended)

For the most reliable results, use the direct script:

```
node check-supabase-direct.js
```

This script directly checks for known tables in your database and displays sample data from each one.

## Other Methods

### 1. HTML Method

1. Open the `check-supabase.html` file in your browser
2. The Supabase URL and anon key are already pre-filled
3. Click "Check Database"
4. The page will display all tables and sample data from each table

### 2. Browser Console Method

If your application is already running:

1. Open your application in the browser
2. Open the browser's developer console (F12 or right-click > Inspect > Console)
3. Copy and paste the contents of `check-supabase-browser.js` into the console
4. Press Enter to run the script
5. The console will display all tables and sample data

### 3. Node.js Method

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

### 4. TypeScript Method

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
