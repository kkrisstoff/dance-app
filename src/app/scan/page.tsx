import { getStudioName } from "@/config/studio";
import { uk } from "@/copy/uk";
import { Scanner } from "./Scanner";

export default function ScanPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-5 pt-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{getStudioName()}</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">{uk.scan.title}</h1>
      <p className="mt-2 mb-6 text-center text-sm text-gray-500">{uk.scan.description}</p>
      <Scanner />
    </main>
  );
}
