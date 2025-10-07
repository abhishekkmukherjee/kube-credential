#!/bin/bash

echo "🧪 Testing Railway Deployment..."

# Replace these with your actual Railway URLs
ISSUANCE_URL="https://your-issuance-service.up.railway.app"
VERIFICATION_URL="https://your-verification-service.up.railway.app"
FRONTEND_URL="https://your-frontend-service.up.railway.app"

echo "🔧 Testing Issuance Service Health..."
curl -s "$ISSUANCE_URL/api/health" | jq '.' || echo "❌ Issuance service not responding"

echo ""
echo "🔍 Testing Verification Service Health..."
curl -s "$VERIFICATION_URL/api/health" | jq '.' || echo "❌ Verification service not responding"

echo ""
echo "🌐 Testing Frontend..."
curl -s -I "$FRONTEND_URL" | head -1 || echo "❌ Frontend not responding"

echo ""
echo "🧪 Testing Credential Issuance..."
CREDENTIAL=$(curl -s -X POST "$ISSUANCE_URL/api/credentials" \
  -H "Content-Type: application/json" \
  -d '{
    "holderName": "Test User",
    "holderEmail": "test@example.com",
    "credentialType": "certification",
    "issuerName": "Test Issuer"
  }')

if echo "$CREDENTIAL" | jq -e '.success' > /dev/null; then
  echo "✅ Credential issued successfully"
  CREDENTIAL_ID=$(echo "$CREDENTIAL" | jq -r '.data.id')
  
  echo ""
  echo "🔍 Testing Credential Verification..."
  VERIFICATION=$(curl -s "$VERIFICATION_URL/api/verify/$CREDENTIAL_ID")
  
  if echo "$VERIFICATION" | jq -e '.valid' > /dev/null; then
    echo "✅ Credential verified successfully"
  else
    echo "❌ Credential verification failed"
  fi
else
  echo "❌ Credential issuance failed"
fi

echo ""
echo "🎯 Test complete! Check the results above."
echo "📱 Frontend URL: $FRONTEND_URL"