import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ab_pet_grooming',
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const name = (body.name || '').toString();
    const email = (body.email || '').toString();
    const phone = (body.phone || '').toString();
    const subject = (body.subject || '').toString();
    const message = (body.message || '').toString();

    const conn = await mysql.createConnection(DB);
    const sql = `INSERT INTO contact_messages (name,email,phone,subject,message) VALUES (?,?,?,?,?)`;
    await conn.execute(sql, [name,email,phone,subject,message]);
    await conn.end();
    return NextResponse.json({ success: true });
  }catch(err:any){
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
