import React, { useState } from 'react';
import { apiService } from '../services/api';
import { IssuanceResponse } from '../types';

const IssuancePage: React.FC = () => {
  const [formData, setFormData] = useState({
    holderName: '',
    credentialType: '',
    expiryDate: '',
    licenseNumber: '',
    additionalData: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IssuanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data: any = {
        holderName: formData.holderName,
        credentialType: formData.credentialType,
        data: {}
      };

      if (formData.expiryDate) {
        data.expiryDate = new Date(formData.expiryDate).toISOString();
      }

      if (formData.licenseNumber) {
        data.data.licenseNumber = formData.licenseNumber;
      }

      if (formData.additionalData) {
        try {
          const additionalJson = JSON.parse(formData.additionalData);
          data.data = { ...data.data, ...additionalJson };
        } catch {
          data.data.additionalInfo = formData.additionalData;
        }
      }

      const response = await apiService.issueCredential(data);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1
  };

  return (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '2rem' }}>Issue New Credential</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Holder Name *
              </label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleInputChange}
                required
                style={inputStyle}
                placeholder="Enter full name"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Credential Type *
              </label>
              <select
                name="credentialType"
                value={formData.credentialType}
                onChange={handleInputChange}
                required
                style={inputStyle}
              >
                <option value="">Select credential type</option>
                <option value="Driver License">Driver License</option>
                <option value="Passport">Passport</option>
                <option value="ID Card">ID Card</option>
                <option value="Professional Certificate">Professional Certificate</option>
                <option value="Academic Degree">Academic Degree</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                License/ID Number (Optional)
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter license or ID number"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Additional Data (Optional JSON)
              </label>
              <textarea
                name="additionalData"
                value={formData.additionalData}
                onChange={handleInputChange}
                style={{ ...inputStyle, minHeight: '100px' }}
                placeholder='{"field": "value"} or plain text'
              />
            </div>

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Issuing...' : 'Issue Credential'}
            </button>
          </form>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Result</h3>
          
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
            <div style={{
              backgroundColor: result.success ? '#2ecc71' : '#e74c3c',
              color: 'white',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <strong>{result.message}</strong>
              {result.workerId && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Worker: {result.workerId}
                </div>
              )}
            </div>
          )}

          {result?.credential && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Credential Details:</h4>
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
        </div>
      </div>
    </div>
  );
};

export default IssuancePage;