import mongoose from 'mongoose';

declare global {
	// eslint-disable-next-line no-var
	var mongoose: { conn: any; promise: any } | undefined;
}

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/password_manager';

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

// Ensure cached is properly typed and not undefined
const typedCached = cached as { conn: any; promise: any };

async function connectDB() {
	if (typedCached.conn) {
		return typedCached.conn;
	}

	if (!typedCached.promise) {
		const opts = {
			bufferCommands: false,
		};

		typedCached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
			return mongoose;
		});
	}

	try {
		typedCached.conn = await typedCached.promise;
	} catch (e) {
		typedCached.promise = null;
		throw e;
	}

	return typedCached.conn;
}

export default connectDB;
