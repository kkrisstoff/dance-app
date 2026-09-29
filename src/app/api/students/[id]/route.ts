import { NextResponse } from "next/server";
import { uk } from "@/copy/uk";
import { computeStatus } from "@/lib/studentStatus";
import { getStudentById } from "@/server/students";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getStudentById(id);

  if (!record) {
    return NextResponse.json({ error: uk.api.studentNotFound }, { status: 404 });
  }

  return NextResponse.json({
    student: record.student,
    package: record.package,
    status: computeStatus(record.package),
  });
}
