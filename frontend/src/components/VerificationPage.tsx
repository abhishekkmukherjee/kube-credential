import React, { useState } from 'react';
import { apiService } from '../services/api';
import { VerificationResponse, Credential } from '../types';

const VerificationPage: React.FC = () => {
  const [credentialJson, setCredentialJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const credential: Credential = JSON.parse(credentialJson);
      
      // Validate required fields
      if (!credential.id || !credential.holderName || !credential.credentialType) {
        throw new Error('Credential must include id, holderName, and credentialType');
      }

      const response = await apiService.verifyCredential(credential);
      setResult(response);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your credential data.');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSampleCredential = () => {
    const sampleCredential = {
      id: "cred-john-doe-driver-license-12345678",
      holderName: "John Doe",
      credentialType: "Driver License",
      issueDate: "2023-01-01T00:00:00.000Z",
      expiryDate: "2028-01-01T00:00:00.000Z",
      data: {
        licenseNumber: "DL123456789"
      }
    };
    setCredentialJson(JSON.stringify(sampleCredential, null, 2));
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'monospace'
  };

  const buttonStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    marginRight: '1rem'
  };

  const sampleButtonStyle = {
    backgroundColor: '#95a5a6',
    color: 'white',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  };

  return (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '2rem' }}>Verify Credential</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>
                  Credential JSON *
                </label>
                <button
                  type="button"
                  onClick={loadSampleCredential}
                  style={sampleButtonStyle}
                >
                  Load Sample
                </button>
              </div>
              <textarea
                value={credentialJson}
                onChange={(e) => setCredentialJson(e.target.value)}
                required
                style={{ ...inputStyle, minHeight: '300px' }}
                placeholder={`Paste credential JSON here, e.g.:
{
  "id": "cred-john-doe-driver-license-12345678",
  "holderName": "John Doe",
  "credentialType": "Driver License",
  "issueDate": "2023-01-01T00:00:00.000Z",
  "data": {
    "licenseNumber": "DL123456789"
  }
}`}
              />
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <strong>Required fields:</strong> id, holderName, credentialType
            </div>

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Verifying...' : 'Verify Credential'}
            </button>
          </form>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Verification Result</h3>
          
          {error && (
            <div style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              Error: {error}
            </div>
          )}

          {result && (
            <>
              <div style={{
                backgroundColor: result.valid ? '#2ecc71' : '#e74c3c',
                color: 'white',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {result.valid ? '✓ VALID' : '✗ INVALID'}
                </div>
                <div>{result.message}</div>
              </div>

              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Verification Details:</h4>
                <div style={{ fontSize: '0.9rem' }}>
                  <div><strong>Verified by:</strong> {result.workerId}</div>
                  <div><strong>Verification time:</strong> {new Date(result.timestamp).toLocaleString()}</div>
                  {result.issuanceWorkerId && (
                    <div><strong>Originally issued by:</strong> {result.issuanceWorkerId}</div>
                  )}
                  {result.issuanceTimestamp && (
                    <div><strong>Issue time:</strong> {new Date(result.issuanceTimestamp).toLocaleString()}</div>
                  )}
                </div>
              </div>

              {result.credential && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Credential Data:</h4>
                  <pre style={{
                    backgroundColor: '#ffffff',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.9rem',
                    margin: 0
                  }}>
                    {JSON.stringify(result.credential, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;