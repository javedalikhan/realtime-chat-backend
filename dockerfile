# Use slim Node.js image for smaller size
FROM node:18-slim

# Create app directory
WORKDIR /app

# Install system dependencies if needed (like build tools)
RUN apt-get update && apt-get install -y \
  openssl \
  && rm -rf /var/lib/apt/lists/*

# Copy package.json and lockfile
COPY package*.json ./

# Install only production dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Swagger docs (if needed)
RUN npm run swagger:generate

# Build the TypeScript code
RUN npm run build

# Expose port
EXPOSE 3001

# Define environment
ENV NODE_ENV=production

# Healthcheck to ensure the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

  # Run the app
CMD ["node", "dist/index.js"]