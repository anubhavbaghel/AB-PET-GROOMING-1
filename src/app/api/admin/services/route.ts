import { NextResponse } from 'next/server'
import { createPool } from '@/lib/db'

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
})

export async function GET() {
  try {
    console.log('DEBUG: admin/services pool', !!pool, typeof pool?.query, typeof pool?.execute)

    if (!pool || typeof pool.query !== 'function') {
      console.error('DB pool invalid in admin/services GET', pool)
      return NextResponse.json({ error: 'db_error' }, { status: 500 })
    }

    const result = await pool.query(
      `SELECT sc.id as service_id, sc.title, sc.category, sci.id as item_id, sci.type, sci.name, sci.price
       FROM service_cards sc
       LEFT JOIN service_card_items sci ON sc.id = sci.service_id
       ORDER BY sc.id ASC`
    )

    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result

    const map = new Map<number, any>()
    const rowsArr = Array.isArray(rows) ? rows : []
    for (const r of rowsArr) {
      const id = Number(r.service_id)
      if (!map.has(id)) map.set(id, { id, title: r.title, category: r.category, items: [] })
      if (r && r.item_id) {
        const entry = map.get(id)
        if (entry && Array.isArray(entry.items)) entry.items.push({ id: r.item_id, type: r.type, name: r.name, price: r.price })
      }
    }

    return NextResponse.json(Array.from(map.values()))
  } catch (err) {
    console.error('GET /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const title = (body.title || '').toString()
    const category = (body.category || '').toString()
    const items = Array.isArray(body.items) ? body.items : []

    const res: any = (await pool.execute(`INSERT INTO service_cards (title, category) VALUES (?, ?)`, [title, category]))[0]
    const serviceId = res.insertId || res.insertId || res.insertId === 0 ? res.insertId : res.lastID || res.insertId

    for (const it of items) {
      const t = it.type || 'item'
      const name = it.name || ''
      const price = it.price == null || it.price === '' ? null : it.price
      await pool.execute(`INSERT INTO service_card_items (service_id, type, name, price) VALUES (?, ?, ?, ?)`, [serviceId, t, name, price])
    }

    return NextResponse.json({ success: true, id: serviceId })
  } catch (err) {
    console.error('POST /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url)
    const id = Number(url.searchParams.get('id'))
    if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })
    const body = await req.json()
    const title = (body.title || '').toString()
    const category = (body.category || '').toString()
    const items = Array.isArray(body.items) ? body.items : []

    await pool.execute(`UPDATE service_cards SET title = ?, category = ? WHERE id = ?`, [title, category, id])
    await pool.execute(`DELETE FROM service_card_items WHERE service_id = ?`, [id])

    for (const it of items) {
      const t = it.type || 'item'
      const name = it.name || ''
      const price = it.price == null || it.price === '' ? null : it.price
      await pool.execute(`INSERT INTO service_card_items (service_id, type, name, price) VALUES (?, ?, ?, ?)`, [id, t, name, price])
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = Number(url.searchParams.get('id'))
    if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    await pool.execute(`DELETE FROM service_card_items WHERE service_id = ?`, [id])
    await pool.execute(`DELETE FROM service_cards WHERE id = ?`, [id])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
