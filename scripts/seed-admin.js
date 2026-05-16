const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
});

const uri = env.MONGO_URI;
const client = new MongoClient(uri, { tlsInsecure: true });

// Change these as desired
const USERNAME = 'admin';
const PASSWORD = 'admin123';

async function seed() {
  await client.connect();
  const db = client.db('ab_pet_grooming');

  // Check if admin already exists
  const existing = await db.collection('admin_users').findOne({ username: USERNAME });
  if (existing) {
    console.log('Admin user already exists:', USERNAME);
    await client.close();
    return;
  }

  const hashed = await bcrypt.hash(PASSWORD, 10);
  const res = await db.collection('admin_users').insertOne({
    username: USERNAME,
    password: hashed,
    created_at: new Date(),
  });

  console.log('✅ Admin user created!');
  console.log('   Username:', USERNAME);
  console.log('   Password:', PASSWORD);
  console.log('   _id:', res.insertedId.toString());
  await client.close();
}

seed().catch(e => { console.error('❌ FAIL:', e.message); client.close(); });
