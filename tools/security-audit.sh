#!/bin/bash

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}           JU Research Portal Security Audit            ${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo ""

# Check if .env file exists
echo -e "${YELLOW}Checking for .env file...${NC}"
if [ -f .env ]; then
  echo -e "${GREEN}✅ .env file found${NC}"
else
  echo -e "${RED}❌ .env file not found${NC}"
  echo -e "Creating .env file from .env.example..."
  
  if [ -f .env.example ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
    echo -e "${YELLOW}⚠️  Please update the .env file with your actual credentials${NC}"
  else
    echo -e "${RED}❌ .env.example file not found${NC}"
    echo -e "Creating basic .env file..."
    
    cat > .env << EOL
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Application Configuration
NODE_ENV=development
EOL
    
    echo -e "${GREEN}✅ Created basic .env file${NC}"
    echo -e "${YELLOW}⚠️  Please update the .env file with your actual credentials${NC}"
  fi
fi

echo ""

# Check if .env is in .gitignore
echo -e "${YELLOW}Checking if .env is in .gitignore...${NC}"
if [ -f .gitignore ]; then
  if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✅ .env is properly ignored in .gitignore${NC}"
  else
    echo -e "${RED}❌ .env is not in .gitignore${NC}"
    echo -e "Adding .env to .gitignore..."
    echo ".env" >> .gitignore
    echo -e "${GREEN}✅ Added .env to .gitignore${NC}"
  fi
else
  echo -e "${RED}❌ .gitignore file not found${NC}"
  echo -e "Creating .gitignore file..."
  
  cat > .gitignore << EOL
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
dist
dist-ssr
*.local
build
out

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
*.sublime-*
*~
.*.swp
.*.swo

# Supabase
.supabase

# Testing
coverage
.nyc_output

# Temporary files
tmp
temp
.tmp
.temp

# Docker volumes
docker/volumes
EOL
  
  echo -e "${GREEN}✅ Created .gitignore file${NC}"
fi

echo ""

# Check for leaked credentials
echo -e "${YELLOW}Checking for leaked credentials...${NC}"
if [ -f ./tools/check-leaks.sh ]; then
  echo -e "Running check-leaks.sh..."
  chmod +x ./tools/check-leaks.sh
  ./tools/check-leaks.sh
else
  echo -e "${RED}❌ check-leaks.sh not found${NC}"
  echo -e "Please run the following command to check for leaked credentials:"
  echo -e "  grep -r 'VITE_SUPABASE' --include='*.{js,ts,tsx,jsx,html,md}' . | grep -v '.env'"
fi

echo ""

# Check Supabase connection
echo -e "${YELLOW}Would you like to test your Supabase connection? (y/n)${NC}"
read -r test_connection

if [ "$test_connection" = "y" ] || [ "$test_connection" = "Y" ]; then
  echo -e "${YELLOW}Testing Supabase connection...${NC}"
  
  if [ -f ./tools/supabase-checker/check-supabase-node.js ]; then
    node ./tools/supabase-checker/check-supabase-node.js
  else
    echo -e "${RED}❌ check-supabase-node.js not found${NC}"
    echo -e "Please check your Supabase connection manually."
  fi
fi

echo ""
echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}           Security Audit Complete                      ${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo ""
echo -e "Security recommendations:"
echo -e "1. Ensure your .env file contains valid credentials and is not committed to git"
echo -e "2. Regularly run ./tools/check-leaks.sh to check for leaked credentials"
echo -e "3. Rotate your Supabase keys if you suspect they have been compromised"
echo -e "4. Use environment variables instead of hardcoded credentials"
echo -e "5. Keep your dependencies up to date with 'npm audit' and 'npm update'"
echo "" 