import Link from "next/link";
import Image from "next/image";
import { Heart, Github, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Temu Karir"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-lg font-bold gradient-text">Temu Karir</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Direktori halaman karir resmi perusahaan Indonesia. Melamar
                            langsung ke sumber resmi, aman dan terverifikasi otomatis.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Navigasi</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#direktori"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Direktori Perusahaan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#tentang"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Tentang Kami
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Dukungan</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Temu Karir adalah proyek gratis dan open-source. Bantu kami tetap
                            berjalan dengan donasi.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://saweria.co/temukarir"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                            >
                                <Heart className="h-3.5 w-3.5" />
                                Donasi
                            </a>
                            <a
                                href="mailto:hello@temukarir.com"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Mail className="h-3.5 w-3.5" />
                                Kontak
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Temu Karir. Dibuat dengan{" "}
                        <Heart className="inline h-3 w-3 text-primary" /> di Indonesia.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
