import ReviewsManager from '@/components/admin/ReviewsManager'

export default function ReviewsPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2d2047', margin: '0 0 8px 0' }}>Customer Reviews</h1>
        <p style={{ color: '#7A7A7A', margin: 0 }}>Approve, reject or delete customer reviews.</p>
      </div>

      <ReviewsManager />
    </div>
  )
}
