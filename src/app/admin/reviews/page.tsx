import ReviewsManager from '@/components/admin/ReviewsManager'

export default function ReviewsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Reviews</h1>
          <p>Approve, reject or delete customer reviews.</p>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <ReviewsManager />
      </div>
    </div>
  )
}
