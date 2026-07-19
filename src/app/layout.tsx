import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ErrorBoundary from "@/components/ErrorBoundary";
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
  title: "Movra | FIFA World Cup 2026 Stadium Assistant",
  description:
    "An AI-powered stadium operations and fan experience assistant for the FIFA World Cup 2026. Navigate venues, track crowds, access multilingual assistance, and get real-time decision support.",
  keywords: [
    "FIFA World Cup 2026",
    "stadium assistant",
    "AI",
    "crowd management",
    "accessibility",
    "multilingual",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip to main content link for keyboard navigation (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
