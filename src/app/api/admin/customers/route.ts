import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import { getAdminFromRequest } from '@/lib/adminAuth'
import { ObjectId } from 'mongodb'

// admin APIs now operate on MongoDB collections

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

    // Build Mongo query
    const filter: any = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }
    const col = await mongo.getCollection('customers')
    const rows = await col.find(filter, { sort: { id: -1 } }).toArray()
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
    const col = await mongo.getCollection('customers')
    const r = await col.insertOne({ name, email, phone, address, city, created_at: new Date() })
    return NextResponse.json({ success: true, id: r.insertedId?.toString() })
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
    const idFromQuery = url.searchParams.get('id') || ''
    const body = await req.json()
    const idStr = body.id ? String(body.id) : (idFromQuery || '')
    if (!idStr) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

    const fields: string[] = []
    const params: any[] = []
    for (const k of Object.keys(body)) {
      if (k === 'id') continue
      fields.push(`${k} = ?`)
      params.push(body[k])
    }
    if (fields.length) {
      const update: any = {}
      for (let i = 0; i < fields.length; i++) {
        // fields array contains strings like "name = ?"; map to body keys directly
      }
      // simple approach: apply all body fields except id
      const toUpdate: any = {}
      for (const k of Object.keys(body)) {
        if (k === 'id') continue
        toUpdate[k] = body[k]
      }
      const col = await mongo.getCollection('customers')
      // support numeric legacy id or ObjectId string
      let filter: any
      if (/^\d+$/.test(idStr)) {
        filter = { id: Number(idStr) }
      } else if (ObjectId.isValid(idStr)) {
        filter = { _id: new ObjectId(idStr) }
      } else {
        return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
      }
      await col.updateOne(filter, { $set: toUpdate })
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
    const idStr = url.searchParams.get('id') || ''
    if (!idStr) return NextResponse.json({ error: 'missing_id' }, { status: 400 })
    const col = await mongo.getCollection('customers')
    if (/^\d+$/.test(idStr)) {
      await col.deleteOne({ id: Number(idStr) })
    } else if (ObjectId.isValid(idStr)) {
      await col.deleteOne({ _id: new ObjectId(idStr) })
    } else {
      return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/customers error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
