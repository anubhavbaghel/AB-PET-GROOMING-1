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
    <div style={{ marginTop: 18 }}>
      <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
        <h3>{editingId ? 'Edit Service' : 'Add Boarding Service'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label>Name</label><br />
            <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Price</label><br />
            <input value={price} onChange={e => setPrice(e.target.value)} style={{ padding: 8, width: 200 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Type</label><br />
            <input value={type} onChange={e => setType(e.target.value)} placeholder="e.g., Day Boarding" style={{ padding: 8, width: 240 }} />
          </div>
          <div>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
            {editingId ? <button type="button" onClick={clearForm} style={{ marginLeft: 8 }}>Cancel</button> : null}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <h3>Boarding Services</h3>
        {loading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Price</th>
                <th style={{ padding: 8 }}>Type</th>
                <th style={{ padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id}>
                  <td style={{ padding: 8 }}>{it.name}</td>
                  <td style={{ padding: 8 }}>{it.price ? `₹${it.price}` : '-'}</td>
                  <td style={{ padding: 8 }}>{it.type || '-'}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleEdit(it)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(it.id)} style={{ color: '#c00' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
