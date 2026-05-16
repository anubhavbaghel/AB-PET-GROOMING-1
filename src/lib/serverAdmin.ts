import { getAdminFromRequest } from './adminAuth'

// Helpers for server-side pages to assert an authenticated admin.
export async function requireAdmin(req: Request) {
  const admin = await getAdminFromRequest(req)
  if (!admin) throw new Error('unauthorized')
  return admin
}

export default { requireAdmin }
