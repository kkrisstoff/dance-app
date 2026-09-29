import { NextResponse } from "next/server";
import { uk } from "@/copy/uk";
import { recordPayment } from "@/server/admin";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await req.json();
  const sessions = typeof body.sessions === "number" ? body.sessions : 0;

  if (!sessions || sessions <= 0) {
    return NextResponse.json({ error: uk.admin.validationSessionsPositive }, { status: 400 });
  }

  try {
    const { id } = await params;
    return NextResponse.json(await recordPayment(id, sessions));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
