# Kube Credential System

A complete microservice-based credential issuance and verification system built with Node.js, TypeScript, React, and Kubernetes. This system demonstrates modern cloud-native architecture with independent, scalable services.

## 🏗️ Architecture

### Backend Services
- **Issuance Service** (Port 3001): Issues credentials and tracks which worker handled each request
- **Verification Service** (Port 3002): Verifies issued credentials against the issuance service
- **Database**: SQLite for persistence (easily replaceable with PostgreSQL/MySQL)

### Frontend
- **React Application** (Port 3000): Two-page interface for credential issuance and verification
- **Responsive Design**: Clean, professional UI with real-time feedback

### Infrastructure
- **Docker**: Containerized services with multi-stage builds
- **Kubernetes**: Production-ready manifests with health checks and scaling
- **Load Balancing**: Service discovery and load distribution

## 🚀 Quick Start

### Local Development
```bash
# Install all dependencies
cd backend/issuance && npm install
cd ../verification && npm install
cd ../../frontend && npm install

# Start services (3 terminals)
cd backend/issuance && npm run dev     # Port 3001
cd backend/verification && npm run dev # Port 3002
cd frontend && npm start               # Port 3000
```

### Docker Deployment
```bash
# Build and start all services
./scripts/build-images.sh
docker-compose up -d

# Test the deployment
./scripts/test-services.sh
```

### Kubernetes Deployment
```bash
# Deploy to Kubernetes cluster
./scripts/deploy-k8s.sh

# Access via port forwarding
kubectl port-forward -n kube-credential service/frontend-service 8080:80
```

## 📋 Features

### Credential Issuance
- ✅ Issue new credentials with unique IDs
- ✅ Prevent duplicate issuance
- ✅ Worker identification for each request
- ✅ Support for multiple credential types
- ✅ Optional expiry dates
- ✅ Flexible data structure

### Credential Verification
- ✅ Verify credential authenticity
- ✅ Check expiration status
- ✅ Cross-service validation
- ✅ Audit trail with timestamps
- ✅ Worker tracking for verification

### User Interface
- ✅ Intuitive credential issuance form
- ✅ JSON-based verification interface
- ✅ Real-time feedback and error handling
- ✅ Sample data loading
- ✅ Responsive design

### DevOps & Deployment
- ✅ Docker containerization
- ✅ Kubernetes manifests
- ✅ Health checks and monitoring
- ✅ Horizontal pod autoscaling
- ✅ Ingress routing
- ✅ Production-ready configuration

## 🧪 Testing

### Unit Tests
```bash
npm run test:all                    # All services
npm run test:issuance              # Issuance service only
npm run test:verification          # Verification service only
npm run test:frontend              # Frontend only
```

### Integration Testing
```bash
# Start services and run integration tests
docker-compose up -d
./scripts/test-services.sh
```

### Manual Testing Scenarios
1. **Issue New Credential**: Complete form → Get success message with worker ID
2. **Duplicate Prevention**: Resubmit same data → Get "already issued" message
3. **Verify Valid Credential**: Use issued credential JSON → Get "VALID" status
4. **Verify Invalid Credential**: Use fake data → Get "INVALID" status
5. **Expiry Check**: Use expired credential → Get "expired" message

## 📊 API Endpoints

### Issuance Service (`/api`)
- `GET /health` - Service health check
- `POST /credentials` - Issue new credential

### Verification Service (`/api`)
- `GET /health` - Service health check  
- `POST /verify` - Verify credential

See [API.md](API.md) for detailed API documentation.

## 🔧 Configuration

### Environment Variables
```bash
# Issuance Service
NODE_ENV=production
PORT=3001
WORKER_ID=worker-1

# Verification Service  
NODE_ENV=production
PORT=3002
WORKER_ID=verifier-1
ISSUANCE_SERVICE_URL=http://issuance-service:3001

# Frontend
REACT_APP_ISSUANCE_API_URL=http://localhost:3001/api
REACT_APP_VERIFICATION_API_URL=http://localhost:3002/api
```

## 📁 Project Structure
```
kube-credential/
├── backend/
│   ├── issuance/          # Credential issuance service
│   └── verification/      # Credential verification service
├── frontend/              # React application
├── k8s/                   # Kubernetes manifests
├── scripts/               # Deployment and testing scripts
├── docker-compose.yml     # Local development setup
└── docs/                  # Additional documentation
```

## 🚀 Cloud Deployment

### AWS EKS
1. Build and push images to ECR
2. Update Kubernetes manifests with ECR image URLs
3. Deploy using `kubectl apply -f k8s/`

### Google GKE / Azure AKS
1. Push images to respective container registries
2. Update image references in manifests
3. Deploy using provided Kubernetes configurations

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔍 Monitoring & Observability

- **Health Checks**: All services expose `/api/health` endpoints
- **Logging**: Structured logging with request tracing
- **Metrics**: Ready for Prometheus integration
- **Kubernetes Probes**: Liveness and readiness checks configured

## 🛡️ Security Features

- **Helmet.js**: Security headers for Express services
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Request payload validation
- **Non-root Containers**: Security-hardened Docker images
- **Resource Limits**: Kubernetes resource constraints

## 📚 Documentation

- [API Documentation](API.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions  
- [Testing Guide](TESTING.md) - Comprehensive testing procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 👤 **Contact Information**

**Name**: Abhishek Mukherjee  
**Email**: mukherjeeabhishek207@gmail.com  


---

**Built with ❤️ using Node.js, TypeScript, React, and Kubernetes**
