import { testConnection } from './lib/database.js';
import { createTables, insertInitialData } from './lib/schema.js';

async function test() {
  console.log('í·ª Testing database setup...');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('âŒ Database connection failed');
    process.exit(1);
  }
  
  await createTables();
  await insertInitialData();
  
  console.log('âœ… Database setup complete!');
  process.exit(0);
}

test().catch(error => {
  console.error('âŒ Test failed:', error);
  process.exit(1);
});
