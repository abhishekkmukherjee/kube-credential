import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Manual CORS headers - bulletproof approach
app.use((req, res, next) => {
  // Allow all origins
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
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

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Credential Issuance Service running on port ${PORT}`);
  console.log(`Worker ID: ${process.env.WORKER_ID || 'auto-generated'}`);
});

export default app;