"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Briefcase,
    CheckCircle2,
    AlertTriangle,
    Plus,
    Pencil,
    Trash2,
    LogOut,
    ExternalLink,
    Search,
    BarChart3,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FreelancePlatform, FREELANCE_CATEGORIES, PAYMENT_TYPES, FreelanceCategory, PaymentType } from "@/lib/freelance-types";
import { freelanceData as mockFreelance } from "@/lib/freelance-data";

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function AdminFreelance() {
    const router = useRouter();
    const [platforms, setPlatforms] = useState<FreelancePlatform[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState<FreelancePlatform | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isAdmin = localStorage.getItem("tk_admin");
        if (!isAdmin) {
            router.push("/admin/login");
            return;
        }

        setPlatforms([...mockFreelance]);
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("tk_admin");
        router.push("/admin/login");
    };

    const stats = {
        total: platforms.length,
        active: platforms.filter((c) => c.status === "ACTIVE").length,
        flagged: platforms.filter((c) => c.status === "FLAGGED").length,
    };

    const filteredPlatforms = platforms.filter((c) => {
        const matchSearch =
            !search || c.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            filterStatus === "all" || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleAdd = async (formData: FormData) => {
        const platformData = {
            name: formData.get("name") as string,
            slug: slugify(formData.get("name") as string),
            category: formData.get("category") as FreelanceCategory,
            payment_type: formData.get("payment_type") as PaymentType,
            platform_url: formData.get("platform_url") as string,
            status: "ACTIVE" as const,
        };

        const newPlatform: FreelancePlatform = {
            ...platformData,
            id: Date.now().toString(),
        };
        setPlatforms((prev) => [newPlatform, ...prev]);
        toast.success(`${newPlatform.name} berhasil ditambahkan`);
        setIsAddOpen(false);
    };

    const handleEdit = async (formData: FormData) => {
        if (!editingPlatform) return;

        const updates = {
            name: formData.get("name") as string,
            slug: slugify(formData.get("name") as string),
            category: formData.get("category") as FreelanceCategory,
            payment_type: formData.get("payment_type") as PaymentType,
            platform_url: formData.get("platform_url") as string,
        };

        setPlatforms((prev) =>
            prev.map((c) =>
                c.id === editingPlatform.id
                    ? { ...c, ...updates }
                    : c
            )
        );
        toast.success("Platform berhasil diperbarui");
        setIsEditOpen(false);
        setEditingPlatform(null);
    };

    const handleDelete = async (platform: FreelancePlatform) => {
        if (!confirm(`Hapus ${platform.name}?`)) return;

        setPlatforms((prev) => prev.filter((c) => c.id !== platform.id));
        toast.success(`${platform.name} berhasil dihapus`);
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground">Memuat data...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Admin Freelance
                                <Badge variant="outline" className="text-xs font-normal text-amber-500 border-amber-500/30">
                                    Mock Data
                                </Badge>
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Kelola direktori platform freelance
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="text-muted-foreground"
                    >
                        <LogOut className="mr-1.5 h-3.5 w-3.5" />
                        Keluar
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                                <p className="text-xs text-muted-foreground">Aktif</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.flagged}</p>
                                <p className="text-xs text-muted-foreground">Flagged</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex gap-3 flex-1 w-full sm:w-auto">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari platform..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-10 rounded-lg"
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[150px] h-10 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="ACTIVE">Aktif</SelectItem>
                                <SelectItem value="FLAGGED">Flagged</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" className="rounded-lg bg-primary/5 border-primary/20 text-primary hover:bg-primary/10">
                            <Link href="/admin/dashboard">
                                <BarChart3 className="mr-1.5 h-4 w-4" />
                                Kembali ke Perusahaan
                            </Link>
                        </Button>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-lg">
                                    <Plus className="mr-1.5 h-4 w-4" />
                                    Tambah Platform
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Tambah Platform Baru</DialogTitle>
                                </DialogHeader>
                                <PlatformForm onSubmit={handleAdd} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px]">Platform</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Tipe Pembayaran</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlatforms.map((platform) => (
                                <TableRow key={platform.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs overflow-hidden border shrink-0">
                                                {platform.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{platform.name}</p>
                                                <a
                                                    href={platform.platform_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                                >
                                                    Web
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {platform.category}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs font-normal">
                                            {platform.payment_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {platform.status === "ACTIVE" ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs">
                                                Aktif
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-amber-600 border-amber-400 dark:text-amber-400 text-xs">
                                                Flagged
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                onClick={() => {
                                                    setEditingPlatform(platform);
                                                    setIsEditOpen(true);
                                                }}
                                                title="Edit"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDelete(platform)}
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredPlatforms.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        Tidak ada platform freelance ditemukan
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Platform Freelance</DialogTitle>
                    </DialogHeader>
                    {editingPlatform && (
                        <PlatformForm onSubmit={handleEdit} initialData={editingPlatform} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function PlatformForm({
    onSubmit,
    initialData,
}: {
    onSubmit: (data: FormData) => void;
    initialData?: FreelancePlatform;
}) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(new FormData(e.currentTarget));
            }}
            className="space-y-4"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium">
                        Nama Platform *
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="platform_url" className="text-xs font-medium">
                        URL Platform *
                    </Label>
                    <Input
                        id="platform_url"
                        name="platform_url"
                        type="url"
                        defaultValue={initialData?.platform_url}
                        required
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-medium">
                        Kategori *
                    </Label>
                    <select
                        id="category"
                        name="category"
                        defaultValue={initialData?.category || "General Freelance"}
                        required
                        className="w-full h-9 rounded-lg border bg-background px-3 text-sm"
                    >
                        {FREELANCE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="payment_type" className="text-xs font-medium">
                        Tipe Pembayaran *
                    </Label>
                    <select
                        id="payment_type"
                        name="payment_type"
                        defaultValue={initialData?.payment_type || "Bebas"}
                        required
                        className="w-full h-9 rounded-lg border bg-background px-3 text-sm"
                    >
                        {PAYMENT_TYPES.map((o) => (
                            <option key={o} value={o}>
                                {o}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" className="rounded-lg">
                    {initialData ? "Simpan Perubahan" : "Tambahkan Platform"}
                </Button>
            </div>
        </form>
    );
}
