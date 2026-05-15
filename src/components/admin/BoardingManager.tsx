"use client"
import React, { useEffect, useState } from 'react'

type Booking = any

export default function BoardingManager() {
  const [rows, setRows] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/boarding')
      if (!res.ok) {
        console.error('Failed to load boarding:', res.status)
        setRows([])
        return
      }
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setRows([])
    } finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    if (!confirm(`Set status to ${status} for #${id}?`)) return
    await fetch(`/api/admin/boarding?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    await load()
  }

  async function handleDelete(id: number) {
    if (!confirm(`Delete boarding #${id}?`)) return
    await fetch(`/api/admin/boarding?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', margin: 0 }}>Boarding Bookings</h2>
        <button onClick={load} disabled={loading} style={{ padding: '8px 16px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7A7A' }}>Loading boarding records...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
              <tr>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Pet</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Check-in</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Check-out</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Total</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                  <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>#{r.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#2d2047', fontWeight: 500 }}>{r.customer_name || r.customer_id || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{r.phone || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#2d2047', fontWeight: 500 }}>{r.pet_name || r.pet_id || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{r.pet_type || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4A4A4A' }}>{r.check_in_date} <br/> <span style={{ fontSize: '12px', color: '#7A7A7A' }}>{r.check_in_time || ''}</span></td>
                  <td style={{ padding: '12px 16px', color: '#4A4A4A' }}>{r.check_out_date || '-'} <br/> <span style={{ fontSize: '12px', color: '#7A7A7A' }}>{r.check_out_time || ''}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                      background: r.status === 'completed' ? '#eefaf0' : r.status === 'cancelled' ? '#fff1f1' : '#E6F4EA',
                      color: r.status === 'completed' ? '#187a2e' : r.status === 'cancelled' ? '#b22222' : '#2E7D32',
                      border: `1px solid ${r.status === 'completed' ? '#bee3c6' : r.status === 'cancelled' ? '#f0c4c4' : '#C8E6C9'}`
                    }}>
                      {r.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#7158a6' }}>{r.total_price ? `₹${r.total_price}` : '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => updateStatus(r.id, 'completed')} style={{ padding: '6px 12px', background: '#eefaf0', color: '#187a2e', border: '1px solid #bee3c6', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Complete</button>
                      <button onClick={() => updateStatus(r.id, 'cancelled')} style={{ padding: '6px 12px', background: '#fff1f1', color: '#b22222', border: '1px solid #f0c4c4', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Cancel</button>
                      <button onClick={() => handleDelete(r.id)} style={{ padding: '6px 12px', background: '#fff', color: '#D32F2F', border: '1px solid #FFCDD2', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Delete</button>
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
