const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3002;

console.log('🚀 Starting standalone verification server...');

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

// Health endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'healthy',
    service: 'credential-verification',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Credential Verification Service',
    status: 'running',
    endpoints: ['/api/health', '/api/verify']
  });
});

// Verify credential
app.post('/api/verify', async (req, res) => {
  try {
    console.log('Credential verification requested:', req.body);
    
    const { credentialId } = req.body;
    
    if (!credentialId) {
      return res.status(400).json({
        success: false,
        message: 'Missing credentialId'
      });
    }

    const issuanceUrl = process.env.ISSUANCE_SERVICE_URL || 'https://kube-credential-production.up.railway.app';
    console.log(`🔍 Contacting issuance service: ${issuanceUrl}`);

    const response = await axios.get(`${issuanceUrl}/api/credentials/${credentialId}`, {
      timeout: 10000
    });
    
    const data = response.data;
    
    if (!data.success) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    console.log(`✅ Credential verified: ${credentialId}`);

    res.json({
      success: true,
      message: 'Credential is valid',
      credential: data.credential,
      verifiedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error verifying credential:', error.message);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to verify credential'
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
  console.log(`✅ Standalone Verification Service running on port ${PORT}`);
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