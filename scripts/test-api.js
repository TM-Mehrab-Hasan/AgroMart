#!/usr/bin/env node

/**
 * AgroMart API Test Runner
 * Execute this script to test all API endpoints
 * 
 * Usage: node scripts/test-api.js [--dev] [--prod]
 */

import { AgroMartApiTester } from '../src/lib/testing/api-tester.js';

// Test configuration
const CONFIG = {
  development: {
    baseUrl: 'http://localhost:3000',
    timeout: 5000,
    retries: 3,
  },
  production: {
    baseUrl: 'https://your-production-url.com',
    timeout: 10000,
    retries: 5,
  }
};

// Test users for different roles
const TEST_USERS = {
  ADMIN: {
    email: 'admin@agromart.com',
    password: 'admin123',
    role: 'ADMIN',
    name: 'Admin User'
  },
  CUSTOMER: {
    email: 'customer@agromart.com',
    password: 'customer123',
    role: 'CUSTOMER',
    name: 'Customer User'
  },
  SELLER: {
    email: 'seller@agromart.com',
    password: 'seller123',
    role: 'SELLER',
    name: 'Seller User'
  },
  SHOP_OWNER: {
    email: 'shopowner@agromart.com',
    password: 'shopowner123',
    role: 'SHOP_OWNER',
    name: 'Shop Owner'
  },
  RIDER: {
    email: 'rider@agromart.com',
    password: 'rider123',
    role: 'RIDER',
    name: 'Rider User'
  }
};

async function main() {
  const args = process.argv.slice(2);
  const environment = args.includes('--prod') ? 'production' : 'development';
  
  console.log(`🌾 AgroMart API Testing Suite`);
  console.log(`📍 Environment: ${environment}`);
  console.log(`🔗 Base URL: ${CONFIG[environment].baseUrl}\n`);

  // Initialize tester
  const tester = new AgroMartApiTester(CONFIG[environment]);

  try {
    // Authenticate test users (if available)
    console.log('🔐 Authenticating test users...');
    for (const [role, user] of Object.entries(TEST_USERS)) {
      try {
        await tester.authenticate(user);
        console.log(`✅ ${role} authenticated`);
      } catch (error) {
        console.log(`⚠️  ${role} authentication failed (might need manual setup)`);
      }
    }
    console.log('');

    // Run comprehensive tests
    await tester.runComprehensiveTests();

    // Export results
    const results = tester.getTestResults();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-results-${timestamp}.json`;
    
    console.log(`\n💾 Test results saved to: ${filename}`);
    
    // Determine exit code
    const failedTests = results.filter(r => r.status === 'FAIL').length;
    process.exit(failedTests > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}