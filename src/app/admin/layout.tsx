import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const adminId = cookieStore.get('admin_id')?.value;
  if (!adminId) redirect('/admin-login');

  const adminUsername = cookieStore.get('admin_username')?.value || '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F6FC', fontFamily: "'Poppins', sans-serif" }}>
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '260px', 
        background: '#fff', 
        borderRight: '1px solid #E6D9F5',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Sidebar Header / Logo */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #E6D9F5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, #7158a6, #B8A8D8)', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            AB
          </div>
          <div style={{ fontWeight: 800, fontSize: '18px', color: '#4A4A4A' }}>Pet Grooming</div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link href="/admin/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', background: '#F8F6FC', color: '#7158a6', fontWeight: 600, textDecoration: 'none'
          }}>
            Dashboard
          </Link>
          <Link href="/admin/bookings" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', color: '#7A7A7A', fontWeight: 500, textDecoration: 'none'
          }}>
            Bookings
          </Link>
          <Link href="/admin/boarding" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', color: '#7A7A7A', fontWeight: 500, textDecoration: 'none'
          }}>
            Boarding
          </Link>
          <Link href="/admin/services" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', color: '#7A7A7A', fontWeight: 500, textDecoration: 'none'
          }}>
            Services
          </Link>
          <Link href="/admin/pets" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', color: '#7A7A7A', fontWeight: 500, textDecoration: 'none'
          }}>
            Pets Registry
          </Link>
          <Link href="/admin/reviews" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', color: '#7A7A7A', fontWeight: 500, textDecoration: 'none'
          }}>
            Reviews
          </Link>
        </nav>
        
        {/* User Profile & Logout */}
        <div style={{ padding: '24px', borderTop: '1px solid #E6D9F5' }}>
          <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '16px', fontWeight: 500 }}>LOGGED IN AS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', background: '#E6D9F5', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7158a6', fontWeight: 'bold'
            }}>
              {adminUsername.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontWeight: 600, color: '#4A4A4A', fontSize: '14px' }}>{adminUsername || 'Admin'}</div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px 32px', 
          background: '#fff', 
          borderBottom: '1px solid #E6D9F5' 
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#2d2047', margin: 0 }}>Admin Panel</h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#7158a6', background: '#F8F6FC', padding: '8px 16px', borderRadius: '20px', fontWeight: 600 }}>
              Have a great day, {adminUsername || 'Admin'}! 👋
            </span>
          </div>
        </header>

        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
