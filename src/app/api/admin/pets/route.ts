import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import { getAdminFromRequest } from '@/lib/adminAuth'

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

    // Convert to Mongo query. We'll perform a left-join-like lookup via aggregation if needed.
    const match: any = {}
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
      ]
    }
    const col = await mongo.getCollection('pets')
    const rows = await col.find(match, { sort: { id: -1 } }).toArray()
    // populate owner info by looking up customers map
    const customerIds = Array.from(new Set(rows.map(r => r.customer_id).filter(Boolean)))
    let customersMap: Record<string, any> = {}
    if (customerIds.length) {
      const custs = await (await mongo.getCollection('customers')).find({ id: { $in: customerIds } }).toArray()
      customersMap = Object.fromEntries(custs.map((c: any) => [c.id, c]))
    }
    const out = rows.map((r: any) => ({ ...r, owner_name: customersMap[r.customer_id]?.name, owner_phone: customersMap[r.customer_id]?.phone }))
    return NextResponse.json(out)
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

    const col = await mongo.getCollection('pets')
    const r = await col.insertOne({ customer_id, name, breed, age, weight, color, medical_notes, allergies, vaccinated: !!vaccinated, created_at: new Date() })
    return NextResponse.json({ success: true, id: r.insertedId?.toString() })
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
      const toUpdate: any = {}
      for (const k of Object.keys(body)) {
        if (k === 'id') continue
        toUpdate[k] = body[k]
      }
      const col = await mongo.getCollection('pets')
      await col.updateOne({ _id: typeof id === 'string' ? { $eq: id } : { id: id } }, { $set: toUpdate })
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
    const col = await mongo.getCollection('pets')
    await col.deleteOne({ _id: typeof id === 'string' ? { $eq: id } : { id: id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/pets error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
