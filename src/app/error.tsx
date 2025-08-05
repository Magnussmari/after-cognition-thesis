'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '1rem' }}>
          Something went wrong!
        </h1>
        
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8d7da',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          overflowX: 'auto'
        }}>
          <strong>Error:</strong> {error.message}
          {error.digest && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Digest:</strong> {error.digest}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
          
          <button
            onClick={() => window.location.href = '/auth/login'}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}