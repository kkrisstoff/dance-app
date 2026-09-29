/** Shared shapes. UI and data access both use these, neither imports the database driver. */

export type StudentSummary = {
  id: string;
  name: string;
  notes: string | null;
};

export type PackageSummary = {
  totalSessions: number;
  remainingSessions: number;
  startsAt: string;
  expiresAt: string;
};

export type StudentRecord = {
  student: StudentSummary;
  package: PackageSummary | null;
};

export type StudentListItem = {
  id: string;
  name: string;
};
