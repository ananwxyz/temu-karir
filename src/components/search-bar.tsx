"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { INDUSTRIES, OWNERSHIP_TYPES } from "@/lib/types";

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    industry: string;
    onIndustryChange: (industry: string) => void;
    ownership: string;
    onOwnershipChange: (ownership: string) => void;
    resultCount: number;
}

export function SearchBar({
    query,
    onQueryChange,
    industry,
    onIndustryChange,
    ownership,
    onOwnershipChange,
    resultCount,
}: SearchBarProps) {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Cari perusahaan... (contoh: Tokopedia, BCA, Gojek)"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="h-14 pl-12 pr-4 text-base rounded-xl border-border/50 bg-card shadow-sm focus:border-primary/50 focus:ring-primary/20"
                    id="search-company"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter:</span>
                </div>
                <div className="flex flex-wrap gap-3 flex-1">
                    <Select value={industry} onValueChange={onIndustryChange}>
                        <SelectTrigger
                            className="w-full sm:w-[220px] h-10 rounded-lg bg-card border-border/50"
                            id="filter-industry"
                        >
                            <SelectValue placeholder="Semua Industri" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Industri</SelectItem>
                            {INDUSTRIES.map((ind) => (
                                <SelectItem key={ind} value={ind}>
                                    {ind}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={ownership} onValueChange={onOwnershipChange}>
                        <SelectTrigger
                            className="w-full sm:w-[160px] h-10 rounded-lg bg-card border-border/50"
                            id="filter-ownership"
                        >
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            {OWNERSHIP_TYPES.map((o) => (
                                <SelectItem key={o} value={o}>
                                    {o}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    <span className="font-semibold text-foreground">{resultCount}</span>{" "}
                    perusahaan ditemukan
                </p>
            </div>
        </div>
    );
}
