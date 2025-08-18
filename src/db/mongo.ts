import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017';
const dbName = process.env.MONGODB_DB || 'shootingmatch';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (!client || !db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
  return { client, db };
}
