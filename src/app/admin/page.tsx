import Link from "next/link";
import { getStudioName } from "@/config/studio";
import { uk } from "@/copy/uk";
import { computeStatus } from "@/lib/studentStatus";
import { statusTheme } from "@/components/student/statusTheme";
import { listAllStudents } from "@/server/admin";
import { getStudentById } from "@/server/students";

export default async function AdminPage() {
  const students = await listAllStudents();
  const studioName = getStudioName();

  // Load status for each student so the admin sees their state at a glance
  const studentsWithStatus = await Promise.all(
    students.map(async (s) => {
      const record = await getStudentById(s.id);
      const status = record ? computeStatus(record.package) : null;
      return { ...s, status };
    })
  );

  return (
    <main className="min-h-screen bg-gray-50 px-5 pt-10 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {studioName}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">{uk.admin.studentList}</h1>

      <Link
        href="/admin/students/new"
        className="mt-6 block w-full rounded-2xl bg-gray-900 py-4 text-center text-base font-semibold text-white active:bg-gray-700"
      >
        + {uk.admin.addStudent}
      </Link>

      {studentsWithStatus.length === 0 ? (
        <p className="mt-10 text-center text-sm text-gray-400">{uk.admin.noStudents}</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {studentsWithStatus.map((s) => {
            const theme = s.status ? statusTheme[s.status.code] : statusTheme.no_package;
            const desc = s.status ? uk.describeStatus(s.status) : null;
            return (
              <li key={s.id}>
                <Link
                  href={`/admin/students/${s.id}`}
                  className="block rounded-2xl bg-white px-5 py-4 shadow-sm active:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">{s.name}</p>
                    <span className="text-lg">{theme.icon}</span>
                  </div>
                  {desc && (
                    <p className="mt-1 text-sm text-gray-500">{desc.label}</p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
