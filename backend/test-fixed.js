import { testConnection } from './lib/database.js';
import { checkAndInitialize } from './lib/schema-fixed.js';

async function test() {
  console.log('� Testing with existing schema...');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Database connection failed');
    process.exit(1);
  }
  
  await checkAndInitialize();
  
  console.log('✅ All tests passed!');
  process.exit(0);
}

test().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
