"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";
import { CompanyCard } from "@/components/company-card";
import { searchCompanies as mockSearch } from "@/lib/data";
import { searchCompanies as supabaseSearch } from "@/lib/supabase";
import { Company } from "@/lib/types";
import { Building2, Loader2 } from "lucide-react";

export function CompanyGrid() {
    const [query, setQuery] = useState("");
    const [industry, setIndustry] = useState("all");
    const [ownership, setOwnership] = useState("all");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [useSupabase, setUseSupabase] = useState(true);

    // Fetch from Supabase on mount and when filters change
    useEffect(() => {
        let cancelled = false;

        async function fetchCompanies() {
            setLoading(true);
            try {
                if (useSupabase) {
                    const results = await supabaseSearch(query, industry, ownership);
                    if (!cancelled) {
                        if (results.length > 0 || query || industry !== "all" || ownership !== "all") {
                            setCompanies(results);
                        } else {
                            // Supabase empty (no migration yet), fall back to mock
                            setUseSupabase(false);
                            setCompanies(mockSearch(query, industry, ownership));
                        }
                    }
                } else {
                    if (!cancelled) {
                        setCompanies(mockSearch(query, industry, ownership));
                    }
                }
            } catch {
                if (!cancelled) {
                    setUseSupabase(false);
                    setCompanies(mockSearch(query, industry, ownership));
                }
            }
            if (!cancelled) setLoading(false);
        }

        const debounce = setTimeout(fetchCompanies, 300);
        return () => {
            cancelled = true;
            clearTimeout(debounce);
        };
    }, [query, industry, ownership, useSupabase]);

    return (
        <section id="direktori" className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                        Direktori Perusahaan
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Temukan halaman karir resmi dari berbagai perusahaan ternama di
                        Indonesia. Semua data diverifikasi secara otomatis.
                    </p>
                </div>

                <SearchBar
                    query={query}
                    onQueryChange={setQuery}
                    industry={industry}
                    onIndustryChange={setIndustry}
                    ownership={ownership}
                    onOwnershipChange={setOwnership}
                    resultCount={companies.length}
                />

                {loading ? (
                    <div className="mt-16 flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Memuat data perusahaan...</span>
                    </div>
                ) : companies.length > 0 ? (
                    <div className="mt-8 flex flex-col gap-3">
                        {companies.map((company, i) => (
                            <div
                                key={company.id}
                                className="animate-fade-in-up opacity-0"
                                style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "forwards" }}
                            >
                                <CompanyCard company={company} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-16 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Tidak ada perusahaan ditemukan
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Coba ubah kata kunci pencarian atau filter untuk menemukan
                            perusahaan yang Anda cari.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
