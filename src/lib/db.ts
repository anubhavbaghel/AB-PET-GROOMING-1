import fs from 'fs'
import path from 'path'

let sqliteDb: any = null
let mysql2: any = null
let pg: any = null

function initSqlite() {
  if (sqliteDb) return sqliteDb
  const dbFile = process.env.DB_FILE || path.join(process.cwd(), 'database', 'dev.sqlite')
  const dir = path.dirname(dbFile)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const Database = require('better-sqlite3')
  sqliteDb = new Database(dbFile)
  try {
    sqliteDb.pragma('journal_mode = WAL')
    sqliteDb.pragma('foreign_keys = ON')
  } catch (e) {
    // ignore
  }

  // Ensure minimal tables exist for local dev
  const ensure = (sql: string) => {
    try {
      sqliteDb.prepare(sql).run()
    } catch (e) {
      // ignore errors from incompatible statements
    }
  }

  ensure(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_name TEXT,
    email TEXT,
    phone TEXT,
    pet_name TEXT,
    pet_category TEXT,
    breed TEXT,
    pet_size TEXT,
    pet_count INTEGER,
    multi_pet_note TEXT,
    main_service TEXT,
    addons TEXT,
    appointment_date TEXT,
    appointment_time TEXT,
    notes TEXT,
    payment_method TEXT,
    payment_status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  ensure(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  ensure(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  ensure(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    message TEXT,
    rating INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Services (service cards + items)
  ensure(`CREATE TABLE IF NOT EXISTS service_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  ensure(`CREATE TABLE IF NOT EXISTS service_card_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER,
    type TEXT,
    name TEXT,
    price TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(service_id) REFERENCES service_cards(id) ON DELETE CASCADE
  )`)

  return sqliteDb
}

function isSelect(sql: string) {
  return /^\s*(select|pragma)/i.test(sql)
}

export function createPool(opts?: any) {
  const DB_CLIENT = (process.env.DB_CLIENT || 'mysql').toLowerCase()

  if (DB_CLIENT === 'sqlite') {
    const db = initSqlite()
    return {
      query: async (sql: string, params?: any[]) => {
        const stmt = db.prepare(sql)
        if (isSelect(sql)) {
          const rows = stmt.all(params || [])
          return [rows, undefined]
        } else {
          const info = stmt.run(params || [])
          return [{ affectedRows: info.changes, insertId: info.lastInsertRowid }, undefined]
        }
      },
      execute: async (sql: string, params?: any[]) => {
        const stmt = db.prepare(sql)
        if (isSelect(sql)) {
          const rows = stmt.all(params || [])
          return [rows, undefined]
        } else {
          const info = stmt.run(params || [])
          return [{ affectedRows: info.changes, insertId: info.lastInsertRowid }, undefined]
        }
      },
      end: async () => {},
    }
  }

  // SUPABASE / POSTGRES adapter
  if (DB_CLIENT === 'supabase' || DB_CLIENT === 'postgres' || DB_CLIENT === 'pg') {
    // lazy require pg to avoid build-time errors when not used
    if (!pg) pg = require('pg')
    const { Pool } = pg

    // prefer explicit DATABASE_URL/SUPABASE_DB_URL, otherwise use opts
    const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || opts?.connectionString
    const poolConfig = connectionString ? { connectionString } : opts || {}

    // ensure SSL for Supabase by default
    if ((process.env.DB_CLIENT || '').toLowerCase() === 'supabase') {
      poolConfig.ssl = poolConfig.ssl ?? { rejectUnauthorized: false }
    }

    // reuse pool across lambda/container warm instances
    const globalRef: any = global as any
    if (!globalRef.__pgPool) {
      globalRef.__pgPool = new Pool({
        // allow overriding max via env
        max: Number(process.env.PG_POOL_MAX) || 6,
        ...poolConfig,
      })
      // log unexpected errors
      globalRef.__pgPool.on && globalRef.__pgPool.on('error', (err: any) => {
        console.error('Unexpected Postgres pool error', err)
      })
    }

    const pool = globalRef.__pgPool

    const convertSql = (sql: string, params?: any[]) => {
      // convert positional '?' placeholders to $1, $2 ... for pg
      let idx = 0
      const converted = sql.replace(/\?/g, () => `$${++idx}`)

      // automatically add RETURNING id for INSERTs when not present
      const needsReturning = /^\s*insert\s+into\s+/i.test(sql) && !/\breturning\b/i.test(sql)
      const finalSql = needsReturning ? `${converted} RETURNING id` : converted
      return { sql: finalSql, params: params || [] }
    }

    return {
      query: async (sql: string, params?: any[]) => {
        const { sql: q, params: p } = convertSql(sql, params)
        const res = await pool.query(q, p)
        if (isSelect(sql)) {
          return [res.rows, undefined]
        }
        const insertId = res.rows && res.rows[0] ? (res.rows[0].id ?? res.rows[0].insertId) : undefined
        return [{ affectedRows: res.rowCount, insertId }, undefined]
      },
      execute: async (sql: string, params?: any[]) => {
        const { sql: q, params: p } = convertSql(sql, params)
        const res = await pool.query(q, p)
        if (isSelect(sql)) {
          return [res.rows, undefined]
        }
        const insertId = res.rows && res.rows[0] ? (res.rows[0].id ?? res.rows[0].insertId) : undefined
        return [{ affectedRows: res.rowCount, insertId }, undefined]
      },
      end: async () => {
        try {
          await pool.end()
        } catch (e) {
          // ignore
        }
      },
    }
  }

  if (!mysql2) mysql2 = require('mysql2/promise')
  return mysql2.createPool(opts)
}

export async function createConnection(opts?: any) {
  const DB_CLIENT = process.env.DB_CLIENT || 'mysql'

  if (DB_CLIENT === 'sqlite') {
    const db = initSqlite()
    return {
      query: async (sql: string, params?: any[]) => {
        const stmt = db.prepare(sql)
        if (isSelect(sql)) {
          const rows = stmt.all(params || [])
          return [rows, undefined]
        } else {
          const info = stmt.run(params || [])
          return [{ affectedRows: info.changes, insertId: info.lastInsertRowid }, undefined]
        }
      },
      execute: async (sql: string, params?: any[]) => {
        const stmt = db.prepare(sql)
        if (isSelect(sql)) {
          const rows = stmt.all(params || [])
          return [rows, undefined]
        } else {
          const info = stmt.run(params || [])
          return [{ affectedRows: info.changes, insertId: info.lastInsertRowid }, undefined]
        }
      },
      end: async () => {},
    }
  }

  const normalizedClient = (DB_CLIENT || 'mysql').toLowerCase()
  if (normalizedClient === 'supabase' || normalizedClient === 'postgres' || normalizedClient === 'pg') {
    if (!pg) pg = require('pg')
    const { Client } = pg
    const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || opts?.connectionString
    const clientConfig = connectionString ? { connectionString } : opts || {}
    // ensure SSL for Supabase
    if ((process.env.DB_CLIENT || '').toLowerCase() === 'supabase') {
      clientConfig.ssl = clientConfig.ssl ?? { rejectUnauthorized: false }
    }
    const client = new Client(clientConfig)
    await client.connect()

    const convertSql = (sql: string, params?: any[]) => {
      let idx = 0
      const converted = sql.replace(/\?/g, () => `$${++idx}`)
      const needsReturning = /^\s*insert\s+into\s+/i.test(sql) && !/\breturning\b/i.test(sql)
      const finalSql = needsReturning ? `${converted} RETURNING id` : converted
      return { sql: finalSql, params: params || [] }
    }

    return {
      query: async (sql: string, params?: any[]) => {
        const { sql: q, params: p } = convertSql(sql, params)
        const res = await client.query(q, p)
        if (isSelect(sql)) return [res.rows, undefined]
        const insertId = res.rows && res.rows[0] ? (res.rows[0].id ?? res.rows[0].insertId) : undefined
        return [{ affectedRows: res.rowCount, insertId }, undefined]
      },
      execute: async (sql: string, params?: any[]) => {
        const { sql: q, params: p } = convertSql(sql, params)
        const res = await client.query(q, p)
        if (isSelect(sql)) return [res.rows, undefined]
        const insertId = res.rows && res.rows[0] ? (res.rows[0].id ?? res.rows[0].insertId) : undefined
        return [{ affectedRows: res.rowCount, insertId }, undefined]
      },
      end: async () => {
        try {
          await client.end()
        } catch (e) {
          // ignore
        }
      },
    }
  }

  if (!mysql2) mysql2 = require('mysql2/promise')
  return mysql2.createConnection(opts)
}

export default { createPool, createConnection }
