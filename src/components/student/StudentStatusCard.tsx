import type { StudentStatus } from "@/lib/studentStatus";
import type { PackageSummary } from "@/lib/models";
import { uk } from "@/copy/uk";
import { DeductButton } from "./DeductButton";
import { statusTheme } from "./statusTheme";

export function StudentStatusCard({
  name,
  status,
  package: activePackage,
  studentId,
  deductedToday,
  readOnly,
}: {
  name: string;
  status: StudentStatus;
  package: PackageSummary | null;
  studentId: string;
  deductedToday: boolean;
  readOnly: boolean;
}) {
  const theme = statusTheme[status.code];
  const { label, sublabel } = uk.describeStatus(status);

  return (
    <>
      <div className="px-5 pt-10 pb-6">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">
          {uk.student.labelAboveName}
        </p>
        <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
      </div>

      <div className="mx-4 rounded-2xl bg-white shadow-sm px-6 py-8 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{theme.icon}</span>
          <p className="text-2xl font-semibold text-gray-900 leading-tight">{label}</p>
        </div>

        <p className="text-base text-gray-500">{sublabel}</p>

        <span className={`self-start mt-1 px-3 py-1 rounded-full text-sm font-medium ${theme.badge}`}>
          {uk.statusBadge[status.code]}
        </span>

        {activePackage && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-400">
            <span>{uk.student.total(activePackage.totalSessions)}</span>
            <span>{uk.student.deducted(activePackage.totalSessions - activePackage.remainingSessions)}</span>
          </div>
        )}
      </div>

      <DeductButton
        studentId={studentId}
        canDeduct={status.canDeduct && !deductedToday && !readOnly}
        blockedReason={
          readOnly
            ? uk.readOnly.blocked
            : deductedToday
              ? uk.deduct.alreadyToday
              : uk.deductBlockedReason[status.code]
        }
      />
    </>
  );
}
