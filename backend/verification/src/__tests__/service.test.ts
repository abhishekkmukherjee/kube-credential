import { VerificationService } from '../service';
import { Database } from '../database';
import axios from 'axios';

// Mock dependencies
jest.mock('../database');
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VerificationService', () => {
  let service: VerificationService;
  let mockDb: jest.Mocked<Database>;

  beforeEach(() => {
    service = new VerificationService();
    mockDb = new Database() as jest.Mocked<Database>;
    (service as any).db = mockDb;
    jest.clearAllMocks();
  });

  describe('verifyCredential', () => {
    const validCredential = {
      id: 'test-id',
      holderName: 'John Doe',
      credentialType: 'Driver License',
      issueDate: '2023-01-01T00:00:00.000Z',
      data: { licenseNumber: 'DL123456' }
    };

    it('should verify a valid credential successfully', async () => {
      mockDb.saveVerification.mockResolvedValue();
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          alreadyIssued: true,
          workerId: 'worker-123',
          timestamp: '2023-01-01T00:00:00.000Z'
        }
      });

      const result = await service.verifyCredential(validCredential);

      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Credential is valid');
      expect(result.issuanceWorkerId).toBe('worker-123');
      expect(mockDb.saveVerification).toHaveBeenCalled();
    });

    it('should reject an invalid credential', async () => {
      mockDb.saveVerification.mockResolvedValue();
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          alreadyIssued: false
        }
      });

      const result = await service.verifyCredential(validCredential);

      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Credential is not valid or does not exist');
    });

    it('should reject an expired credential', async () => {
      const expiredCredential = {
        ...validCredential,
        expiryDate: '2022-01-01T00:00:00.000Z' // Past date
      };

      mockDb.saveVerification.mockResolvedValue();

      const result = await service.verifyCredential(expiredCredential);

      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Credential has expired');
    });

    it('should handle service errors gracefully', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));
      mockDb.saveVerification.mockResolvedValue();

      const result = await service.verifyCredential(validCredential);

      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Credential is not valid or does not exist');
    });
  });

  describe('getWorkerId', () => {
    it('should return the worker ID', () => {
      const workerId = service.getWorkerId();
      expect(workerId).toBeDefined();
      expect(typeof workerId).toBe('string');
    });
  });
});