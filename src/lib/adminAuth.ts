import { createConnection } from '@/lib/db'

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASS = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || 'ab_pet_grooming'

function parseCookies(cookieHeader: string) {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out
  const parts = cookieHeader.split(';')
  for (const p of parts) {
    const idx = p.indexOf('=')
    if (idx > -1) {
      const k = p.slice(0, idx).trim()
      const v = p.slice(idx + 1).trim()
      out[k] = v
    }
  }
  return out
}

export async function getAdminFromRequest(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = parseCookies(cookieHeader)
    const idStr = cookies['admin_id'] || cookies['adminId'] || cookies['admin-id']
    if (!idStr) return null
    const id = Number(idStr)
    if (!id) return null

    const conn = await createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME })
    try {
      const res: any = await conn.execute('SELECT id, username FROM admin_users WHERE id = ?', [id])
      const rows = Array.isArray(res) && Array.isArray(res[0]) ? res[0] : res
      if (Array.isArray(rows) && rows.length > 0) return rows[0]
      return null
    } finally {
      try { await conn.end() } catch (e) { /* ignore */ }
    }
  } catch (e) {
    console.error('adminAuth.getAdminFromRequest error', e)
    return null
  }
}

export default { getAdminFromRequest }
