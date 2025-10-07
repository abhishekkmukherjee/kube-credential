#!/usr/bin/env node

// Alternative start script for Railway
console.log('🔍 Railway Start Script - Verification Service');
console.log('📁 Current directory:', process.cwd());
console.log('📦 Node version:', process.version);

const fs = require('fs');
const path = require('path');

// Check if we need to build
const distExists = fs.existsSync(path.join(__dirname, 'dist', 'server.js'));
console.log('🔨 Dist exists:', distExists);

if (!distExists) {
  console.log('🔨 Building TypeScript...');
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('🚀 Starting server...');
require('./dist/server.js');