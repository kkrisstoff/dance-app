"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uk } from "@/copy/uk";

export default function NewStudentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(uk.admin.validationNameRequired);
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Error");
      setLoading(false);
      return;
    }

    const { student } = await res.json();
    router.push(`/admin/students/${student.id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 pt-10 pb-10">
      <h1 className="text-3xl font-bold text-gray-900">{uk.admin.addStudent}</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-700">
          {uk.admin.studentName}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={uk.admin.namePlaceholder}
          autoFocus
          className="rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-2xl bg-gray-900 py-4 text-base font-semibold text-white active:bg-gray-700 disabled:bg-gray-300"
        >
          {loading ? "..." : uk.admin.save}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-2xl border border-gray-200 py-4 text-base font-medium text-gray-500"
        >
          {uk.admin.cancel}
        </button>
      </form>
    </main>
  );
}
