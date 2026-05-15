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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Boarding Bookings</h2>
        <button onClick={load} disabled={loading}>Refresh</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <tr>
                <th style={{ padding: 8 }}>ID</th>
                <th style={{ padding: 8 }}>Customer</th>
                <th style={{ padding: 8 }}>Pet</th>
                <th style={{ padding: 8 }}>Check-in</th>
                <th style={{ padding: 8 }}>Check-out</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Total</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td style={{ padding: 8 }}>#{r.id}</td>
                  <td style={{ padding: 8 }}>{r.customer_name || r.customer_id || '-' }<div style={{ fontSize: 12, color: '#666' }}>{r.phone || ''}</div></td>
                  <td style={{ padding: 8 }}>{r.pet_name || r.pet_id || '-'}<div style={{ fontSize: 12, color: '#666' }}>{r.pet_type || ''}</div></td>
                  <td style={{ padding: 8 }}>{r.check_in_date}{r.check_in_time ? ` ${r.check_in_time}` : ''}</td>
                  <td style={{ padding: 8 }}>{r.check_out_date || '-'}{r.check_out_time ? ` ${r.check_out_time}` : ''}</td>
                  <td style={{ padding: 8 }}>{r.status || '-'}</td>
                  <td style={{ padding: 8 }}>{r.total_price ? `₹${r.total_price}` : '-'}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => updateStatus(r.id, 'completed')} style={{ marginRight: 8 }}>Mark Completed</button>
                    <button onClick={() => updateStatus(r.id, 'cancelled')} style={{ marginRight: 8 }}>Cancel</button>
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
