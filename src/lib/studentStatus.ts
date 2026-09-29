import type { PackageSummary } from "@/lib/models";

/**
 * Business status only — no user-facing text here.
 * Copy for each code lives in src/copy/uk.ts (or a future en.ts).
 */
export type StatusCode =
  | "valid" // 3+ sessions, not expired
  | "low" // 1-2 sessions, not expired
  | "empty" // 0 sessions (package may still be active date-wise)
  | "expired" // sessions remain but the date has passed
  | "no_package"; // student has no active package

export interface StudentStatus {
  code: StatusCode;
  /** Sessions left on the active package. null when there is no package. */
  remaining: number | null;
  /** ISO date (YYYY-MM-DD) the active package expires. null when there is no package. */
  expiresAt: string | null;
  canDeduct: boolean;
}

export function computeStatus(pkg: PackageSummary | null): StudentStatus {
  if (!pkg) {
    return { code: "no_package", remaining: null, expiresAt: null, canDeduct: false };
  }

  const today = new Date().toISOString().slice(0, 10);
  const isExpired = pkg.expiresAt < today;
  const remaining = pkg.remainingSessions;

  if (isExpired) {
    return { code: "expired", remaining, expiresAt: pkg.expiresAt, canDeduct: false };
  }

  if (remaining === 0) {
    return { code: "empty", remaining, expiresAt: pkg.expiresAt, canDeduct: false };
  }

  if (remaining <= 2) {
    return { code: "low", remaining, expiresAt: pkg.expiresAt, canDeduct: true };
  }

  return { code: "valid", remaining, expiresAt: pkg.expiresAt, canDeduct: true };
}
