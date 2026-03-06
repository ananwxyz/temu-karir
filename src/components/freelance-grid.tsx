"use client";

import { useState, useEffect } from "react";
import { FreelanceSearchBar } from "@/components/freelance-search-bar";
import { FreelanceCard } from "@/components/freelance-card";
import { searchFreelance } from "@/lib/freelance-data";
import { FreelancePlatform } from "@/lib/freelance-types";
import { Briefcase, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function FreelanceGrid() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [paymentType, setPaymentType] = useState("all");

    const [platforms, setPlatforms] = useState<FreelancePlatform[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);

    // Reset page to 1 whenever filters or page size change
    useEffect(() => {
        setCurrentPage(1);
    }, [query, category, paymentType, pageSize]);

    // Fetch data (using mock directly as there's no supabase implementation)
    useEffect(() => {
        let cancelled = false;

        async function fetchPlatforms() {
            setLoading(true);
            try {
                if (!cancelled) {
                    const mock = searchFreelance(query, category, paymentType);
                    const from = (currentPage - 1) * pageSize;
                    setPlatforms(mock.slice(from, from + pageSize));
                    setTotalCount(mock.length);
                }
            } catch (error) {
                console.error("Error fetching freelance data:", error);
            }
            if (!cancelled) setLoading(false);
        }

        const debounce = setTimeout(fetchPlatforms, 300);
        return () => {
            cancelled = true;
            clearTimeout(debounce);
        };
    }, [query, category, paymentType, currentPage, pageSize]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return (
        <section id="freelance" className="py-16 sm:py-20 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                        Direktori Freelance
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Temukan berbagai platform freelance terbaik untuk menemukan
                        proyek dan pekerjaan lepas sesuai dengan keahlian Anda.
                    </p>
                </div>

                <FreelanceSearchBar
                    query={query}
                    onQueryChange={setQuery}
                    category={category}
                    onCategoryChange={setCategory}
                    paymentType={paymentType}
                    onPaymentTypeChange={setPaymentType}
                    resultCount={totalCount}
                />

                {loading ? (
                    <div className="mt-16 flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Memuat data platform freelance...</span>
                    </div>
                ) : platforms.length > 0 ? (
                    <>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {platforms.map((platform, i) => (
                                <div
                                    key={platform.id}
                                    className="animate-fade-in-up opacity-0"
                                    style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "forwards" }}
                                >
                                    <FreelanceCard platform={platform} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalCount > pageSize && (
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Tampilkan</span>
                                    <Select
                                        value={pageSize.toString()}
                                        onValueChange={(val) => {
                                            setPageSize(Number(val));
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="100">100</SelectItem>
                                            <SelectItem value="200">200</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span>per halaman</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        Halaman <span className="font-medium text-foreground">{currentPage}</span> dari <span className="font-medium text-foreground">{totalPages}</span>
                                        <span className="ml-2 text-xs">({totalCount} platform)</span>
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
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Tidak ada platform ditemukan
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Coba ubah kata kunci pencarian atau filter untuk menemukan
                            platform freelance yang Anda cari.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
