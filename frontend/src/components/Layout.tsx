import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
            Kube Credential
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/issue"
              style={{
                color: location.pathname === '/issue' ? '#3498db' : 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                backgroundColor: location.pathname === '/issue' ? 'rgba(52, 152, 219, 0.2)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              Issue Credential
            </Link>
            <Link
              to="/verify"
              style={{
                color: location.pathname === '/verify' ? '#3498db' : 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                backgroundColor: location.pathname === '/verify' ? 'rgba(52, 152, 219, 0.2)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              Verify Credential
            </Link>
          </div>
        </div>
      </nav>
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;