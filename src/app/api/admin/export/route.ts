import { NextResponse } from 'next/server'
import { createPool } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/adminAuth'

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
})

function extractRows(result: any) {
  return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result
}

function escapeCsv(val: any) {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('\n') || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const body = await req.json().catch(() => ({}))
    const type = (body.type || 'appointments').toString()
    const APPOINTMENTS_TABLE = process.env.DB_TABLE_APPOINTMENTS || 'appointments'

    if (type === 'appointments') {
      const res = await pool.query(`SELECT id, owner_name, phone, email, pet_name, pet_category, main_service, addons, appointment_date, appointment_time, notes, created_at FROM ${APPOINTMENTS_TABLE} ORDER BY id ASC`)
      const rows = extractRows(res) || []
      const headers = ['id','owner_name','phone','email','pet_name','pet_category','main_service','addons','appointment_date','appointment_time','notes','created_at']
      const lines = [headers.join(',')]
      for (const r of rows) lines.push(headers.map(h => escapeCsv(r[h])).join(','))
      const csv = '\uFEFF' + lines.join('\n')
      const filename = `appointments_export_${new Date().toISOString().slice(0,10)}.csv`
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` } })
    }

    if (type === 'contact_messages') {
      const res = await pool.query('SELECT id, name, email, phone, subject, message, created_at FROM contact_messages ORDER BY id ASC')
      const rows = extractRows(res) || []
      const headers = ['id','name','email','phone','subject','message','created_at']
      const lines = [headers.join(',')]
      for (const r of rows) lines.push(headers.map(h => escapeCsv(r[h])).join(','))
      const csv = '\uFEFF' + lines.join('\n')
      const filename = `contact_messages_export_${new Date().toISOString().slice(0,10)}.csv`
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` } })
    }

    if (type === 'reviews') {
      const res = await pool.query('SELECT id, customer_id, booking_id, rating, comment, status, created_at FROM reviews ORDER BY id ASC')
      const rows = extractRows(res) || []
      const headers = ['id','customer_id','booking_id','rating','comment','status','created_at']
      const lines = [headers.join(',')]
      for (const r of rows) lines.push(headers.map(h => escapeCsv(r[h])).join(','))
      const csv = '\uFEFF' + lines.join('\n')
      const filename = `reviews_export_${new Date().toISOString().slice(0,10)}.csv`
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` } })
    }

    if (type === 'services') {
      // join service_cards and items
      const res = await pool.query(`SELECT sc.id as service_id, sc.title, sc.category, sci.id as item_id, sci.type, sci.name, sci.price
        FROM service_cards sc
        LEFT JOIN service_card_items sci ON sc.id = sci.service_id
        ORDER BY sc.id ASC`)
      const rows = extractRows(res) || []
      const headers = ['service_id','title','category','item_id','item_type','item_name','item_price']
      const lines = [headers.join(',')]
      for (const r of rows) lines.push([r.service_id,r.title,r.category,r.item_id,r.type,r.name,r.price].map(escapeCsv).join(','))
      const csv = '\uFEFF' + lines.join('\n')
      const filename = `services_export_${new Date().toISOString().slice(0,10)}.csv`
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` } })
    }

    return NextResponse.json({ error: 'unsupported_type' }, { status: 400 })
  } catch (err) {
    console.error('POST /api/admin/export error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
