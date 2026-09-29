import { NextResponse } from "next/server";
import { uk } from "@/copy/uk";
import { listAllStudents, createStudent } from "@/server/admin";

export async function GET() {
  const students = await listAllStudents();
  return NextResponse.json({ students });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: uk.admin.validationNameRequired },
      { status: 400 }
    );
  }

  const result = await createStudent(name);
  return NextResponse.json(result, { status: 201 });
}
