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

## Docker Setup

This project includes Docker configuration for easy deployment. The Docker setup is located in the `docker` directory.

### Quick Start

You can use the wrapper script to run Docker commands from anywhere in the project:

```bash
# Show help
./docker-run.sh help

# Start the development environment
./docker-run.sh start

# Start the production environment
./docker-run.sh start-prod

# Stop all containers
./docker-run.sh stop
```

### Development

To run the application in development mode using Docker:

```bash
./docker-run.sh start
# or
docker-compose -f docker/docker-compose.yml up
```

This will start the application and a proxy for Supabase.

### Production

For production deployment:

```bash
./docker-run.sh start-prod
# or
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

This will start the application with production-specific configurations, including an Nginx reverse proxy for SSL termination.

### Docker Configuration Files

- `docker/Dockerfile`: Multi-stage build for the React application
- `docker/docker-compose.yml`: Base Docker Compose configuration
- `docker/docker-compose.prod.yml`: Production-specific Docker Compose configuration
- `docker/nginx/conf.d/default.conf`: Nginx configuration for the reverse proxy

For more details, see the [Docker README](docker/README.md).

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

### Supabase Connection Issues

If you encounter issues with the Supabase connection, you can use the following tools to diagnose the problem:

1. **Check Environment Variables**:
   ```bash
   node tools/check-env.js
   ```
   This will show if your environment variables are being loaded correctly.

2. **Test Supabase Functions**:
   ```bash
   node tools/check-functions.js
   ```
   This will test if the SQL functions are working correctly.

3. **Browser Connection Test**:
   Open the following URL in your browser:
   ```
   http://localhost:3000/check-supabase.html
   ```
   This will allow you to test the Supabase connection directly in the browser.

### Docker Environment Variables

If you're using Docker and encountering issues with environment variables, make sure:

1. Your `.env` file is properly configured
2. The environment variables are being passed to the Docker container
3. The application is being rebuilt after changes to environment variables:
   ```bash
   ./docker-run.sh build
   ./docker-run.sh start
   ```

## Security Best Practices

### Environment Variables

Always use environment variables for sensitive information. Never commit real credentials to the repository.

1. Copy the `.env.example` file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual Supabase credentials in the `.env` file:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```

3. The `.env` file is included in `.gitignore` to prevent accidental commits of sensitive information.

### Security Audit Tool

We provide a comprehensive security audit tool to help you identify and fix security issues:

```bash
./tools/security-audit.sh
```

This script will:
- Check for the existence of a proper `.env` file
- Ensure `.env` is included in `.gitignore`
- Scan your codebase for potential leaked credentials
- Offer to test your Supabase connection
- Provide security recommendations

Run this tool regularly, especially after making changes to your environment configuration.

### Checking for Leaked Credentials

For a quick check of leaked credentials, you can use:

```bash
./tools/check-leaks.sh
```

This script will scan your codebase for potential leaked credentials and provide guidance on how to fix any issues found.

### Docker Environment Variables

When using Docker, make sure your environment variables are properly configured:

1. Ensure your `.env` file is correctly set up with your Supabase credentials.
2. If you make changes to your `.env` file, you'll need to rebuild the Docker containers:
   ```bash
   ./docker-run.sh build
   ```
