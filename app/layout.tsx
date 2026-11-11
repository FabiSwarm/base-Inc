import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ocrB = localFont({
  src: "./fonts/ocr-b/ocrb.ttf",
  variable: "--font-ocr-b",
  weight: "400",
  display: "swap",
  fallback: ["Courier New", "monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "ASSISE — Die Essenz von Stil.",
  description:
    "Minimalistische Anzugshosen für den Alltag. Entdecke ASSISE I und ASSISE II: zwei Schnitte, eine Haltung. Eine Größe. Deine Länge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${ocrB.variable} ${inter.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
