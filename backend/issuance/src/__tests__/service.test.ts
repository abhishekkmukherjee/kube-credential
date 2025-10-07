import { IssuanceService } from '../service';
import { Database } from '../database';

// Mock the database
jest.mock('../database');

describe('IssuanceService', () => {
  let service: IssuanceService;
  let mockDb: jest.Mocked<Database>;

  beforeEach(() => {
    service = new IssuanceService();
    mockDb = new Database() as jest.Mocked<Database>;
    (service as any).db = mockDb;
  });

  describe('issueCredential', () => {
    it('should issue a new credential successfully', async () => {
      mockDb.findCredential.mockResolvedValue(null);
      mockDb.saveCredential.mockResolvedValue();

      const credentialData = {
        holderName: 'John Doe',
        credentialType: 'Driver License',
        data: { licenseNumber: 'DL123456' }
      };

      const result = await service.issueCredential(credentialData);

      expect(result.success).toBe(true);
      expect(result.alreadyIssued).toBe(false);
      expect(result.credential).toBeDefined();
      expect(result.credential?.holderName).toBe('John Doe');
      expect(result.workerId).toBeDefined();
      expect(mockDb.saveCredential).toHaveBeenCalled();
    });

    it('should return existing credential if already issued', async () => {
      const existingRecord = {
        id: 'test-id',
        credential: {
          id: 'test-id',
          holderName: 'John Doe',
          credentialType: 'Driver License',
          issueDate: '2023-01-01T00:00:00.000Z',
          data: {}
        },
        workerId: 'worker-123',
        timestamp: '2023-01-01T00:00:00.000Z',
        status: 'issued' as const
      };

      mockDb.findCredential.mockResolvedValue(existingRecord);

      const credentialData = {
        holderName: 'John Doe',
        credentialType: 'Driver License',
        data: {}
      };

      const result = await service.issueCredential(credentialData);

      expect(result.success).toBe(true);
      expect(result.alreadyIssued).toBe(true);
      expect(result.workerId).toBe('worker-123');
      expect(mockDb.saveCredential).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockDb.findCredential.mockRejectedValue(new Error('Database error'));

      const credentialData = {
        holderName: 'John Doe',
        credentialType: 'Driver License',
        data: {}
      };

      const result = await service.issueCredential(credentialData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to issue credential');
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