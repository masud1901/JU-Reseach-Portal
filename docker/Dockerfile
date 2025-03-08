FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application with environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo 'set -e' >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_SUPABASE_URL_PLACEHOLDER|${VITE_SUPABASE_URL}|g" {} \;' >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_SUPABASE_ANON_KEY_PLACEHOLDER|${VITE_SUPABASE_ANON_KEY}|g" {} \;' >> /docker-entrypoint.d/40-replace-env-vars.sh && \
    chmod +x /docker-entrypoint.d/40-replace-env-vars.sh

# Copy nginx configuration if needed
# COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 