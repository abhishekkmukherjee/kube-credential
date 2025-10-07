#!/bin/bash

# Build Docker images for Kube Credential system

echo "Building Kube Credential Docker images..."

# Build issuance service
echo "Building issuance service..."
docker build -t kube-credential/issuance-service:latest ./backend/issuance

# Build verification service
echo "Building verification service..."
docker build -t kube-credential/verification-service:latest ./backend/verification

# Build frontend
echo "Building frontend..."
docker build -t kube-credential/frontend:latest ./frontend

echo "All images built successfully!"

# List built images
echo "Built images:"
docker images | grep kube-credential