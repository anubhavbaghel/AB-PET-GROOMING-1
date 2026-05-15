"use client"
import React, { useEffect, useState } from 'react'

type Pet = any
type Customer = any

export default function PetsManager() {
  const [pets, setPets] = useState<Pet[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [color, setColor] = useState('')
  const [vaccinated, setVaccinated] = useState(false)
  const [medicalNotes, setMedicalNotes] = useState('')
  const [allergies, setAllergies] = useState('')

  useEffect(() => { load(); loadCustomers() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pets')
      const data = await res.json()
      setPets(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function loadCustomers() {
    try {
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      setCustomers(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
  }

  function clearForm() {
    setEditingId(null)
    setCustomerId(null)
    setName('')
    setBreed('')
    setAge('')
    setWeight('')
    setColor('')
    setVaccinated(false)
    setMedicalNotes('')
    setAllergies('')
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const payload: any = { customer_id: customerId, name, breed, age: age ? Number(age) : null, weight: weight ? Number(weight) : null, color, vaccinated, medical_notes: medicalNotes, allergies }
    try {
      if (editingId) {
        await fetch(`/api/admin/pets?id=${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        await fetch('/api/admin/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      await load()
      clearForm()
    } catch (err) { console.error(err) }
  }

  function handleEdit(p: any) {
    setEditingId(p.id)
    setCustomerId(p.customer_id || null)
    setName(p.name || '')
    setBreed(p.breed || '')
    setAge(p.age ? String(p.age) : '')
    setWeight(p.weight ? String(p.weight) : '')
    setColor(p.color || '')
    setVaccinated(!!p.vaccinated)
    setMedicalNotes(p.medical_notes || '')
    setAllergies(p.allergies || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this pet?')) return
    await fetch(`/api/admin/pets?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', marginBottom: '16px' }}>{editingId ? 'Edit Pet' : 'Add Pet'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Owner</label>
              <select value={customerId ?? ''} onChange={e => setCustomerId(e.target.value ? Number(e.target.value) : null)} required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }}>
                <option value="">Select owner</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Pet Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Breed</label>
              <input value={breed} onChange={e => setBreed(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Age (Years)</label>
              <input value={age} onChange={e => setAge(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} type="number" step="0.1" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Weight (Kg)</label>
              <input value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} type="number" step="0.1" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Color</label>
              <input value={color} onChange={e => setColor(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8F6FC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', alignSelf: 'end' }}>
              <input type="checkbox" checked={vaccinated} onChange={e => setVaccinated(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#7158a6' }} /> 
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#4A4A4A', cursor: 'pointer' }}>Fully Vaccinated</label>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Allergies</label>
              <input value={allergies} onChange={e => setAllergies(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4A4A', marginBottom: '6px' }}>Medical Notes</label>
              <textarea value={medicalNotes} onChange={e => setMedicalNotes(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E6D9F5', outline: 'none', background: '#F8F6FC', fontSize: '14px', resize: 'vertical' }} rows={2} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #7158a6, #c084fc)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 10px rgba(113,88,166,0.2)' }}>{editingId ? 'Update Pet' : 'Register Pet'}</button>
            {editingId && <button type="button" onClick={clearForm} style={{ padding: '10px 20px', borderRadius: '8px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', marginBottom: '16px' }}>Registered Pets</h2>
        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#7A7A7A' }}>Loading pets...</div> : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
              <tr>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Owner</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Pet Name</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Breed</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Age/Weight</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Vaccinated</th>
                <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                  <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>#{p.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#2d2047', fontWeight: 500 }}>{p.owner_name || p.customer_id || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{p.owner_phone || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', color: '#7A7A7A' }}>{p.breed || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#4A4A4A' }}>{p.age ?? '-'} yr <br/><span style={{ fontSize: '12px', color: '#7A7A7A' }}>{p.weight ? p.weight + ' kg' : ''}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.vaccinated ? (
                      <span style={{ padding: '4px 8px', background: '#eefaf0', color: '#187a2e', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>Yes</span>
                    ) : (
                      <span style={{ padding: '4px 8px', background: '#fff1f1', color: '#b22222', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>No</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(p)} style={{ padding: '6px 12px', background: '#F8F6FC', color: '#7158a6', border: '1px solid #E6D9F5', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', background: '#fff1f1', color: '#b22222', border: '1px solid #f0c4c4', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Delete</button>
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
