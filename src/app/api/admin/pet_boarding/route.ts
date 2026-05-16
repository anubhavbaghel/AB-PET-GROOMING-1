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
    const col = await mongo.getCollection('pet_boarding')
    const rows = await col.find({}, { sort: { id: 1 } }).toArray()
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/admin/pet_boarding error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const body = await req.json()
    const name = body.name || ''
    const price = body.price == null ? null : body.price
    const type = body.type || ''
    const col = await mongo.getCollection('pet_boarding')
    const r = await col.insertOne({ name, price, type, created_at: new Date() })
    return NextResponse.json({ success: true, id: r.insertedId?.toString() })
  } catch (err) {
    console.error('POST /api/admin/pet_boarding error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const idFromQuery = url.searchParams.get('id')
    const body = await req.json()
    const filter = makeIdFilter(idFromQuery || body.id)
    if (!filter) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    const toUpdate: any = {}
    for (const k of Object.keys(body)) {
      if (k === 'id') continue
      toUpdate[k] = body[k]
    }
    if (Object.keys(toUpdate).length === 0) return NextResponse.json({ error: 'no_changes' }, { status: 400 })

    const col = await mongo.getCollection('pet_boarding')
    await col.updateOne(filter, { $set: toUpdate })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/admin/pet_boarding error', err)
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
    const col = await mongo.getCollection('pet_boarding')
    await col.deleteOne(filter)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/pet_boarding error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
