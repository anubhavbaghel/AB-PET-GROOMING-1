"use client"
import React, { useEffect, useState } from 'react'

type Review = any

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  async function approve(id: number) {
    if (!confirm(`Approve review #${id}?`)) return
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve' }) })
    await load()
  }

  async function reject(id: number) {
    if (!confirm(`Reject review #${id}?`)) return
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject' }) })
    await load()
  }

  async function handleDelete(id: number) {
    if (!confirm(`Delete review #${id}?`)) return
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Reviews</h2>
        <button onClick={load} disabled={loading}>Refresh</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <tr>
                <th style={{ padding: 8 }}>ID</th>
                <th style={{ padding: 8 }}>Customer</th>
                <th style={{ padding: 8 }}>Rating</th>
                <th style={{ padding: 8 }}>Comment</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r: any) => (
                <tr key={r.id}>
                  <td style={{ padding: 8 }}>#{r.id}</td>
                  <td style={{ padding: 8 }}>{r.customer_name || r.customer_id || '-'}<div style={{ fontSize: 12, color: '#666' }}>{r.customer_phone || ''}</div></td>
                  <td style={{ padding: 8 }}>{r.rating || '-'}</td>
                  <td style={{ padding: 8 }}>{r.comment || ''}</td>
                  <td style={{ padding: 8 }}>{r.status || '-'}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => approve(r.id)} style={{ marginRight: 8 }}>Approve</button>
                    <button onClick={() => reject(r.id)} style={{ marginRight: 8 }}>Reject</button>
                    <button onClick={() => handleDelete(r.id)} style={{ color: '#c00' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
