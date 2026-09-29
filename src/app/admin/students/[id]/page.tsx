import Link from "next/link";
import { notFound } from "next/navigation";
import { uk } from "@/copy/uk";
import { statusTheme } from "@/components/student/statusTheme";
import { computeStatus } from "@/lib/studentStatus";
import { getStudentById } from "@/server/students";
import { PaymentForm } from "./PaymentForm";
import { CopyLinkButton } from "./CopyLinkButton";

export default async function AdminStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getStudentById(id);
  if (!record) notFound();

  const status = computeStatus(record.package);
  const theme = statusTheme[status.code];
  const { label, sublabel } = uk.describeStatus(status);

  return (
    <main className="min-h-screen bg-gray-50 px-5 pt-10 pb-10">
      <Link href="/admin" className="text-sm font-medium text-gray-500">
        {uk.admin.backToList}
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{record.student.name}</h1>
      <div className={`mt-4 rounded-2xl px-5 py-4 ${theme.bg} flex items-center gap-3`}>
        <span className="text-2xl">{theme.icon}</span>
        <div>
          <p className="text-lg font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{sublabel}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">{uk.admin.payment}</h2>
        <PaymentForm studentId={record.student.id} />
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">{uk.admin.qrLink}</h2>
        <CopyLinkButton studentId={record.student.id} />
      </div>
    </main>
  );
}
