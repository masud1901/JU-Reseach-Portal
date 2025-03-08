#!/bin/bash

# Docker utilities for JU Research Portal

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the absolute path of the docker directory
DOCKER_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$DOCKER_DIR")"

# Load environment variables from .env file
ENV_FILE="$PROJECT_ROOT/.env"
if [ -f "$ENV_FILE" ]; then
  echo -e "${GREEN}Loading environment variables from $ENV_FILE${NC}"
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo -e "${YELLOW}Warning: .env file not found at $ENV_FILE${NC}"
  echo -e "${YELLOW}Some features may not work correctly without environment variables.${NC}"
fi

# Load Docker-specific environment variables
DOCKER_ENV_FILE="$DOCKER_DIR/.env.docker"
if [ -f "$DOCKER_ENV_FILE" ]; then
  echo -e "${GREEN}Loading Docker environment variables from $DOCKER_ENV_FILE${NC}"
  export $(grep -v '^#' "$DOCKER_ENV_FILE" | xargs)
else
  echo -e "${YELLOW}Warning: Docker .env file not found at $DOCKER_ENV_FILE${NC}"
  echo -e "${YELLOW}Creating default Docker .env file...${NC}"
  cat > "$DOCKER_ENV_FILE" << EOL
# Docker environment variables
# This file is used by Docker Compose to set environment variables

# Supabase configuration
# If these are not set, they will be loaded from the project's .env file
# VITE_SUPABASE_URL=https://zzciimqdmffilxwwadwj.supabase.co
# VITE_SUPABASE_ANON_KEY=your_anon_key

# Default fallback URL for Supabase proxy (used if VITE_SUPABASE_URL is not set)
SUPABASE_FALLBACK_URL=https://example.com
EOL
  echo -e "${GREEN}Default Docker .env file created at $DOCKER_ENV_FILE${NC}"
  export SUPABASE_FALLBACK_URL=https://example.com
fi

# Function to display help
show_help() {
  echo -e "${YELLOW}JU Research Portal Docker Utilities${NC}"
  echo ""
  echo "Usage: ./docker-utils.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start       - Start the development environment"
  echo "  start-prod  - Start the production environment"
  echo "  stop        - Stop all containers"
  echo "  restart     - Restart all containers"
  echo "  logs        - Show logs from all containers"
  echo "  build       - Rebuild all containers"
  echo "  clean       - Remove all containers, networks, and volumes"
  echo "  help        - Show this help message"
  echo ""
}

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    exit 1
  fi

  # Check for docker compose (new format) or docker-compose (old format)
  if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
    echo -e "${GREEN}Using Docker Compose plugin (docker compose)${NC}"
  elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
    echo -e "${GREEN}Using standalone Docker Compose (docker-compose)${NC}"
  else
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose or the Docker Compose plugin.${NC}"
    exit 1
  fi
}

# Start development environment
start_dev() {
  echo -e "${GREEN}Starting development environment...${NC}"
  
  # Check if Supabase URL is set
  if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "${YELLOW}Warning: VITE_SUPABASE_URL is not set. Using fallback URL: $SUPABASE_FALLBACK_URL${NC}"
  else
    echo -e "${GREEN}Using Supabase URL: $VITE_SUPABASE_URL${NC}"
  fi
  
  $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_ENV_FILE" up
}

# Start production environment
start_prod() {
  echo -e "${GREEN}Starting production environment...${NC}"
  
  # Check if Supabase URL is set
  if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "${YELLOW}Warning: VITE_SUPABASE_URL is not set. Using fallback URL: $SUPABASE_FALLBACK_URL${NC}"
  else
    echo -e "${GREEN}Using Supabase URL: $VITE_SUPABASE_URL${NC}"
  fi
  
  $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" -f "$DOCKER_DIR/docker-compose.prod.yml" --env-file "$DOCKER_ENV_FILE" up -d
  echo -e "${GREEN}Production environment started in detached mode.${NC}"
}

# Stop all containers
stop() {
  echo -e "${GREEN}Stopping all containers...${NC}"
  $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_ENV_FILE" down
  echo -e "${GREEN}All containers stopped.${NC}"
}

# Restart all containers
restart() {
  echo -e "${GREEN}Restarting all containers...${NC}"
  $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_ENV_FILE" down
  $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_ENV_FILE" up -d
  echo -e "${GREEN}All containers restarted.${NC}"
}

# Show logs from all containers
logs() {
  echo -e "${GREEN}Showing logs from all containers...${NC}"
  $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_ENV_FILE" logs -f
}

# Rebuild all containers
build() {
  echo -e "${GREEN}Rebuilding all containers...${NC}"
  $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_ENV_FILE" build --no-cache
  echo -e "${GREEN}All containers rebuilt.${NC}"
}

# Clean up all containers, networks, and volumes
clean() {
  echo -e "${YELLOW}This will remove all containers, networks, and volumes. Are you sure? (y/n)${NC}"
  read -r answer
  if [ "$answer" != "${answer#[Yy]}" ]; then
    echo -e "${GREEN}Cleaning up...${NC}"
    $DOCKER_COMPOSE -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_ENV_FILE" down -v
    echo -e "${GREEN}All containers, networks, and volumes removed.${NC}"
  else
    echo -e "${YELLOW}Operation cancelled.${NC}"
  fi
}

# Main script
check_docker

# Parse command line arguments
case "$1" in
  start)
    start_dev
    ;;
  start-prod)
    start_prod
    ;;
  stop)
    stop
    ;;
  restart)
    restart
    ;;
  logs)
    logs
    ;;
  build)
    build
    ;;
  clean)
    clean
    ;;
  help|*)
    show_help
    ;;
esac 