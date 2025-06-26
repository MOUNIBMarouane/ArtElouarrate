import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});


// Handle graceful shutdown
const cleanup = async () => {
  try {
    console.log('🔌 Disconnecting from database...');
    await db.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error during database disconnection:', error);
  }
};

// Process event handlers for cleanup
process.on('beforeExit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGUSR2', cleanup);

export default db; 