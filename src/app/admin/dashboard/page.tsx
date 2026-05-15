import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import mysql from 'mysql2/promise';
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
    redirect('/admin/login');
  }

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });
    // Basic aggregates
    const [[{ cnt: total_appointments }]] = await conn.query('SELECT COUNT(id) as cnt FROM appointments');
    const today = new Date();
    const todayStr = isoDate(today);
    const [[{ cnt: today_appointments }]] = await conn.query('SELECT COUNT(id) as cnt FROM appointments WHERE appointment_date = ?', [todayStr]);
    const [[{ cnt: upcoming }]] = await conn.query('SELECT COUNT(id) as cnt FROM appointments WHERE appointment_date >= ?', [todayStr]);
    const [[{ cnt: total_customers }]] = await conn.query('SELECT COUNT(DISTINCT phone) as cnt FROM appointments');

    const [[{ cnt: dogs }]] = await conn.query("SELECT COUNT(id) as cnt FROM appointments WHERE pet_category = 'Dog'");
    const [[{ cnt: cats }]] = await conn.query("SELECT COUNT(id) as cnt FROM appointments WHERE pet_category = 'Cat'");
    const [[{ cnt: classic }]] = await conn.query("SELECT COUNT(id) as cnt FROM appointments WHERE main_service LIKE '%Classic%'");
    const [[{ cnt: addons }]] = await conn.query("SELECT COUNT(id) as cnt FROM appointments WHERE addons != '' AND addons IS NOT NULL");

    // Recent appointments
    const [recentRows] = await conn.query('SELECT id, owner_name, phone, pet_name, breed, pet_category, main_service, addons, appointment_date, appointment_time FROM appointments ORDER BY id DESC LIMIT 5');

    // Time-series: last 28 days (for weekly/last-4-weeks) and last 7 days (for daily)
    const start28 = new Date(today);
    start28.setDate(start28.getDate() - 27);
    const start28Str = isoDate(start28);

    const [dailyRows] = await conn.query('SELECT appointment_date as d, COUNT(*) as cnt FROM appointments WHERE appointment_date >= ? GROUP BY appointment_date ORDER BY appointment_date', [start28Str]);
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
    const [monthlyRows] = await conn.query("SELECT DATE_FORMAT(appointment_date, '%Y-%m') as ym, COUNT(*) as cnt FROM appointments WHERE appointment_date >= ? GROUP BY ym ORDER BY ym", [startMonthStr]);
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
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back — admin #{adminId}</p>
          </div>
          <div>
            <a href="/admin/bookings" style={{ marginRight: 12 }}>View Bookings</a>
            <a href="/admin/services">Services</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 12, marginTop: 20 }}>
          <div style={{ padding: 16, borderRadius: 8, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{total_appointments}</div>
            <div style={{ color: '#666' }}>Total Appointments</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{today_appointments}</div>
            <div style={{ color: '#666' }}>Today's Appointments</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{upcoming}</div>
            <div style={{ color: '#666' }}>Upcoming</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{total_customers}</div>
            <div style={{ color: '#666' }}>Total Customers</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12, marginTop: 18 }}>
          <div style={{ padding: 14, borderRadius: 8, background: '#fff' }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{dogs}</div>
            <div style={{ color: '#666' }}>Dog Appointments</div>
          </div>
          <div style={{ padding: 14, borderRadius: 8, background: '#fff' }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{cats}</div>
            <div style={{ color: '#666' }}>Cat Appointments</div>
          </div>
          <div style={{ padding: 14, borderRadius: 8, background: '#fff' }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{classic}</div>
            <div style={{ color: '#666' }}>Classic Packages</div>
          </div>
          <div style={{ padding: 14, borderRadius: 8, background: '#fff' }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{addons}</div>
            <div style={{ color: '#666' }}>With Add-ons</div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <h2>Charts</h2>
          <DashboardCharts
            dailyLabels={dailyLabels}
            dailyCounts={dailyCounts}
            weeklyLabels={weeklyLabels}
            weeklyCounts={weeklyCounts}
            monthlyLabels={monthlyLabels}
            monthlyCounts={monthlyCounts}
          />
        </div>

        <div style={{ marginTop: 22 }}>
          <h2>Recent Appointments</h2>
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <tr>
                  <th style={{ padding: 8 }}>ID</th>
                  <th style={{ padding: 8 }}>Owner</th>
                  <th style={{ padding: 8 }}>Pet</th>
                  <th style={{ padding: 8 }}>Service</th>
                  <th style={{ padding: 8 }}>Date</th>
                  <th style={{ padding: 8 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(recentRows) && recentRows.length > 0 ? (
                  recentRows.map((r: any) => (
                    <tr key={r.id}>
                      <td style={{ padding: 8 }}>#{r.id}</td>
                      <td style={{ padding: 8 }}>{r.owner_name}<div style={{ fontSize: 12, color: '#666' }}>{r.phone}</div></td>
                      <td style={{ padding: 8 }}>{r.pet_name}<div style={{ fontSize: 12, color: '#666' }}>{r.breed}</div></td>
                      <td style={{ padding: 8 }}>{r.main_service}{r.addons ? <div style={{ fontSize: 12, color: '#666' }}>+ {r.addons}</div> : null}</td>
                      <td style={{ padding: 8 }}>{formatDate(r.appointment_date)}</td>
                      <td style={{ padding: 8 }}>{r.appointment_time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#888' }}>No appointments yet</td>
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
