"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Building2,
    CheckCircle2,
    AlertTriangle,
    Plus,
    Pencil,
    Trash2,
    RefreshCcw,
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
import { Textarea } from "@/components/ui/textarea";
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
import { Company, INDUSTRIES, CITIES, Industry } from "@/lib/types";
import { companies as mockCompanies } from "@/lib/data";
import {
    getCompanies as getSupabaseCompanies,
    createCompany as supabaseCreate,
    updateCompany as supabaseUpdate,
    deleteCompany as supabaseDelete,
    validateCompany as supabaseValidate,
} from "@/lib/supabase";

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function AdminDashboard() {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [useSupabase, setUseSupabase] = useState(true);

    useEffect(() => {
        const isAdmin = localStorage.getItem("tk_admin");
        if (!isAdmin) {
            router.push("/admin/login");
            return;
        }

        async function fetchData() {
            try {
                const data = await getSupabaseCompanies();
                if (data.length > 0) {
                    setCompanies(data);
                } else {
                    setUseSupabase(false);
                    setCompanies([...mockCompanies]);
                }
            } catch {
                setUseSupabase(false);
                setCompanies([...mockCompanies]);
            }
            setLoading(false);
        }
        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("tk_admin");
        router.push("/admin/login");
    };

    const stats = {
        total: companies.length,
        active: companies.filter((c) => c.status === "ACTIVE").length,
        flagged: companies.filter((c) => c.status === "FLAGGED").length,
    };

    const filteredCompanies = companies.filter((c) => {
        const matchSearch =
            !search || c.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            filterStatus === "all" || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleAdd = async (formData: FormData) => {
        const companyData = {
            name: formData.get("name") as string,
            slug: slugify(formData.get("name") as string),
            industry: formData.get("industry") as Industry,
            city: formData.get("city") as string,
            description: formData.get("description") as string,
            career_url: formData.get("career_url") as string,
            hash_signature: null,
            email: (formData.get("email") as string) || null,
            phone: (formData.get("phone") as string) || null,
            linkedin_url: (formData.get("linkedin_url") as string) || null,
            whatsapp: (formData.get("whatsapp") as string) || null,
            maps_url: (formData.get("maps_url") as string) || null,
            instagram_url: (formData.get("instagram_url") as string) || null,
            status: "ACTIVE" as const,
            last_verified_at: null,
        };

        if (useSupabase) {
            const result = await supabaseCreate(companyData);
            if (result) {
                setCompanies((prev) => [result, ...prev]);
                toast.success(`${result.name} berhasil ditambahkan`);
            } else {
                toast.error("Gagal menambahkan perusahaan");
            }
        } else {
            const newCompany: Company = {
                ...companyData,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setCompanies((prev) => [newCompany, ...prev]);
            toast.success(`${newCompany.name} berhasil ditambahkan`);
        }
        setIsAddOpen(false);
    };

    const handleEdit = async (formData: FormData) => {
        if (!editingCompany) return;

        const updates = {
            name: formData.get("name") as string,
            slug: slugify(formData.get("name") as string),
            industry: formData.get("industry") as Industry,
            city: formData.get("city") as string,
            description: formData.get("description") as string,
            career_url: formData.get("career_url") as string,
            email: (formData.get("email") as string) || null,
            phone: (formData.get("phone") as string) || null,
            linkedin_url: (formData.get("linkedin_url") as string) || null,
            whatsapp: (formData.get("whatsapp") as string) || null,
            maps_url: (formData.get("maps_url") as string) || null,
            instagram_url: (formData.get("instagram_url") as string) || null,
        };

        if (useSupabase) {
            const result = await supabaseUpdate(editingCompany.id, updates);
            if (result) {
                setCompanies((prev) => prev.map((c) => (c.id === editingCompany.id ? result : c)));
                toast.success("Perusahaan berhasil diperbarui");
            } else {
                toast.error("Gagal memperbarui perusahaan");
            }
        } else {
            setCompanies((prev) =>
                prev.map((c) =>
                    c.id === editingCompany.id
                        ? { ...c, ...updates, updated_at: new Date().toISOString() }
                        : c
                )
            );
            toast.success("Perusahaan berhasil diperbarui");
        }
        setIsEditOpen(false);
        setEditingCompany(null);
    };

    const handleDelete = async (company: Company) => {
        if (!confirm(`Hapus ${company.name}?`)) return;

        if (useSupabase) {
            const success = await supabaseDelete(company.id);
            if (success) {
                setCompanies((prev) => prev.filter((c) => c.id !== company.id));
                toast.success(`${company.name} berhasil dihapus`);
            } else {
                toast.error("Gagal menghapus perusahaan");
            }
        } else {
            setCompanies((prev) => prev.filter((c) => c.id !== company.id));
            toast.success(`${company.name} berhasil dihapus`);
        }
    };

    const handleValidate = (company: Company) => {
        toast.promise(
            (async () => {
                await new Promise((r) => setTimeout(r, 2000));
                const hash = `hash_${Date.now()}`;
                if (useSupabase) {
                    await supabaseValidate(company.id, hash);
                }
                setCompanies((prev) =>
                    prev.map((c) =>
                        c.id === company.id
                            ? {
                                ...c,
                                status: "ACTIVE" as const,
                                last_verified_at: new Date().toISOString(),
                                hash_signature: hash,
                            }
                            : c
                    )
                );
            })(),
            {
                loading: `Memvalidasi ${company.name}...`,
                success: `${company.name} berhasil divalidasi`,
                error: "Validasi gagal",
            }
        );
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
                            href="/"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Admin Dashboard
                                {!useSupabase && (
                                    <Badge variant="outline" className="text-xs font-normal text-amber-500 border-amber-500/30">
                                        Mock Data
                                    </Badge>
                                )}
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Kelola direktori perusahaan
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total Perusahaan</p>
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
                                <p className="text-xs text-muted-foreground">Aktif & Terverifikasi</p>
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
                                <p className="text-xs text-muted-foreground">Perlu Tinjauan</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flagged Alert */}
                {stats.flagged > 0 && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                {stats.flagged} perusahaan memerlukan tinjauan
                            </p>
                            <p className="text-xs text-amber-600/80 dark:text-amber-400/60">
                                Data ini ditandai karena validasi otomatis gagal. Periksa dan perbarui URL karir.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 shrink-0"
                            onClick={() => setFilterStatus("FLAGGED")}
                        >
                            Lihat
                        </Button>
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex gap-3 flex-1 w-full sm:w-auto">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari perusahaan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-10 rounded-lg"
                                id="admin-search"
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[150px] h-10 rounded-lg" id="admin-filter-status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="ACTIVE">Aktif</SelectItem>
                                <SelectItem value="FLAGGED">Flagged</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-lg" id="btn-add-company">
                                <Plus className="mr-1.5 h-4 w-4" />
                                Tambah Perusahaan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tambah Perusahaan Baru</DialogTitle>
                            </DialogHeader>
                            <CompanyForm onSubmit={handleAdd} />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px]">Perusahaan</TableHead>
                                <TableHead>Industri</TableHead>
                                <TableHead>Kota</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Terakhir Diverifikasi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCompanies.map((company) => (
                                <TableRow key={company.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs overflow-hidden border shrink-0">
                                                {company.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{company.name}</p>
                                                <a
                                                    href={company.career_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                                >
                                                    Halaman Karir
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {company.industry}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {company.city}
                                    </TableCell>
                                    <TableCell>
                                        {company.status === "ACTIVE" ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs">
                                                Aktif
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-amber-600 border-amber-400 dark:text-amber-400 text-xs">
                                                Flagged
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {company.last_verified_at
                                            ? new Date(company.last_verified_at).toLocaleDateString(
                                                "id-ID",
                                                { day: "numeric", month: "short", year: "numeric" }
                                            )
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                onClick={() => handleValidate(company)}
                                                title="Validasi Sekarang"
                                            >
                                                <RefreshCcw className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                onClick={() => {
                                                    setEditingCompany(company);
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
                                                onClick={() => handleDelete(company)}
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredCompanies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Tidak ada perusahaan ditemukan
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Perusahaan</DialogTitle>
                    </DialogHeader>
                    {editingCompany && (
                        <CompanyForm onSubmit={handleEdit} initialData={editingCompany} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function CompanyForm({
    onSubmit,
    initialData,
}: {
    onSubmit: (data: FormData) => void;
    initialData?: Company;
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
                        Nama Perusahaan *
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
                    <Label htmlFor="career_url" className="text-xs font-medium">
                        URL Karir *
                    </Label>
                    <Input
                        id="career_url"
                        name="career_url"
                        type="url"
                        defaultValue={initialData?.career_url}
                        required
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="industry" className="text-xs font-medium">
                        Industri *
                    </Label>
                    <select
                        id="industry"
                        name="industry"
                        defaultValue={initialData?.industry || "Technology"}
                        required
                        className="w-full h-9 rounded-lg border bg-background px-3 text-sm"
                    >
                        {INDUSTRIES.map((ind) => (
                            <option key={ind} value={ind}>
                                {ind}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-medium">
                        Kota *
                    </Label>
                    <select
                        id="city"
                        name="city"
                        defaultValue={initialData?.city || "Jakarta"}
                        required
                        className="w-full h-9 rounded-lg border bg-background px-3 text-sm"
                    >
                        {CITIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium">
                    Deskripsi *
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={initialData?.description}
                    required
                    rows={2}
                    className="rounded-lg text-sm"
                />
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={initialData?.email || ""}
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium">
                        Telepon
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        defaultValue={initialData?.phone || ""}
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="linkedin_url" className="text-xs font-medium">
                        LinkedIn URL
                    </Label>
                    <Input
                        id="linkedin_url"
                        name="linkedin_url"
                        type="url"
                        defaultValue={initialData?.linkedin_url || ""}
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="whatsapp" className="text-xs font-medium">
                        WhatsApp
                    </Label>
                    <Input
                        id="whatsapp"
                        name="whatsapp"
                        defaultValue={initialData?.whatsapp || ""}
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="maps_url" className="text-xs font-medium">
                        Google Maps URL
                    </Label>
                    <Input
                        id="maps_url"
                        name="maps_url"
                        type="url"
                        defaultValue={initialData?.maps_url || ""}
                        className="h-9 rounded-lg text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="instagram_url" className="text-xs font-medium">
                        Instagram URL
                    </Label>
                    <Input
                        id="instagram_url"
                        name="instagram_url"
                        type="url"
                        defaultValue={initialData?.instagram_url || ""}
                        className="h-9 rounded-lg text-sm"
                    />
                </div>

            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="submit" className="rounded-lg">
                    {initialData ? "Simpan Perubahan" : "Tambah Perusahaan"}
                </Button>
            </div>
        </form>
    );
}
