import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import api from '@/lib/api'
import { info, error as logError } from '@/lib/logger'

export async function GET() {
  try {
    const col = await mongo.getCollection('reviews')
    const rows = await col.find({ status: 'approved' }, { sort: { created_at: -1 }, limit: 50 }).toArray()
    // map to the shape expected by the front-end: id, name, review (message), rating
    const out = rows.map((r: any) => ({
      id: r.id ?? String(r._id),
      name: r.name || r.customer_name || '',
      review: r.message || r.comment || '',
      rating: r.rating,
    }))
    return NextResponse.json(out)
  } catch (err: any) {
    logError('GET /api/reviews error', { error: err?.message || err })
    return api.serverError('Failed to fetch reviews')
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local'
    if (!api.checkRate(ip, Number(process.env.RATE_LIMIT || 90), 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const name = api.validateString(body.name, 1, 120)
    const message = api.validateString(body.message, 1, 2000)
    const rating = Number(body.rating)

    if (!name) return api.badRequest('name is required')
    if (!message) return api.badRequest('message is required')
    if (!rating || rating < 1 || rating > 5) return api.badRequest('rating must be between 1 and 5')

    const col = await mongo.getCollection('reviews')
    const res = await col.insertOne({
      name,
      message,
      rating,
      status: 'pending', // admin must approve before it shows publicly
      created_at: new Date(),
    })

    info('review.submitted', { name, rating, id: String(res.insertedId) })
    return NextResponse.json({ success: true, id: String(res.insertedId) })
  } catch (err: any) {
    logError('POST /api/reviews error', { error: err?.message || err })
    return api.serverError('Failed to submit review')
  }
}
