const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

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
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Credential Verification API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      verifyCredential: 'POST /api/verify'
    },
    workerId: process.env.WORKER_ID || 'render-verification-worker-1'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'credential-verification',
    workerId: process.env.WORKER_ID || 'render-verification-worker-1',
    timestamp: new Date().toISOString()
  });
});

// Verify credential endpoint
app.post('/api/verify', async (req, res) => {
  try {
    const credential = req.body;

    // Validate required fields
    if (!credential.id || !credential.holderName || !credential.credentialType) {
      return res.status(400).json({
        success: false,
        message: 'Credential must include id, holderName, and credentialType',
        valid: false,
        workerId: process.env.WORKER_ID || 'render-verification-worker-1',
        timestamp: new Date().toISOString()
      });
    }

    // Simple verification logic
    const isValid = credential.id && 
                   credential.holderName && 
                   credential.credentialType &&
                   credential.issuedAt;

    res.json({
      success: true,
      valid: isValid,
      message: isValid ? 'Credential is valid' : 'Credential validation failed',
      workerId: process.env.WORKER_ID || 'render-verification-worker-1',
      timestamp: new Date().toISOString(),
      credential: {
        id: credential.id,
        holderName: credential.holderName,
        credentialType: credential.credentialType,
        verified: isValid
      }
    });
  } catch (error) {
    console.error('Error in credential verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      valid: false,
      workerId: process.env.WORKER_ID || 'render-verification-worker-1',
      timestamp: new Date().toISOString()
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
  console.log(`🔧 Worker ID: ${process.env.WORKER_ID || 'render-verification-worker-1'}`);
  console.log(`✅ CORS enabled for all origins`);
  console.log(`🌐 Server listening on 0.0.0.0:${PORT}`);
});

module.exports = app;