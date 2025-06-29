import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { generateMetaDescription, generatePageTitle } from "@/utils/seo";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elouarateart.com"),
  title: {
    default: generatePageTitle("home"),
    template: "%s | PRO ART GALLERY",
  },
  description: generateMetaDescription("home"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://elouarateart.com",
    siteName: "PRO ART GALLERY",
    images: [
      {
        url: "/og-image-home.jpg",
        width: 1200,
        height: 630,
        alt: "PRO ART GALLERY - Premium Art Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: generatePageTitle("home"),
    description: generateMetaDescription("home"),
    images: ["/og-image-home.jpg"],
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-slate-100`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
