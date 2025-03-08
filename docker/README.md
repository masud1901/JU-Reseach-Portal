# Docker Setup for JU Research Portal

This directory contains Docker configuration files for containerizing the JU Research Portal application.

## Files

- `Dockerfile`: Multi-stage build for the React application
- `docker-compose.yml`: Orchestrates the application and a proxy for Supabase
- `docker-compose.prod.yml`: Production-specific configurations
- `.env.docker`: Docker-specific environment variables
- `docker-utils.sh`: Utility script for Docker operations

## Usage

### Development

For development, you can use the following command:

```bash
# From the project root
./docker-run.sh start
```

### Production

For production deployment:

```bash
# From the project root
./docker-run.sh start-prod
```

## Environment Variables

The Docker setup uses environment variables from two sources:

1. **Project .env file**: The main environment variables for the application are loaded from the project's `.env` file in the root directory.

2. **Docker .env.docker file**: Docker-specific environment variables are loaded from the `.env.docker` file in the `docker` directory.

If the Supabase URL is not set in either file, a fallback URL will be used for the Supabase proxy.

### Required Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Docker-specific Environment Variables

- `SUPABASE_FALLBACK_URL`: Fallback URL for the Supabase proxy (used if `VITE_SUPABASE_URL` is not set)

## Customization

You can customize the Nginx configuration by uncommenting the relevant line in the Dockerfile and creating an `nginx.conf` file in this directory. 