import { v4 as uuidv4 } from 'uuid';
import { Database } from './database';
import { Credential, IssuanceRecord, IssuanceResponse } from './types';

export class IssuanceService {
  private db: Database;
  private workerId: string;

  constructor() {
    this.db = new Database();
    this.workerId = process.env.WORKER_ID || `worker-${Math.floor(Math.random() * 1000)}`;
  }

  async issueCredential(credentialData: Omit<Credential, 'id' | 'issueDate'>): Promise<IssuanceResponse> {
    try {
      // Generate credential ID based on holder name and type for consistency
      const credentialId = this.generateCredentialId(credentialData.holderName, credentialData.credentialType);
      
      // Check if credential already exists
      const existingCredential = await this.db.findCredential(credentialId);
      if (existingCredential) {
        return {
          success: true,
          message: `Credential already issued by ${existingCredential.workerId}`,
          credential: existingCredential.credential,
          workerId: existingCredential.workerId,
          timestamp: existingCredential.timestamp,
          alreadyIssued: true
        };
      }

      // Create new credential
      const credential: Credential = {
        id: credentialId,
        issueDate: new Date().toISOString(),
        ...credentialData
      };

      const record: IssuanceRecord = {
        id: credentialId,
        credential,
        workerId: this.workerId,
        timestamp: new Date().toISOString(),
        status: 'issued'
      };

      await this.db.saveCredential(record);

      return {
        success: true,
        message: `Credential issued by ${this.workerId}`,
        credential,
        workerId: this.workerId,
        timestamp: record.timestamp,
        alreadyIssued: false
      };
    } catch (error) {
      console.error('Error issuing credential:', error);
      return {
        success: false,
        message: 'Failed to issue credential'
      };
    }
  }

  private generateCredentialId(holderName: string, credentialType: string): string {
    // Create consistent ID based on holder name and credential type
    const baseString = `${holderName.toLowerCase().replace(/\s+/g, '-')}-${credentialType.toLowerCase().replace(/\s+/g, '-')}`;
    return `cred-${baseString}-${uuidv4().substring(0, 8)}`;
  }

  getWorkerId(): string {
    return this.workerId;
  }
}