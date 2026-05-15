"use client"
import React, { useEffect, useState } from 'react'

type Booking = any

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/appointments')
      const data = await res.json()
      setBookings(Array.isArray(data.data) ? data.data : [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: string) {
    if (!confirm(`Set status to ${status} for #${id}?`)) return
    await fetch(`/api/admin/appointments?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    await load()
  }

  async function handleDelete(id: number) {
    if (!confirm(`Delete booking #${id}?`)) return
    await fetch(`/api/admin/appointments?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Bookings</h2>
        <button onClick={load} disabled={loading}>Refresh</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <tr>
                <th style={{ padding: 8 }}>ID</th>
                <th style={{ padding: 8 }}>Owner</th>
                <th style={{ padding: 8 }}>Pet</th>
                <th style={{ padding: 8 }}>Service</th>
                <th style={{ padding: 8 }}>Date</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id}>
                  <td style={{ padding: 8 }}>#{b.id}</td>
                  <td style={{ padding: 8 }}>{b.owner_name}<div style={{ fontSize: 12, color: '#666' }}>{b.phone}</div></td>
                  <td style={{ padding: 8 }}>{b.pet_name}<div style={{ fontSize: 12, color: '#666' }}>{b.breed}</div></td>
                  <td style={{ padding: 8 }}>{b.main_service}</td>
                  <td style={{ padding: 8 }}>{b.appointment_date} {b.appointment_time}</td>
                  <td style={{ padding: 8 }}>{b.status || '-'}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => updateStatus(b.id, 'Accepted')} style={{ marginRight: 8 }}>Accept</button>
                    <button onClick={() => updateStatus(b.id, 'Rejected')} style={{ marginRight: 8 }}>Reject</button>
                    <button onClick={() => handleDelete(b.id)} style={{ color: '#c00' }}>Delete</button>
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
