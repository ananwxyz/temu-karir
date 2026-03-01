"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock login — in production, this would use Supabase Auth
        await new Promise((r) => setTimeout(r, 1000));

        if (email === "admin@temukarir.com" && password === "Temukarir888") {
            localStorage.setItem("tk_admin", "true");
            toast.success("Login berhasil!");
            router.push("/admin/dashboard");
        } else {
            toast.error("Email atau password salah");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                        <Briefcase className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Masuk untuk mengelola direktori perusahaan
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="rounded-xl border bg-card p-6 sm:p-8 space-y-5 shadow-sm"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@contoh.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-11 rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-11 rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 rounded-lg text-base"
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </Button>

                </form>
            </div>
        </div>
    );
}
