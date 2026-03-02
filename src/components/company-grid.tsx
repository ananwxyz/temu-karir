"use client";

import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "@/components/search-bar";
import { CompanyCard } from "@/components/company-card";
import { searchCompanies as mockSearch } from "@/lib/data";
import { searchCompanies as supabaseSearch } from "@/lib/supabase";
import { Company } from "@/lib/types";
import { Building2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function CompanyGrid() {
    const [query, setQuery] = useState("");
    const [industry, setIndustry] = useState("all");
    const [ownership, setOwnership] = useState("all");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [useSupabase, setUseSupabase] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    // Reset page to 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [query, industry, ownership]);

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

    // Calculate pagination data
    const totalItems = companies.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Ensure currentPage is valid if pageSize changes or results shrink
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const currentCompanies = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return companies.slice(startIndex, startIndex + pageSize);
    }, [companies, currentPage, pageSize]);

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
                    resultCount={totalItems}
                />

                {loading ? (
                    <div className="mt-16 flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Memuat data perusahaan...</span>
                    </div>
                ) : totalItems > 0 ? (
                    <>
                        <div className="mt-8 flex flex-col gap-3">
                            {currentCompanies.map((company, i) => (
                                <div
                                    key={company.id}
                                    className="animate-fade-in-up opacity-0"
                                    style={{ animationDelay: `${(i % pageSize) * 0.03}s`, animationFillMode: "forwards" }}
                                >
                                    <CompanyCard company={company} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalItems > 10 && (
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Tampilkan</span>
                                    <Select
                                        value={pageSize.toString()}
                                        onValueChange={(val) => {
                                            setPageSize(Number(val));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span>per halaman</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        Halaman <span className="font-medium text-foreground">{currentPage}</span> dari <span className="font-medium text-foreground">{totalPages}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="sr-only">Halaman sebelumnya</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                            <span className="sr-only">Halaman selanjutnya</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
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
