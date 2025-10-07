# Kube Credential Management System

A modern credential management system built with React frontend and Node.js microservices backend.

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- Responsive design with modern UI

### Backend Services
- **Credential Issuance Service** (Port 3001)
- **Credential Verification Service** (Port 3002)
- Both built with Express.js and TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Local Development

1. **Extract and navigate to the project**
```bash
unzip kube-credential.zip
cd kube-credential
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend/issuance && npm install
cd ../verification && npm install
```

3. **Start the services**

Start all services with one command:
```bash
npm run dev
```

Or start individually:
```bash
# Terminal 1 - Issuance Service
cd backend/issuance && npm run dev

# Terminal 2 - Verification Service  
cd backend/verification && npm run dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Issuance API: http://localhost:3001
- Verification API: http://localhost:3002

## 📁 Project Structure

```
kube-credential/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── types.ts         # TypeScript types
│   └── package.json
├── backend/
│   ├── issuance/           # Credential issuance service
│   │   ├── src/
│   │   │   ├── server.ts   # Express server
│   │   │   ├── routes.ts   # API routes
│   │   │   ├── service.ts  # Business logic
│   │   │   └── database.ts # Data layer
│   │   └── package.json
│   └── verification/       # Credential verification service
│       ├── src/
│       │   ├── server.ts   # Express server
│       │   ├── routes.ts   # API routes
│       │   ├── service.ts  # Business logic
│       │   └── database.ts # Data layer
│       └── package.json
└── scripts/                # Utility scripts
```

## 🔧 API Endpoints

### Credential Issuance Service (Port 3001)
- `GET /` - Service info
- `GET /api/health` - Health check
- `POST /api/credentials` - Issue new credential
- `GET /api/credentials/:id` - Get credential by ID

### Credential Verification Service (Port 3002)
- `GET /` - Service info
- `GET /api/health` - Health check
- `POST /api/verify` - Verify credential

## 🧪 Testing

Run tests for all services:
```bash
npm test
```

Run tests for individual services:
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend/issuance && npm test
cd backend/verification && npm test
```

## 📝 Features

- **Credential Issuance**: Create and manage digital credentials
- **Credential Verification**: Verify credential authenticity
- **Responsive UI**: Works on desktop and mobile devices
- **Microservices Architecture**: Scalable and maintainable
- **TypeScript**: Type-safe development
- **Testing**: Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.