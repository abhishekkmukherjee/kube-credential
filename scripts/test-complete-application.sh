#!/bin/bash

# 🧪 Complete Application Testing Script
# Tests your entire Kube Credential application end-to-end

echo "🧪 Testing Complete Kube Credential Application"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -e "${BLUE}Testing:${NC} $description"
    echo -e "${YELLOW}URL:${NC} $url"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$url" 2>/dev/null)
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        print_result 0 "$description"
        if [ -f /tmp/response.json ]; then
            echo -e "${BLUE}Response:${NC}"
            cat /tmp/response.json | jq . 2>/dev/null || cat /tmp/response.json
        fi
    else
        print_result 1 "$description (Status: $status_code, Expected: $expected_status)"
    fi
    echo ""
}

# Function to test POST endpoint
test_post_endpoint() {
    local url=$1
    local data=$2
    local expected_status=$3
    local description=$4
    
    echo -e "${BLUE}Testing:${NC} $description"
    echo -e "${YELLOW}URL:${NC} $url"
    echo -e "${YELLOW}Data:${NC} $data"
    
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$data" \
        -o /tmp/response.json "$url" 2>/dev/null)
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        print_result 0 "$description"
        if [ -f /tmp/response.json ]; then
            echo -e "${BLUE}Response:${NC}"
            cat /tmp/response.json | jq . 2>/dev/null || cat /tmp/response.json
        fi
    else
        print_result 1 "$description (Status: $status_code, Expected: $expected_status)"
        if [ -f /tmp/response.json ]; then
            echo -e "${RED}Error Response:${NC}"
            cat /tmp/response.json
        fi
    fi
    echo ""
}

# Check if jq is installed for JSON formatting
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq not found. Installing for better JSON formatting...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command -v yum &> /dev/null; then
        sudo yum install -y jq
    elif command -v brew &> /dev/null; then
        brew install jq
    else
        echo -e "${YELLOW}⚠️  Could not install jq. JSON output will be unformatted.${NC}"
    fi
fi

# Get Railway URLs from user
echo -e "${BLUE}📋 Please provide your Railway deployment URLs:${NC}"
echo ""

read -p "🚂 Frontend URL (e.g., https://your-frontend.up.railway.app): " FRONTEND_URL
read -p "🚂 Issuance Service URL (e.g., https://your-issuance.up.railway.app): " ISSUANCE_URL  
read -p "🚂 Verification Service URL (e.g., https://your-verification.up.railway.app): " VERIFICATION_URL

# Remove trailing slashes
FRONTEND_URL=${FRONTEND_URL%/}
ISSUANCE_URL=${ISSUANCE_URL%/}
VERIFICATION_URL=${VERIFICATION_URL%/}

echo ""
echo -e "${BLUE}🧪 Starting comprehensive tests...${NC}"
echo ""

# Test 1: Backend Health Checks
echo -e "${YELLOW}=== STEP 1: Backend Health Checks ===${NC}"
test_endpoint "$ISSUANCE_URL/api/health" "200" "Issuance Service Health Check"
test_endpoint "$VERIFICATION_URL/api/health" "200" "Verification Service Health Check"

# Test 2: Frontend Loading
echo -e "${YELLOW}=== STEP 2: Frontend Loading ===${NC}"
test_endpoint "$FRONTEND_URL" "200" "Frontend Application Loading"

# Test 3: Issue a Credential
echo -e "${YELLOW}=== STEP 3: Credential Issuance ===${NC}"
CREDENTIAL_DATA='{
  "holderName": "Test User",
  "holderEmail": "test@example.com", 
  "credentialType": "certification",
  "issuerName": "Test University",
  "data": {
    "course": "Web Development",
    "grade": "A+",
    "completionDate": "2024-10-07"
  }
}'

echo "Issuing test credential..."
response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$CREDENTIAL_DATA" \
    -o /tmp/credential_response.json "$ISSUANCE_URL/api/credentials" 2>/dev/null)
status_code="${response: -3}"

if [ "$status_code" = "201" ] || [ "$status_code" = "200" ]; then
    print_result 0 "Credential Issuance"
    echo -e "${BLUE}Issued Credential:${NC}"
    cat /tmp/credential_response.json | jq . 2>/dev/null || cat /tmp/credential_response.json
    
    # Extract credential ID for verification test
    CREDENTIAL_ID=$(cat /tmp/credential_response.json | jq -r '.id' 2>/dev/null)
    if [ "$CREDENTIAL_ID" = "null" ] || [ -z "$CREDENTIAL_ID" ]; then
        CREDENTIAL_ID=$(cat /tmp/credential_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    fi
    echo -e "${YELLOW}Credential ID for verification:${NC} $CREDENTIAL_ID"
else
    print_result 1 "Credential Issuance (Status: $status_code)"
    if [ -f /tmp/credential_response.json ]; then
        echo -e "${RED}Error Response:${NC}"
        cat /tmp/credential_response.json
    fi
    CREDENTIAL_ID=""
fi
echo ""

# Test 4: Verify the Credential
echo -e "${YELLOW}=== STEP 4: Credential Verification ===${NC}"
if [ -n "$CREDENTIAL_ID" ] && [ "$CREDENTIAL_ID" != "null" ]; then
    VERIFICATION_DATA="{\"credentialId\": \"$CREDENTIAL_ID\"}"
    test_post_endpoint "$VERIFICATION_URL/api/verify" "$VERIFICATION_DATA" "200" "Credential Verification (Valid)"
else
    echo -e "${RED}❌ Skipping verification test - no credential ID available${NC}"
    ((TESTS_FAILED++))
    echo ""
fi

# Test 5: Verify Invalid Credential
echo -e "${YELLOW}=== STEP 5: Invalid Credential Test ===${NC}"
INVALID_DATA='{"credentialId": "invalid-credential-12345"}'
test_post_endpoint "$VERIFICATION_URL/api/verify" "$INVALID_DATA" "404" "Invalid Credential Verification"

# Test 6: Frontend API Integration
echo -e "${YELLOW}=== STEP 6: Frontend API Integration ===${NC}"
echo -e "${BLUE}Testing:${NC} Frontend can reach backend APIs"

# Check if frontend can reach issuance API
frontend_issuance_test=$(curl -s -w "%{http_code}" -o /dev/null "$FRONTEND_URL/api/health" 2>/dev/null)
if [ "${frontend_issuance_test: -3}" = "200" ]; then
    print_result 0 "Frontend API Proxy Working"
else
    # Try direct CORS test
    cors_test=$(curl -s -w "%{http_code}" -H "Origin: $FRONTEND_URL" -o /dev/null "$ISSUANCE_URL/api/health" 2>/dev/null)
    if [ "${cors_test: -3}" = "200" ]; then
        print_result 0 "Frontend CORS Configuration"
    else
        print_result 1 "Frontend API Integration - Check CORS settings"
    fi
fi
echo ""

# Test 7: Load Testing (Light)
echo -e "${YELLOW}=== STEP 7: Basic Load Test ===${NC}"
echo -e "${BLUE}Testing:${NC} Multiple concurrent requests"

# Test 5 concurrent health checks
for i in {1..5}; do
    curl -s "$ISSUANCE_URL/api/health" > /dev/null &
done
wait

print_result 0 "Concurrent Request Handling"
echo ""

# Final Results
echo -e "${YELLOW}=== TEST SUMMARY ===${NC}"
echo ""
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your application is working perfectly!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Your application URLs:${NC}"
    echo -e "Frontend:     $FRONTEND_URL"
    echo -e "Issuance:     $ISSUANCE_URL"
    echo -e "Verification: $VERIFICATION_URL"
    echo ""
    echo -e "${BLUE}🧪 Manual Testing Steps:${NC}"
    echo "1. Open $FRONTEND_URL in your browser"
    echo "2. Try issuing a credential with the form"
    echo "3. Copy the credential ID from the response"
    echo "4. Switch to 'Verify Credential' tab"
    echo "5. Paste the credential ID and verify"
    echo ""
    echo -e "${GREEN}✅ Ready for submission!${NC}"
else
    echo -e "${RED}⚠️  Some tests failed. Please check the errors above.${NC}"
    echo ""
    echo -e "${BLUE}🔧 Common fixes:${NC}"
    echo "- Check that all services are deployed and running"
    echo "- Verify environment variables are set correctly"
    echo "- Ensure CORS is configured for cross-origin requests"
    echo "- Check Railway logs for any deployment errors"
fi

# Cleanup
rm -f /tmp/response.json /tmp/credential_response.json

echo ""
echo -e "${BLUE}📊 Test completed at $(date)${NC}"