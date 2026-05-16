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
    const col = await mongo.getCollection('contact_messages')
    const rows = await col.find({}, { sort: { id: -1 } }).toArray()
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/admin/contact_messages error', err)
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

    const col = await mongo.getCollection('contact_messages')
    await col.deleteOne(filter)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/contact_messages error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
