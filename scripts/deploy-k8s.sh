#!/bin/bash

# Deploy Kube Credential to Kubernetes

echo "Deploying Kube Credential to Kubernetes..."

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Deploy services
echo "Deploying issuance service..."
kubectl apply -f k8s/issuance-deployment.yaml

echo "Deploying verification service..."
kubectl apply -f k8s/verification-deployment.yaml

echo "Deploying frontend..."
kubectl apply -f k8s/frontend-deployment.yaml

# Deploy ingress
echo "Deploying ingress..."
kubectl apply -f k8s/ingress.yaml

echo "Deployment complete!"

# Check status
echo "Checking deployment status..."
kubectl get pods -n kube-credential
kubectl get services -n kube-credential
kubectl get ingress -n kube-credential