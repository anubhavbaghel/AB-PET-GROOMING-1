import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/admin/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const adminId = cookieStore.get('admin_id')?.value;
  if (!adminId) redirect('/admin-login');

  const adminUsername = cookieStore.get('admin_username')?.value || '';

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7fb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#fff', borderBottom: '1px solid #eee' }}>
        <div style={{ fontWeight: 700 }}>Admin Panel</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ color: '#444' }}>{adminUsername}</div>
          <LogoutButton />
        </div>
      </header>

      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
