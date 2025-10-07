// Ultra-simple Express server with CORS - guaranteed to work
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

console.log('🚀 Starting ultra-simple verification service...');

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

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'credential-verification',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Verify credential
app.post('/api/verify', async (req, res) => {
  try {
    const { credentialId } = req.body;
    
    if (!credentialId) {
      return res.status(400).json({
        success: false,
        message: 'Missing credentialId'
      });
    }

    const issuanceUrl = process.env.ISSUANCE_SERVICE_URL || 'https://kube-credential-production.up.railway.app';
    
    // Use axios for HTTP request
    const axios = require('axios');
    const response = await axios.get(`${issuanceUrl}/api/credentials/${credentialId}`);
    
    const data = response.data;
    
    if (!data.success) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    res.json({
      success: true,
      message: 'Credential is valid',
      credential: data.credential,
      verifiedAt: new Date().toISOString()
    });

  } catch (error) {
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});