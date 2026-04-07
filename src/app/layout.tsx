import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Regulance — The Automated Financial Immune System for India",
  description: "Regulance bridges the gap between Tally and the GST portal. AI agents that autonomously audit ledgers, resolve discrepancies, and defend against scrutiny notices.",
  icons: {
    icon: '/regulance.png',
  },
  openGraph: {
    title: "Regulance — The Automated Financial Immune System for India",
    description: "Regulance bridges the gap between Tally and the GST portal. AI agents that autonomously audit ledgers, resolve discrepancies, and defend against scrutiny notices.",
    images: [
      {
        url: '/regulance.png',
        width: 1200,
        height: 630,
        alt: 'Regulance',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Regulance — The Automated Financial Immune System for India",
    description: "Regulance bridges the gap between Tally and the GST portal. AI agents that autonomously audit ledgers, resolve discrepancies, and defend against scrutiny notices.",
    images: ['/regulance.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
