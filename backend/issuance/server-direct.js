const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Manual CORS headers - bulletproof approach
app.use((req, res, next) => {
  // Allow all origins
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling preflight request');
    res.status(200).end();
    return;
  }
  
  next();
});

// Middleware
app.use(express.json());

// In-memory storage for credentials
const credentials = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'credential-issuance',
    workerId: process.env.WORKER_ID || 'railway-issuance-worker-1',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Issue credential endpoint
app.post('/api/credentials', (req, res) => {
  try {
    const { holderName, holderEmail, credentialType, issuerName, data } = req.body;
    
    if (!holderName || !credentialType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: holderName, credentialType'
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
      issuedAt: new Date().toISOString(),
      workerId: process.env.WORKER_ID || 'railway-issuance-worker-1'
    };

    credentials.set(credentialId, credential);

    console.log(`✅ Credential issued: ${credentialId} for ${holderName}`);

    res.status(201).json({
      success: true,
      message: 'Credential issued successfully',
      credential
    });
  } catch (error) {
    console.error('Error issuing credential:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to issue credential'
    });
  }
});

// Get credential endpoint
app.get('/api/credentials/:id', (req, res) => {
  try {
    const { id } = req.params;
    const credential = credentials.get(id);

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
  } catch (error) {
    console.error('Error retrieving credential:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve credential'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Credential Issuance Service running on port ${PORT}`);
  console.log(`🔧 Worker ID: ${process.env.WORKER_ID || 'railway-issuance-worker-1'}`);
  console.log(`✅ CORS enabled for all origins`);
});

module.exports = app;