import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import { getAdminFromRequest } from '@/lib/adminAuth'
import { ObjectId } from 'mongodb'

function makeIdFilter(id: any) {
  const s = String(id || '')
  if (!s) return null
  if (/^\d+$/.test(s)) return { id: Number(s) }
  if (ObjectId.isValid(s)) return { _id: new ObjectId(s) }
  return { id: s }
}

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const sc = await mongo.getCollection('service_cards')
    const sci = await mongo.getCollection('service_card_items')
    const cards = await sc.find({}, { sort: { id: 1 } }).toArray()
    const out = []
    for (const c of cards) {
      const items = await sci.find({ service_id: c.id }).toArray()
      out.push({ id: c.id, title: c.title, category: c.category, items: items.map((it: any) => ({ id: it.id, type: it.type, name: it.name, price: it.price })) })
    }
    return NextResponse.json(out)
  } catch (err) {
    console.error('GET /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const body = await req.json()
    const title = (body.title || '').toString()
    const category = (body.category || '').toString()
    const items = Array.isArray(body.items) ? body.items : []

    const sc = await mongo.getCollection('service_cards')
    const sci = await mongo.getCollection('service_card_items')
    const insertRes = await sc.insertOne({ title, category, created_at: new Date() })
    const serviceId = insertRes.insertedId?.toString() ?? null
    // attempt to preserve numeric id if payload provided
    let numericId: number | null = null
    if (!serviceId && body.id && /^\d+$/.test(String(body.id))) numericId = Number(body.id)
    for (const it of items) {
      const t = it.type || 'item'
      const name = it.name || ''
      const price = it.price == null || it.price === '' ? null : it.price
      await sci.insertOne({ service_id: numericId ?? (body.id || null), type: t, name, price, created_at: new Date() })
    }

    return NextResponse.json({ success: true, id: serviceId ?? numericId })
  } catch (err) {
    console.error('POST /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const idParam = url.searchParams.get('id')
    const body = await req.json()
    const filter = makeIdFilter(idParam || body.id)
    if (!filter) return NextResponse.json({ error: 'missing_id' }, { status: 400 })
    const title = (body.title || '').toString()
    const category = (body.category || '').toString()
    const items = Array.isArray(body.items) ? body.items : []

    const sc = await mongo.getCollection('service_cards')
    const sci = await mongo.getCollection('service_card_items')
    await sc.updateOne(filter, { $set: { title, category } })
    // delete existing items by service reference (assume service has numeric id field)
    const serviceIdVal = filter.id ?? null
    if (serviceIdVal !== null) {
      await sci.deleteMany({ service_id: serviceIdVal })
      for (const it of items) {
        const t = it.type || 'item'
        const name = it.name || ''
        const price = it.price == null || it.price === '' ? null : it.price
        await sci.insertOne({ service_id: serviceIdVal, type: t, name, price, created_at: new Date() })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const idParam = url.searchParams.get('id')
    const filter = makeIdFilter(idParam)
    if (!filter) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    const sc = await mongo.getCollection('service_cards')
    const sci = await mongo.getCollection('service_card_items')
    const serviceIdVal = filter.id ?? null
    if (serviceIdVal !== null) {
      await sci.deleteMany({ service_id: serviceIdVal })
    }
    await sc.deleteOne(filter)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/services error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
