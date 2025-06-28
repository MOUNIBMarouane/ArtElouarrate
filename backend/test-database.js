import { testConnection } from './lib/database.js';
import { createTables, insertInitialData } from './lib/schema.js';

async function test() {
  console.log('� Testing database setup...');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Database connection failed');
    process.exit(1);
  }
  
  await createTables();
  await insertInitialData();
  
  console.log('✅ Database setup complete!');
  process.exit(0);
}

test().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
