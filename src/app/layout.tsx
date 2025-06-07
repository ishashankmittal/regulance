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
  title: "Regulance - AI-Powered Regulatory Compliance for Indian Businesses",
  description: "Simplify regulatory compliance with our AI-driven platform that monitors, interprets, and summarizes updates from MCA, RBI, SEBI, GST, and other authorities.",
  icons: {
    icon: '/regulance.png',
  },
  openGraph: {
    title: "Regulance - AI-Powered Regulatory Compliance for Indian Businesses",
    description: "Simplify regulatory compliance with our AI-driven platform that monitors, interprets, and summarizes updates from MCA, RBI, SEBI, GST, and other authorities.",
    images: [
      {
        url: '/regulance.png',
        width: 1200,
        height: 630,
        alt: 'Regulance Logo',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Regulance - AI-Powered Regulatory Compliance for Indian Businesses",
    description: "Simplify regulatory compliance with our AI-driven platform that monitors, interprets, and summarizes updates from MCA, RBI, SEBI, GST, and other authorities.",
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
