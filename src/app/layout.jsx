import { Inter, Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CartSheet } from "@/components/layout/cart-sheet";
import { AuthSync } from "@/components/layout/auth-sync";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    "luxury fashion",
    "minimalist clothing",
    "architectural streetwear",
    "editorial lookbook",
    "avant-garde fashion",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen bg-[#FAFAFA] text-[#111111] antialiased flex flex-col justify-between selection:bg-black selection:text-white">
        <AuthSync />
        {children}

        <CartSheet />
      </body>
    </html>
  );
}
