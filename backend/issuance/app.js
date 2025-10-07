// Ultra-simple Express server with CORS - guaranteed to work
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting ultra-simple issuance service...');

// CORS middleware - first thing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// In-memory storage
const credentials = new Map();

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'credential-issuance',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Issue credential
app.post('/api/credentials', (req, res) => {
  const { holderName, holderEmail, credentialType, issuerName, data } = req.body;
  
  if (!holderName || !credentialType) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  const credentialId = `cred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const credential = {
    id: credentialId,
    holderName,
    holderEmail,
    credentialType,
    issuerName: issuerName || 'Default Issuer',
    data: data || {},
    issuedAt: new Date().toISOString()
  };

  credentials.set(credentialId, credential);

  res.status(201).json({
    success: true,
    message: 'Credential issued successfully',
    credential
  });
});

// Get credential
app.get('/api/credentials/:id', (req, res) => {
  const credential = credentials.get(req.params.id);
  
  if (!credential) {
    return res.status(404).json({
      success: false,
      message: 'Credential not found'
    });
  }

  res.json({
    success: true,
    credential
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});