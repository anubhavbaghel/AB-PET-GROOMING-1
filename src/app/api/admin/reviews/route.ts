import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import { getAdminFromRequest } from '@/lib/adminAuth'
import { ObjectId } from 'mongodb'

function makeReviewIdFilter(id: any) {
  const s = String(id || '')
  if (!s) return null
  if (/^\d+$/.test(s)) return { $or: [{ id: Number(s) }, ...(ObjectId.isValid(s) ? [{ _id: new ObjectId(s) }] : [])] }
  if (ObjectId.isValid(s)) return { _id: new ObjectId(s) }
  return null
}

function extractRows(result: any) {
  return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result
}

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const col = await mongo.getCollection('reviews')
    const rows = await col.find({}, { sort: { id: -1 } }).toArray()
    // populate customer info if present
    const customerIds = Array.from(new Set(rows.map((r: any) => r.customer_id).filter(Boolean)))
    let customersMap: Record<string, any> = {}
    if (customerIds.length) {
      const custs = await (await mongo.getCollection('customers')).find({ id: { $in: customerIds } }).toArray()
      customersMap = Object.fromEntries(custs.map((c: any) => [c.id, c]))
    }
    const out = rows.map((r: any) => ({ ...r, customer_name: customersMap[r.customer_id]?.name, customer_phone: customersMap[r.customer_id]?.phone }))
    return NextResponse.json(out)
  } catch (err) {
    console.error('GET /api/admin/reviews error', err)
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

    let status = body.status
    if (!status && body.action) {
      const a = String(body.action).toLowerCase()
      if (a === 'approve') status = 'approved'
      if (a === 'reject') status = 'rejected'
    }

    if (status) {
      const idParam = String(idFromQuery || body.id || '')
      const filter = makeReviewIdFilter(idParam)
      if (!filter) return NextResponse.json({ error: 'missing_id' }, { status: 400 })
      const col = await mongo.getCollection('reviews')
      await col.updateOne(filter, { $set: { status } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'missing_status' }, { status: 400 })
  } catch (err) {
    console.error('PUT /api/admin/reviews error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

    return NextResponse.json({ error: 'missing_status' }, { status: 400 })
  } catch (err) {
    console.error('PUT /api/admin/reviews error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const idParam = url.searchParams.get('id') || ''
    const filter = makeReviewIdFilter(idParam)
    if (!filter) return NextResponse.json({ error: 'missing_id' }, { status: 400 })
    const col = await mongo.getCollection('reviews')
    await col.deleteOne(filter)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/reviews error', err)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
