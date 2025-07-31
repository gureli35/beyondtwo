import mongoose from 'mongoose';
import { getSecureEnvVar } from '../utils/encryption';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI = (() => {
  try {
    return getSecureEnvVar('MONGODB_URI_ENCRYPTED', true);
  } catch (error) {
    console.warn('Encrypted MONGODB_URI not found, using fallback');
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/beyond2c';
  }
})();

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
