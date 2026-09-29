"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uk } from "@/copy/uk";

export function PaymentForm({ studentId, readOnly }: { studentId: string; readOnly: boolean }) {
  const router = useRouter();
  const [sessions, setSessions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const count = parseInt(sessions, 10);
    if (!count || count <= 0) {
      setError(uk.admin.validationSessionsPositive);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/admin/students/${studentId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessions: count }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Error");
      setLoading(false);
      return;
    }

    const result = await res.json();
    setSuccess(uk.admin.packageUpdated(result.remaining, result.expiresAt));
    setSessions("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">{uk.admin.sessionsCount}</label>
      <input
        type="number"
        inputMode="numeric"
        min="1"
        value={sessions}
        onChange={(e) => setSessions(e.target.value)}
        placeholder={uk.admin.sessionsPlaceholder}
        disabled={readOnly}
        className="rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none disabled:bg-gray-100"
      />
      {readOnly && <p className="text-sm text-amber-800">{uk.readOnly.notice}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}
      <button
        type="submit"
        disabled={loading || readOnly}
        className="rounded-2xl bg-gray-900 py-4 text-base font-semibold text-white active:bg-gray-700 disabled:bg-gray-300"
      >
        {loading ? "..." : uk.admin.recordPayment}
      </button>
    </form>
  );
}
