#!/bin/bash

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script to check for leaked environment variables and sensitive information

echo "Checking for leaked environment variables and sensitive information..."
echo "======================================================================"

# Define patterns to search for
PATTERNS=(
  "VITE_SUPABASE_URL"
  "VITE_SUPABASE_ANON_KEY"
  "VITE_SUPABASE_SERVICE_ROLE_KEY"
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"  # Common JWT prefix
  "supabase.co"
  "password"
  "secret"
  "api_key"
  "apikey"
  "token"
  "auth"
)

# Define files/directories to exclude
EXCLUDE_PATTERNS=(
  ".env"
  ".env.*"
  "node_modules"
  "dist"
  "build"
  ".git"
  "package-lock.json"
  "yarn.lock"
  "pnpm-lock.yaml"
  "*.log"
  "*.min.js"
  "*.min.css"
  "tools/check-leaks.sh"  # Exclude this script itself
)

# Build the exclude pattern for grep
EXCLUDE_ARGS=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude='$pattern'"
done

# Track if we found any leaks
FOUND_LEAKS=false

# Check each pattern
for pattern in "${PATTERNS[@]}"; do
  echo "Checking for: $pattern"
  echo "--------------------"
  
  # Use grep to find the pattern, excluding specified files
  # The eval is needed to properly expand the EXCLUDE_ARGS
  RESULTS=$(eval "grep -r '$pattern' $EXCLUDE_ARGS --include='*.{js,ts,tsx,jsx,html,md,sql,toml,yaml,yml}' . || echo ''")
  
  if [ -z "$RESULTS" ]; then
    echo -e "${GREEN}✅ No instances found.${NC}"
  else
    echo -e "${YELLOW}⚠️  Found instances:${NC}"
    echo "$RESULTS" | while read -r line; do
      echo "  - $line"
    done
    FOUND_LEAKS=true
  fi
  
  echo ""
done

echo "======================================================================"
echo "Leak check completed. Review any findings above."

if [ "$FOUND_LEAKS" = true ]; then
  echo -e "${YELLOW}Sensitive information was found in your codebase. Here's how to fix it:${NC}"
  echo ""
  echo "1. Remove hardcoded credentials:"
  echo "   - Replace hardcoded values with environment variables"
  echo "   - Update your code to fail gracefully when environment variables are missing"
  echo ""
  echo "2. For test files and tools:"
  echo "   - Create a .env.example file with placeholder values"
  echo "   - Update test scripts to require proper environment setup"
  echo "   - Consider using mock services for testing instead of real credentials"
  echo ""
  echo "3. For HTML/frontend files:"
  echo "   - Remove any hardcoded credentials"
  echo "   - Use forms to let users input their own credentials when needed"
  echo "   - Consider server-side proxies to avoid exposing credentials in frontend code"
  echo ""
  echo "4. Clean git history (if credentials were committed):"
  echo "   - Use git-filter-branch or BFG Repo-Cleaner to remove sensitive data"
  echo "   - Example: bfg --replace-text passwords.txt my-repo.git"
  echo "   - After cleaning history, all collaborators should clone a fresh copy"
  echo ""
  echo "5. Rotate compromised credentials:"
  echo "   - If you've committed real credentials, consider them compromised"
  echo "   - Generate new API keys and tokens in your Supabase dashboard"
  echo "   - Update your .env files with the new credentials"
  echo ""
  echo "For more information on securing your application, see:"
  echo "- https://supabase.com/docs/guides/auth/managing-user-data"
  echo "- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository"
else
  echo -e "${GREEN}No sensitive information was found in your codebase.${NC}"
fi 