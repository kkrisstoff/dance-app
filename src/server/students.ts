import type { StudentRecord } from "@/lib/models";
import { getDataSource } from "./data-source";
import type { DeductErrorCode } from "./sqlite-deduct";

export type { DeductErrorCode } from "./sqlite-deduct";

export type { StudentRecord } from "@/lib/models";

/**
 * Student reads used by pages and API routes.
 * Demo and SQLite are loaded separately so the hosted UI does not open a database file.
 */
export async function getStudentById(id: string): Promise<StudentRecord | null> {
  if (getDataSource() === "demo") {
    const { getDemoStudentById } = await import("./demo-students");
    return getDemoStudentById(id);
  }

  const { getSqliteStudentById } = await import("./sqlite-students");
  return getSqliteStudentById(id);
}

export async function wasDeductedToday(id: string): Promise<boolean> {
  if (getDataSource() === "demo") return false;
  const { wasSqliteDeductedToday } = await import("./sqlite-deduct");
  return wasSqliteDeductedToday(id);
}

export async function deductSession(id: string): Promise<{ remaining: number }> {
  if (getDataSource() === "demo") {
    const { DeductError } = await import("./sqlite-deduct");
    throw new DeductError("not_found");
  }
  const { deductSqliteSession } = await import("./sqlite-deduct");
  return deductSqliteSession(id);
}
