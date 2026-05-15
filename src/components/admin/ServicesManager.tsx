"use client"
import React, { useEffect, useState } from 'react'

type Item = { id?: number; type: string; name: string; price?: string }

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('dog')
  const [items, setItems] = useState<Item[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(data || [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  function clearForm() {
    setTitle('')
    setCategory('dog')
    setItems([])
    setEditingId(null)
  }

  function addItemRow(type = 'item') {
    setItems(prev => [...prev, { type, name: '', price: '' }])
  }

  function updateItem(idx: number, patch: Partial<Item>) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it))
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const payload = { title, category, items: items.filter(i => i.name.trim() !== '') }
    try {
      if (editingId) {
        await fetch(`/api/admin/services?id=${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      await load()
      clearForm()
    } catch (err) { console.error(err) }
  }

  async function handleEdit(s: any) {
    setEditingId(s.id)
    setTitle(s.title || '')
    setCategory(s.category || 'dog')
    setItems(s.items && s.items.length ? s.items.map((it: any) => ({ id: it.id, type: it.type, name: it.name, price: it.price || '' })) : [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div>
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 18 }}>
        <h2>{editingId ? 'Edit Service' : 'Add Service'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label>Title</label><br />
            <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Category</label><br />
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 8 }}>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <h4>Items</h4>
            {items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input placeholder="Name" value={it.name} onChange={e => updateItem(idx, { name: e.target.value })} style={{ flex: 2, padding: 8 }} />
                <input placeholder="Price" value={it.price as string} onChange={e => updateItem(idx, { price: e.target.value })} style={{ width: 120, padding: 8 }} />
                <select value={it.type} onChange={e => updateItem(idx, { type: e.target.value })} style={{ width: 120, padding: 8 }}>
                  <option value="item">Item</option>
                  <option value="breed">Breed</option>
                </select>
                <button type="button" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}>✖</button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => addItemRow('item')}>+ Add Item</button>
              <button type="button" onClick={() => addItemRow('breed')}>+ Add Breed</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
            {editingId ? <button type="button" onClick={clearForm} style={{ marginLeft: 8 }}>Cancel</button> : null}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
        <h2>All Services</h2>
        {loading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: 8 }}>Title</th>
                <th style={{ padding: 8 }}>Category</th>
                <th style={{ padding: 8 }}>Items</th>
                <th style={{ padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td style={{ padding: 8 }}>{s.title}</td>
                  <td style={{ padding: 8 }}>{s.category}</td>
                  <td style={{ padding: 8 }}>
                    {Array.isArray(s.items) && s.items.map((it: any) => (
                      <div key={it.id || it.name}>{it.name}{it.price ? ` - ₹${it.price}` : ''} ({it.type})</div>
                    ))}
                  </td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleEdit(s)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(s.id)}>Delete</button>
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
