import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = "https://temukarir.com";

export const metadata: Metadata = {
  title: {
    default: "Temu Karir — Direktori Halaman Karir Resmi Perusahaan Indonesia",
    template: "%s | Temu Karir",
  },
  description:
    "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia. Lamar langsung ke sumber resmi, aman dan terverifikasi. Cari lowongan kerja di Tokopedia, Gojek, BCA, Telkom, dan ratusan perusahaan lainnya.",
  keywords: [
    "lowongan kerja",
    "karir",
    "perusahaan indonesia",
    "fresh graduate",
    "halaman karir resmi",
    "cari kerja",
    "rekrutmen",
    "loker",
    "job vacancy indonesia",
    "career page",
    "BUMN karir",
    "startup indonesia",
    "lamar kerja online",
    "direktori perusahaan",
  ],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Temu Karir — Direktori Halaman Karir Resmi Perusahaan Indonesia",
    description:
      "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia. Lamar langsung ke sumber resmi.",
    url: baseUrl,
    siteName: "Temu Karir",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: "Temu Karir Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Temu Karir — Direktori Halaman Karir Resmi",
    description:
      "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia.",
    images: [`${baseUrl}/logo.png`],
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
    google: "CqDPN5UogHLQoLihmYYxiSndOqhH1xo3gYJl2v3SIAo",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Temu Karir",
      description:
        "Direktori halaman karir resmi perusahaan Indonesia. Temukan lowongan kerja langsung dari sumber resmi.",
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Temu Karir",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
      description:
        "Platform direktori halaman karir resmi perusahaan-perusahaan Indonesia.",
      sameAs: [],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
