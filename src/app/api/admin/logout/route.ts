import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Clear admin cookies on both root and /admin path
  res.cookies.set('admin_id', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('admin_username', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('admin_id', '', { httpOnly: true, path: '/admin', maxAge: 0 });
  res.cookies.set('admin_username', '', { httpOnly: true, path: '/admin', maxAge: 0 });
  return res;
}
