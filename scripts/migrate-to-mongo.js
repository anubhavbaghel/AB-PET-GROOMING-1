// Simple migration script: exports data from SQLite (dev.sqlite) into MongoDB collections
// Run: node scripts/migrate-to-mongo.js
const path = require('path')
const fs = require('fs')

async function run() {
  const projectRoot = path.resolve(__dirname, '..')
  const dbFile = path.join(projectRoot, 'database', 'dev.sqlite')
  if (!fs.existsSync(dbFile)) {
    console.error('No dev.sqlite found at', dbFile)
    process.exit(1)
  }

  const Database = require('better-sqlite3')
  const db = new Database(dbFile, { readonly: true })

  const { MongoClient } = require('mongodb')
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL
  const MONGO_DB = process.env.MONGO_DB || process.env.DB_NAME || 'ab_pet_grooming'
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI env var')
    process.exit(1)
  }
  const client = new MongoClient(MONGO_URI)
  await client.connect()
  const mongo = client.db(MONGO_DB)

  const tables = ['appointments','contact_messages','admin_users','reviews','service_cards','service_card_items','customers','pets','boarding']
  for (const t of tables) {
    try {
      const rows = db.prepare(`SELECT * FROM ${t}`).all()
      if (rows && rows.length) {
        console.log(`Importing ${rows.length} rows into ${t}`)
        await mongo.collection(t).deleteMany({})
        await mongo.collection(t).insertMany(rows)
      } else {
        console.log(`No rows for ${t}`)
      }
    } catch (e) {
      console.warn(`Skipping ${t}:`, e.message)
    }
  }

  await client.close()
  console.log('Migration complete')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
