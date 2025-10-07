const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002;

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'credential-verification',
    workerId: process.env.WORKER_ID || 'railway-verification-worker-1',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Verify credential endpoint
app.post('/api/verify', async (req, res) => {
  try {
    const { credentialId } = req.body;
    
    if (!credentialId) {
      return res.status(400).json({
        success: false,
        message: 'Missing credentialId'
      });
    }

    // Get issuance service URL
    const issuanceUrl = process.env.ISSUANCE_SERVICE_URL || 'https://kube-credential-production.up.railway.app';
    
    console.log(`🔍 Verifying credential: ${credentialId}`);
    console.log(`📡 Contacting issuance service: ${issuanceUrl}`);

    // Fetch credential from issuance service using axios
    const axios = require('axios');
    const response = await axios.get(`${issuanceUrl}/api/credentials/${credentialId}`);
    
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
      verifiedAt: new Date().toISOString(),
      verifiedBy: process.env.WORKER_ID || 'railway-verification-worker-1'
    });

  } catch (error) {
    console.error('Error verifying credential:', error);
    
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Credential Verification Service running on port ${PORT}`);
  console.log(`🔧 Worker ID: ${process.env.WORKER_ID || 'railway-verification-worker-1'}`);
  console.log(`✅ CORS enabled for all origins`);
});

module.exports = app;