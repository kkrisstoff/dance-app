import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { attendances, packages, students } from "@/db/schema";

import { DeductError } from "./deduct-errors";

export { DeductError, type DeductErrorCode } from "./deduct-errors";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function wasSqliteDeductedToday(studentId: string): boolean {
  const row = db
    .select({ id: attendances.id })
    .from(attendances)
    .where(and(eq(attendances.studentId, studentId), eq(attendances.date, today())))
    .get();
  return Boolean(row);
}

export function deductSqliteSession(studentId: string): { remaining: number } {
  const student = db.select().from(students).where(eq(students.id, studentId)).get();
  if (!student) throw new DeductError("not_found");

  const activePackage = db
    .select()
    .from(packages)
    .where(and(eq(packages.studentId, student.id), eq(packages.isActive, true)))
    .get();

  if (!activePackage) throw new DeductError("no_package");

  const date = today();
  if (activePackage.expiresAt < date) throw new DeductError("expired");
  if (activePackage.remainingSessions <= 0) throw new DeductError("empty");
  if (wasSqliteDeductedToday(student.id)) throw new DeductError("already_today");

  const remaining = activePackage.remainingSessions - 1;

  try {
    db.transaction((tx) => {
      tx.insert(attendances)
        .values({
          id: crypto.randomUUID(),
          packageId: activePackage.id,
          studentId: student.id,
          date,
        })
        .run();

      tx.update(packages)
        .set({ remainingSessions: remaining })
        .where(eq(packages.id, activePackage.id))
        .run();
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE")) throw new DeductError("already_today");
    throw error;
  }

  return { remaining };
}
