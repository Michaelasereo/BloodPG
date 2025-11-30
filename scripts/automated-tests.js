/**
 * Automated Test Script for BloodPG
 * Run with: node scripts/automated-tests.js
 * 
 * This script tests API endpoints, data validation, and backend logic.
 * UI/UX tests must still be done manually.
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function test(name, testFn) {
  try {
    log(`\n🧪 Testing: ${name}`, 'info');
    await testFn();
    testResults.passed++;
    log(`✅ PASSED: ${name}`, 'success');
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({ test: name, error: error.message });
    log(`❌ FAILED: ${name} - ${error.message}`, 'error');
  }
}

// Test Suite
async function runTests() {
  log('🚀 Starting Automated Tests for BloodPG', 'info');
  log('='.repeat(60), 'info');
  
  // 1. Server Health Check
  await test('Server is running', async () => {
    const response = await makeRequest(`${BASE_URL}/`);
    if (response.status !== 200) {
      throw new Error(`Server returned status ${response.status}`);
    }
  });
  
  // 2. API Routes Exist
  await test('Admin clear-data API route exists', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/clear-data`, {
      method: 'POST'
    });
    // Should return 200 or 401/403 (not 404)
    if (response.status === 404) {
      throw new Error('API route not found');
    }
  });
  
  await test('Admin all-users API route exists', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/all-users`);
    // Should return 200 or 401/403 (not 404)
    if (response.status === 404) {
      throw new Error('API route not found');
    }
  });
  
  // 3. Environment Variables
  await test('Supabase URL is configured', () => {
    if (!SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
    }
  });
  
  await test('Supabase Anon Key is configured', () => {
    if (!SUPABASE_ANON_KEY) {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    }
  });
  
  // 4. Page Routes
  await test('Home page loads', async () => {
    const response = await makeRequest(`${BASE_URL}/`);
    if (response.status !== 200) {
      throw new Error(`Home page returned status ${response.status}`);
    }
  });
  
  await test('Admin login page exists', async () => {
    const response = await makeRequest(`${BASE_URL}/admin/login`);
    if (response.status === 404) {
      throw new Error('Admin login page not found');
    }
  });
  
  await test('Clear data page exists', async () => {
    const response = await makeRequest(`${BASE_URL}/clear-data`);
    if (response.status === 404) {
      throw new Error('Clear data page not found');
    }
  });
  
  // 5. Auth Callback Route
  await test('Auth callback route exists', async () => {
    const response = await makeRequest(`${BASE_URL}/auth/callback`);
    // Should redirect (3xx) or return 200, not 404
    if (response.status === 404) {
      throw new Error('Auth callback route not found');
    }
  });
  
  // 6. Static Assets
  await test('Logo icon exists', async () => {
    const response = await makeRequest(`${BASE_URL}/logoblackblood.svg`);
    if (response.status !== 200) {
      throw new Error('Logo icon not found');
    }
  });
  
  // Print Summary
  log('\n' + '='.repeat(60), 'info');
  log(`\n📊 Test Summary:`, 'info');
  log(`✅ Passed: ${testResults.passed}`, 'success');
  log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
  
  if (testResults.errors.length > 0) {
    log(`\n❌ Errors:`, 'error');
    testResults.errors.forEach(({ test, error }) => {
      log(`  - ${test}: ${error}`, 'error');
    });
  }
  
  log('\n📝 Note: UI/UX tests must be done manually', 'warning');
  log('   Run the manual test script (MANUAL_TEST_SCRIPT.md) for complete testing.', 'warning');
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'error');
  process.exit(1);
});

