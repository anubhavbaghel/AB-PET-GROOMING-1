import { NextResponse } from 'next/server'
import { createPool } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/adminAuth'

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
})

function extractRows(result: any) {
  return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result
}

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY id DESC')
    const rows = extractRows(result) || []
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/admin/contact_messages error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const id = Number(url.searchParams.get('id'))
    if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/contact_messages error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
