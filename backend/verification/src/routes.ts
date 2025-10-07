import { Router, Request, Response } from 'express';
import { VerificationService } from './service';

const router = Router();
const verificationService = new VerificationService();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    service: 'credential-verification',
    workerId: verificationService.getWorkerId(),
    timestamp: new Date().toISOString()
  });
});

// Verify credential endpoint
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const credential = req.body;

    // Validate required fields
    if (!credential.id || !credential.holderName || !credential.credentialType) {
      return res.status(400).json({
        success: false,
        message: 'Credential must include id, holderName, and credentialType',
        valid: false,
        workerId: verificationService.getWorkerId(),
        timestamp: new Date().toISOString()
      });
    }

    const result = await verificationService.verifyCredential(credential);
    res.json(result);
  } catch (error) {
    console.error('Error in credential verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      valid: false,
      workerId: verificationService.getWorkerId(),
      timestamp: new Date().toISOString()
    });
  }
});

export default router;