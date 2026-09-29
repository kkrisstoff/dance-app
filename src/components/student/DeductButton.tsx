"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uk } from "@/copy/uk";

export function DeductButton({
  studentId,
  canDeduct,
  blockedReason,
}: {
  studentId: string;
  canDeduct: boolean;
  blockedReason: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/students/${studentId}/deduct`, { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(typeof body.error === "string" ? body.error : uk.deduct.empty);
      return;
    }

    router.refresh();
  }

  return (
    <div className="px-4 mt-6">
      <button
        type="button"
        disabled={!canDeduct || loading}
        onClick={handleClick}
        className={`w-full rounded-2xl py-5 text-lg font-semibold transition-colors ${
          canDeduct && !loading
            ? "bg-gray-900 text-white active:bg-gray-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "..." : uk.action.deduct}
      </button>
      {(error || (!canDeduct && blockedReason)) && (
        <p className="text-center text-sm text-gray-400 mt-2">{error || blockedReason}</p>
      )}
    </div>
  );
}
