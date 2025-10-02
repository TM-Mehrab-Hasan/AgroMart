import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
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
  title: "AgroMart - Agricultural Marketplace Platform",
  description: "A comprehensive agricultural marketplace connecting farmers, fishermen, and dairy producers with customers through efficient delivery systems.",
  keywords: ["agriculture", "marketplace", "farming", "dairy", "fish", "vegetables", "crops", "ecommerce"],
  authors: [{ name: "Mehrab Hasan" }],
  creator: "Mehrab Hasan",
  openGraph: {
    title: "AgroMart - Agricultural Marketplace Platform",
    description: "Connecting farmers to markets with efficient multi-role management system.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
