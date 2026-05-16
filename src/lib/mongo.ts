import { MongoClient, Db, Collection, Document } from 'mongodb'

declare global {
  // reuse across lambda/container warm instances
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined
}

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || process.env.MONGODB_URI || ''
const MONGO_DB = process.env.MONGO_DB || process.env.DB_NAME || 'ab_pet_grooming'

async function getClient(): Promise<MongoClient> {
  if (!MONGO_URI) throw new Error('Missing MONGO_URI environment variable')
  const globalRef: any = global as any
  if (!globalRef.__mongoClient) {
    globalRef.__mongoClient = new MongoClient(MONGO_URI, {
      // tlsInsecure bypasses local TLS cert chain validation issues (dev only)
      tlsInsecure: process.env.NODE_ENV !== 'production',
    })
    await globalRef.__mongoClient.connect()
  }
  return globalRef.__mongoClient as MongoClient
}

export async function getDb(): Promise<Db> {
  const client = await getClient()
  return client.db(MONGO_DB)
}

export async function getCollection<T extends Document = any>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export async function insertOne<T extends Document = any>(name: string, doc: any) {
  const col = await getCollection<T>(name);
  return col.insertOne(doc);
}

export async function insertMany<T extends Document = any>(name: string, docs: any[]) {
  const col = await getCollection<T>(name);
  return col.insertMany(docs);
}

export async function find<T extends Document = any>(name: string, query: any, options?: any) {
  const col = await getCollection<T>(name)
  return col.find(query, options).toArray()
}

export async function countDocuments(name: string, query: any) {
  const col = await getCollection(name)
  return col.countDocuments(query)
}

export default { getClient, getDb, getCollection, insertOne, insertMany, find, countDocuments }
