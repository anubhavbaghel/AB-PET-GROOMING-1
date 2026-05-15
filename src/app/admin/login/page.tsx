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
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 380, padding: 28, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Admin Login</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 18 }}>Sign in to access the admin panel</p>

        {error && (
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 6, background: '#fdecea', color: '#8a1f1f' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="username" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#6b5dd3', color: '#fff', border: 'none', fontWeight: 600 }}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
}
