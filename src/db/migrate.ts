/**
 * Run this once to create the database tables:
 *   npm run db:migrate
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

const DB_PATH = path.join(process.cwd(), "dance.db");
const MIGRATIONS_PATH = path.join(process.cwd(), "src/db/migrations");

const sqlite = new Database(DB_PATH);
const db = drizzle(sqlite);

console.log("Running migrations…");
migrate(db, { migrationsFolder: MIGRATIONS_PATH });
console.log("✓ Migrations complete");

sqlite.close();
