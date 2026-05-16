import mongo from '@/lib/mongo'
import { NextResponse } from 'next/server';
import api from '@/lib/api'
import { info, error as logError } from '@/lib/logger'

const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
}
const APPOINTMENTS_TABLE = process.env.DB_TABLE_APPOINTMENTS || 'appointments'

export async function POST(req: Request) {
  try {
    // basic rate limiting by IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local'
    if (!api.checkRate(ip, Number(process.env.RATE_LIMIT || 90), 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json();
    const owner_name = api.validateString(body.owner_name, 1, 120)
    const email = api.validateString(body.email, 0, 120)
    const phone = api.validateString(body.phone, 6, 24)
    const pet_name = api.validateString(body.pet_name, 0, 80)
    const pet_category = api.validateString(body.pet_category, 0, 40)
    const breed = api.validateString(body.breed, 0, 80)
    const pet_size = api.validateString(body.pet_size, 0, 40)
    const pet_count = Number(body.pet_count) || 1
    const multi_pet_note = api.validateString(body.multi_pet_note, 0, 200)
    const main_service = api.validateString(body.main_service, 0, 120)
    const addons = Array.isArray(body.addons) ? body.addons.join(', ') : api.validateString(body.addons, 0, 300)
    const appointment_date = api.validateString(body.appointment_date, 1, 40)
    const appointment_time = api.validateString(body.appointment_time, 1, 40)
    const notes = api.validateString(body.notes, 0, 600)
    const payment_method = api.validateString(body.payment_method, 0, 40) || 'cash'
    const payment_status = payment_method === 'online' ? 'paid' : 'pending'

    if (!owner_name || !appointment_date || !appointment_time) {
      return api.badRequest('owner_name, appointment_date and appointment_time are required')
    }

    // Use MongoDB for Next.js APIs (appointments collection)
    try {
      const col = await mongo.getCollection('appointments')
      const total = await col.countDocuments({ appointment_date })
      if (total >= Number(process.env.SLOTS_PER_DAY || 10)) {
        return NextResponse.json({ success: false, full: true }, { status: 400 })
      }

      const doc = {
        owner_name, email, phone, pet_name, pet_category, breed, pet_size, pet_count,
        multi_pet_note, main_service, addons, appointment_date, appointment_time, notes,
        payment_method, payment_status, created_at: new Date(),
      }
      const res = await col.insertOne(doc)
      const insertId = res.insertedId?.toString()
      info('appointment.created', { owner_name, appointment_date, appointment_time, id: insertId })
      return NextResponse.json({ success: true, id: insertId })
    } catch (e: any) {
      logError('mongo insert appointment error', { error: e?.message || e })
      return api.serverError('Failed to create appointment')
    }
  } catch (err: any) {
    logError('POST /api/appointments error', { error: err?.message || err })
    return api.serverError('Failed to create appointment')
  }
}
