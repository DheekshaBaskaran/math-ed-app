// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Background from "./components/Background";
import Nav from "./components/Nav";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "MathEd · AI Math Tutor",
  description: "K–8 real-world math practice with an AI tutor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${display.variable} min-h-screen`}>
        <Background />
        <Nav />
        {children}
      </body>
    </html>
  );
}
