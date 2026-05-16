import mongo from '@/lib/mongo'
import { ObjectId } from 'mongodb'

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
    // Build a Mongo filter that supports both numeric legacy ids and ObjectId strings
    const s = String(idStr)
    const filters: any[] = []
    if (/^\d+$/.test(s)) filters.push({ id: Number(s) })
    if (ObjectId.isValid(s)) filters.push({ _id: new ObjectId(s) })
    if (filters.length === 0) return null
    const filter = filters.length === 1 ? filters[0] : { $or: filters }

    try {
      const col = await mongo.getCollection('admin_users')
      const admin = await col.findOne(filter, { projection: { id: 1, username: 1 } })
      return admin || null
    } catch (e) {
      console.error('adminAuth.getAdminFromRequest error', e)
      return null
    }
  } catch (e) {
    console.error('adminAuth.getAdminFromRequest error', e)
    return null
  }
}

export default { getAdminFromRequest }
