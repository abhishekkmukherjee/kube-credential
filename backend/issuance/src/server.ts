import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import routes from './routes';

const app = express();

// ✅ Safe environment variable defaults
const PORT: number = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_URL: string = process.env.FRONTEND_URL || 'http://localhost:3000';
const WORKER_ID: string = process.env.WORKER_ID || 'auto-generated';

// ✅ Allowed frontend origins
const allowedOrigins: string[] = [FRONTEND_URL, 'http://localhost:3000'];

// ✅ Custom CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
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

// ✅ Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Credential Issuance API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      issueCredential: 'POST /api/credentials',
      getCredential: 'GET /api/credentials/:id'
    },
    workerId: WORKER_ID
  });
});

// ✅ Main API routes
app.use('/api', routes);

// ✅ Global error handler (with proper typings)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
  console.log(`🧩 Worker ID: ${WORKER_ID}`);
});

export default app;
