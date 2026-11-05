import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BASE — Die Essenz von Stil.",
  description:
    "Minimalistische Anzugshosen für den Alltag. Entdecke BASE I und BASE II: zwei Schnitte, eine Haltung. Eine Größe. Deine Länge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
