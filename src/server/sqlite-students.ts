import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { packages, students } from "@/db/schema";
import type { StudentRecord } from "@/lib/models";

export function getSqliteStudentById(id: string): StudentRecord | null {
  const student = db.select().from(students).where(eq(students.id, id)).get();
  if (!student) return null;

  const activePackage =
    db
      .select()
      .from(packages)
      .where(and(eq(packages.studentId, student.id), eq(packages.isActive, true)))
      .get() ?? null;

  return {
    student: {
      id: student.id,
      name: student.name,
      notes: student.notes,
    },
    package: activePackage
      ? {
          totalSessions: activePackage.totalSessions,
          remainingSessions: activePackage.remainingSessions,
          startsAt: activePackage.startsAt,
          expiresAt: activePackage.expiresAt,
        }
      : null,
  };
}
