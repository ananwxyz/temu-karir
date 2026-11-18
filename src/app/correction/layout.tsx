import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: {
        canonical: "https://temukarir.com/correction",
    },
    title: {
        default: "Koreksi Data Perusahaan | Temu Karir",
        template: "%s | Temu Karir",
    },
    description:
        "Ajukan koreksi atau perbaikan data halaman karir perusahaan di direktori Temu Karir.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function KoreksiLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}