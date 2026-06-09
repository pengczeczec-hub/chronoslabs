import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronos Labs — CYBER_GLOW Nixie Clocks & DIY Kits",
  description:
    "Matrix Edge-Glow ready-to-run RGB clocks and Heritage IN-14 Soviet vacuum tube DIY kits. Three premium models from $199.99 — instant plug-and-play or hardcore zero-tool assembly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
