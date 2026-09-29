import type { Metadata, Viewport } from "next";
import { getStudioName } from "@/config/studio";
import { uk } from "@/copy/uk";
import "./globals.css";

export function generateMetadata(): Metadata {
  return {
    title: getStudioName(),
    description: uk.app.description,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
