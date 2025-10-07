const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting standalone issuance server...');

// CORS middleware - allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling preflight request');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// In-memory storage
const credentials = new Map();

// Health endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'healthy',
    service: 'credential-issuance',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Credential Issuance Service',
    status: 'running',
    endpoints: ['/api/health', '/api/credentials']
  });
});

// Issue credential
app.post('/api/credentials', (req, res) => {
  try {
    console.log('Credential issuance requested:', req.body);
    
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
      issuedAt: new Date().toISOString()
    };

    credentials.set(credentialId, credential);
    console.log(`✅ Credential issued: ${credentialId}`);

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

// Get credential
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

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Standalone Issuance Service running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 CORS enabled for all origins`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;