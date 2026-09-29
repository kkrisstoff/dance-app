import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { packages, students } from "@/db/schema";
import type { StudentListItem } from "@/lib/models";
import type { CreateStudentResult, RecordPaymentResult } from "./admin";

export function listSqliteStudents(): StudentListItem[] {
  return db
    .select({ id: students.id, name: students.name })
    .from(students)
    .all();
}

export function createSqliteStudent(name: string): CreateStudentResult {
  const id = crypto.randomUUID();

  db.insert(students)
    .values({ id, name })
    .run();

  return { student: { id, name } };
}

/**
 * Record a payment following the rules in docs/product.md:
 *
 * - Admin enters only the number of sessions paid.
 * - End date = one calendar month from today.
 * - Active non-expired package: add sessions, reset end date.
 * - No package or expired package: new package, old sessions not carried over.
 */
export function recordSqlitePayment(
  id: string,
  sessions: number
): RecordPaymentResult {
  const student = db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .get();

  if (!student) throw new Error("Student not found");

  const today = new Date().toISOString().slice(0, 10);
  const expiresAt = oneMonthFromToday();

  const activePackage = db
    .select()
    .from(packages)
    .where(and(eq(packages.studentId, student.id), eq(packages.isActive, true)))
    .get();

  if (activePackage && activePackage.expiresAt >= today) {
    // Active and not expired: add sessions, refresh end date
    const newRemaining = activePackage.remainingSessions + sessions;
    const newTotal = activePackage.totalSessions + sessions;

    db.update(packages)
      .set({
        totalSessions: newTotal,
        remainingSessions: newRemaining,
        expiresAt,
      })
      .where(eq(packages.id, activePackage.id))
      .run();

    return { remaining: newRemaining, expiresAt };
  }

  // No package, or expired: archive old and create new
  if (activePackage) {
    db.update(packages)
      .set({ isActive: false })
      .where(eq(packages.id, activePackage.id))
      .run();
  }

  const packageId = crypto.randomUUID();
  db.insert(packages)
    .values({
      id: packageId,
      studentId: student.id,
      totalSessions: sessions,
      remainingSessions: sessions,
      startsAt: today,
      expiresAt,
      isActive: true,
    })
    .run();

  return { remaining: sessions, expiresAt };
}

function oneMonthFromToday(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}
