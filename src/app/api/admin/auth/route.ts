import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import mongo from '@/lib/mongo'

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

    // optional admin CSRF token check (set ADMIN_CSRF_TOKEN in env for production)
    const expected = process.env.ADMIN_CSRF_TOKEN
    if (expected) {
      const header = req.headers.get('x-csrf-token') || ''
      if (header !== expected) {
        return NextResponse.json({ success: false, message: 'Missing or invalid CSRF token' }, { status: 403 })
      }
    }

    const col = await mongo.getCollection('admin_users')
    const admin = await col.findOne({ username })
    if (!admin) return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 })

    const stored = admin.password || ''
    let ok = false
    if (looksLikeBcryptHash(stored)) {
      ok = await bcrypt.compare(password, stored)
    } else {
      ok = password === stored
      if (ok) {
        try {
          const hashed = await bcrypt.hash(password, 10)
          await col.updateOne({ _id: admin._id }, { $set: { password: hashed } })
        } catch (e) {
          console.error('Failed to upgrade password hash', e)
        }
      }
    }

    if (ok) {
      const maxAge = 60 * 60 * 24
      const res = NextResponse.json({ success: true }, { status: 200 })
      const secure = process.env.NODE_ENV === 'production'
      // set cookies at root path so API routes under /api can receive them
      // prefer returning numeric legacy id if present, otherwise ObjectId string
      const idForCookie = admin.id ? String(admin.id) : String(admin._id)
      res.cookies.set('admin_id', idForCookie, { httpOnly: true, path: '/', maxAge, secure, sameSite: 'lax' })
      res.cookies.set('admin_username', String(admin.username), { httpOnly: true, path: '/', maxAge, secure, sameSite: 'lax' })
      return res
    }

    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 })
  } catch (err) {
    console.error('POST /api/admin/auth error', err)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
