import Link from "next/link";
import {
    MapPin,
    CheckCircle2,
    AlertTriangle,
    ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Company } from "@/lib/types";

interface CompanyCardProps {
    company: Company;
}

function getIndustryEmoji(industry: string): string {
    const map: Record<string, string> = {
        Outsourcing: "🤝",
        Technology: "💻",
        "Banking & Finance": "🏦",
        "E-Commerce": "🛒",
        Telekomunikasi: "📡",
        FMCG: "🏪",
        Otomotif: "🚗",
        "Energi & Pertambangan": "⚡",
        Kesehatan: "🏥",
        Logistik: "📦",
        "Media & Hiburan": "📺",
        Pendidikan: "🎓",
        "Properti & Konstruksi": "🏗️",
        Pemerintahan: "🏛️",
        Lainnya: "🏢",
    };
    return map[industry] || "🏢";
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "Belum diverifikasi";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Hari ini";
    if (diff === 1) return "Kemarin";
    if (diff < 7) return `${diff} hari lalu`;
    if (diff < 30) return `${Math.floor(diff / 7)} minggu lalu`;
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function CompanyCard({ company }: CompanyCardProps) {
    return (
        <div className="card-hover rounded-xl border bg-card px-5 py-4 flex items-center gap-4">
            {/* Initial */}
            <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0 border font-semibold">
                {company.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/companies/${company.slug}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                    >
                        {company.name}
                    </Link>
                    {company.status === "ACTIVE" ? (
                        <div className="flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                    ) : (
                        <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-600 text-[10px] px-1.5 py-0 shrink-0"
                        >
                            <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                            Perlu Tinjauan
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span>{getIndustryEmoji(company.industry)} {company.industry}</span>
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {company.city}
                    </span>
                </div>
            </div>

            {/* Career Link Button */}
            <Button
                asChild
                size="sm"
                className="rounded-lg shrink-0 shadow-sm shadow-primary/10 hover:shadow-primary/20 transition-all"
            >
                <a
                    href={company.career_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Halaman Karir</span>
                    <span className="sm:hidden">Karir</span>
                </a>
            </Button>
        </div>
    );
}
