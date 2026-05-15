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
    const url = new URL(req.url)
    const search = (url.searchParams.get('search') || '').trim()

    const where: string[] = []
    const params: any[] = []
    if (search) {
      where.push('(name LIKE ? OR phone LIKE ? OR email LIKE ?)')
      const s = `%${search}%`
      params.push(s, s, s)
    }

    const whereClause = where.length ? ' WHERE ' + where.join(' AND ') : ''
    const res = await pool.query(`SELECT * FROM customers ${whereClause} ORDER BY id DESC`, params)
    const rows = extractRows(res) || []
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/admin/customers error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const body = await req.json()
    const name = body.name || ''
    const email = body.email || ''
    const phone = body.phone || ''
    const address = body.address || ''
    const city = body.city || ''
    const res: any = (await pool.execute(`INSERT INTO customers (name, email, phone, address, city) VALUES (?, ?, ?, ?, ?)`, [name, email, phone, address, city]))[0]
    const insertId = res.insertId ?? res.lastID ?? 0
    return NextResponse.json({ success: true, id: insertId })
  } catch (err) {
    console.error('POST /api/admin/customers error', err)
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

    const fields: string[] = []
    const params: any[] = []
    for (const k of Object.keys(body)) {
      if (k === 'id') continue
      fields.push(`${k} = ?`)
      params.push(body[k])
    }
    if (fields.length) {
      params.push(id)
      await pool.execute(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`, params)
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'no_changes' }, { status: 400 })
  } catch (err) {
    console.error('PUT /api/admin/customers error', err)
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
    await pool.execute('DELETE FROM customers WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/customers error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
