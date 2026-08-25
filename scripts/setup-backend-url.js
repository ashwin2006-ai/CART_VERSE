#!/usr/bin/env node

/**
 * Setup Backend URL Script
 * 
 * Usage: node scripts/setup-backend-url.js <backend-url>
 * Example: node scripts/setup-backend-url.js https://e-commerce-api.onrender.com
 */

const fs = require('fs');
const path = require('path');

const backendUrl = process.argv[2];

if (!backendUrl) {
  console.error('❌ Error: Backend URL is required');
  console.error('Usage: node scripts/setup-backend-url.js <backend-url>');
  console.error('Example: node scripts/setup-backend-url.js https://e-commerce-api.onrender.com');
  process.exit(1);
}

// Validate URL
try {
  new URL(backendUrl);
} catch {
  console.error('❌ Error: Invalid URL format');
  console.error('Please provide a valid URL like: https://e-commerce-api.onrender.com');
  process.exit(1);
}

// Update .env.production.local
const envPath = path.join(__dirname, '..', '.env.production.local');
const envContent = `# Production environment - deployed backend API URL
VITE_API_URL=${backendUrl}/api
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env.production.local');
  console.log(`📍 Backend URL: ${backendUrl}/api`);
  console.log('\n📋 Next steps:');
  console.log('   1. Commit the changes: git add .env.production.local && git commit -m "Update backend URL"');
  console.log('   2. Push to GitHub: git push');
  console.log('   3. Vercel will auto-redeploy with the new backend URL');
  console.log('   4. Wait 2-3 minutes for the build to complete');
  console.log('   5. Visit https://e-commerce-virid-delta.vercel.app/ to test');
} catch (err) {
  console.error('❌ Error writing to .env.production.local:', err.message);
  process.exit(1);
}
