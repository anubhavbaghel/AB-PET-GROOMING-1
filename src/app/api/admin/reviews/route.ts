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
    const result = await pool.query('SELECT * FROM reviews ORDER BY id DESC')
    const rows = extractRows(result) || []
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/admin/reviews error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const idFromQuery = Number(url.searchParams.get('id'))
    const body = await req.json()
    const id = Number(body.id || idFromQuery)
    if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    let status = body.status
    if (!status && body.action) {
      const a = String(body.action).toLowerCase()
      if (a === 'approve') status = 'approved'
      if (a === 'reject') status = 'rejected'
    }

    if (status) {
      await pool.execute('UPDATE reviews SET status = ? WHERE id = ?', [status, id])
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'missing_status' }, { status: 400 })
  } catch (err) {
    console.error('PUT /api/admin/reviews error', err)
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

    await pool.execute('DELETE FROM reviews WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/reviews error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
