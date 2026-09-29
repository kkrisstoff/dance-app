import type { StudentListItem, StudentRecord } from "@/lib/models";
import { getDataSource, ReadOnlyError } from "./data-source";

export type { StudentListItem, StudentRecord } from "@/lib/models";

export type CreateStudentResult = { student: StudentListItem };
export type RecordPaymentResult = {
  remaining: number;
  expiresAt: string;
};

export async function listAllStudents(): Promise<StudentListItem[]> {
  if (getDataSource() === "demo") {
    const { listDemoStudents } = await import("./demo-admin");
    return listDemoStudents();
  }
  const { listSqliteStudents } = await import("./sqlite-admin");
  return listSqliteStudents();
}

export async function createStudent(name: string): Promise<CreateStudentResult> {
  if (getDataSource() === "demo") {
    throw new ReadOnlyError();
  }
  const { createSqliteStudent } = await import("./sqlite-admin");
  return createSqliteStudent(name);
}

export async function recordPayment(
  id: string,
  sessions: number
): Promise<RecordPaymentResult> {
  if (getDataSource() === "demo") {
    throw new ReadOnlyError();
  }
  const { recordSqlitePayment } = await import("./sqlite-admin");
  return recordSqlitePayment(id, sessions);
}
