import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "SellKoro - Buy & Sell Anything in Bangladesh",
    template: "%s | SellKoro"
  },
  description: "SellKoro is Bangladesh's largest online marketplace. Buy and sell new & used products, cars, property, jobs, electronics, furniture, and more. Post free ads and reach millions of buyers today!",
  keywords: [
    "sellkoro",
    "online marketplace bangladesh",
    "buy and sell bangladesh",
    "classified ads bangladesh",
    "sell products online",
    "buy second hand products",
    "sell car bangladesh",
    "property for sale bangladesh",
    "jobs in bangladesh",
    "electronics bangladesh",
    "furniture bangladesh"
  ],
  authors: [{ name: "SellKoro", url: "https://sellkoro.com" }],
  creator: "SellKoro",
  publisher: "SellKoro",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sellkoro.com"),
  alternates: {
    canonical: "/",
    languages: {
      'en': '/en',
      'bn': '/bn',
    },
  },
  openGraph: {
    title: "SellKoro - Buy & Sell Anything in Bangladesh",
    description: "Join millions of buyers and sellers on SellKoro. Post free ads, sell your products, and find great deals on electronics, cars, property, jobs, and more.",
    url: "https://sellkoro.com",
    siteName: "SellKoro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SellKoro - Buy & Sell Anything in Bangladesh",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SellKoro - Buy & Sell Anything in Bangladesh",
    description: "Join millions of buyers and sellers on SellKoro. Post free ads and find great deals on electronics, cars, property, jobs, and more.",
    images: ["/og-image.jpg"],
    creator: "@sellkoro",
    site: "@sellkoro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // other verification codes can be added here
  },
  category: "e-commerce",
  classification: "Online Marketplace",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/shortcut-icon.png"],
  },
  manifest: "/manifest.json",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>
        {children}

        </Layout>
      </body>
    </html>
  );
}
