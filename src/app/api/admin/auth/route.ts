import { NextResponse } from 'next/server'
import { createConnection } from '@/lib/db'
import bcrypt from 'bcryptjs'

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASS = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || 'ab_pet_grooming'

function looksLikeBcryptHash(s: string) {
  return typeof s === 'string' && s.startsWith('$2')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = (body.username || '').toString()
    const password = (body.password || '').toString()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 })
    }

    const conn = await createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME })
    try {
      const q = 'SELECT id, username, password FROM admin_users WHERE username = ?'
      const result = await conn.execute(q, [username])
      const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result

      if (Array.isArray(rows) && rows.length > 0) {
        const admin = rows[0]
        const stored = admin.password || ''
        let ok = false

        if (looksLikeBcryptHash(stored)) {
          ok = await bcrypt.compare(password, stored)
        } else {
          // backward-compatible: plain-text password stored
          ok = password === stored
          if (ok) {
            // upgrade to hashed password (best-effort)
            try {
              const hashed = await bcrypt.hash(password, 10)
              await conn.execute('UPDATE admin_users SET password = ? WHERE id = ?', [hashed, admin.id])
            } catch (e) {
              console.error('Failed to upgrade password hash', e)
            }
          }
        }

        if (ok) {
          const maxAge = 60 * 60 * 24
          const res = NextResponse.json({ success: true }, { status: 200 })
          const secure = process.env.NODE_ENV === 'production'
          res.cookies.set('admin_id', String(admin.id), { httpOnly: true, path: '/admin', maxAge, secure, sameSite: 'lax' })
          res.cookies.set('admin_username', String(admin.username), { httpOnly: true, path: '/admin', maxAge, secure, sameSite: 'lax' })
          return res
        }
      }

      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 })
    } finally {
      try { await conn.end() } catch (e) { /* ignore */ }
    }
  } catch (err) {
    console.error('POST /api/admin/auth error', err)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
