import type { Metadata } from "next";
import { inter } from "./font";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capit24 Terminal",
  description: "Terminal financiero en tiempo real",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}


