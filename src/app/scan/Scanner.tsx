"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { uk } from "@/copy/uk";

const studentPath = /^\/(?:student|s)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

function studentIdFromQr(text: string): string | null {
  try {
    const url = new URL(text);
    return url.pathname.match(studentPath)?.[1] ?? null;
  } catch {
    return text.match(studentPath)?.[1] ?? null;
  }
}

export function Scanner() {
  const router = useRouter();
  const [error, setError] = useState("");
  const handled = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    let stopped = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => {
          if (handled.current) return;
          const studentId = studentIdFromQr(text);
          if (!studentId) {
            setError(uk.scan.unrecognized);
            return;
          }
          handled.current = true;
          scanner
            .stop()
            .catch(() => undefined)
            .finally(() => router.push(`/student/${studentId}`));
        },
        () => undefined
      )
      .catch(() => {
        if (!stopped) setError(uk.scan.cameraError);
      });

    return () => {
      stopped = true;
      scanner.stop().catch(() => undefined);
    };
  }, [router]);

  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <div id="qr-reader" className="min-h-[280px] w-full overflow-hidden rounded-2xl bg-black" />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
