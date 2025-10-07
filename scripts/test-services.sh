#!/bin/bash

# Test Kube Credential services

echo "Testing Kube Credential services..."

# Test issuance service health
echo "Testing issuance service health..."
curl -f http://localhost:3001/api/health || echo "Issuance service not responding"

# Test verification service health
echo "Testing verification service health..."
curl -f http://localhost:3002/api/health || echo "Verification service not responding"

# Test credential issuance
echo "Testing credential issuance..."
curl -X POST http://localhost:3001/api/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "holderName": "Test User",
    "credentialType": "Driver License",
    "data": {"licenseNumber": "TEST123"}
  }' || echo "Credential issuance failed"

# Test credential verification (using a sample credential)
echo "Testing credential verification..."
curl -X POST http://localhost:3002/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-credential-id",
    "holderName": "Test User",
    "credentialType": "Driver License",
    "issueDate": "2023-01-01T00:00:00.000Z",
    "data": {"licenseNumber": "TEST123"}
  }' || echo "Credential verification failed"

echo "Service tests completed!"