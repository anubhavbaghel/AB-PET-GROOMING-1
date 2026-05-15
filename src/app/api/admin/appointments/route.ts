import { NextResponse } from 'next/server'
import { createPool } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/adminAuth'

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
})

const APPOINTMENTS_TABLE = process.env.DB_TABLE_APPOINTMENTS || 'appointments'

function extractRows(result: any) {
  return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result
}

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const search = (url.searchParams.get('search') || '').trim()
    const date_from = url.searchParams.get('date_from') || ''
    const date_to = url.searchParams.get('date_to') || ''
    const pet_type = url.searchParams.get('pet_type') || ''
    const page = Number(url.searchParams.get('page') || '1') || 1
    const perPage = Number(url.searchParams.get('perPage') || '15') || 15

    const where: string[] = []
    const params: any[] = []

    if (search) {
      where.push("(owner_name LIKE ? OR phone LIKE ? OR pet_name LIKE ? OR id LIKE ?)")
      const s = `%${search}%`
      params.push(s, s, s, s)
    }
    if (pet_type) {
      where.push('pet_category = ?')
      params.push(pet_type)
    }
    if (date_from) {
      where.push('appointment_date >= ?')
      params.push(date_from)
    }
    if (date_to) {
      where.push('appointment_date <= ?')
      params.push(date_to)
    }

    const whereClause = where.length ? ' WHERE ' + where.join(' AND ') : ''

    // Count
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM ${APPOINTMENTS_TABLE} ${whereClause}`, params)
    const countRows = extractRows(countResult) || []
    let total = 0
    if (Array.isArray(countRows) && countRows.length > 0) {
      const first = countRows[0]
      total = Number(first.total ?? first.cnt ?? Object.values(first)[0] ?? 0)
    }

    const offset = (page - 1) * perPage
    const qParams = params.concat([offset, perPage])
    const dataResult = await pool.query(`SELECT * FROM ${APPOINTMENTS_TABLE} ${whereClause} ORDER BY id DESC LIMIT ?, ?`, qParams)
    const rows = extractRows(dataResult) || []

    return NextResponse.json({ data: rows, total, page, perPage })
  } catch (err) {
    console.error('GET /api/admin/appointments error', err)
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

    await pool.execute(`DELETE FROM ${APPOINTMENTS_TABLE} WHERE id = ?`, [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/appointments error', err)
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

    // Allow updating status or arbitrary fields (status only for now)
    const status = body.status
    if (status !== undefined) {
      await pool.execute(`UPDATE ${APPOINTMENTS_TABLE} SET status = ? WHERE id = ?`, [status, id])
      return NextResponse.json({ success: true })
    }

    // If other fields provided, build update
    const fields: string[] = []
    const params: any[] = []
    for (const k of Object.keys(body)) {
      if (k === 'id') continue
      fields.push(`${k} = ?`)
      params.push(body[k])
    }
    if (fields.length) {
      params.push(id)
      await pool.execute(`UPDATE ${APPOINTMENTS_TABLE} SET ${fields.join(', ')} WHERE id = ?`, params)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'no_changes' }, { status: 400 })
  } catch (err) {
    console.error('PUT /api/admin/appointments error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
