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
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', margin: 0 }}>All Bookings</h2>
        <button onClick={load} disabled={loading} style={{ padding: '8px 16px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7A7A' }}>Loading bookings...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
              <tr>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Owner</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Pet</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Service</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                  <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>#{b.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#2d2047', fontWeight: 500 }}>{b.owner_name}</div>
                    <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{b.phone}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#2d2047', fontWeight: 500 }}>{b.pet_name}</div>
                    <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{b.breed || b.pet_category}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-block', background: '#F0E6FF', color: '#7158a6', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{b.main_service}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4A4A4A' }}>{b.appointment_date} <br/> <span style={{ fontSize: '12px', color: '#7A7A7A' }}>{b.appointment_time}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                      background: b.status === 'Accepted' ? '#eefaf0' : b.status === 'Rejected' ? '#fff1f1' : '#FFF8E1',
                      color: b.status === 'Accepted' ? '#187a2e' : b.status === 'Rejected' ? '#b22222' : '#F57F17',
                      border: `1px solid ${b.status === 'Accepted' ? '#bee3c6' : b.status === 'Rejected' ? '#f0c4c4' : '#FFE082'}`
                    }}>
                      {b.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => updateStatus(b.id, 'Accepted')} style={{ padding: '6px 12px', background: '#eefaf0', color: '#187a2e', border: '1px solid #bee3c6', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Accept</button>
                      <button onClick={() => updateStatus(b.id, 'Rejected')} style={{ padding: '6px 12px', background: '#fff1f1', color: '#b22222', border: '1px solid #f0c4c4', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Reject</button>
                      <button onClick={() => handleDelete(b.id)} style={{ padding: '6px 12px', background: '#fff', color: '#D32F2F', border: '1px solid #FFCDD2', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Delete</button>
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
