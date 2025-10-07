import axios from 'axios';
import { IssuanceResponse, VerificationResponse, Credential } from '../types';

const ISSUANCE_API_URL = process.env.REACT_APP_ISSUANCE_API_URL || 'http://localhost:3001/api';
const VERIFICATION_API_URL = process.env.REACT_APP_VERIFICATION_API_URL || 'http://localhost:3002/api';

export const apiService = {
  async issueCredential(credentialData: {
    holderName: string;
    credentialType: string;
    expiryDate?: string;
    data?: Record<string, any>;
  }): Promise<IssuanceResponse> {
    try {
      const response = await axios.post(`${ISSUANCE_API_URL}/credentials`, credentialData);
      return response.data;
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw new Error('Failed to issue credential');
    }
  },

  async verifyCredential(credential: Credential): Promise<VerificationResponse> {
    try {
      const response = await axios.post(`${VERIFICATION_API_URL}/verify`, credential);
      return response.data;
    } catch (error) {
      console.error('Error verifying credential:', error);
      throw new Error('Failed to verify credential');
    }
  },

  async checkIssuanceHealth(): Promise<any> {
    try {
      const response = await axios.get(`${ISSUANCE_API_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Issuance service health check failed:', error);
      throw error;
    }
  },

  async checkVerificationHealth(): Promise<any> {
    try {
      const response = await axios.get(`${VERIFICATION_API_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Verification service health check failed:', error);
      throw error;
    }
  }
};