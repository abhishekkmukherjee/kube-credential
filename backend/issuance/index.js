#!/usr/bin/env node

// Railway entry point - use direct JavaScript for immediate CORS fix
console.log('🚀 Starting issuance service with direct CORS fix...');
require('./server-direct.js');