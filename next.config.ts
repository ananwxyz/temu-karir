import type { NextConfig } from "next";

/**
 * Semua route publik memakai slug bahasa Inggris:
 *   /company/[slug], /submit, /correction
 * URL lama berbahasa Indonesia tetap hidup lewat redirect permanen (308)
 * supaya backlink dan hasil indeks Google tidak berakhir 404.
 */
const legacyRedirects = [
    // /perusahaan             -> /            (indeks direktori = homepage)
    { source: "/perusahaan", destination: "/", permanent: true },
    // /perusahaan/abb-insurance -> /company/abb-insurance
    { source: "/perusahaan/:slug*", destination: "/company/:slug*", permanent: true },
    { source: "/koreksi", destination: "/correction", permanent: true },
    { source: "/lapor", destination: "/correction", permanent: true },
    { source: "/kirim", destination: "/submit", permanent: true },
];

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ["lucide-react"],
    },
    async redirects() {
        return legacyRedirects;
    },
};

export default nextConfig;