import type { Metadata } from "next";
import { Inter, Orbitron, Space_Mono } from "next/font/google";
import "./globals.css";
import GsapInitializer from "@/components/ui/GsapInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap"
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "R.ked - Creative Developer",
  description: "Creative coder building immersive web experiences in the digital cosmos",
  keywords: ["developer", "creative coding", "web development", "portfolio", "R.ked"],
  authors: [{ name: "R.ked" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${spaceMono.variable}`}>
      <body className="bg-black text-white overflow-x-hidden">
        <GsapInitializer />
        {children}
      </body>
    </html>
  );
} 