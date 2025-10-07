import { Router, Request, Response } from 'express';
import { IssuanceService } from './service';

const router = Router();
const issuanceService = new IssuanceService();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    service: 'credential-issuance',
    workerId: issuanceService.getWorkerId(),
    timestamp: new Date().toISOString()
  });
});

// Issue credential endpoint
router.post('/credentials', async (req: Request, res: Response) => {
  try {
    const { holderName, credentialType, expiryDate, data } = req.body;

    // Validate required fields
    if (!holderName || !credentialType) {
      return res.status(400).json({
        success: false,
        message: 'holderName and credentialType are required'
      });
    }

    const result = await issuanceService.issueCredential({
      holderName,
      credentialType,
      expiryDate,
      data: data || {}
    });

    const statusCode = result.success ? (result.alreadyIssued ? 200 : 201) : 500;
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Error in credential issuance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;