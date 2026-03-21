"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Search,
    Sparkles,
    Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStats as getMockStats } from "@/lib/data";
import { getStats as getSupabaseStats } from "@/lib/supabase";

export function Hero() {
    const [totalPerusahaan, setTotalPerusahaan] = useState(0);

    useEffect(() => {
        async function fetchStats() {
            try {
                const s = await getSupabaseStats();
                if (s.total > 0) {
                    setTotalPerusahaan(s.total);
                } else {
                    setTotalPerusahaan(getMockStats().total);
                }
            } catch {
                setTotalPerusahaan(getMockStats().total);
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Hero Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <div className="animate-fade-in-up opacity-0 mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
                            <Sparkles className="h-3.5 w-3.5" />
                            Terverifikasi otomatis secara berkala
                        </div>

                        {/* Title */}
                        <h1 
                            className="animate-fade-in-up opacity-0 stagger-1 text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight"
                        >
                            <span className="block">Jelajahi <span className="gradient-text">Karir</span></span>
                            <span className="block">di Perusahaan</span>
                            <span className="block">Terkemuka Indonesia</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="animate-fade-in-up opacity-0 stagger-2 mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl lg:max-w-none leading-relaxed mx-auto lg:mx-0">
                            Website kumpulan karir perusahaan terpercaya. Akses langsung ke{" "}
                            <span className="font-semibold text-foreground">
                                {totalPerusahaan}+ perusahaan
                            </span>{" "}
                            terkemuka. Tanpa login, tanpa biaya, langsung ke sumber resmi.
                        </p>

                        {/* CTA */}
                        <div className="animate-fade-in-up opacity-0 stagger-3 mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="h-13 px-8 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium"
                            >
                                <Link href="/#direktori">
                                    <Search className="mr-2 h-5 w-5" />
                                    Cari Perusahaan
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Fun Fact */}
                    <div className="animate-fade-in-up opacity-0 relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10 shadow-lg" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
                        <div className="absolute -right-10 -top-10 opacity-10">
                            <Lightbulb className="h-40 w-40 text-primary" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 text-emerald-500 font-semibold tracking-wide uppercase text-sm">
                                <Lightbulb className="h-5 w-5" />
                                <span>Tahukah Kamu?</span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
                                Sebagian besar rekruter sebenarnya lebih menyukai kandidat yang melamar langsung melalui website karir resmi perusahaan.
                            </h2>

                            <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
                                Mengapa? Karena itu menunjukkan inisiatif, dan data kandidat langsung masuk ke Applicant Tracking System (ATS) internal mereka tanpa perantara platform pihak ketiga. Banyak juga loker &quot;hidden gem&quot; yang hanya diposting di website resmi mereka!
                            </p>

                            <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
                                TAPI, proses mencari halaman karir tiap perusahaan ini seringkali melelahkan. Harus buka Google, cek website resminya satu-satu (yang kadang UI-nya muter-muter), sampai akhirnya nemu tombol &quot;Career&quot; yang nyempil di pojokan. Waktu nyari kerja malah habis buat navigasi web. 😩
                            </p>

                            <div className="inline-flex items-center gap-2 font-medium text-foreground bg-background/50 backdrop-blur-sm px-4 py-3 rounded-lg border">
                                <span className="text-xl">💡</span>
                                <span>Pakai ini aja biar hemat waktu: <span className="text-primary font-bold">temukarir.com</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


