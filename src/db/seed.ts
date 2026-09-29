/**
 * Populate the database with test data.
 *   npm run db:seed
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { students, packages, attendances } from "./schema";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "dance.db");
const sqlite = new Database(DB_PATH);
const db = drizzle(sqlite);

function uuid() {
  return crypto.randomUUID();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  return daysFromNow(-n);
}

console.log("Seeding database…");

// Clear existing data (order matters because of FK)
db.delete(attendances).run();
db.delete(packages).run();
db.delete(students).run();

// ── Student 1: Єгор — healthy package ───────────────────────────────────────
const egorId = uuid();
db.insert(students).values({
  id: egorId,
  name: "Єгор",
  notes: "Bachata group Mon/Thu",
}).run();

db.insert(packages).values({
  id: uuid(),
  studentId: egorId,
  totalSessions: 8,
  remainingSessions: 6,
  startsAt: daysAgo(10),
  expiresAt: daysFromNow(20),
  isActive: true,
}).run();

// ── Student 2: Катерина — low balance + nearly expired ───────────────────────
const katenrynaId = uuid();
db.insert(students).values({
  id: katenrynaId,
  name: "Катерина",
}).run();

db.insert(packages).values({
  id: uuid(),
  studentId: katenrynaId,
  totalSessions: 8,
  remainingSessions: 1,
  startsAt: daysAgo(25),
  expiresAt: daysFromNow(5),
  isActive: true,
}).run();

// ── Student 3: Марія — zero sessions ─────────────────────────────────────────
const mariyaId = uuid();
db.insert(students).values({
  id: mariyaId,
  name: "Марія",
}).run();

db.insert(packages).values({
  id: uuid(),
  studentId: mariyaId,
  totalSessions: 8,
  remainingSessions: 0,
  startsAt: daysAgo(20),
  expiresAt: daysFromNow(10),
  isActive: true,
}).run();

// ── Student 4: Олексій — expired package ─────────────────────────────────────
const oleksiyId = uuid();
db.insert(students).values({
  id: oleksiyId,
  name: "Олексій",
}).run();

db.insert(packages).values({
  id: uuid(),
  studentId: oleksiyId,
  totalSessions: 8,
  remainingSessions: 3,
  startsAt: daysAgo(40),
  expiresAt: daysAgo(5), // expired 5 days ago
  isActive: true,
}).run();

// ── Student 5: Аліна — no package yet ────────────────────────────────────────
db.insert(students).values({
  id: uuid(),
  name: "Аліна",
}).run();

console.log("✓ Seed complete");
console.log("");
console.log("Test students seeded with generated UUIDs.");
console.log("");

sqlite.close();
