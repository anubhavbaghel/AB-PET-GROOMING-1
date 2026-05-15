"use client"
import React, { useEffect, useState } from 'react'

type PB = { id?: number; name: string; price?: string | number; type?: string }

export default function PetBoardingManager() {
  const [items, setItems] = useState<PB[]>([])
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pet_boarding')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  function clearForm() {
    setName('')
    setPrice('')
    setType('')
    setEditingId(null)
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const payload = { name, price: price ? Number(price) : null, type }
    try {
      if (editingId) {
        await fetch(`/api/admin/pet_boarding?id=${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        await fetch('/api/admin/pet_boarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      await load()
      clearForm()
    } catch (err) { console.error(err) }
  }

  async function handleEdit(it: any) {
    setEditingId(it.id)
    setName(it.name || '')
    setPrice(it.price ? String(it.price) : '')
    setType(it.type || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this boarding service?')) return
    await fetch(`/api/admin/pet_boarding?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', marginBottom: '16px' }}>{editingId ? 'Edit Boarding Service' : 'Add Boarding Service'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Service Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Deluxe Suite" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Price (₹)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 500" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Type / Category</label>
              <input value={type} onChange={e => setType(e.target.value)} placeholder="e.g. Day Boarding" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #7158a6, #c084fc)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 10px rgba(113,88,166,0.2)' }}>{editingId ? 'Update Service' : 'Add Service'}</button>
            {editingId && <button type="button" onClick={clearForm} style={{ padding: '10px 20px', borderRadius: '8px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', marginBottom: '16px' }}>Service Catalog</h2>
        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7A7A' }}>Loading catalog...</div> : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
              <tr>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '180px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                  <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>{it.name}</td>
                  <td style={{ padding: '12px 16px', color: '#7A7A7A' }}>{it.type || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#7158a6', fontWeight: 600 }}>{it.price ? `₹${it.price}` : '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(it)} style={{ padding: '6px 12px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDelete(it.id)} style={{ padding: '6px 12px', background: '#fff1f1', color: '#b22222', border: '1px solid #f0c4c4', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Delete</button>
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
