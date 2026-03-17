import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = "https://temukarir.com";

export const metadata: Metadata = {
// ... existing metadata ...
  title: {
    default: "Temu Karir — Website Kumpulan Karir Perusahaan Indonesia",
    template: "%s | Temu Karir",
  },
  description:
    "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia. Website kumpulan karir perusahaan terlengkap. Lamar langsung ke sumber resmi, aman dan terverifikasi.",
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
    "lowongan kerja resmi",
    "lowongan pekerjaan",
    "infoloker",
    "situs lowongan kerja",
    "portal lowongan kerja",
    "cari loker",
    "karir startup",
    "website kumpulan karir perusahaan",
    "kumpulan karir perusahaan",
    "daftar karir perusahaan",
  ],
  authors: [{ name: "Temu Karir" }],
  creator: "Temu Karir",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Temu Karir — Website Kumpulan Karir Perusahaan Indonesia",
    description:
      "Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia. Lamar langsung ke sumber resmi melalui website kumpulan karir perusahaan terbaik.",
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
    title: "Temu Karir — Website Kumpulan Karir Perusahaan",
    description:
      "Website kumpulan karir perusahaan terlengkap. Temukan halaman karir resmi dari ratusan perusahaan terpercaya di Indonesia.",
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
        "Website kumpulan karir perusahaan Indonesia. Temukan lowongan kerja langsung dari sumber resmi tanpa perantara.",
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
        "Website kumpulan karir perusahaan-perusahaan terkemuka di Indonesia.",
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
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
