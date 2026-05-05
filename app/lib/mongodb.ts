import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalCache._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalCache._mongooseCache) {
  globalCache._mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const mongoUri = MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
