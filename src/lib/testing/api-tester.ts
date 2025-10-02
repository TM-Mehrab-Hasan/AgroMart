/**
 * AgroMart API Testing Utility
 * Comprehensive test suite for all API endpoints
 */

export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface TestUser {
  email: string;
  password: string;
  role: string;
  name: string;
}

export interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  statusCode?: number;
  responseTime?: number;
  error?: string;
  data?: any;
}

export class AgroMartApiTester {
  private config: TestConfig;
  private authTokens: Map<string, string> = new Map();
  private testResults: ApiTestResult[] = [];

  constructor(config: TestConfig) {
    this.config = config;
  }

  // Authentication helper
  async authenticate(user: TestUser): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      const token = data.token || data.accessToken;
      
      if (token) {
        this.authTokens.set(user.role, token);
      }
      
      return token;
    } catch (error) {
      console.error(`Authentication failed for ${user.role}:`, error);
      throw error;
    }
  }

  // Generic API test method
  async testEndpoint(
    method: string,
    endpoint: string,
    userRole?: string,
    body?: any,
    expectedStatus?: number
  ): Promise<ApiTestResult> {
    const startTime = Date.now();
    const testResult: ApiTestResult = {
      endpoint,
      method,
      status: 'FAIL',
    };

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authentication if user role is specified
      if (userRole && this.authTokens.has(userRole)) {
        headers['Authorization'] = `Bearer ${this.authTokens.get(userRole)}`;
      }

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseTime = Date.now() - startTime;
      testResult.responseTime = responseTime;
      testResult.statusCode = response.status;

      // Check if response status matches expected status
      if (expectedStatus && response.status !== expectedStatus) {
        testResult.error = `Expected status ${expectedStatus}, got ${response.status}`;
        testResult.status = 'FAIL';
      } else {
        testResult.status = 'PASS';
      }

      // Try to parse response data
      try {
        const data = await response.json();
        testResult.data = data;
      } catch (e) {
        // Response might not be JSON, that's okay
      }

    } catch (error) {
      testResult.error = error instanceof Error ? error.message : 'Unknown error';
      testResult.responseTime = Date.now() - startTime;
    }

    this.testResults.push(testResult);
    return testResult;
  }

  // Test authentication endpoints
  async testAuthenticationEndpoints(): Promise<ApiTestResult[]> {
    console.log('🔐 Testing Authentication Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test registration
    results.push(await this.testEndpoint(
      'POST',
      '/api/auth/register',
      undefined,
      {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'CUSTOMER'
      },
      201
    ));

    // Test signin with invalid credentials
    results.push(await this.testEndpoint(
      'POST',
      '/api/auth/signin',
      undefined,
      {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      401
    ));

    return results;
  }

  // Test product endpoints
  async testProductEndpoints(): Promise<ApiTestResult[]> {
    console.log('🌾 Testing Product Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get all products (public)
    results.push(await this.testEndpoint('GET', '/api/products', undefined, undefined, 200));

    // Test get featured products
    results.push(await this.testEndpoint('GET', '/api/products/featured', undefined, undefined, 200));

    // Test product search
    results.push(await this.testEndpoint('GET', '/api/products/search?q=rice', undefined, undefined, 200));

    // Test create product (requires seller authentication)
    results.push(await this.testEndpoint(
      'POST',
      '/api/products',
      'SELLER',
      {
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        category: 'VEGETABLES',
        unit: 'KG',
        stockQuantity: 100
      },
      201
    ));

    return results;
  }

  // Test order endpoints
  async testOrderEndpoints(): Promise<ApiTestResult[]> {
    console.log('📦 Testing Order Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get orders (requires authentication)
    results.push(await this.testEndpoint('GET', '/api/orders', 'CUSTOMER', undefined, 200));

    // Test unauthorized access to orders
    results.push(await this.testEndpoint('GET', '/api/orders', undefined, undefined, 401));

    // Test create order
    results.push(await this.testEndpoint(
      'POST',
      '/api/orders',
      'CUSTOMER',
      {
        items: [
          {
            productId: 'test-product-id',
            quantity: 2,
            price: 10.99
          }
        ],
        deliveryAddressId: 'test-address-id'
      },
      201
    ));

    return results;
  }

  // Test cart endpoints
  async testCartEndpoints(): Promise<ApiTestResult[]> {
    console.log('🛒 Testing Cart Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get cart
    results.push(await this.testEndpoint('GET', '/api/cart', 'CUSTOMER', undefined, 200));

    // Test add to cart
    results.push(await this.testEndpoint(
      'POST',
      '/api/cart',
      'CUSTOMER',
      {
        productId: 'test-product-id',
        quantity: 1
      },
      201
    ));

    // Test unauthorized cart access
    results.push(await this.testEndpoint('GET', '/api/cart', undefined, undefined, 401));

    return results;
  }

  // Test notification endpoints
  async testNotificationEndpoints(): Promise<ApiTestResult[]> {
    console.log('🔔 Testing Notification Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get notifications
    results.push(await this.testEndpoint('GET', '/api/notifications', 'CUSTOMER', undefined, 200));

    // Test unread count
    results.push(await this.testEndpoint('GET', '/api/notifications/unread-count', 'CUSTOMER', undefined, 200));

    // Test notification preferences
    results.push(await this.testEndpoint('GET', '/api/notifications/preferences', 'CUSTOMER', undefined, 200));

    // Test mark all as read
    results.push(await this.testEndpoint('PUT', '/api/notifications/mark-all-read', 'CUSTOMER', undefined, 200));

    return results;
  }

  // Test review endpoints
  async testReviewEndpoints(): Promise<ApiTestResult[]> {
    console.log('⭐ Testing Review Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get reviews
    results.push(await this.testEndpoint('GET', '/api/reviews', undefined, undefined, 200));

    // Test create review
    results.push(await this.testEndpoint(
      'POST',
      '/api/reviews',
      'CUSTOMER',
      {
        productId: 'test-product-id',
        rating: 5,
        comment: 'Great product!'
      },
      201
    ));

    // Test review analytics (admin only)
    results.push(await this.testEndpoint('GET', '/api/reviews/analytics', 'ADMIN', undefined, 200));

    // Test unauthorized access to admin analytics
    results.push(await this.testEndpoint('GET', '/api/reviews/analytics', 'CUSTOMER', undefined, 403));

    return results;
  }

  // Test shop endpoints
  async testShopEndpoints(): Promise<ApiTestResult[]> {
    console.log('🏪 Testing Shop Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get shops
    results.push(await this.testEndpoint('GET', '/api/shops', undefined, undefined, 200));

    // Test create shop
    results.push(await this.testEndpoint(
      'POST',
      '/api/shops',
      'SHOP_OWNER',
      {
        name: 'Test Shop',
        description: 'Test shop description',
        addressId: 'test-address-id'
      },
      201
    ));

    return results;
  }

  // Test address endpoints
  async testAddressEndpoints(): Promise<ApiTestResult[]> {
    console.log('📍 Testing Address Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get addresses
    results.push(await this.testEndpoint('GET', '/api/addresses', 'CUSTOMER', undefined, 200));

    // Test create address
    results.push(await this.testEndpoint(
      'POST',
      '/api/addresses',
      'CUSTOMER',
      {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      201
    ));

    return results;
  }

  // Test user endpoints
  async testUserEndpoints(): Promise<ApiTestResult[]> {
    console.log('👥 Testing User Endpoints...');
    
    const results: ApiTestResult[] = [];

    // Test get profile
    results.push(await this.testEndpoint('GET', '/api/users/profile', 'CUSTOMER', undefined, 200));

    // Test admin get all users
    results.push(await this.testEndpoint('GET', '/api/users', 'ADMIN', undefined, 200));

    // Test unauthorized access to user list
    results.push(await this.testEndpoint('GET', '/api/users', 'CUSTOMER', undefined, 403));

    return results;
  }

  // Run comprehensive test suite
  async runComprehensiveTests(): Promise<void> {
    console.log('🚀 Starting AgroMart API Comprehensive Test Suite...\n');
    
    try {
      // Test all endpoint categories
      await this.testAuthenticationEndpoints();
      await this.testProductEndpoints();
      await this.testOrderEndpoints();
      await this.testCartEndpoints();
      await this.testNotificationEndpoints();
      await this.testReviewEndpoints();
      await this.testShopEndpoints();
      await this.testAddressEndpoints();
      await this.testUserEndpoints();

      // Generate test report
      this.generateTestReport();
      
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  }

  // Generate test report
  private generateTestReport(): void {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
    const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
    const skippedTests = this.testResults.filter(r => r.status === 'SKIP').length;

    console.log('\n📊 TEST REPORT');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏭️  Skipped: ${skippedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    console.log('='.repeat(50));

    // Show failed tests
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(test => {
          console.log(`- ${test.method} ${test.endpoint}: ${test.error || 'Unknown error'}`);
        });
    }

    // Show performance stats
    const avgResponseTime = this.testResults
      .filter(r => r.responseTime)
      .reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalTests;
    
    console.log(`\n⚡ Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  }

  // Get test results
  getTestResults(): ApiTestResult[] {
    return this.testResults;
  }

  // Clear test results
  clearResults(): void {
    this.testResults = [];
    this.authTokens.clear();
  }
}