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

# Wait a bit for services to start
sleep 10

# Test issuance service
echo "Testing issuance service..."
curl -f https://kube-credential-production.up.railway.app/api/health || echo "❌ Issuance service health check failed"

# Test verification service
echo "Testing verification service..."
curl -f https://superb-art-production.up.railway.app/api/health || echo "❌ Verification service health check failed"

echo ""
echo "✅ Deployment complete! Your services should now be working with proper CORS headers."