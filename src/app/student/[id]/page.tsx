import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentStatusCard } from "@/components/student/StudentStatusCard";
import { statusTheme } from "@/components/student/statusTheme";
import { uk } from "@/copy/uk";
import { computeStatus } from "@/lib/studentStatus";
import { getStudentById, wasDeductedToday } from "@/server/students";

export default async function StudentPage({ params }: { params: { id: string } }) {
  const record = await getStudentById(params.id);
  if (!record) notFound();

  const status = computeStatus(record.package);
  const deductedToday = await wasDeductedToday(record.student.id);
  const theme = statusTheme[status.code];

  return (
    <main className={`min-h-screen ${theme.bg} flex flex-col`}>
      <StudentStatusCard
        name={record.student.name}
        status={status}
        package={record.package}
        studentId={record.student.id}
        deductedToday={deductedToday}
      />
      <div className="px-4 mt-4 pb-8">
        <Link
          href="/scan"
          className="block w-full rounded-2xl py-4 text-center text-base font-medium text-gray-500 bg-white border border-gray-200 active:bg-gray-50"
        >
          {uk.nav.scanNext}
        </Link>
      </div>
    </main>
  );
}
