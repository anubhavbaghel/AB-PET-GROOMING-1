"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F6FC' }}>
      <div style={{ width: 420, background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 8px 24px rgba(45,32,71,0.08)' }}>
        <h2 style={{ margin: 0, marginBottom: 8, fontSize: 20, color: '#2d2047' }}>Admin Login</h2>
        <p style={{ marginTop: 0, marginBottom: 18, color: '#7A7A7A' }}>Sign in to manage the AB Pet Grooming dashboard.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6 }}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E6D9F5', background: '#F8F6FC' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E6D9F5', background: '#F8F6FC' }} />
          </div>
          {error ? <div style={{ color: '#b22222', marginBottom: 12 }}>{error}</div> : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="submit" disabled={loading} style={{ padding: '10px 18px', borderRadius: 8, background: 'linear-gradient(135deg, #7158a6, #c084fc)', color: '#fff', border: 'none', fontWeight: 700 }}>{loading ? 'Signing in…' : 'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
