"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data?.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8F6FC', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 40, borderRadius: 24, boxShadow: '0 20px 40px rgba(184, 168, 216, 0.15)', background: '#fff', border: '1px solid #E6D9F5' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            width: 64, height: 64, background: 'linear-gradient(135deg, #7158a6, #B8A8D8)', 
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', fontSize: 28, fontWeight: 'bold', margin: '0 auto 16px', boxShadow: '0 8px 16px rgba(113, 88, 166, 0.2)'
          }}>
            AB
          </div>
          <h2 style={{ color: '#2d2047', fontSize: 26, fontWeight: 800, margin: '0 0 8px 0' }}>Welcome Back</h2>
          <p style={{ color: '#7A7A7A', fontSize: 15, margin: 0 }}>Sign in to AB Pet Grooming admin</p>
        </div>

        {error && (
          <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: '#FFF0F0', color: '#D32F2F', fontSize: 14, textAlign: 'center', fontWeight: 500, border: '1px solid #FFD6D6' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label htmlFor="username" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#4A4A4A', marginBottom: 8 }}>Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter your username" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E6D9F5', outline: 'none', fontSize: 15, transition: '0.3s', background: '#FAF8FF', color: '#2d2047' }} />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#4A4A4A', marginBottom: 8 }}>Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E6D9F5', outline: 'none', fontSize: 15, transition: '0.3s', background: '#FAF8FF', color: '#2d2047' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, #7158a6, #c084fc)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, marginTop: 8, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(113, 88, 166, 0.2)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}
