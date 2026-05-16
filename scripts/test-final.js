const { MongoClient } = require('mongodb');
const fs = require('fs');

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim().replace(/^"|"$/g, '');
    env[match[1].trim()] = val;
  }
});

const uri = env.MONGO_URI;
const dbName = env.MONGO_DB || 'ab_pet_grooming';

async function run() {
  console.log("URI:", uri.replace(/:([^:@]{4})[^:@]*@/, ':$1***@'));
  console.log("DB:", dbName);

  const client = new MongoClient(uri, {
    tlsInsecure: true, // Mirrors what mongo.ts now does in dev
  });

  try {
    console.log("\nConnecting...");
    await client.connect();
    const result = await client.db('admin').command({ ping: 1 });
    console.log("✅ Connected! Ping:", result);
    const db = client.db(dbName);
    const collections = await db.collections();
    console.log("Collections:", collections.map(c => c.collectionName).join(', ') || "(empty)");
  } catch (error) {
    console.error("❌ Failed:", error.message);
  } finally {
    await client.close();
  }
}

run();
