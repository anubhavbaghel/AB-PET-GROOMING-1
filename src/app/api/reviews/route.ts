import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import api from '@/lib/api'
import { error as logError } from '@/lib/logger'

export async function GET() {
  try {
    const col = await mongo.getCollection('reviews')
    const rows = await col.find({ status: 'approved' }, { sort: { id: -1 }, limit: 50 }).toArray()
    // map to the previous shape: id, name, review (message), rating
    const out = rows.map((r: any) => ({ id: r.id ?? r._id, name: r.name || r.customer_name || '', review: r.message || r.comment || '', rating: r.rating }))
    return NextResponse.json(out)
  } catch (err: any) {
    logError('GET /api/reviews error', { error: err?.message || err })
    return api.serverError('Failed to fetch reviews')
  }
}
