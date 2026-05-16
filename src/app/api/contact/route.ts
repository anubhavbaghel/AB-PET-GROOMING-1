import { NextResponse } from 'next/server';
import api from '@/lib/api'
import { info, error as logError } from '@/lib/logger'
import mongo from '@/lib/mongo'

export async function POST(req: Request){
  try{
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local'
    if (!api.checkRate(ip, Number(process.env.RATE_LIMIT || 90), 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json();
    const name = api.validateString(body.name, 1, 120);
    const email = api.validateString(body.email, 0, 120);
    const phone = api.validateString(body.phone, 0, 24);
    const subject = api.validateString(body.subject, 0, 200);
    const message = api.validateString(body.message, 1, 2000);

    if (!name || !message) return api.badRequest('name and message are required')

    const col = await mongo.getCollection('contact_messages')
    await col.insertOne({ name, email, phone, subject, message, created_at: new Date() })
    info('contact.created', { name })
    return NextResponse.json({ success: true });
  }catch(err:any){
    logError('POST /api/contact error', { error: err?.message || err })
    return api.serverError('Failed to submit contact message')
  }
}
