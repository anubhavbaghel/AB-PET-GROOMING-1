const { MongoClient } = require('mongodb');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
});

const uri = env.MONGO_URI;
const client = new MongoClient(uri, { tlsInsecure: true });

async function test() {
  await client.connect();
  console.log('✅ Connected to MongoDB!');

  const db = client.db('ab_pet_grooming');

  // Test WRITE
  const col = db.collection('_test_write');
  const res = await col.insertOne({ test: true, ts: new Date() });
  console.log('✅ Write OK - inserted id:', res.insertedId.toString());

  // Test READ
  const doc = await col.findOne({ _id: res.insertedId });
  console.log('✅ Read OK - doc found:', !!doc);

  // Clean up
  await col.deleteOne({ _id: res.insertedId });
  console.log('✅ Delete OK');

  // Check admin_users collection
  const admins = await db.collection('admin_users').find({}).toArray();
  console.log('--- Admin Users ---');
  console.log('Count:', admins.length);
  admins.forEach(a => console.log('  username:', a.username, '| _id:', String(a._id)));

  // Check all collections
  const cols = await db.listCollections().toArray();
  console.log('--- All Collections ---');
  cols.forEach(c => console.log(' -', c.name));

  await client.close();
}

test().catch(e => {
  console.error('❌ FAIL:', e.message);
  client.close();
});
