#!/bin/bash

echo "🚂 Deploying Kube Credential to Railway"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
else
    echo "✅ Railway CLI already installed"
fi

# Login to Railway
echo "🔐 Please login to Railway..."
railway login

# Check if logged in successfully
if railway whoami &> /dev/null; then
    echo "✅ Successfully logged in to Railway"
else
    echo "❌ Failed to login to Railway"
    exit 1
fi

echo ""
echo "🎯 Railway Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://railway.app/dashboard"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select 'abhishekkmukherjee/kube-credential'"
echo "4. Create 3 services with these root directories:"
echo "   - Service 1: backend/issuance"
echo "   - Service 2: backend/verification" 
echo "   - Service 3: frontend"
echo ""
echo "🔧 Environment Variables to Set:"
echo ""
echo "Issuance Service:"
echo "  NODE_ENV=production"
echo "  PORT=3001"
echo "  WORKER_ID=railway-issuance-worker-1"
echo ""
echo "Verification Service:"
echo "  NODE_ENV=production"
echo "  PORT=3002"
echo "  WORKER_ID=railway-verification-worker-1"
echo "  ISSUANCE_SERVICE_URL=https://YOUR_ISSUANCE_URL"
echo ""
echo "Frontend Service:"
echo "  REACT_APP_ISSUANCE_API_URL=https://YOUR_ISSUANCE_URL/api"
echo "  REACT_APP_VERIFICATION_API_URL=https://YOUR_VERIFICATION_URL/api"
echo ""
echo "📖 See RAILWAY_DEPLOYMENT.md for detailed step-by-step instructions"
echo "⏱️  Total deployment time: ~20 minutes"
echo "💰 Cost: FREE (within Railway's $5/month credit)"