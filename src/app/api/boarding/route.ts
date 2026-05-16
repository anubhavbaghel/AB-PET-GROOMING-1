import { NextResponse } from 'next/server'
import mongo from '@/lib/mongo'
import api from '@/lib/api'
import { info, error as logError } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local'
    if (!api.checkRate(ip, Number(process.env.RATE_LIMIT || 90), 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()

    // Owner details
    const owner_name = api.validateString(body.owner_name, 1, 120)
    const phone = api.validateString(body.phone, 6, 24)
    const email = api.validateString(body.email, 0, 120)
    const city = api.validateString(body.city, 0, 80)

    // Pet details
    const pet_name = api.validateString(body.pet_name, 1, 80)
    const pet_type = api.validateString(body.pet_type, 1, 40)
    const plan = api.validateString(body.plan, 1, 120)
    const breed = api.validateString(body.breed, 0, 80)
    const age = body.age !== undefined ? String(body.age) : ''
    const gender = api.validateString(body.gender, 0, 20)
    const notes = api.validateString(body.notes, 0, 600)

    // Boarding details
    const boarding_type = api.validateString(body.boarding_type, 1, 60)
    const emergency_contact = api.validateString(body.emergency_contact, 6, 24)
    const checkin_date = api.validateString(body.checkin_date, 1, 40)
    const checkout_date = api.validateString(body.checkout_date, 1, 40)
    const vaccinated_confirm = api.validateString(body.vaccinated_confirm, 0, 10)

    // Payment
    const payment_method = api.validateString(body.payment_method, 0, 40) || 'cash'
    const payment_status = payment_method === 'online' ? 'paid' : 'pending'

    // Required field validation
    if (!owner_name) return api.badRequest('Owner name is required')
    if (!phone) return api.badRequest('Phone number is required')
    if (!pet_name) return api.badRequest('Pet name is required')
    if (!pet_type) return api.badRequest('Pet type is required')
    if (!plan) return api.badRequest('Boarding plan is required')
    if (!boarding_type) return api.badRequest('Boarding type is required')
    if (!checkin_date) return api.badRequest('Check-in date is required')
    if (!checkout_date) return api.badRequest('Check-out date is required')

    // Date sanity check
    if (checkout_date < checkin_date) {
      return api.badRequest('Check-out date cannot be before check-in date')
    }

    const doc = {
      owner_name,
      phone,
      email,
      city,
      pet_name,
      pet_type,
      plan,
      breed,
      age,
      gender,
      notes,
      boarding_type,
      emergency_contact,
      checkin_date,
      checkout_date,
      vaccinated_confirm,
      payment_method,
      payment_status,
      status: 'pending',
      created_at: new Date(),
    }

    const col = await mongo.getCollection('boarding')
    const res = await col.insertOne(doc)
    const insertId = res.insertedId?.toString()

    info('boarding.created', { owner_name, pet_name, checkin_date, checkout_date, id: insertId })
    return NextResponse.json({ success: true, id: insertId })
  } catch (err: any) {
    logError('POST /api/boarding error', { error: err?.message || err })
    return api.serverError('Failed to submit boarding request')
  }
}
