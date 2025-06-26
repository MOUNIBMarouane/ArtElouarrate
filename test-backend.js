#!/usr/bin/env node

const API_BASE = 'http://localhost:3000/api';

async function testEndpoint(name, url) {
  try {
    console.log(`\n🔄 Testing ${name}...`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.text();
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      try {
        const jsonData = JSON.parse(data);
        console.log(`   ✅ ${name} - SUCCESS`);
        console.log(`   Response: ${JSON.stringify(jsonData, null, 2).substring(0, 200)}...`);
        return { success: true, data: jsonData };
      } catch (e) {
        console.log(`   ✅ ${name} - SUCCESS (non-JSON response)`);
        console.log(`   Response: ${data.substring(0, 200)}...`);
        return { success: true, data: data };
      }
    } else {
      console.log(`   ❌ ${name} - FAILED`);
      console.log(`   Error: ${data.substring(0, 200)}...`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ ${name} - ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🎨 ELOUARATE ART - Backend API Tests');
  console.log('=====================================');
  
  const tests = [
    { name: 'Health Check', url: `${API_BASE}/health` },
    { name: 'Categories', url: `${API_BASE}/categories` },
    { name: 'Artworks', url: `${API_BASE}/artworks` },
    { name: 'Dashboard Stats', url: `${API_BASE}/dashboard/stats` },
    { name: 'Dashboard Activity', url: `${API_BASE}/dashboard/activity` },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url);
    results.push({ ...test, ...result });
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  
  let passed = 0;
  let failed = 0;
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.name}: PASSED`);
      passed++;
    } else {
      console.log(`❌ ${result.name}: FAILED - ${result.error}`);
      failed++;
    }
  });
  
  console.log(`\n🎯 Final Score: ${passed}/${results.length} tests passed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Backend is fully functional.');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Check the server logs for details.`);
  }
  
  return { passed, failed, total: results.length };
}

// Add global fetch if not available (for older Node.js versions)
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

// Run tests
runTests().then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
}); 