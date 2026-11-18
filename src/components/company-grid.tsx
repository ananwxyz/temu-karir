"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import { CompanyCard } from "@/components/company-card";
import { searchCompanies as mockSearch } from "@/lib/data";
import { searchCompaniesPaginated } from "@/lib/supabase";
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

const DEFAULT_PAGE_SIZE = 100;

function readPage(raw: string | null): number {
    const value = Number(raw);
    return Number.isFinite(value) && value > 1 ? Math.floor(value) : 1;
}

function readPageSize(raw: string | null): number {
    return Number(raw) === 200 ? 200 : DEFAULT_PAGE_SIZE;
}

export function CompanyGrid() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State awal dibaca dari query string supaya link bisa dibagikan
    // dan reload mengembalikan tampilan yang sama.
    const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
    const [industry, setIndustry] = useState(
        () => searchParams.get("industri") ?? "all"
    );
    const [ownership, setOwnership] = useState(
        () => searchParams.get("tipe") ?? "all"
    );
    const [currentPage, setCurrentPage] = useState(() =>
        readPage(searchParams.get("page"))
    );
    const [pageSize, setPageSize] = useState(() =>
        readPageSize(searchParams.get("per"))
    );

    const [companies, setCompanies] = useState<Company[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [useSupabase, setUseSupabase] = useState(true);

    const urlSignature = searchParams.toString();
    const lastWrittenSignature = useRef<string | null>(null);

    // Reset halaman ke 1 saat filter berubah — tapi jangan saat mount,
    // agar deep link seperti ?industry=bank&page=2 tetap bekerja.
    const filterSignature = `${query}\u0000${industry}\u0000${ownership}\u0000${pageSize}`;
    const lastFilterSignature = useRef(filterSignature);
    useEffect(() => {
        if (lastFilterSignature.current === filterSignature) return;
        lastFilterSignature.current = filterSignature;
        setCurrentPage(1);
    }, [filterSignature]);

    // URL -> state (menangani tombol Back/Forward). Dilewati kalau URL
    // yang masuk persis hasil tulis kita sendiri.
    useEffect(() => {
        if (lastWrittenSignature.current === urlSignature) return;

        const urlQuery = searchParams.get("q") ?? "";
        const urlIndustry = searchParams.get("industri") ?? "all";
        const urlOwnership = searchParams.get("tipe") ?? "all";
        const urlPage = readPage(searchParams.get("page"));
        const urlPageSize = readPageSize(searchParams.get("per"));

        setQuery((prev) => (prev === urlQuery ? prev : urlQuery));
        setIndustry((prev) => (prev === urlIndustry ? prev : urlIndustry));
        setOwnership((prev) => (prev === urlOwnership ? prev : urlOwnership));
        setCurrentPage((prev) => (prev === urlPage ? prev : urlPage));
        setPageSize((prev) => (prev === urlPageSize ? prev : urlPageSize));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlSignature]);

    // State -> URL, di-debounce 300 ms supaya mengetik tidak membanjiri history.
    useEffect(() => {
        const params = new URLSearchParams();
        const trimmedQuery = query.trim();
        if (trimmedQuery) params.set("q", trimmedQuery);
        if (industry !== "all") params.set("industri", industry);
        if (ownership !== "all") params.set("tipe", ownership);
        if (currentPage > 1) params.set("page", String(currentPage));
        if (pageSize !== DEFAULT_PAGE_SIZE) params.set("per", String(pageSize));

        const qs = params.toString();
        if (qs === urlSignature) return;

        const timer = setTimeout(() => {
            lastWrittenSignature.current = qs;
            router.replace(
                `${pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
                { scroll: false }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [
        query,
        industry,
        ownership,
        currentPage,
        pageSize,
        pathname,
        router,
        urlSignature,
    ]);

    // Fetch paginated data from Supabase (or fallback to mock)
    useEffect(() => {
        let cancelled = false;

        async function fetchCompanies() {
            setLoading(true);
            try {
                if (useSupabase) {
                    const { data, count } = await searchCompaniesPaginated(
                        query.trim() || undefined,
                        industry,
                        ownership,
                        currentPage,
                        pageSize
                    );
                    if (!cancelled) {
                        if (count > 0 || query || industry !== "all" || ownership !== "all") {
                            setCompanies(data);
                            setTotalCount(count);
                        } else if (data.length === 0 && count === 0 && !query && industry === "all" && ownership === "all") {
                            // Supabase empty, fall back to mock
                            setUseSupabase(false);
                            const mock = mockSearch(query, industry, ownership);
                            setCompanies(mock.slice(0, pageSize));
                            setTotalCount(mock.length);
                        }
                    }
                } else {
                    if (!cancelled) {
                        const mock = mockSearch(query, industry, ownership);
                        const from = (currentPage - 1) * pageSize;
                        setCompanies(mock.slice(from, from + pageSize));
                        setTotalCount(mock.length);
                    }
                }
            } catch {
                if (!cancelled) {
                    setUseSupabase(false);
                    const mock = mockSearch(query, industry, ownership);
                    const from = (currentPage - 1) * pageSize;
                    setCompanies(mock.slice(from, from + pageSize));
                    setTotalCount(mock.length);
                }
            }
            if (!cancelled) setLoading(false);
        }

        const debounce = setTimeout(fetchCompanies, 300);
        return () => {
            cancelled = true;
            clearTimeout(debounce);
        };
    }, [query, industry, ownership, currentPage, pageSize, useSupabase]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
                    resultCount={totalCount}
                    loading={loading}
                />

                {loading ? (
                    <div className="mt-16 flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Memuat data perusahaan...</span>
                    </div>
                ) : companies.length > 0 ? (
                    <>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                        {/* Pagination Controls */}
                        {totalCount > pageSize && (
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Tampilkan</span>
                                    <Select
                                        value={pageSize.toString()}
                                        onValueChange={(val) => {
                                            const next = readPageSize(val);
                                            setPageSize(next);
                                            setCurrentPage(1);
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
                                        <span className="ml-2 text-xs">({totalCount} perusahaan)</span>
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
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
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