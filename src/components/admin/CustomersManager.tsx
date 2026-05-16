"use client"
import React, { useEffect, useState } from 'react'

type Customer = any

export default function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      setCustomers(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function clearForm() {
    setEditingId(null)
    setName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setCity('')
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const payload: any = { name, email, phone, address, city }
    try {
      if (editingId) {
        await fetch(`/api/admin/customers`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...payload }) })
      } else {
        await fetch('/api/admin/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      await load()
      clearForm()
    } catch (err) { console.error(err) }
  }

  function handleEdit(c: any) {
    setEditingId(c._id || c.id)
    setName(c.name || '')
    setEmail(c.email || '')
    setPhone(c.phone || '')
    setAddress(c.address || '')
    setCity(c.city || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this customer?')) return
    try {
      await fetch(`/api/admin/customers?id=${id}`, { method: 'DELETE' })
      await load()
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2d2047', marginBottom: 16 }}>{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6 }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E6D9F5', background: '#F8F6FC' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6 }}>Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E6D9F5', background: '#F8F6FC' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6 }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E6D9F5', background: '#F8F6FC' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6 }}>City</label>
              <input value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E6D9F5', background: '#F8F6FC' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A4A4A', marginBottom: 6 }}>Address</label>
              <input value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E6D9F5', background: '#F8F6FC' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #7158a6, #c084fc)', color: '#fff', border: 'none', fontWeight: 600 }}>{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={clearForm} style={{ padding: '10px 20px', borderRadius: 8, background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', fontWeight: 600 }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2d2047', marginBottom: 16 }}>Customers</h2>
        {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#7A7A7A' }}>Loading...</div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
                <tr>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>City</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id || c.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                    <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>#{c._id ? String(c._id).slice(0,6) : c.id}</td>
                    <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '12px 16px' }}>{c.phone || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{c.email || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{c.city || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEdit(c)} style={{ padding: '6px 12px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDelete(c._id || c.id)} style={{ padding: '6px 12px', background: '#fff1f1', color: '#b22222', border: '1px solid #f0c4c4', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
