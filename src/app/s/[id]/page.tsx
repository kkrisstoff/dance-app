import { notFound } from "next/navigation";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { statusTheme } from "@/components/student/statusTheme";
import { getStudioName } from "@/config/studio";
import { uk } from "@/copy/uk";
import { computeStatus } from "@/lib/studentStatus";
import { getStudentById } from "@/server/students";

export default async function StudentQRPage({ params }: { params: { id: string } }) {
  const record = await getStudentById(params.id);
  if (!record) notFound();

  const status = computeStatus(record.package);
  const theme = statusTheme[status.code];
  const { label, sublabel } = uk.describeStatus(status);
  const studioName = getStudioName();
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const teacherUrl = `${proto}://${host}/student/${record.student.id}`;
  const qrDataUrl = await QRCode.toDataURL(teacherUrl, {
    width: 300,
    margin: 2,
    color: { dark: "#111827", light: "#ffffff" },
  });

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className={`h-2 w-full ${theme.strip}`} />
      <div className="px-6 pt-8 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{studioName}</p>
        <h1 className="text-3xl font-bold text-gray-900">{record.student.name}</h1>
      </div>
      <div className="mx-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-5 flex items-start gap-4">
        <span className="text-2xl mt-0.5">{theme.icon}</span>
        <div>
          <p className="text-xl font-semibold text-gray-900 leading-snug">{label}</p>
          <p className="text-sm text-gray-500 mt-0.5">{sublabel}</p>
        </div>
      </div>
      <div className="flex flex-col items-center mt-8 px-6">
        <div className="rounded-2xl border-2 border-gray-100 p-4 bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt={uk.qr.alt} width={260} height={260} className="block" />
        </div>
        <p className="mt-4 text-sm text-gray-400 text-center">{uk.qr.instruction}</p>
      </div>
      <div className="mt-auto pb-8 pt-6 text-center">
        <p className="text-xs text-gray-300">{studioName}</p>
      </div>
    </main>
  );
}
