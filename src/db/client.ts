import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const DB_PATH = path.join(process.cwd(), "dance.db");

// Re-use the connection across hot-reloads in development
const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> };

export const db =
  globalForDb.db ??
  drizzle(new Database(DB_PATH), { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
