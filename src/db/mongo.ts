import mongoose, { Connection } from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/shootingmatch';

let connection: Connection | null = null;

export async function connectToDatabase() {
  if (!connection) {
    await mongoose.connect(uri, {
      // Add options here if needed, e.g. useNewUrlParser, useUnifiedTopology
    });
    connection = mongoose.connection;
  }
  return mongoose;
}
