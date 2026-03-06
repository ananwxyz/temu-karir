import { AlertTriangle, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FreelancePlatform } from "@/lib/freelance-types";

interface FreelanceCardProps {
    platform: FreelancePlatform;
}

function getCategoryEmoji(category: string): string {
    const map: Record<string, string> = {
        "Programming & Tech": "💻",
        "Graphic Design & Creative": "🎨",
        "Writing & Translation": "✍️",
        "Digital Marketing": "📈",
        "Video & Animation": "🎥",
        "General Freelance": "💼",
    };
    return map[category] || "💼";
}

export function FreelanceCard({ platform }: FreelanceCardProps) {
    return (
        <div className="card-hover rounded-xl border bg-card px-5 py-4 flex items-center gap-4">
            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground truncate">
                        {platform.name}
                    </span>
                    {platform.status === "PENDING" ? (
                        <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600 text-[10px] px-1.5 py-0 shrink-0"
                        >
                            <Clock className="h-2.5 w-2.5 mr-0.5" />
                            Menunggu
                        </Badge>
                    ) : platform.status === "ACTIVE" ? null : (
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
                    <span>{getCategoryEmoji(platform.category)} {platform.category}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                        {platform.payment_type}
                    </Badge>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
                <Button
                    asChild
                    size="sm"
                    className="rounded-lg shrink-0 shadow-sm shadow-primary/10 hover:shadow-primary/20 transition-all"
                >
                    <a
                        href={platform.platform_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Kunjungi</span>
                        <span className="sm:hidden">Kunjungi</span>
                    </a>
                </Button>
            </div>
        </div>
    );
}
