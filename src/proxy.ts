import { NextResponse, type NextRequest } from "next/server";

type Role = "admin" | "teacher";

const passwordEnv: Record<Role, string> = {
  admin: "ADMIN_PASSWORD",
  teacher: "TEACHER_PASSWORD",
};

function roleForPath(pathname: string): Role {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin") ? "admin" : "teacher";
}

function passwordFromHeader(header: string | null): string | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = new TextDecoder().decode(
      Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0))
    );
    const separator = decoded.indexOf(":");
    return separator === -1 ? null : decoded.slice(separator + 1);
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(request: NextRequest) {
  const role = roleForPath(request.nextUrl.pathname);
  const expected = process.env[passwordEnv[role]];

  if (!expected) {
    return new NextResponse(`${passwordEnv[role]} is not set`, { status: 503 });
  }

  const given = passwordFromHeader(request.headers.get("authorization"));
  if (given !== null && safeEqual(given, expected)) return NextResponse.next();

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${role}", charset="UTF-8"` },
  });
}

export const config = {
  matcher: ["/scan", "/student/:path*", "/api/students/:path*", "/admin/:path*", "/api/admin/:path*"],
};
