# Professional Docker configuration for Elouarate Art
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json backend/
COPY Frontend/package*.json Frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Install frontend dependencies and build
WORKDIR /app/Frontend
RUN npm ci
RUN npm run build

# Copy application code
WORKDIR /app
COPY backend/ backend/
COPY Frontend/dist/ Frontend/dist/

# Create uploads directory
RUN mkdir -p backend/uploads backend/logs

# Set proper permissions
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start application
WORKDIR /app/backend
CMD ["npm", "start"]