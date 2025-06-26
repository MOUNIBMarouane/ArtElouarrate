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

EXPOSE 3000

CMD ["node", "server-clean.js"]
