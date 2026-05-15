import { NextResponse } from 'next/server'
import { error as logError, info as logInfo } from './logger'

export function badRequest(msg = 'Bad request') {
  return NextResponse.json({ success: false, error: msg }, { status: 400 })
}

export function serverError(msg = 'Server error') {
  logError(msg)
  return NextResponse.json({ success: false, error: msg }, { status: 500 })
}

// very small in-memory rate limiter for public endpoints (per IP)
const RATE_MAP = new Map<string, { count: number; ts: number }>()
export function checkRate(ip = 'global', limit = 60, windowMs = 60_000) {
  const now = Date.now()
  const entry = RATE_MAP.get(ip) || { count: 0, ts: now }
  if (now - entry.ts > windowMs) {
    entry.count = 1
    entry.ts = now
    RATE_MAP.set(ip, entry)
    return true
  }
  entry.count += 1
  RATE_MAP.set(ip, entry)
  return entry.count <= limit
}

export function validateString(v: any, min = 0, max = 1000) {
  if (v === undefined || v === null) return ''
  const s = String(v).trim()
  if (s.length < min) return ''
  if (s.length > max) return s.slice(0, max)
  return s
}

export default { badRequest, serverError, checkRate, validateString }
