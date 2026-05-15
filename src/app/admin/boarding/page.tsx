import BoardingManager from '@/components/admin/BoardingManager'
import PetBoardingManager from '@/components/admin/PetBoardingManager'

export default function BoardingPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Boarding</h1>
          <p>Manage boarding reservations and service types.</p>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <BoardingManager />
      </div>

      <div style={{ marginTop: 18 }}>
        <PetBoardingManager />
      </div>
    </div>
  )
}
