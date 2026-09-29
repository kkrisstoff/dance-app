import type { StatusCode } from "@/lib/studentStatus";

// Visual treatment per status. Text for each status lives in src/copy/uk.ts.
export const statusTheme: Record<
  StatusCode,
  { bg: string; badge: string; icon: string; strip: string }
> = {
  valid: { bg: "bg-green-50", badge: "bg-green-100 text-green-800", icon: "✅", strip: "bg-green-500" },
  low: { bg: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-800", icon: "⚠️", strip: "bg-yellow-400" },
  empty: { bg: "bg-red-50", badge: "bg-red-100 text-red-800", icon: "❌", strip: "bg-red-500" },
  expired: { bg: "bg-red-50", badge: "bg-red-100 text-red-800", icon: "❌", strip: "bg-red-500" },
  no_package: { bg: "bg-gray-50", badge: "bg-gray-100 text-gray-700", icon: "❓", strip: "bg-gray-400" },
};
