import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import { getAdminFromRequest } from '@/lib/adminAuth'

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

    if (type === 'appointments') {
      const col = await mongo.getCollection('appointments')
      const rows = await col.find({}, { sort: { id: 1 } }).toArray()
      const headers = ['id','owner_name','phone','email','pet_name','pet_category','main_service','addons','appointment_date','appointment_time','notes','created_at']
      const lines = [headers.join(',')]
      for (const r of rows) lines.push(headers.map(h => escapeCsv(r[h])).join(','))
      const csv = '\uFEFF' + lines.join('\n')
      const filename = `appointments_export_${new Date().toISOString().slice(0,10)}.csv`
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` } })
    }

    if (type === 'contact_messages') {
      const col = await mongo.getCollection('contact_messages')
      const rows = await col.find({}, { sort: { id: 1 } }).toArray()
      const headers = ['id','name','email','phone','subject','message','created_at']
      const lines = [headers.join(',')]
      for (const r of rows) lines.push(headers.map(h => escapeCsv(r[h])).join(','))
      const csv = '\uFEFF' + lines.join('\n')
      const filename = `contact_messages_export_${new Date().toISOString().slice(0,10)}.csv`
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` } })
    }

    if (type === 'reviews') {
      const col = await mongo.getCollection('reviews')
      const rows = await col.find({}, { sort: { id: 1 } }).toArray()
      const headers = ['id','customer_id','booking_id','rating','comment','status','created_at']
      const lines = [headers.join(',')]
      for (const r of rows) lines.push(headers.map(h => escapeCsv(r[h])).join(','))
      const csv = '\uFEFF' + lines.join('\n')
      const filename = `reviews_export_${new Date().toISOString().slice(0,10)}.csv`
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` } })
    }

    if (type === 'services') {
      // service_cards + service_card_items stored in Mongo as separate collections
      const sc = await mongo.getCollection('service_cards')
      const sci = await mongo.getCollection('service_card_items')
      const cards = await sc.find({}, { sort: { id: 1 } }).toArray()
      const lines: string[] = []
      const headers = ['service_id','title','category','item_id','item_type','item_name','item_price']
      lines.push(headers.join(','))
      for (const c of cards) {
        const items = await sci.find({ service_id: c.id }).toArray()
        if (!items || items.length === 0) {
          lines.push([c.id, c.title, c.category, '', '', '', ''].map(escapeCsv).join(','))
          continue
        }
        for (const it of items) {
          lines.push([c.id, c.title, c.category, it.id, it.type, it.name, it.price].map(escapeCsv).join(','))
        }
      }
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
