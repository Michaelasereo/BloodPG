/**
 * Codebase Validation Script
 * Checks for common issues, missing files, and code quality
 */

const fs = require('fs');
const path = require('path');

let issues = [];
let warnings = [];

function checkFileExists(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    issues.push(`Missing file: ${filePath} (${description})`);
    return false;
  }
  return true;
}

function checkFileContent(filePath, searchText, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes(searchText)) {
      warnings.push(`Potential issue in ${filePath}: ${description}`);
    }
  }
}

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

log('🔍 Checking Codebase...', 'info');
log('='.repeat(60), 'info');

// Check critical files
log('\n📁 Checking critical files...', 'info');

const criticalFiles = [
  ['app/page.tsx', 'Main page component'],
  ['app/layout.tsx', 'Root layout'],
  ['lib/auth.ts', 'Authentication service'],
  ['lib/supabaseService.ts', 'Supabase service'],
  ['lib/dataService.ts', 'Data service'],
  ['lib/pdfGeneratorHtml.ts', 'PDF generator'],
  ['components/Header/Header.tsx', 'Header component'],
  ['components/MainContent/MainContent.tsx', 'Main content component'],
  ['components/Sidebar/Sidebar.tsx', 'Sidebar component'],
  ['components/SignInModal/SignInModal.tsx', 'Sign-in modal'],
  ['app/auth/callback/route.ts', 'Auth callback route'],
  ['app/api/admin/clear-data/route.ts', 'Admin clear data API'],
];

criticalFiles.forEach(([file, desc]) => {
  if (checkFileExists(file, desc)) {
    log(`  ✅ ${file}`, 'success');
  }
});

// Check environment variables
log('\n🔐 Checking environment setup...', 'info');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      log(`  ✅ ${varName} is configured`, 'success');
    } else {
      issues.push(`Missing environment variable: ${varName}`);
      log(`  ❌ ${varName} is missing`, 'error');
    }
  });
} else {
  warnings.push('.env.local file not found - environment variables may not be set');
  log('  ⚠️  .env.local not found', 'warning');
}

// Check for common code issues
log('\n🔍 Checking for common issues...', 'info');

// Check if dummy data initialization is disabled
const initDataPath = path.join(process.cwd(), 'lib/initData.ts');
if (fs.existsSync(initDataPath)) {
  const content = fs.readFileSync(initDataPath, 'utf8');
  if (content.includes('resetToDummyData()') && !content.includes('// DISABLED')) {
    warnings.push('Dummy data auto-initialization may still be enabled');
    log('  ⚠️  Dummy data initialization may be enabled', 'warning');
  } else {
    log('  ✅ Dummy data initialization is disabled', 'success');
  }
}

// Check PDF generator
const pdfGenPath = path.join(process.cwd(), 'lib/pdfGeneratorHtml.ts');
if (fs.existsSync(pdfGenPath)) {
  const content = fs.readFileSync(pdfGenPath, 'utf8');
  if (content.includes('html2canvas') && content.includes('jsPDF')) {
    log('  ✅ PDF generator uses html2canvas and jsPDF', 'success');
  }
  if (content.includes('scale: 2')) {
    log('  ✅ PDF generator uses optimized scale', 'success');
  }
}

// Check authentication flow
const authCallbackPath = path.join(process.cwd(), 'app/auth/callback/route.ts');
if (fs.existsSync(authCallbackPath)) {
  const content = fs.readFileSync(authCallbackPath, 'utf8');
  if (content.includes('exchangeCodeForSession')) {
    log('  ✅ Auth callback handles OAuth code exchange', 'success');
  }
  if (content.includes('asereopeyemimichael@gmail.com')) {
    log('  ✅ Admin email check is implemented', 'success');
  }
}

// Check RLS policies
const schemaPath = path.join(process.cwd(), 'supabase/schema.sql');
if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  if (content.includes('ENABLE ROW LEVEL SECURITY')) {
    log('  ✅ RLS is enabled in schema', 'success');
  }
  if (content.includes('CREATE POLICY')) {
    log('  ✅ RLS policies are defined', 'success');
  }
}

// Summary
log('\n' + '='.repeat(60), 'info');
log('\n📊 Validation Summary:', 'info');

if (issues.length === 0 && warnings.length === 0) {
  log('✅ No issues found!', 'success');
} else {
  if (issues.length > 0) {
    log(`\n❌ Critical Issues (${issues.length}):`, 'error');
    issues.forEach(issue => log(`  - ${issue}`, 'error'));
  }
  
  if (warnings.length > 0) {
    log(`\n⚠️  Warnings (${warnings.length}):`, 'warning');
    warnings.forEach(warning => log(`  - ${warning}`, 'warning'));
  }
}

log('\n💡 Next Steps:', 'info');
log('  1. Fix any critical issues above', 'info');
log('  2. Run: node scripts/automated-tests.js', 'info');
log('  3. Complete manual testing with MANUAL_TEST_SCRIPT.md', 'info');

process.exit(issues.length > 0 ? 1 : 0);

