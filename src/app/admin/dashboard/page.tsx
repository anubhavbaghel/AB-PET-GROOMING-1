import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createConnection } from '@/lib/db'
import DashboardCharts from '@/components/admin/DashboardCharts';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'ab_pet_grooming';

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString();
  } catch (e) {
    return d;
  }
}

function isoDate(dt: Date) {
  return dt.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const adminId = cookieStore.get('admin_id')?.value;
  if (!adminId) {
    redirect('/admin-login');
  }

  const APPOINTMENTS_TABLE = process.env.DB_TABLE_APPOINTMENTS || 'appointments'
  let conn: any = null;
  try {
    conn = await createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });
    // Basic aggregates
    const [[{ cnt: total_appointments }]] = await conn.query(`SELECT COUNT(id) as cnt FROM ${APPOINTMENTS_TABLE}`);
    const today = new Date();
    const todayStr = isoDate(today);
    const [[{ cnt: today_appointments }]] = await conn.query(`SELECT COUNT(id) as cnt FROM ${APPOINTMENTS_TABLE} WHERE appointment_date = ?`, [todayStr]);
    const [[{ cnt: upcoming }]] = await conn.query(`SELECT COUNT(id) as cnt FROM ${APPOINTMENTS_TABLE} WHERE appointment_date >= ?`, [todayStr]);
    const [[{ cnt: total_customers }]] = await conn.query(`SELECT COUNT(DISTINCT phone) as cnt FROM ${APPOINTMENTS_TABLE}`);

    const [[{ cnt: dogs }]] = await conn.query(`SELECT COUNT(id) as cnt FROM ${APPOINTMENTS_TABLE} WHERE pet_category = 'Dog'`);
    const [[{ cnt: cats }]] = await conn.query(`SELECT COUNT(id) as cnt FROM ${APPOINTMENTS_TABLE} WHERE pet_category = 'Cat'`);
    const [[{ cnt: classic }]] = await conn.query(`SELECT COUNT(id) as cnt FROM ${APPOINTMENTS_TABLE} WHERE main_service LIKE '%Classic%'`);
    const [[{ cnt: addons }]] = await conn.query(`SELECT COUNT(id) as cnt FROM ${APPOINTMENTS_TABLE} WHERE addons != '' AND addons IS NOT NULL`);

    // Recent appointments
    const [recentRows] = await conn.query(`SELECT id, owner_name, phone, pet_name, breed, pet_category, main_service, addons, appointment_date, appointment_time FROM ${APPOINTMENTS_TABLE} ORDER BY id DESC LIMIT 5`);

    // Time-series: last 28 days (for weekly/last-4-weeks) and last 7 days (for daily)
    const start28 = new Date(today);
    start28.setDate(start28.getDate() - 27);
    const start28Str = isoDate(start28);

    const [dailyRows] = await conn.query(`SELECT appointment_date as d, COUNT(*) as cnt FROM ${APPOINTMENTS_TABLE} WHERE appointment_date >= ? GROUP BY appointment_date ORDER BY appointment_date`, [start28Str]);
    const dailyMap = new Map<string, number>();
    (dailyRows as any[]).forEach((r: any) => {
      const d = r.d instanceof Date ? isoDate(r.d) : String(r.d).slice(0, 10);
      dailyMap.set(d, Number(r.cnt));
    });

    // Build last 7 days arrays
    const dailyLabels: string[] = [];
    const dailyCounts: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - i);
      const s = isoDate(dt);
      dailyLabels.push(dt.toLocaleDateString(undefined, { weekday: 'short' }));
      dailyCounts.push(dailyMap.get(s) || 0);
    }

    // Build last 4 weeks from start28 (4 buckets of 7 days)
    const weeklyLabels: string[] = [];
    const weeklyCounts: number[] = [];
    for (let w = 0; w < 4; w++) {
      const wkStart = new Date(start28);
      wkStart.setDate(start28.getDate() + w * 7);
      const wkEnd = new Date(wkStart);
      wkEnd.setDate(wkStart.getDate() + 6);
      let sum = 0;
      for (let d = new Date(wkStart); d <= wkEnd; d.setDate(d.getDate() + 1)) {
        sum += dailyMap.get(isoDate(d)) || 0;
      }
      weeklyLabels.push(wkStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
      weeklyCounts.push(sum);
    }

    // Monthly: last 6 months
    const startMonth = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const startMonthStr = isoDate(startMonth);
    let monthlyRows: any[] = [];
    if (process.env.DB_CLIENT === 'sqlite') {
      const res = await conn.query(`SELECT strftime('%Y-%m', appointment_date) as ym, COUNT(*) as cnt FROM ${APPOINTMENTS_TABLE} WHERE appointment_date >= ? GROUP BY ym ORDER BY ym`, [startMonthStr]);
      monthlyRows = res[0] as any[]
    } else {
      const res = await conn.query(`SELECT DATE_FORMAT(appointment_date, '%Y-%m') as ym, COUNT(*) as cnt FROM ${APPOINTMENTS_TABLE} WHERE appointment_date >= ? GROUP BY ym ORDER BY ym`, [startMonthStr]);
      monthlyRows = res[0] as any[]
    }
    const monthlyMap = new Map<string, number>();
    (monthlyRows as any[]).forEach((r: any) => monthlyMap.set(String(r.ym), Number(r.cnt)));

    const monthlyLabels: string[] = [];
    const monthlyCounts: number[] = [];
    for (let m = 0; m < 6; m++) {
      const dt = new Date(startMonth.getFullYear(), startMonth.getMonth() + m, 1);
      const key = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
      monthlyLabels.push(dt.toLocaleString(undefined, { month: 'short' }));
      monthlyCounts.push(monthlyMap.get(key) || 0);
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2d2047', margin: '0 0 8px 0' }}>Dashboard Overview</h1>
            <p style={{ color: '#7A7A7A', margin: 0 }}>Here's what's happening today at AB Pet Grooming.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/admin/bookings" style={{ background: '#fff', color: '#7158a6', border: '1px solid #E6D9F5', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: '0.2s' }}>View Bookings</a>
            <a href="/admin/services" style={{ background: 'linear-gradient(135deg, #7158a6, #c084fc)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: '0.2s', boxShadow: '0 4px 10px rgba(113,88,166,0.2)' }}>Manage Services</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '16px', marginTop: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2d2047' }}>{total_appointments}</div>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>Total Appointments</div>
          </div>
          <div style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2d2047' }}>{today_appointments}</div>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>Today's Appointments</div>
          </div>
          <div style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2d2047' }}>{upcoming}</div>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>Upcoming Bookings</div>
          </div>
          <div style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2d2047' }}>{total_customers}</div>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>Total Customers</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', background: '#F8F6FC', border: '1px solid #E6D9F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 600 }}>🐶 Dog Appointments</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#7158a6' }}>{dogs}</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: '#F8F6FC', border: '1px solid #E6D9F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 600 }}>🐱 Cat Appointments</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#7158a6' }}>{cats}</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: '#F8F6FC', border: '1px solid #E6D9F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 600 }}>🛁 Classic Packages</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#7158a6' }}>{classic}</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: '#F8F6FC', border: '1px solid #E6D9F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#7A7A7A', fontSize: '14px', fontWeight: 600 }}>✨ With Add-ons</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#7158a6' }}>{addons}</div>
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d2047', marginBottom: '16px' }}>Analytics & Trends</h2>
          <DashboardCharts
            dailyLabels={dailyLabels}
            dailyCounts={dailyCounts}
            weeklyLabels={weeklyLabels}
            weeklyCounts={weeklyCounts}
            monthlyLabels={monthlyLabels}
            monthlyCounts={monthlyCounts}
          />
        </div>

        <div style={{ marginTop: '32px', background: '#fff', borderRadius: '16px', border: '1px solid #E6D9F5', boxShadow: '0 4px 12px rgba(113, 88, 166, 0.05)', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2047', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Recent Appointments
            <a href="/admin/bookings" style={{ fontSize: '14px', color: '#7158a6', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ textAlign: 'left', background: '#F8F6FC', borderTop: '1px solid #E6D9F5', borderBottom: '2px solid #E6D9F5' }}>
                <tr>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Owner</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Pet</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Service</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '12px 16px', color: '#4A4A4A', fontWeight: 600 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(recentRows) && recentRows.length > 0 ? (
                  recentRows.map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #E6D9F5' }}>
                      <td style={{ padding: '12px 16px', color: '#2d2047', fontWeight: 600 }}>#{r.id}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ color: '#2d2047', fontWeight: 500 }}>{r.owner_name}</div>
                        <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{r.phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ color: '#2d2047', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {r.pet_category === 'Dog' ? '🐶' : r.pet_category === 'Cat' ? '🐱' : ''} {r.pet_name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{r.breed || '-'}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-block', background: '#F0E6FF', color: '#7158a6', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{r.main_service}</span>
                        {r.addons ? <div style={{ fontSize: '12px', color: '#7A7A7A', marginTop: '4px' }}>+ {r.addons}</div> : null}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4A4A4A' }}>{formatDate(r.appointment_date)}</td>
                      <td style={{ padding: '12px 16px', color: '#4A4A4A' }}>{r.appointment_time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#7A7A7A' }}>No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (err: any) {
    console.error('Admin dashboard DB error:', err?.message || err);
    return (
      <div style={{ padding: 24 }}>
        <h1>Dashboard</h1>
        <div style={{ marginTop: 16, padding: 16, borderRadius: 8, background: '#fff3f3', color: '#8a1f1f' }}>
          <strong>Cannot connect to the database.</strong>
          <div style={{ marginTop: 8 }}>Start your MySQL server (service name may be <code>MySQL80</code>) or set the correct DB environment variables.</div>
        </div>
      </div>
    );
  } finally {
    if (conn) await conn.end();
  }
}
