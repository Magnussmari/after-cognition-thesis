export const dynamic = 'force-dynamic';

export default function TestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET';
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Environment Test Page</h1>
      <p>NEXT_PUBLIC_SUPABASE_URL: {supabaseUrl}</p>
      <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {hasAnonKey ? 'SET' : 'NOT SET'}</p>
      <p>NODE_ENV: {process.env.NODE_ENV}</p>
    </div>
  );
}