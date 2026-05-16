const { MongoClient } = require('mongodb');
const fs = require('fs');

// Simple dot-env parser to avoid needing the dotenv package
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    // Remove surrounding quotes if present
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val;
  }
});

const uri = env.MONGO_URI;

async function run() {
  if (!uri) {
    console.error("MONGO_URI not found in .env.local");
    return;
  }
  
  console.log("Testing connection string from .env.local:");
  console.log(uri.replace(/:([^:@]{4})[^:@]*@/, ':$1***@'));
  
  const client = new MongoClient(uri);
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully to MongoDB!");
    const db = client.db(env.MONGO_DB || 'ab_pet_grooming');
    const collections = await db.collections();
    console.log("Available collections:", collections.map(c => c.collectionName).join(', ') || "None");
  } catch (error) {
    console.error("\nConnection failed!");
    console.error(error.message || error);
  } finally {
    await client.close();
  }
}

run();
