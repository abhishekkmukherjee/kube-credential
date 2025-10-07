#!/bin/bash

# Railway CLI Deployment Script
# Make sure you have Railway CLI installed: npm install -g @railway/cli

echo "🚀 Deploying to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Please login to Railway..."
railway login

# Create a new project
echo "📦 Creating new Railway project..."
railway project create

# Deploy Issuance Service
echo "🔧 Deploying Issuance Service..."
cd backend/issuance
railway up --detach
ISSUANCE_URL=$(railway domain)
cd ../..

# Deploy Verification Service  
echo "🔍 Deploying Verification Service..."
cd backend/verification
railway up --detach
VERIFICATION_URL=$(railway domain)
cd ../..

# Deploy Frontend
echo "🌐 Deploying Frontend..."
cd frontend
# Set environment variables for frontend
railway variables set REACT_APP_ISSUANCE_API_URL="https://${ISSUANCE_URL}/api"
railway variables set REACT_APP_VERIFICATION_API_URL="https://${VERIFICATION_URL}/api"
railway up --detach
FRONTEND_URL=$(railway domain)
cd ..

echo "✅ Deployment Complete!"
echo "🔧 Issuance Service: https://${ISSUANCE_URL}"
echo "🔍 Verification Service: https://${VERIFICATION_URL}"  
echo "🌐 Frontend: https://${FRONTEND_URL}"