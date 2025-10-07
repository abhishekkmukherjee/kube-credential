export interface Credential {
  id: string;
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate?: string;
  data: Record<string, any>;
}

export interface IssuanceRecord {
  id: string;
  credential: Credential;
  workerId: string;
  timestamp: string;
  status: 'issued' | 'revoked';
}

export interface IssuanceResponse {
  success: boolean;
  message: string;
  credential?: Credential;
  workerId?: string;
  timestamp?: string;
  alreadyIssued?: boolean;
}