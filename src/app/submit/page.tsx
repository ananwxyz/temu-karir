"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Send,
    CheckCircle2,
    Building2,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDUSTRIES, OWNERSHIP_TYPES, Industry, OwnershipType } from "@/lib/types";
import { createSubmission } from "@/lib/supabase";

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function SubmitCompanyPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const slug = slugify(name);

        const companyData = {
            name,
            slug,
            industry: formData.get("industry") as Industry,
            ownership: formData.get("ownership") as OwnershipType,
            career_url: formData.get("career_url") as string,
            email: (formData.get("email") as string) || null,
            linkedin_url: (formData.get("linkedin_url") as string) || null,
            whatsapp: (formData.get("whatsapp") as string) || null,
            instagram_url: (formData.get("instagram_url") as string) || null,
        };

        try {
            const result = await createSubmission(companyData);
            if (result) {
                setSubmitted(true);
            } else {
                setError("Gagal mengirim data. Pastikan nama perusahaan belum terdaftar dan coba lagi.");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-3">
                        Terima Kasih!
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Data perusahaan Anda telah dikirim dan sedang menunggu verifikasi oleh admin.
                        Setelah diverifikasi, perusahaan akan muncul di direktori.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild variant="outline" className="rounded-lg">
                            <Link href="/">Kembali ke Beranda</Link>
                        </Button>
                        <Button
                            className="rounded-lg"
                            onClick={() => setSubmitted(false)}
                        >
                            Ajukan Lagi
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="border-b bg-card/50">
                <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Ajukan Perusahaan
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Bantu kami melengkapi direktori karir Indonesia
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
                <div className="rounded-xl border bg-card p-6 sm:p-8">
                    <p className="text-sm text-muted-foreground mb-6">
                        Isi form di bawah untuk mengajukan perusahaan baru ke direktori.
                        Data akan diverifikasi oleh admin sebelum ditampilkan.
                    </p>

                    {error && (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 mb-6">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-medium">
                                    Nama Perusahaan *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="contoh: PT ABC Indonesia"
                                    className="h-10 rounded-lg text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="career_url" className="text-xs font-medium">
                                    URL Halaman Karir *
                                </Label>
                                <Input
                                    id="career_url"
                                    name="career_url"
                                    type="url"
                                    required
                                    placeholder="https://career.example.com"
                                    className="h-10 rounded-lg text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="industry" className="text-xs font-medium">
                                    Industri *
                                </Label>
                                <select
                                    id="industry"
                                    name="industry"
                                    required
                                    defaultValue="Technology & Digital"
                                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                                >
                                    {INDUSTRIES.map((ind) => (
                                        <option key={ind} value={ind}>
                                            {ind}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ownership" className="text-xs font-medium">
                                    Tipe Kepemilikan *
                                </Label>
                                <select
                                    id="ownership"
                                    name="ownership"
                                    required
                                    defaultValue="Swasta"
                                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                                >
                                    {OWNERSHIP_TYPES.map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border-t pt-5">
                            <p className="text-xs font-medium text-muted-foreground mb-3">
                                Kontak & Sosial Media (opsional)
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-medium">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="careers@example.com"
                                        className="h-10 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="linkedin_url" className="text-xs font-medium">
                                        LinkedIn URL
                                    </Label>
                                    <Input
                                        id="linkedin_url"
                                        name="linkedin_url"
                                        type="url"
                                        placeholder="https://linkedin.com/company/..."
                                        className="h-10 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="whatsapp" className="text-xs font-medium">
                                        WhatsApp
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        name="whatsapp"
                                        placeholder="628xxxxxxxxxx"
                                        className="h-10 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="instagram_url" className="text-xs font-medium">
                                        Instagram URL
                                    </Label>
                                    <Input
                                        id="instagram_url"
                                        name="instagram_url"
                                        type="url"
                                        placeholder="https://instagram.com/..."
                                        className="h-10 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                className="rounded-lg min-w-[160px]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Kirim Pengajuan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
