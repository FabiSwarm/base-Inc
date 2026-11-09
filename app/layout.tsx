import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["300", "700"],
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
      className={`${ibmPlexMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
