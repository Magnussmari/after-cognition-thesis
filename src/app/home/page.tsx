import Link from 'next/link';

export default function PublicHomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f8f9fa',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
        After Cognition
      </h1>
      
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#666' }}>
        Human Value in the Age of Irreducibility
      </p>
      
      <p style={{ marginBottom: '3rem', color: '#555', maxWidth: '600px' }}>
        An exploration of human value and meaning in an age where AI systems approach and exceed human cognitive capabilities.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          href="/auth/login"
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem'
          }}
        >
          Login to Read
        </Link>
        
        <Link
          href="/test"
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem'
          }}
        >
          Test Page
        </Link>
      </div>
    </div>
  );
}