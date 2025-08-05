'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SetupPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const setupAdmin = async () => {
    setLoading(true)
    setMessage('Creating admin user...')
    
    const supabase = createClient()
    
    // Try to sign up first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'magnussmari@unak.is',
      password: 'temp-password-change-me',
      options: {
        data: {
          full_name: 'Magnús Smári Smárason',
          role: 'admin'
        }
      }
    })
    
    if (signUpError && signUpError.message !== 'User already registered') {
      setMessage(`Error: ${signUpError.message}`)
      setLoading(false)
      return
    }
    
    // Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'magnussmari@unak.is',
      password: 'temp-password-change-me'
    })
    
    if (signInError) {
      // If sign in fails, the user exists but with different password
      // Try to reset password
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        'magnussmari@unak.is',
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        }
      )
      
      if (resetError) {
        setMessage(`Error: ${resetError.message}`)
      } else {
        setMessage('Password reset email sent! Check your email to set a new password.')
      }
    } else {
      setMessage('Success! Admin user is ready. You can now go to login.')
    }
    
    setLoading(false)
  }

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
        <h1 style={{ marginBottom: '2rem', color: '#333' }}>
          Setup Admin User
        </h1>
        
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          Click the button below to create or fix the admin user account.
        </p>
        
        <button
          onClick={setupAdmin}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '2rem'
          }}
        >
          {loading ? 'Setting up...' : 'Setup Admin User'}
        </button>
        
        {message && (
          <div style={{
            padding: '1rem',
            backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}
        
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/auth/login"
            style={{
              color: '#007bff',
              textDecoration: 'none'
            }}
          >
            Go to Login →
          </a>
        </div>
      </div>
    </div>
  )
}