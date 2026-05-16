import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import { getAdminFromRequest } from '@/lib/adminAuth'
import { ObjectId } from 'mongodb'

const APPOINTMENTS_COLLECTION = process.env.DB_TABLE_APPOINTMENTS || 'appointments'

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
    const date_from = url.searchParams.get('date_from') || ''
    const date_to = url.searchParams.get('date_to') || ''
    const pet_type = url.searchParams.get('pet_type') || ''
    const page = Number(url.searchParams.get('page') || '1') || 1
    const perPage = Number(url.searchParams.get('perPage') || '15') || 15

    const filter: any = {}
    if (search) {
      filter.$or = [
        { owner_name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { pet_name: { $regex: search, $options: 'i' } },
        { id: search },
      ]
    }
    if (pet_type) filter.pet_category = pet_type
    if (date_from || date_to) {
      filter.appointment_date = {}
      if (date_from) filter.appointment_date.$gte = date_from
      if (date_to) filter.appointment_date.$lte = date_to
    }

    const col = await mongo.getCollection(APPOINTMENTS_COLLECTION)
    const total = await col.countDocuments(filter)
    const rows = await col.find(filter, { sort: { id: -1 }, skip: (page - 1) * perPage, limit: perPage }).toArray()
    const out = rows.map((r: any) => ({ ...r, id: r.id ?? (r._id ? String(r._id) : undefined) }))
    return NextResponse.json({ data: out, total, page, perPage })
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
    const idParam = url.searchParams.get('id')
    const filter = makeIdFilter(idParam)
    if (!filter) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    const col = await mongo.getCollection(APPOINTMENTS_COLLECTION)
    await col.deleteOne(filter)
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
    const idFromQuery = url.searchParams.get('id')
    const body = await req.json()
    const filter = makeIdFilter(idFromQuery || body.id)
    if (!filter) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    const col = await mongo.getCollection(APPOINTMENTS_COLLECTION)
    // Allow updating status or arbitrary fields (status only for now)
    const status = body.status
    if (status !== undefined) {
      await col.updateOne(filter, { $set: { status } })
      return NextResponse.json({ success: true })
    }

    // If other fields provided, build update
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
    console.error('PUT /api/admin/appointments error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
