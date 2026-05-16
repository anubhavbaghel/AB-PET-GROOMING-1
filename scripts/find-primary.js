const { MongoClient } = require('mongodb');

const shards = [
  'ac-chk8ssb-shard-00-00.fgu8ozc.mongodb.net',
  'ac-chk8ssb-shard-00-01.fgu8ozc.mongodb.net',
  'ac-chk8ssb-shard-00-02.fgu8ozc.mongodb.net',
];

async function checkPrimary(host) {
  const uri = `mongodb://admin:QbbnCj2tHTyqbINr@${host}:27017/?authSource=admin&tls=true&tlsInsecure=true&directConnection=true&serverSelectionTimeoutMS=6000`;
  const client = new MongoClient(uri, { tlsInsecure: true, serverSelectionTimeoutMS: 6000 });
  try {
    await client.connect();
    const status = await client.db('admin').command({ isMaster: 1 });
    const role = status.ismaster ? 'PRIMARY ⭐' : (status.secondary ? 'SECONDARY' : 'UNKNOWN');
    console.log(`${host}: ${role}`);
    await client.close();
    return status.ismaster ? host : null;
  } catch (e) {
    console.log(`${host}: ERROR - ${e.message}`);
    return null;
  }
}

async function main() {
  let primary = null;
  for (const shard of shards) {
    const result = await checkPrimary(shard);
    if (result) primary = result;
  }
  if (primary) {
    console.log('\n✅ Primary is:', primary);
    console.log('Use this MONGO_URI:');
    console.log(`mongodb://admin:QbbnCj2tHTyqbINr@${primary}:27017/?authSource=admin&tls=true&tlsInsecure=true&directConnection=true&appName=ab-pet-grooming`);
  } else {
    console.log('\n❌ Could not find primary');
  }
}

main();
