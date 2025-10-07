#!/usr/bin/env node

// Railway entry point - bulletproof version with fresh build
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Ensuring fresh build for CORS fix...');

// Always rebuild to ensure latest changes
try {
  console.log('📦 Running fresh build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
const serverPath = path.join(distPath, 'server.js');

if (!fs.existsSync(serverPath)) {
  console.error('❌ dist/server.js not found after build');
  process.exit(1);
}

console.log('🚀 Starting issuance service with CORS fix...');
require('./dist/server.js');