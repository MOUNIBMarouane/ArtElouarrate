import { testConnection } from './lib/database.js';
import { checkAndInitialize } from './lib/schema-fixed.js';

async function test() {
  console.log('í·ª Testing with existing schema...');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('âŒ Database connection failed');
    process.exit(1);
  }
  
  await checkAndInitialize();
  
  console.log('âœ… All tests passed!');
  process.exit(0);
}

test().catch(error => {
  console.error('âŒ Test failed:', error);
  process.exit(1);
});
