export interface Credential {
  id: string;
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate?: string;
  data: Record<string, any>;
}

export interface IssuanceResponse {
  success: boolean;
  message: string;
  credential?: Credential;
  workerId?: string;
  timestamp?: string;
  alreadyIssued?: boolean;
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