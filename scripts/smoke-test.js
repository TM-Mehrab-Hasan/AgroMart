/**
 * AgroMart API Smoke Test
 * Quick verification of critical API endpoints
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.request(url, { method }, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          status: res.statusCode,
          data: data,
          responseTime: endTime - startTime
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Basic smoke test function
async function smokeTest() {
  const baseUrl = 'http://localhost:3000';
  const results = [];

  console.log('🚀 Starting AgroMart API Smoke Test...\n');

  // Test cases with expected status codes
  const testCases = [
    { method: 'GET', endpoint: '/api/products', expectedStatus: 200, description: 'List products' },
    { method: 'GET', endpoint: '/api/products/featured', expectedStatus: 200, description: 'Featured products' },
    { method: 'GET', endpoint: '/api/products/search?q=test', expectedStatus: 200, description: 'Search products' },
    { method: 'GET', endpoint: '/api/shops', expectedStatus: 200, description: 'List shops' },
    { method: 'GET', endpoint: '/api/reviews', expectedStatus: 200, description: 'List reviews' },
    
    // Protected endpoints (should return 401 without auth)
    { method: 'GET', endpoint: '/api/cart', expectedStatus: 401, description: 'Get cart (unauthorized)' },
    { method: 'GET', endpoint: '/api/orders', expectedStatus: 401, description: 'List orders (unauthorized)' },
    { method: 'GET', endpoint: '/api/notifications', expectedStatus: 401, description: 'List notifications (unauthorized)' },
    { method: 'GET', endpoint: '/api/users/profile', expectedStatus: 401, description: 'Get profile (unauthorized)' },
    
    // Admin endpoints (should return 401/403)
    { method: 'GET', endpoint: '/api/users', expectedStatus: 401, description: 'List users (unauthorized)' },
    { method: 'GET', endpoint: '/api/reviews/analytics', expectedStatus: 401, description: 'Review analytics (unauthorized)' },
  ];

  // Execute tests
  for (const testCase of testCases) {
    try {
      const response = await makeRequest(`${baseUrl}${testCase.endpoint}`, testCase.method);
      
      const passed = response.status === testCase.expectedStatus;
      
      results.push({
        ...testCase,
        actualStatus: response.status,
        responseTime: response.responseTime,
        passed,
      });

      const status = passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${testCase.method} ${testCase.endpoint} - ${testCase.description}`);
      console.log(`   Expected: ${testCase.expectedStatus}, Got: ${response.status}, Time: ${response.responseTime}ms\n`);
      
    } catch (error) {
      results.push({
        ...testCase,
        actualStatus: 'ERROR',
        responseTime: 0,
        passed: false,
        error: error.message,
      });
      
      console.log(`❌ ERROR ${testCase.method} ${testCase.endpoint} - ${error.message}\n`);
    }
  }

  // Generate summary
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const avgResponseTime = results
    .filter(r => r.responseTime > 0)
    .reduce((sum, r) => sum + r.responseTime, 0) / totalTests;

  console.log('📊 SMOKE TEST SUMMARY');
  console.log('='.repeat(40));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log(`⚡ Avg Response Time: ${avgResponseTime.toFixed(0)}ms`);
  console.log('='.repeat(40));

  if (failedTests > 0) {
    console.log('\n❌ FAILED TESTS:');
    results
      .filter(r => !r.passed)
      .forEach(test => {
        console.log(`- ${test.method} ${test.endpoint}: Expected ${test.expectedStatus}, got ${test.actualStatus}`);
      });
  }

  return {
    totalTests,
    passedTests,
    failedTests,
    successRate: (passedTests / totalTests) * 100,
    avgResponseTime,
    results,
  };
}

// Run smoke test if this file is executed directly
if (typeof window === 'undefined') {
  smokeTest()
    .then((summary) => {
      if (summary.failedTests > 0) {
        process.exit(1);
      } else {
        console.log('\n🎉 All smoke tests passed!');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('Smoke test failed:', error);
      process.exit(1);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { smokeTest };
}