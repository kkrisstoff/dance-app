import Link from "next/link";
import { uk } from "@/copy/uk";

export default function StudentNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl mb-4">❓</p>
      <h1 className="text-xl font-semibold text-gray-800">{uk.notFound.title}</h1>
      <p className="text-sm text-gray-400 mt-2">{uk.notFound.checkQrOrLink}</p>
      <Link href="/scan" className="mt-8 px-6 py-3 rounded-2xl bg-gray-900 text-white text-sm font-medium">
        {uk.nav.backToScan}
      </Link>
    </main>
  );
}
