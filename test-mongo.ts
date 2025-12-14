import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found");
    process.exit(1);
  }
  console.log("Testing connection to:", uri.replace(/:[^:]*@/, ":****@"));
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected successfully!");
    const db = client.db();
    console.log("Database name:", db.databaseName);
    await client.close();
  } catch (e) {
    console.error("Connection failed:", e);
  }
}

main();
