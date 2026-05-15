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
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', margin: 0 }}>Review Queue</h2>
        <button onClick={load} disabled={loading} style={{ padding: '8px 16px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7A7A' }}>Loading reviews...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
              <tr>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '60px' }}>ID</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '160px' }}>Customer</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '100px' }}>Rating</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Comment</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '100px' }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                  <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>#{r.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#2d2047', fontWeight: 500 }}>{r.customer_name || r.customer_id || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{r.customer_phone || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '16px' }}>
                    {r.rating ? '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4A4A4A', fontStyle: 'italic' }}>"{r.comment || ''}"</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                      background: r.status === 'approved' ? '#eefaf0' : r.status === 'rejected' ? '#fff1f1' : '#FFF8E1',
                      color: r.status === 'approved' ? '#187a2e' : r.status === 'rejected' ? '#b22222' : '#F57F17',
                      border: `1px solid ${r.status === 'approved' ? '#bee3c6' : r.status === 'rejected' ? '#f0c4c4' : '#FFE082'}`
                    }}>
                      {r.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => approve(r.id)} style={{ padding: '6px 12px', background: '#eefaf0', color: '#187a2e', border: '1px solid #bee3c6', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Approve</button>
                      <button onClick={() => reject(r.id)} style={{ padding: '6px 12px', background: '#fff1f1', color: '#b22222', border: '1px solid #f0c4c4', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Reject</button>
                      <button onClick={() => handleDelete(r.id)} style={{ padding: '6px 12px', background: '#fff', color: '#D32F2F', border: '1px solid #FFCDD2', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Del</button>
                    </div>
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
