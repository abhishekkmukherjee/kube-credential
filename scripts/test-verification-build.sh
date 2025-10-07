#!/bin/bash

echo "🔍 Testing Verification Service Build..."

cd backend/verification

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building TypeScript..."
npm run build

echo "📁 Checking build output..."
ls -la dist/

echo "🚀 Testing start command..."
echo "Running: npm start"
echo "This should start the server on port 3001"

# Don't actually start the server in the script
echo "✅ Build test complete!"
echo "If you see dist/server.js above, the build is working correctly."