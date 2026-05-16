const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:QbbnCj2tHTyqbINr@ab-pet-grooming.fgu8ozc.mongodb.net/?appName=ab-pet-grooming";

async function run() {
  console.log("Connecting to:", uri.replace(/:([^:@]{4})[^:@]*@/, ':$1***@'));
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");
    const db = client.db('ab_pet_grooming');
    const collections = await db.collections();
    console.log("Collections:", collections.map(c => c.collectionName));
  } catch (error) {
    console.error("Connection failed!");
    console.error(error.message || error);
  } finally {
    await client.close();
  }
}

run();
