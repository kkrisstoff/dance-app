"use client";

import { useState } from "react";
import { uk } from "@/copy/uk";

export function CopyLinkButton({ studentId }: { studentId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}/s/${studentId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-3">
      <p className="rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-700 break-all">
        {typeof window !== "undefined" ? `${window.location.origin}/s/${studentId}` : `/s/${studentId}`}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-2 w-full rounded-2xl border border-gray-200 py-3 text-base font-medium text-gray-700 active:bg-gray-50"
      >
        {copied ? uk.admin.linkCopied : uk.admin.copyLink}
      </button>
    </div>
  );
}
