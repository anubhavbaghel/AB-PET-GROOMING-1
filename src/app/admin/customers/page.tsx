import CustomersManager from '@/components/admin/CustomersManager'

export default function CustomersPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2d2047', margin: '0 0 8px 0' }}>Customers</h1>
        <p style={{ color: '#7A7A7A', margin: 0 }}>Manage customer records.</p>
      </div>

      <CustomersManager />
    </div>
  )
}
