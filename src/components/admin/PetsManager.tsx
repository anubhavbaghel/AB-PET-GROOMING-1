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
      <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
        <h3>{editingId ? 'Edit Pet' : 'Add Pet'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label>Owner</label><br />
              <select value={customerId ?? ''} onChange={e => setCustomerId(e.target.value ? Number(e.target.value) : null)} required style={{ width: '100%', padding: 8 }}>
                <option value="">Select owner</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label>Name</label><br />
              <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Breed</label><br />
              <input value={breed} onChange={e => setBreed(e.target.value)} style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Age</label><br />
              <input value={age} onChange={e => setAge(e.target.value)} style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Weight</label><br />
              <input value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Color</label><br />
              <input value={color} onChange={e => setColor(e.target.value)} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={vaccinated} onChange={e => setVaccinated(e.target.checked)} /> <label>Vaccinated</label>
            </div>
            <div>
              <label>Allergies</label><br />
              <input value={allergies} onChange={e => setAllergies(e.target.value)} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Medical Notes</label><br />
              <textarea value={medicalNotes} onChange={e => setMedicalNotes(e.target.value)} style={{ width: '100%', padding: 8 }} rows={3} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
            {editingId ? <button type="button" onClick={clearForm} style={{ marginLeft: 8 }}>Cancel</button> : null}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <h3>Pets Registry</h3>
        {loading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: 8 }}>ID</th>
                <th style={{ padding: 8 }}>Owner</th>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Breed</th>
                <th style={{ padding: 8 }}>Age</th>
                <th style={{ padding: 8 }}>Vaccinated</th>
                <th style={{ padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: 8 }}>#{p.id}</td>
                  <td style={{ padding: 8 }}>{p.owner_name || p.customer_id || '-'}<div style={{ fontSize: 12, color: '#666' }}>{p.owner_phone || ''}</div></td>
                  <td style={{ padding: 8 }}>{p.name}</td>
                  <td style={{ padding: 8 }}>{p.breed || '-'}</td>
                  <td style={{ padding: 8 }}>{p.age ?? '-'}</td>
                  <td style={{ padding: 8 }}>{p.vaccinated ? 'Yes' : 'No'}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleEdit(p)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ color: '#c00' }}>Delete</button>
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
