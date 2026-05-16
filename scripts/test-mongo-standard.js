const { MongoClient } = require('mongodb');

// Try with the standard connection string to bypass SRV lookup issues
const uri = "mongodb://admin:QbbnCj2tHTyqbINr@ac-chk8ssb-shard-00-00.fgu8ozc.mongodb.net:27017,ac-chk8ssb-shard-00-01.fgu8ozc.mongodb.net:27017,ac-chk8ssb-shard-00-02.fgu8ozc.mongodb.net:27017/?ssl=true&replicaSet=atlas-chk8ssb-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ab-pet-grooming";

async function run() {
  console.log("Connecting with standard URI bypassing SRV...");
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
