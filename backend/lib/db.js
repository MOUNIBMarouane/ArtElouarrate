import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Prisma client with connection handling
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
});

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
}

// Handle graceful shutdown
const cleanup = async () => {
  try {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error during database disconnection:', error);
    process.exit(1);
  }
};

// Process event handlers for cleanup
process.on('beforeExit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGUSR2', cleanup);

// Test connection on startup
testConnection();

export default prisma; 