import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Database } from './database';
import { Credential, VerificationRecord, VerificationResponse } from './types';

export class VerificationService {
  private db: Database;
  private workerId: string;
  private issuanceServiceUrl: string;

  constructor() {
    this.db = new Database();
    this.workerId = process.env.WORKER_ID || `verifier-${Math.floor(Math.random() * 1000)}`;
    this.issuanceServiceUrl = process.env.ISSUANCE_SERVICE_URL || 'http://localhost:3001';
  }

  async verifyCredential(credential: Credential): Promise<VerificationResponse> {
    try {
      const timestamp = new Date().toISOString();
      
      // Check if credential is expired
      if (credential.expiryDate && new Date(credential.expiryDate) < new Date()) {
        await this.saveVerificationRecord(credential.id, 'expired', timestamp);
        return {
          success: true,
          message: 'Credential has expired',
          valid: false,
          workerId: this.workerId,
          timestamp
        };
      }

      // Verify credential exists in issuance service
      const isValid = await this.checkCredentialWithIssuanceService(credential);
      
      if (isValid.exists) {
        await this.saveVerificationRecord(
          credential.id, 
          'valid', 
          timestamp, 
          isValid.issuanceWorkerId, 
          isValid.issuanceTimestamp
        );
        
        return {
          success: true,
          message: 'Credential is valid',
          valid: true,
          credential,
          workerId: this.workerId,
          timestamp,
          issuanceWorkerId: isValid.issuanceWorkerId,
          issuanceTimestamp: isValid.issuanceTimestamp
        };
      } else {
        await this.saveVerificationRecord(credential.id, 'invalid', timestamp);
        return {
          success: true,
          message: 'Credential is not valid or does not exist',
          valid: false,
          workerId: this.workerId,
          timestamp
        };
      }
    } catch (error) {
      console.error('Error verifying credential:', error);
      return {
        success: false,
        message: 'Failed to verify credential',
        valid: false,
        workerId: this.workerId,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async checkCredentialWithIssuanceService(credential: Credential): Promise<{
    exists: boolean;
    issuanceWorkerId?: string;
    issuanceTimestamp?: string;
  }> {
    try {
      // In a real system, we'd have a dedicated endpoint for this
      // For now, we'll simulate by checking if we can issue the same credential
      // and see if it returns "already issued"
      const response = await axios.post(`${this.issuanceServiceUrl}/api/credentials`, {
        holderName: credential.holderName,
        credentialType: credential.credentialType,
        expiryDate: credential.expiryDate,
        data: credential.data
      });

      if (response.data.success && response.data.alreadyIssued) {
        return {
          exists: true,
          issuanceWorkerId: response.data.workerId,
          issuanceTimestamp: response.data.timestamp
        };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error checking with issuance service:', error);
      return { exists: false };
    }
  }

  private async saveVerificationRecord(
    credentialId: string, 
    result: 'valid' | 'invalid' | 'expired', 
    timestamp: string,
    issuanceWorkerId?: string,
    issuanceTimestamp?: string
  ): Promise<void> {
    const record: VerificationRecord = {
      id: uuidv4(),
      credentialId,
      workerId: this.workerId,
      timestamp,
      verificationResult: result,
      issuanceWorkerId,
      issuanceTimestamp
    };

    await this.db.saveVerification(record);
  }

  getWorkerId(): string {
    return this.workerId;
  }
}