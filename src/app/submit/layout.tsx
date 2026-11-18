import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: {
        canonical: "https://temukarir.com/submit",
    },
    title: {
        default: "Kirim Lowongan Kerja Perusahaan | Temu Karir",
        template: "%s | Temu Karir",
    },
    description:
        "Kirim data halaman karir resmi perusahaan Anda ke Temu Karir agar terindeks dalam direktori kumpulan karir perusahaan Indonesia.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function SubmitLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}