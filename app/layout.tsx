import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AI guide for creative directors — Studio Method",
  description: "How I ran an AI agent inside a 30-person design studio for a year. A practical guide for creative directors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Plausible Analytics — privacy-first, no cookies, no banner required */}
        {/* Activate: register studiomethod.ai at plausible.io (free tier) */}
        <Script
          defer
          data-domain="studiomethod.ai"
          src="https://plausible.io/js/script.tagged-events.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        {children}
        {/* Vercel Analytics — activate at vercel.com/chrisabad/studio-method-site/analytics */}
        <Analytics />
      </body>
    </html>
  );
}
