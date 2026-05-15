import PetsManager from '@/components/admin/PetsManager'

export default function PetsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Pets Registry</h1>
          <p>Manage registered pets and their owners.</p>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <PetsManager />
      </div>
    </div>
  )
}
