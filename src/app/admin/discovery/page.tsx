"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    Loader2,
    CheckCircle2,
    XCircle,
    Globe,
    ExternalLink,
    Trash2,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface DiscoveryResult {
    domain: string;
    discovered_url: string | null;
    method: string | null;
    status_code: number | null;
    is_active: boolean;
    error?: string;
}

interface DiscoveryRecord {
    id: string;
    domain: string;
    discovered_url: string | null;
    method: string | null;
    status_code: number | null;
    is_active: boolean;
    fail_count: number;
    last_checked: string | null;
    created_at: string;
}

export default function DiscoveryPage() {
    const router = useRouter();
    const [domainInput, setDomainInput] = useState("");
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState<DiscoveryResult[]>([]);
    const [history, setHistory] = useState<DiscoveryRecord[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        const isAdmin = localStorage.getItem("tk_admin");
        if (!isAdmin) {
            router.push("/admin/login");
            return;
        }
        fetchHistory();
    }, [router]);

    async function fetchHistory() {
        try {
            const res = await fetch("/api/discovery");
            const data = await res.json();
            if (data.success && data.data) {
                setHistory(data.data);
            }
        } catch {
            // ignore
        }
        setLoadingHistory(false);
    }

    async function handleScan() {
        const lines = domainInput
            .split(/[\n,;]+/)
            .map((d) => d.trim())
            .filter((d) => d.length > 0 && d.includes("."));

        if (lines.length === 0) {
            toast.error("Masukkan minimal 1 domain");
            return;
        }

        if (lines.length > 10) {
            toast.error("Maksimal 10 domain per scan untuk menghindari timeout");
            return;
        }

        setScanning(true);
        setResults([]);
        toast.info(`Scanning ${lines.length} domain...`, { duration: 5000 });

        try {
            const res = await fetch("/api/discovery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domains: lines, concurrency: 3 }),
            });

            const data = await res.json();

            if (data.success) {
                setResults(data.results);
                const found = data.results.filter((r: DiscoveryResult) => r.discovered_url).length;
                toast.success(`Selesai! ${found}/${data.results.length} domain ditemukan`);
                fetchHistory();
            } else {
                toast.error(data.error || "Scan gagal");
            }
        } catch (err) {
            toast.error("Request timeout atau gagal. Coba kurangi jumlah domain.");
        }

        setScanning(false);
    }

    function getMethodBadge(method: string | null) {
        if (!method) return null;
        const colors: Record<string, string> = {
            path_scan: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            subdomain_scan: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
            homepage_extraction: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
        const labels: Record<string, string> = {
            path_scan: "Path",
            subdomain_scan: "Subdomain",
            homepage_extraction: "Homepage",
        };
        return (
            <Badge className={`${colors[method] || ""} text-xs font-normal`}>
                {labels[method] || method}
            </Badge>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50">
                <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-3">
                    <Link
                        href="/admin/dashboard"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Career Discovery
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Scan domain perusahaan untuk menemukan halaman karir otomatis
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {/* Scan Form */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <div>
                        <h2 className="font-semibold text-foreground mb-1">Scan Domain</h2>
                        <p className="text-xs text-muted-foreground">
                            Masukkan domain perusahaan (1 per baris, maks 10). Worker akan
                            otomatis cari halaman karir via path scan, subdomain scan, dan
                            homepage extraction.
                        </p>
                    </div>

                    <Textarea
                        placeholder={`Contoh:\nhokben.co.id\npizzahut.co.id\nkopikenangan.com`}
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value)}
                        rows={5}
                        className="rounded-lg font-mono text-sm"
                        disabled={scanning}
                    />

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {domainInput
                                .split(/[\n,;]+/)
                                .filter((d) => d.trim().length > 0 && d.includes(".")).length}{" "}
                            domain terdeteksi
                        </p>
                        <Button
                            onClick={handleScan}
                            disabled={scanning}
                            className="rounded-lg"
                        >
                            {scanning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Mulai Scan
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Scan Results */}
                {results.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="px-5 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-foreground">
                                Hasil Scan
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    {results.filter((r) => r.discovered_url).length} ditemukan
                                </span>
                                <span className="flex items-center gap-1">
                                    <XCircle className="h-3 w-3 text-red-500" />
                                    {results.filter((r) => !r.discovered_url).length} gagal
                                </span>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Domain</TableHead>
                                    <TableHead>URL Karir</TableHead>
                                    <TableHead>Metode</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((r) => (
                                    <TableRow key={r.domain}>
                                        <TableCell className="font-mono text-xs">
                                            {r.domain}
                                        </TableCell>
                                        <TableCell>
                                            {r.discovered_url ? (
                                                <a
                                                    href={r.discovered_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1 max-w-[300px] truncate"
                                                >
                                                    {r.discovered_url}
                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{getMethodBadge(r.method)}</TableCell>
                                        <TableCell>
                                            {r.discovered_url ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-400" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* History */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="px-5 py-3 border-b">
                        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            Riwayat Scan
                        </h3>
                    </div>

                    {loadingHistory ? (
                        <div className="py-10 flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Memuat riwayat...</span>
                        </div>
                    ) : history.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Domain</TableHead>
                                    <TableHead>URL Karir</TableHead>
                                    <TableHead>Metode</TableHead>
                                    <TableHead>Aktif</TableHead>
                                    <TableHead>Terakhir Dicek</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-mono text-xs">
                                            {r.domain}
                                        </TableCell>
                                        <TableCell>
                                            {r.discovered_url ? (
                                                <a
                                                    href={r.discovered_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1 max-w-[300px] truncate"
                                                >
                                                    {r.discovered_url}
                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Tidak ditemukan</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{getMethodBadge(r.method)}</TableCell>
                                        <TableCell>
                                            {r.is_active ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-400" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {r.last_checked
                                                ? new Date(r.last_checked).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            Belum ada riwayat scan. Mulai scan domain di atas!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
