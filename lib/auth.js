import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Development-এ ফাইল বদলালেও একটাই database connection ব্যবহার হবে
const globalForMongo = globalThis;
const client =
  globalForMongo._mongoClient || new MongoClient(process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // README অনুযায়ী কমপক্ষে ৬ অক্ষর
  },
});