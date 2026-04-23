'use client'

import { useState } from 'react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Auth will be implemented with Supabase
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>📝 EziNotes</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>Voice to NDIS notes</p>

        {!user ? (
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>Welcome! {user.email}</p>
            <button style={btnStyle} onClick={() => setUser(null)}>Sign Out</button>
          </div>
        )}
      </div>
    </main>
  )
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '12px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  fontSize: '16px',
  boxSizing: 'border-box'
}

const btnStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  background: '#2563eb',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '8px'
}
