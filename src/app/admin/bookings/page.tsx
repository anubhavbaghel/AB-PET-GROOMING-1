import BookingsManager from '@/components/admin/BookingsManager'

export default function BookingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2d2047', margin: '0 0 8px 0' }}>Appointments</h1>
        <p style={{ color: '#7A7A7A', margin: 0 }}>Manage grooming appointments, accept or reject requests.</p>
      </div>
      <BookingsManager />
    </div>
  )
}
