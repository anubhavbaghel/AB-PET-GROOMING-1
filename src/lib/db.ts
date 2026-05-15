import fs from 'fs'
import path from 'path'

const DB_CLIENT = process.env.DB_CLIENT || 'mysql'
let sqliteDb: any = null
let mysql2: any = null

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

  if (!mysql2) mysql2 = require('mysql2/promise')
  return mysql2.createPool(opts)
}

export async function createConnection(opts?: any) {
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

  if (!mysql2) mysql2 = require('mysql2/promise')
  return mysql2.createConnection(opts)
}

export default { createPool, createConnection }
