FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/

# Install dependencies
WORKDIR /app/backend
RUN npm install

# Copy all backend code
COPY backend/ ./

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "server-clean.js"]
