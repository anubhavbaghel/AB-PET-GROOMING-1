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
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', marginBottom: '16px' }}>{editingId ? 'Edit Service Package' : 'Add New Service Package'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Package Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Classic Bath" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Pet Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }}>
                <option value="dog">🐶 Dog</option>
                <option value="cat">🐱 Cat</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#2d2047', marginBottom: '12px' }}>Included Items / Prices</h4>
            {items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                <input placeholder="Feature Name / Breed" value={it.name} onChange={e => updateItem(idx, { name: e.target.value })} style={{ flex: 2, padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#fff', fontSize: '14px' }} />
                <input placeholder="Price (₹)" value={it.price as string} onChange={e => updateItem(idx, { price: e.target.value })} style={{ width: '120px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#fff', fontSize: '14px' }} />
                <select value={it.type} onChange={e => updateItem(idx, { type: e.target.value })} style={{ width: '120px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#fff', fontSize: '14px' }}>
                  <option value="item">Item</option>
                  <option value="breed">Breed</option>
                </select>
                <button type="button" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} style={{ background: '#fff1f1', color: '#b22222', border: 'none', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button type="button" onClick={() => addItemRow('item')} style={{ padding: '8px 16px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>+ Add Item</button>
              <button type="button" onClick={() => addItemRow('breed')} style={{ padding: '8px 16px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>+ Add Breed Price</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #7158a6, #c084fc)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 10px rgba(113,88,166,0.2)' }}>{editingId ? 'Update Package' : 'Save Package'}</button>
            {editingId && <button type="button" onClick={clearForm} style={{ padding: '10px 20px', borderRadius: '8px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', marginBottom: '16px' }}>Service Catalog</h2>
        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7A7A' }}>Loading services...</div> : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
              <tr>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '100px' }}>Category</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Items & Pricing</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600, width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                  <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>{s.title}</td>
                  <td style={{ padding: '12px 16px', color: '#7A7A7A', textTransform: 'capitalize' }}>{s.category}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {Array.isArray(s.items) && s.items.map((it: any) => (
                      <div key={it.id || it.name} style={{ fontSize: '13px', color: '#4A4A4A' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#B8A8D8', marginRight: '6px' }}></span>
                        {it.name} 
                        {it.price && <strong style={{ color: '#7158a6', marginLeft: '6px' }}>₹{it.price}</strong>}
                        <span style={{ fontSize: '11px', color: '#7A7A7A', marginLeft: '6px', background: '#F8F6FC', padding: '2px 6px', borderRadius: '4px' }}>{it.type}</span>
                      </div>
                    ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(s)} style={{ padding: '6px 12px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} style={{ padding: '6px 12px', background: '#fff1f1', color: '#b22222', border: '1px solid #f0c4c4', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Delete</button>
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
