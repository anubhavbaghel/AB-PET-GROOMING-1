let mysql2: any = null
let pg: any = null

function isSelect(sql: string) {
  return /^\s*(select|pragma)/i.test(sql)
}

export function createPool(opts?: any) {
  const DB_CLIENT = (process.env.DB_CLIENT || 'mysql').toLowerCase()

  if (DB_CLIENT === 'sqlite') {
    throw new Error('SQLite support has been removed. Set DB_CLIENT to mysql or postgres.')
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
    throw new Error('SQLite support has been removed. Set DB_CLIENT to mysql or postgres.')
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
