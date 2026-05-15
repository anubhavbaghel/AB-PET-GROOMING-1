import BoardingManager from '@/components/admin/BoardingManager'
import PetBoardingManager from '@/components/admin/PetBoardingManager'

export default function BoardingPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2d2047', margin: '0 0 8px 0' }}>Boarding Management</h1>
        <p style={{ color: '#7A7A7A', margin: 0 }}>Manage boarding reservations and service types.</p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <BoardingManager />
      </div>

      <div>
        <PetBoardingManager />
      </div>
    </div>
  )
}
