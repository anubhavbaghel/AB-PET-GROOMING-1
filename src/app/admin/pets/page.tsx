import PetsManager from '@/components/admin/PetsManager'

export default function PetsPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2d2047', margin: '0 0 8px 0' }}>Pets Registry</h1>
        <p style={{ color: '#7A7A7A', margin: 0 }}>Manage registered pets and their owners.</p>
      </div>

      <PetsManager />
    </div>
  )
}
