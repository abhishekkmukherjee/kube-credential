export interface Credential {
  id: string;
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate?: string;
  data: Record<string, any>;
}

export interface VerificationRecord {
  id: string;
  credentialId: string;
  workerId: string;
  timestamp: string;
  verificationResult: 'valid' | 'invalid' | 'expired';
  issuanceWorkerId?: string;
  issuanceTimestamp?: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  valid: boolean;
  credential?: Credential;
  workerId: string;
  timestamp: string;
  issuanceWorkerId?: string;
  issuanceTimestamp?: string;
}