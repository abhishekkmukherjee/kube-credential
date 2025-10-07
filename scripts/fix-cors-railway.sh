#!/bin/bash

echo "🔧 Fixing CORS Issue for Railway Deployment"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📋 CORS Fix Applied:${NC}"
echo "✅ Updated backend/issuance/src/server.ts"
echo "✅ Updated backend/verification/src/server.ts"
echo "✅ Added your frontend URL: https://keen-serenity-production.up.railway.app"
echo ""

echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "1. Commit and push these changes to GitHub"
echo "2. Railway will automatically redeploy your backend services"
echo "3. Wait 2-3 minutes for deployment to complete"
echo "4. Test your application again"
echo ""

echo -e "${BLUE}📝 Commands to run:${NC}"
echo "git add ."
echo "git commit -m 'Fix CORS configuration for Railway deployment'"
echo "git push origin main"
echo ""

echo -e "${YELLOW}⏱️  After pushing:${NC}"
echo "1. Go to Railway dashboard"
echo "2. Watch your backend services redeploy"
echo "3. Wait for 'Deployed' status"
echo "4. Test your frontend again"
echo ""

echo -e "${GREEN}🧪 Test after deployment:${NC}"
echo "Open: https://keen-serenity-production.up.railway.app"
echo "Try issuing a credential - CORS error should be gone!"
echo ""

echo -e "${BLUE}💡 What was fixed:${NC}"
echo "- Added your frontend URL to CORS allowed origins"
echo "- Configured proper CORS headers"
echo "- Added support for preflight OPTIONS requests"
echo "- Added environment variable support for flexibility"