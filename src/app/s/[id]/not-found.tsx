import { uk } from "@/copy/uk";

export default function QRNotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl mb-4">❓</p>
      <h1 className="text-lg font-semibold text-gray-800">{uk.notFound.title}</h1>
      <p className="text-sm text-gray-400 mt-2">{uk.notFound.checkLink}</p>
    </main>
  );
}
