#!/bin/bash

echo "🚀 Preparing Kube Credential for AWS App Runner Deployment"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Kube Credential system"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if files exist
echo "📋 Checking deployment files..."

if [ -f "backend/issuance/apprunner.yaml" ]; then
    echo "✅ Issuance apprunner.yaml exists"
else
    echo "❌ Missing backend/issuance/apprunner.yaml"
fi

if [ -f "backend/verification/apprunner.yaml" ]; then
    echo "✅ Verification apprunner.yaml exists"
else
    echo "❌ Missing backend/verification/apprunner.yaml"
fi

if [ -f "frontend/apprunner.yaml" ]; then
    echo "✅ Frontend apprunner.yaml exists"
else
    echo "❌ Missing frontend/apprunner.yaml"
fi

if [ -f "frontend/.env.production" ]; then
    echo "✅ Frontend .env.production exists"
else
    echo "❌ Missing frontend/.env.production"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/kube-credential.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Go to AWS Console → App Runner"
echo "3. Create 3 services using the apprunner.yaml files"
echo "4. Update URLs in verification apprunner.yaml and frontend .env.production"
echo "5. Redeploy services with updated URLs"
echo ""
echo "📖 See AWS_APP_RUNNER_DEPLOYMENT.md for detailed instructions"