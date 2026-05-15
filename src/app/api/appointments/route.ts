import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const owner_name = (body.owner_name || '').toString();
    const email = (body.email || '').toString();
    const phone = (body.phone || '').toString();
    const pet_name = (body.pet_name || '').toString();
    const pet_category = (body.pet_category || '').toString();
    const breed = (body.breed || '').toString();
    const pet_size = (body.pet_size || '').toString();
    const pet_count = (body.pet_count || '').toString();
    const multi_pet_note = (body.multi_pet_note || '').toString();
    const main_service = (body.main_service || '').toString();
    const addons = Array.isArray(body['addons[]']) ? body['addons[]'].join(', ') : (body.addons ? (Array.isArray(body.addons) ? body.addons.join(', ') : body.addons) : '');
    const appointment_date = (body.appointment_date || '').toString();
    const appointment_time = (body.appointment_time || '').toString();
    const notes = (body.notes || '').toString();
    const payment_method = (body.payment_method || 'cash').toString();
    const payment_status = payment_method === 'online' ? 'paid' : 'pending';

    const conn = await mysql.createConnection(DB);

    const [rows] = await conn.execute("SELECT COUNT(*) as total FROM appointments WHERE appointment_date=?", [appointment_date]);
    const total = (rows as any)[0].total || 0;
    if (total >= 10) {
      await conn.end();
      return NextResponse.json({ full: true }, { status: 400 });
    }

    const sql = `INSERT INTO appointments (owner_name, email, phone, pet_name, pet_category, breed, pet_size, pet_count, multi_pet_note, main_service, addons, appointment_date, appointment_time, notes, payment_method, payment_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = [owner_name, email, phone, pet_name, pet_category, breed, pet_size, pet_count, multi_pet_note, main_service, addons, appointment_date, appointment_time, notes, payment_method, payment_status];

    await conn.execute(sql, params);
    await conn.end();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
