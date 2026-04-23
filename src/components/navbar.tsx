"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const linkClass = scrolled
        ? "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        : "text-sm font-medium text-zinc-300 transition-colors hover:text-white";

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? "glass border-b py-0" 
                    : "bg-transparent border-b-transparent py-2"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            alt="Temu Karir"
                            width={36}
                            height={36}
                            className="rounded-lg transition-transform group-hover:scale-105"
                        />
                        <span className="text-xl font-bold gradient-text">Temu Karir</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className={linkClass}>
                            Beranda
                        </Link>
                        <Link href="/#direktori" className={linkClass}>
                            Direktori
                        </Link>
                        <Link href="/#tentang" className={linkClass}>
                            Tentang
                        </Link>
                        <Link href="/submit" className={`${linkClass} flex items-center gap-1`}>
                            <Plus className="h-3.5 w-3.5" />
                            Ajukan
                        </Link>
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className={scrolled 
                                ? "border-primary/30 text-primary hover:bg-primary/10" 
                                : "border-white/30 text-white hover:bg-white/10"
                            }
                        >
                            <a
                                href="https://inh-or-id.myr.id/donate/hangatkan-gaza"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="mr-1.5 text-sm leading-none">🇵🇸</span>
                                Donasi
                            </a>
                        </Button>
                        <div className={`border-l pl-6 ${scrolled ? "border-border" : "border-white/20"}`}>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`rounded-lg p-2 transition-colors ${
                                scrolled 
                                    ? "text-muted-foreground hover:bg-accent hover:text-foreground" 
                                    : "text-white hover:bg-white/10"
                            }`}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className={`md:hidden border-t py-4 space-y-3 animate-fade-in-up ${scrolled ? "glass" : "bg-zinc-950/90 backdrop-blur-md rounded-b-2xl border-white/10"}`}>
                        <Link
                            href="/"
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                scrolled ? "text-muted-foreground hover:bg-accent hover:text-foreground" : "text-zinc-300 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/#direktori"
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                scrolled ? "text-muted-foreground hover:bg-accent hover:text-foreground" : "text-zinc-300 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            Direktori
                        </Link>
                        <Link
                            href="/#tentang"
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                scrolled ? "text-muted-foreground hover:bg-accent hover:text-foreground" : "text-zinc-300 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            Tentang
                        </Link>
                        <Link
                            href="/submit"
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                scrolled ? "text-muted-foreground hover:bg-accent hover:text-foreground" : "text-zinc-300 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            Ajukan Perusahaan
                        </Link>
                        <div className="px-3 pt-2">
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className={`w-full ${
                                    scrolled 
                                        ? "border-primary/30 text-primary hover:bg-primary/10" 
                                        : "border-white/30 text-white hover:bg-white/10"
                                }`}
                            >
                                <a
                                    href="https://inh-or-id.myr.id/donate/hangatkan-gaza"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="mr-1.5 text-sm leading-none">🇵🇸</span>
                                    Donasi
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
