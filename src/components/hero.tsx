"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Search,
    Shield,
    Clock,
    Sparkles,
    ArrowRight,
    Building2,
    CheckCircle2,
    MapPin,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStats as getMockStats } from "@/lib/data";
import { getStats as getSupabaseStats } from "@/lib/supabase";

export function Hero() {
    const [stats, setStats] = useState({ total: 0, active: 0, flagged: 0, industries: 0, cities: 0 });

    useEffect(() => {
        async function fetchStats() {
            try {
                const s = await getSupabaseStats();
                if (s.total > 0) {
                    setStats(s);
                } else {
                    setStats(getMockStats());
                }
            } catch {
                setStats(getMockStats());
            }
        }
        fetchStats();
    }, []);

    return (
        <section className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.64_0.18_166_/_0.05),transparent_70%)]" />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(oklch(0.64 0.18 166) 1px, transparent 1px), linear-gradient(90deg, oklch(0.64 0.18 166) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="animate-fade-in-up opacity-0 mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
                        <Sparkles className="h-3.5 w-3.5" />
                        Terverifikasi otomatis setiap minggu
                    </div>

                    {/* Title */}
                    <h1 className="animate-fade-in-up opacity-0 stagger-1 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                        Temukan{" "}
                        <span className="gradient-text">Halaman Karir</span>{" "}
                        Resmi Perusahaan Indonesia
                    </h1>

                    {/* Subtitle */}
                    <p className="animate-fade-in-up opacity-0 stagger-2 mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Akses langsung ke{" "}
                        <span className="font-semibold text-foreground">
                            {stats.total}+ perusahaan
                        </span>{" "}
                        terpercaya. Tanpa login, tanpa biaya, langsung ke sumber resmi.
                    </p>

                    {/* CTA */}
                    <div className="animate-fade-in-up opacity-0 stagger-3 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="h-13 px-8 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        >
                            <Link href="/#direktori">
                                <Search className="mr-2 h-5 w-5" />
                                Cari Perusahaan
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-13 px-8 text-base rounded-xl border-border/50 hover:bg-accent"
                        >
                            <Link href="/#tentang">
                                Pelajari Lebih Lanjut
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="animate-fade-in-up opacity-0 stagger-4 mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <StatItem
                            icon={<Building2 className="h-5 w-5" />}
                            value={stats.total.toString()}
                            label="Perusahaan"
                        />
                        <StatItem
                            icon={<TrendingUp className="h-5 w-5" />}
                            value={stats.industries.toString()}
                            label="Industri"
                        />
                        <StatItem
                            icon={<MapPin className="h-5 w-5" />}
                            value={stats.cities.toString()}
                            label="Kota"
                        />
                    </div>
                </div>
            </div>

            {/* About section */}
            <div id="tentang" className="relative pb-16 sm:pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Shield className="h-6 w-6" />}
                            title="Sumber Resmi & Aman"
                            description="Semua tautan karir berasal dari website resmi perusahaan. Tidak ada pihak ketiga atau perantara."
                            delay="0.1s"
                        />
                        <FeatureCard
                            icon={<Clock className="h-6 w-6" />}
                            title="Validasi Otomatis"
                            description="Sistem kami memverifikasi keaktifan setiap halaman karir setiap minggu, memastikan data selalu up-to-date."
                            delay="0.2s"
                        />
                        <FeatureCard
                            icon={<Sparkles className="h-6 w-6" />}
                            title="Gratis & Tanpa Login"
                            description="Akses tanpa batas ke semua informasi. Tidak perlu mendaftar, tidak perlu membayar."
                            delay="0.3s"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatItem({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: string;
    label: string;
}) {
    return (
        <div className="rounded-xl border bg-card/50 p-4 text-center card-hover">
            <div className="flex items-center justify-center mb-2 text-primary">
                {icon}
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    delay,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: string;
}) {
    return (
        <div
            className="animate-fade-in-up opacity-0 rounded-xl border bg-card p-6 card-hover"
            style={{ animationDelay: delay, animationFillMode: "forwards" }}
        >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                {icon}
            </div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    );
}
