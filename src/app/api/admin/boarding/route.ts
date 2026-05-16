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
    const url = new URL(req.url)
    const search = (url.searchParams.get('search') || '').trim()
    const status = url.searchParams.get('status') || ''
    const pet_type = url.searchParams.get('pet_type') || ''

    const filter: any = {}
    if (search) {
      filter.$or = [
        { owner_name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { pet_name: { $regex: search, $options: 'i' } },
        { id: search },
      ]
    }
    if (status) filter.status = status
    if (pet_type) filter.pet_type = pet_type

    const col = await mongo.getCollection('boarding')
    const rows = await col.find(filter, { sort: { id: -1 } }).toArray()
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/admin/boarding error', err)
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
    const col = await mongo.getCollection('boarding')
    await col.deleteOne(filter)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/boarding error', err)
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

    const col = await mongo.getCollection('boarding')
    const status = body.status
    if (status !== undefined) {
      await col.updateOne(filter, { $set: { status } })
      return NextResponse.json({ success: true })
    }

    const toUpdate: any = {}
    for (const k of Object.keys(body)) {
      if (k === 'id') continue
      toUpdate[k] = body[k]
    }
    if (Object.keys(toUpdate).length) {
      await col.updateOne(filter, { $set: toUpdate })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'no_changes' }, { status: 400 })
  } catch (err) {
    console.error('PUT /api/admin/boarding error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
