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
      where.push("(p.name LIKE ? OR p.breed LIKE ? OR c.name LIKE ? OR p.id LIKE ?)")
      const s = `%${search}%`
      params.push(s, s, s, s)
    }

    const whereClause = where.length ? ' WHERE ' + where.join(' AND ') : ''
    const sql = `SELECT p.*, c.name as owner_name, c.phone as owner_phone FROM pets p LEFT JOIN customers c ON p.customer_id = c.id ${whereClause} ORDER BY p.id DESC`
    const res = await pool.query(sql, params)
    const rows = extractRows(res) || []
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/admin/pets error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const body = await req.json()
    const customer_id = Number(body.customer_id) || null
    const name = body.name || ''
    const breed = body.breed || ''
    const age = body.age ? Number(body.age) : null
    const weight = body.weight ? Number(body.weight) : null
    const color = body.color || ''
    const medical_notes = body.medical_notes || ''
    const allergies = body.allergies || ''
    const vaccinated = body.vaccinated ? 1 : 0

    const res: any = (await pool.execute(`INSERT INTO pets (customer_id, name, breed, age, weight, color, medical_notes, allergies, vaccinated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [customer_id, name, breed, age, weight, color, medical_notes, allergies, vaccinated]))[0]
    const insertId = res.insertId ?? res.lastID ?? 0
    return NextResponse.json({ success: true, id: insertId })
  } catch (err) {
    console.error('POST /api/admin/pets error', err)
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
      if (k === 'vaccinated') {
        fields.push(`${k} = ?`)
        params.push(body[k] ? 1 : 0)
        continue
      }
      fields.push(`${k} = ?`)
      params.push(body[k])
    }
    if (fields.length) {
      params.push(id)
      await pool.execute(`UPDATE pets SET ${fields.join(', ')} WHERE id = ?`, params)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'no_changes' }, { status: 400 })
  } catch (err) {
    console.error('PUT /api/admin/pets error', err)
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
    await pool.execute('DELETE FROM pets WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/pets error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
