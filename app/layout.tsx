import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daniel Garcia Fonseca — Software/AI Developer",
  description:
    "I build AI-powered backends and developer tools — turning models into reliable, production-ready systems with clean APIs.",
  openGraph: {
    title: "Daniel Garcia Fonseca — AI / Software Developer",
    description:
      "I build AI-powered backends and developer tools — turning models into reliable, production-ready systems with clean APIs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hanken.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
