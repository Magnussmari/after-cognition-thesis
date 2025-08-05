import Link from 'next/link';

export default function AuthErrorPage() {
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
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '1rem' }}>
          Authentication Error
        </h1>
        
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          There was an error with the authentication link. This could be because:
        </p>
        
        <ul style={{ 
          textAlign: 'left', 
          marginBottom: '2rem',
          color: '#555',
          lineHeight: '1.8'
        }}>
          <li>The link has expired</li>
          <li>The link was already used</li>
          <li>The link is invalid</li>
        </ul>
        
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          Please use the password login instead:
        </p>
        
        <Link
          href="/auth/login/password"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem'
          }}
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}