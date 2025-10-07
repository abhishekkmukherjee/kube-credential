#!/bin/bash

echo "🧪 Testing CORS configuration..."

FRONTEND_URL="https://keen-serenity-production.up.railway.app"
ISSUANCE_URL="https://kube-credential-production.up.railway.app"
VERIFICATION_URL="https://superb-art-production.up.railway.app"

echo "Frontend URL: $FRONTEND_URL"
echo "Issuance URL: $ISSUANCE_URL"
echo "Verification URL: $VERIFICATION_URL"
echo ""

# Test preflight request to issuance service
echo "🔍 Testing CORS preflight request to issuance service..."
curl -X OPTIONS \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v "$ISSUANCE_URL/api/credentials" 2>&1 | grep -E "(Access-Control|HTTP/)"

echo ""

# Test preflight request to verification service
echo "🔍 Testing CORS preflight request to verification service..."
curl -X OPTIONS \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v "$VERIFICATION_URL/api/verify" 2>&1 | grep -E "(Access-Control|HTTP/)"

echo ""

# Test actual POST request to issuance service
echo "🔍 Testing actual POST request to issuance service..."
curl -X POST \
  -H "Origin: $FRONTEND_URL" \
  -H "Content-Type: application/json" \
  -d '{"holderName":"Test User","credentialType":"Test Credential"}' \
  -v "$ISSUANCE_URL/api/credentials" 2>&1 | grep -E "(Access-Control|HTTP/|success)"

echo ""
echo "✅ CORS test complete!"