FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm install

# Copy all backend code
COPY backend/ ./

# Generate Prisma client
RUN npx prisma generate

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start with simple Node.js
CMD ["node", "server-clean.js"]