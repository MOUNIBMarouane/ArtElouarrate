import http from 'http';

console.log('🧪 Testing Categories API endpoints...');

function apiRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log(`${method} ${path}:`, {
            status: res.statusCode,
            success: response.success,
            message: response.message || response.error,
            dataLength: response.categories?.length || response.data ? 'has data' : 'no data'
          });
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          console.log(`${method} ${path} - Parse Error:`, responseData);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`${method} ${path} - Request Error:`, error.message);
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function testCategories() {
  try {
    console.log('\n⏰ Waiting for server...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n1. Testing GET categories (before creating any)...');
    const getResponse1 = await apiRequest('GET', '/api/categories');
    
    console.log('\n2. Testing POST create category...');
    const createResponse = await apiRequest('POST', '/api/categories', {
      name: 'Test API Category',
      description: 'Category created via API test',
      color: '#00ff00',
      sortOrder: 1
    });
    
    console.log('\n3. Testing GET categories (after creating one)...');
    const getResponse2 = await apiRequest('GET', '/api/categories');
    
    if (createResponse.data.success && createResponse.data.data?.category?.id) {
      const categoryId = createResponse.data.data.category.id;
      
      console.log('\n4. Testing PUT update category...');
      await apiRequest('PUT', `/api/categories/${categoryId}`, {
        description: 'Updated description via API test'
      });
      
      console.log('\n5. Testing DELETE category...');
      await apiRequest('DELETE', `/api/categories/${categoryId}`);
      
      console.log('\n6. Testing GET categories (after deletion)...');
      await apiRequest('GET', '/api/categories');
    }
    
    console.log('\n🎉 Categories API tests completed!');
    
  } catch (error) {
    console.error('❌ Categories test failed:', error.message);
  }
}

testCategories(); 