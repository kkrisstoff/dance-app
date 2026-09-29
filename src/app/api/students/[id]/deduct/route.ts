import { NextResponse } from "next/server";
import { uk } from "@/copy/uk";
import { deductSession, type DeductErrorCode } from "@/server/students";
import { DeductError } from "@/server/deduct-errors";
import { ReadOnlyError } from "@/server/data-source";

const messages: Record<DeductErrorCode, { status: number; error: string }> = {
  not_found: { status: 404, error: uk.api.studentNotFound },
  no_package: { status: 400, error: uk.deduct.noPackage },
  expired: { status: 400, error: uk.deduct.expired },
  empty: { status: 400, error: uk.deduct.empty },
  already_today: { status: 409, error: uk.deduct.alreadyToday },
};

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await deductSession(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ReadOnlyError) {
      return NextResponse.json({ error: uk.readOnly.blocked }, { status: 403 });
    }
    if (error instanceof DeductError) {
      const mapped = messages[error.code];
      return NextResponse.json({ error: mapped.error }, { status: mapped.status });
    }
    throw error;
  }
}
