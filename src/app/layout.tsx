import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TKD Manager - Academia",
  description: "Sistema de Gestión Integral para la Academia de Taekwondo",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-zinc-100 flex h-screen overflow-hidden`}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-900 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
