import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Temu Karir — Direktori Halaman Karir Resmi Perusahaan Indonesia",
    template: "%s | Temu Karir",
  },
  description:
    "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia. Lamar langsung ke sumber resmi, aman dan terverifikasi.",
  keywords: [
    "lowongan kerja",
    "karir",
    "perusahaan indonesia",
    "fresh graduate",
    "halaman karir resmi",
    "cari kerja",
    "rekrutmen",
  ],
  openGraph: {
    title: "Temu Karir — Direktori Halaman Karir Resmi Perusahaan Indonesia",
    description:
      "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia.",
    url: "https://temukarir.com",
    siteName: "Temu Karir",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temu Karir",
    description:
      "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}
