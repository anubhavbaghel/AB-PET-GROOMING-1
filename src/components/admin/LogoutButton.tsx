"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    router.push('/admin-login');
  }

  return (
    <button onClick={handleLogout} disabled={loading} style={{ padding: '8px 12px', borderRadius: 6, background: '#ef4444', color: '#fff', border: 'none' }}>
      {loading ? 'Logging out…' : 'Logout'}
    </button>
  );
}
