"use client";

import { Search, SlidersHorizontal, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FREELANCE_CATEGORIES, PAYMENT_TYPES } from "@/lib/freelance-types";

interface FreelanceSearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    category: string;
    onCategoryChange: (category: string) => void;
    paymentType: string;
    onPaymentTypeChange: (paymentType: string) => void;
    resultCount: number;
}

export function FreelanceSearchBar({
    query,
    onQueryChange,
    category,
    onCategoryChange,
    paymentType,
    onPaymentTypeChange,
    resultCount,
}: FreelanceSearchBarProps) {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Cari platform freelance... (contoh: Upwork, Fiverr)"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="h-14 pl-12 pr-4 text-base rounded-xl border-border/50 bg-card shadow-sm focus:border-primary/50 focus:ring-primary/20"
                    id="search-freelance"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter:</span>
                </div>
                <div className="flex flex-wrap gap-3 flex-1">
                    <Select value={category} onValueChange={onCategoryChange}>
                        <SelectTrigger
                            className="w-full sm:w-[220px] h-10 rounded-lg bg-card border-border/50"
                            id="filter-category"
                        >
                            <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {FREELANCE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={paymentType} onValueChange={onPaymentTypeChange}>
                        <SelectTrigger
                            className="w-full sm:w-[160px] h-10 rounded-lg bg-card border-border/50"
                            id="filter-payment"
                        >
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            {PAYMENT_TYPES.map((o) => (
                                <SelectItem key={o} value={o}>
                                    {o}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-sm text-muted-foreground whitespace-nowrap hidden md:block">
                    <span className="font-semibold text-foreground">{resultCount}</span>{" "}
                    platform ditemukan
                </p>
            </div>
        </div>
    );
}
