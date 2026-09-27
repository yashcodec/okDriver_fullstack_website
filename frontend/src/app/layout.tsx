import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "okDriver",
  description: "Neural Net Traffic Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-slate-300 min-h-screen flex h-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
