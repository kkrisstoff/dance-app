import type { StudentListItem, StudentRecord } from "@/lib/models";

function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function demoStudents(): StudentRecord[] {
  return [
    {
      student: { id: "11111111-1111-4111-8111-111111111111", name: "Єгор", notes: null },
      package: {
        totalSessions: 8,
        remainingSessions: 6,
        startsAt: isoDaysFromNow(-10),
        expiresAt: isoDaysFromNow(20),
      },
    },
    {
      student: { id: "22222222-2222-4222-8222-222222222222", name: "Катерина", notes: null },
      package: {
        totalSessions: 8,
        remainingSessions: 1,
        startsAt: isoDaysFromNow(-25),
        expiresAt: isoDaysFromNow(5),
      },
    },
    {
      student: { id: "33333333-3333-4333-8333-333333333333", name: "Марія", notes: null },
      package: {
        totalSessions: 8,
        remainingSessions: 0,
        startsAt: isoDaysFromNow(-20),
        expiresAt: isoDaysFromNow(10),
      },
    },
    {
      student: { id: "44444444-4444-4444-8444-444444444444", name: "Олексій", notes: null },
      package: {
        totalSessions: 8,
        remainingSessions: 3,
        startsAt: isoDaysFromNow(-40),
        expiresAt: isoDaysFromNow(-5),
      },
    },
    {
      student: { id: "55555555-5555-4555-8555-555555555555", name: "Аліна", notes: null },
      package: null,
    },
  ];
}

export function getDemoStudentById(id: string): StudentRecord | null {
  return demoStudents().find((record) => record.student.id === id) ?? null;
}

export function listDemoStudentItems(): StudentListItem[] {
  return demoStudents().map(({ student }) => ({
    id: student.id,
    name: student.name,
  }));
}
