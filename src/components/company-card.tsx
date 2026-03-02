import Link from "next/link";
import {
    CheckCircle2,
    AlertTriangle,
    ExternalLink,
    Linkedin,
    Instagram,
    Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Company } from "@/lib/types";

interface CompanyCardProps {
    company: Company;
}

function getIndustryEmoji(industry: string): string {
    const map: Record<string, string> = {
        "Technology & Digital": "💻",
        "Financial Services": "🏦",
        "Insurance": "🛡️",
        "Investment & Venture Capital": "📈",
        "Legal & Professional Services": "⚖️",
        "Telecommunications": "📡",
        "Media & Entertainment": "📺",
        "Consumer Goods (FMCG)": "🏪",
        "Retail & E-Commerce": "🛒",
        "Manufacturing & Industrial": "🏭",
        "Energy & Natural Resources": "⚡",
        "Agriculture & Agribusiness": "🌿",
        "Healthcare & Pharmaceutical": "🏥",
        "Transportation & Logistics": "🚛",
        "Property & Construction": "🏗️",
        "Hospitality & Tourism": "🏨",
        "Education": "🎓",
        "Government & Public Sector": "🏛️",
        "Non-Profit & International Organization": "🌍",
        "Outsourcing": "🤝",
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
    if (diff < 30) return `${Math.floor(diff / 7)} pekan lalu`;
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function CompanyCard({ company }: CompanyCardProps) {
    return (
        <div className="card-hover rounded-xl border bg-card px-5 py-4 flex items-center gap-4">
            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/perusahaan/${company.slug}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                    >
                        {company.name}
                    </Link>
                    {company.status === "ACTIVE" ? (
                        <div className="flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                    ) : company.status === "PENDING" ? (
                        <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600 text-[10px] px-1.5 py-0 shrink-0"
                        >
                            <Clock className="h-2.5 w-2.5 mr-0.5" />
                            Menunggu
                        </Badge>
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
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                        {company.ownership}
                    </Badge>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
                {company.linkedin_url ? (
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                        <a
                            href={company.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="LinkedIn"
                        >
                            <Linkedin className="h-3.5 w-3.5" />
                        </a>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 w-8 p-0 rounded-lg"
                        title="LinkedIn belum tersedia"
                    >
                        <Linkedin className="h-3.5 w-3.5" />
                    </Button>
                )}
                {company.instagram_url ? (
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950"
                    >
                        <a
                            href={company.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Instagram"
                        >
                            <Instagram className="h-3.5 w-3.5" />
                        </a>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 w-8 p-0 rounded-lg"
                        title="Instagram belum tersedia"
                    >
                        <Instagram className="h-3.5 w-3.5" />
                    </Button>
                )}
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
        </div>
    );
}
