import { NextResponse } from 'next/server'
import { createPool } from '@/lib/db'
import api from '@/lib/api'
import { error as logError } from '@/lib/logger'

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
})

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, message as review, rating FROM reviews WHERE status='approved' ORDER BY id DESC LIMIT 50"
    )
    return NextResponse.json(rows)
  } catch (err: any) {
    logError('GET /api/reviews error', { error: err?.message || err })
    return api.serverError('Failed to fetch reviews')
  }
}
