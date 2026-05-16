const { MongoClient } = require('mongodb');

// Port is reachable (TCP test passed), so try connecting with TLS options
const uri = "mongodb://admin:QbbnCj2tHTyqbINr@ac-chk8ssb-shard-00-00.fgu8ozc.mongodb.net:27017,ac-chk8ssb-shard-00-01.fgu8ozc.mongodb.net:27017,ac-chk8ssb-shard-00-02.fgu8ozc.mongodb.net:27017/?ssl=true&replicaSet=atlas-chk8ssb-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ab-pet-grooming";

async function run() {
  console.log("Connecting... (with serverSelectionTimeoutMS=10000)");
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    tls: true,
  });
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");
    const admin = client.db('admin');
    const result = await admin.command({ ping: 1 });
    console.log("Ping result:", result);
    const db = client.db('ab_pet_grooming');
    const collections = await db.collections();
    console.log("Collections:", collections.map(c => c.collectionName).join(', ') || "None (empty db)");
  } catch (error) {
    console.error("Connection failed:", error.message);
    if (error.reason) {
      console.error("Server description:", JSON.stringify(error.reason, null, 2));
    }
  } finally {
    await client.close();
  }
}

run();
