import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Students ────────────────────────────────────────────────────────────────

export const students = sqliteTable("students", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Packages ─────────────────────────────────────────────────────────────────

export const packages = sqliteTable("packages", {
  id: text("id").primaryKey(), // UUID
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  totalSessions: integer("total_sessions").notNull(),
  remainingSessions: integer("remaining_sessions").notNull(),
  startsAt: text("starts_at").notNull(), // ISO date YYYY-MM-DD
  expiresAt: text("expires_at").notNull(), // ISO date YYYY-MM-DD
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Attendances ──────────────────────────────────────────────────────────────

export const attendances = sqliteTable(
  "attendances",
  {
    id: text("id").primaryKey(), // UUID
    packageId: text("package_id")
      .notNull()
      .references(() => packages.id),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    date: text("date").notNull(), // ISO date YYYY-MM-DD
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => ({
    studentDate: uniqueIndex("attendances_student_date_unique").on(table.studentId, table.date),
  })
);

// ─── Types ────────────────────────────────────────────────────────────────────

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type Attendance = typeof attendances.$inferSelect;
export type NewAttendance = typeof attendances.$inferInsert;
