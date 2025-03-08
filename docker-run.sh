#!/bin/bash

# Wrapper script for docker-utils.sh

# Get the absolute path of the project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$PROJECT_ROOT/docker"

# Check if docker-utils.sh exists
if [ ! -f "$DOCKER_DIR/docker-utils.sh" ]; then
  echo "Error: docker-utils.sh not found in $DOCKER_DIR"
  exit 1
fi

# Make sure docker-utils.sh is executable
chmod +x "$DOCKER_DIR/docker-utils.sh"

# Run docker-utils.sh with the provided arguments
cd "$DOCKER_DIR" && ./docker-utils.sh "$@" 