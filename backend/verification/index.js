#!/usr/bin/env node

// Railway entry point - bulletproof version
const path = require('path');
const fs = require('fs');

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
const serverPath = path.join(distPath, 'server.js');

if (!fs.existsSync(serverPath)) {
  console.error('❌ dist/server.js not found. Running build first...');
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

console.log('🚀 Starting verification service...');
require('./dist/server.js');