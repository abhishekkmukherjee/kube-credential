import express from 'express';
import helmet from 'helmet';
import routes from './routes.js'; // adjust if needed

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Get frontend URL from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ✅ Allowed frontend origins
const allowedOrigins = [FRONTEND_URL, 'http://localhost:3000'];

// ✅ CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  // ✅ Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

// ✅ Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ✅ JSON body parser
app.use(express.json());

// ✅ Main routes
app.use('/api', routes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server!',
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Credential Issuance Service running on port ${PORT}`);
  console.log(`🌐 Allowed frontend origin: ${FRONTEND_URL}`);
  console.log(`🧩 Worker ID: ${process.env.WORKER_ID || 'auto-generated'}`);
});

export default app;
