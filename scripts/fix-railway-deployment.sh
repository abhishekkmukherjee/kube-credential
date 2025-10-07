#!/bin/bash

echo "🚀 Fixing Railway deployment configuration..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please run: railway login"
    exit 1
fi

echo "✅ Railway CLI found and user is logged in"

# Validate JavaScript files before deployment
echo "🔍 Validating JavaScript files..."
node -c backend/issuance/index.js || { echo "❌ Issuance index.js has syntax errors"; exit 1; }
node -c backend/issuance/server-direct.js || { echo "❌ Issuance server-direct.js has syntax errors"; exit 1; }
node -c backend/verification/index.js || { echo "❌ Verification index.js has syntax errors"; exit 1; }
node -c backend/verification/server-direct.js || { echo "❌ Verification server-direct.js has syntax errors"; exit 1; }
echo "✅ All JavaScript files are valid"

# Deploy issuance service
echo "📦 Deploying issuance service..."
cd backend/issuance
railway up --service kube-credential-production
if [ $? -eq 0 ]; then
    echo "✅ Issuance service deployed successfully"
else
    echo "❌ Failed to deploy issuance service"
    exit 1
fi

# Deploy verification service  
echo "📦 Deploying verification service..."
cd ../verification
railway up --service superb-art-production
if [ $? -eq 0 ]; then
    echo "✅ Verification service deployed successfully"
else
    echo "❌ Failed to deploy verification service"
    exit 1
fi

cd ../..

echo "🎉 All services deployed successfully!"
echo ""
echo "🔍 Testing services..."

# Wait for services to start
echo "⏳ Waiting 30 seconds for services to start..."
sleep 30

# Test issuance service
echo "Testing issuance service health..."
if curl -f -s https://kube-credential-production.up.railway.app/api/health > /dev/null; then
    echo "✅ Issuance service is healthy"
else
    echo "❌ Issuance service health check failed"
fi

# Test verification service
echo "Testing verification service health..."
if curl -f -s https://superb-art-production.up.railway.app/api/health > /dev/null; then
    echo "✅ Verification service is healthy"
else
    echo "❌ Verification service health check failed"
fi

echo ""
echo "🧪 Testing CORS headers..."
curl -I -X OPTIONS \
  -H "Origin: https://keen-serenity-production.up.railway.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://kube-credential-production.up.railway.app/api/credentials 2>/dev/null | grep -i "access-control" || echo "❌ CORS headers not found"

echo ""
echo "✅ Deployment complete! Your services should now be working with proper CORS headers."
echo "🌐 Frontend: https://keen-serenity-production.up.railway.app"
echo "🔧 Issuance API: https://kube-credential-production.up.railway.app/api"
echo "🔍 Verification API: https://superb-art-production.up.railway.app/api"