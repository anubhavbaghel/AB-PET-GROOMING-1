import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db'

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'ab_pet_grooming';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = (body.username || '').toString();
    const password = (body.password || '').toString();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 });
    }

    const conn = await createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });
    try {
      const [rows] = await conn.execute('SELECT id, username, password FROM admin_users WHERE username = ? AND password = ?', [username, password]);
      const results: any[] = Array.isArray(rows) ? rows as any[] : [];

      if (results.length > 0) {
        const admin = results[0];
        const res = NextResponse.json({ success: true });
        // Set simple HTTP-only cookies for admin session (path limited to /admin)
        res.cookies.set('admin_id', String(admin.id), { httpOnly: true, path: '/admin', maxAge: 60 * 60 * 24 });
        res.cookies.set('admin_username', String(admin.username), { httpOnly: true, path: '/admin', maxAge: 60 * 60 * 24 });
        return res;
      } else {
        return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
      }
    } finally {
      await conn.end();
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
