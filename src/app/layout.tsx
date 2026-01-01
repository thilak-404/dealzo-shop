import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DealzoShop | Premium Verified Deals Feed",
  description: "Experience the fastest, most trustable deal engine for 2025. Curated loot deals from Amazon, Flipkart, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
