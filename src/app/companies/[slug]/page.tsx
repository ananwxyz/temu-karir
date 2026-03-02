import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    Mail,
    Linkedin,
    MessageCircle,
    Instagram,
    CheckCircle2,
    AlertTriangle,
    Shield,
    Calendar,
    Building2,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCompanyBySlug as getFromSupabase, getCompanies as getSupabaseCompanies } from "@/lib/supabase";
import { getCompanyBySlug as getFromMock, getCompanies as getMockCompanies } from "@/lib/data";
import { Company } from "@/lib/types";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    let companies;
    try {
        companies = await getSupabaseCompanies();
        if (companies.length === 0) companies = getMockCompanies();
    } catch {
        companies = getMockCompanies();
    }
    return companies.map((c) => ({ slug: c.slug }));
}

async function getCompany(slug: string): Promise<Company | null> {
    try {
        const company = await getFromSupabase(slug);
        if (company) return company;
    } catch { }
    return getFromMock(slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const company = await getCompany(slug);
    if (!company) return { title: "Perusahaan Tidak Ditemukan" };

    return {
        title: `${company.name} — Halaman Karir Resmi`,
        description: `Kunjungi halaman karir resmi ${company.name} dan lamar langsung. ${company.industry} - ${company.ownership}.`,
        openGraph: {
            title: `${company.name} — Halaman Karir Resmi | Temu Karir`,
            description: `Halaman karir resmi ${company.name}. ${company.industry} - ${company.ownership}.`,
            url: `https://temukarir.com/companies/${company.slug}`,
        },
    };
}

export default async function CompanyDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const company = await getCompany(slug);

    if (!company) {
        notFound();
    }

    const contacts = [
        {
            label: "LinkedIn",
            value: company.linkedin_url || "#",
            icon: Linkedin,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            label: "WhatsApp",
            value: company.whatsapp
                ? `https://wa.me/${company.whatsapp.replace(/\D/g, "")}`
                : null,
            icon: MessageCircle,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-500/10",
        },
        {
            label: "Instagram",
            value: company.instagram_url || "#",
            icon: Instagram,
            color: "text-pink-600 dark:text-pink-400",
            bg: "bg-pink-500/10",
        },
        {
            label: "Email",
            value: company.email ? `mailto:${company.email}` : null,
            displayValue: company.email,
            icon: Mail,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
        },
    ].filter((c) => c.value);

    const verifiedDate = company.last_verified_at
        ? new Date(company.last_verified_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : null;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="border-b bg-card/50">
                <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    <Link
                        href="/#direktori"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Direktori
                    </Link>

                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        {/* Initial */}
                        <div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center text-3xl overflow-hidden border shrink-0">
                            <span>{company.name.charAt(0)}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                    {company.name}
                                </h1>
                                {company.status === "ACTIVE" ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Terverifikasi
                                    </Badge>
                                ) : company.status === "PENDING" ? (
                                    <Badge variant="outline" className="text-blue-600 border-blue-400 dark:text-blue-400">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Menunggu Verifikasi
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-amber-600 border-amber-400 dark:text-amber-400">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Perlu Tinjauan
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {company.industry}
                                </span>
                                <Badge variant="outline" className="text-xs font-normal">
                                    {company.ownership}
                                </Badge>
                                {verifiedDate && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Diverifikasi {verifiedDate}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                {/* CTA */}
                <div className="rounded-xl border bg-gradient-to-r from-primary/5 to-teal-500/5 p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                        Halaman Karir Resmi
                    </h2>
                    <p className="text-sm text-muted-foreground mb-5">
                        Kunjungi halaman karir resmi {company.name} untuk melihat lowongan
                        yang tersedia dan melamar secara langsung.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    >
                        <a
                            href={company.career_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Kunjungi Halaman Karir
                        </a>
                    </Button>
                </div>

                {/* Contacts */}
                {contacts.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-4">
                            Kontak & Tautan Resmi
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {contacts.map((contact) => (
                                <a
                                    key={contact.label}
                                    href={contact.value!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border bg-card p-4 card-hover group"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${contact.bg} ${contact.color} shrink-0`}
                                    >
                                        <contact.icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            {contact.label}
                                        </p>
                                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                            {contact.displayValue || contact.label}
                                        </p>
                                    </div>
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Disclaimer */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                    <div className="flex gap-3">
                        <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-1">
                                Disclaimer Keamanan
                            </h3>
                            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                                Temu Karir hanya menyediakan tautan ke halaman karir resmi
                                perusahaan. Kami tidak bertanggung jawab atas konten di
                                situs eksternal. Selalu verifikasi keaslian informasi dan
                                jangan pernah membayar untuk melamar pekerjaan. Jika Anda
                                menemukan tautan yang tidak valid, silakan hubungi kami.
                            </p>
                        </div>
                    </div>
                </div>

                {/* JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: company.name,
                            url: company.career_url,
                            ...(company.email && { email: company.email }),
                        }),
                    }}
                />
            </div>
        </div>
    );
}

export const dynamic = "force-dynamic";
