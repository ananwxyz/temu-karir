"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="glass sticky top-0 z-50 border-b">
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
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/#direktori"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Direktori
                        </Link>
                        <Link
                            href="/#tentang"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Tentang
                        </Link>
                        <Link
                            href="/submit"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Ajukan
                        </Link>
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                            <a
                                href="https://saweria.co/temukarir"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Heart className="mr-1.5 h-3.5 w-3.5" />
                                Donasi
                            </a>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="md:hidden border-t py-4 space-y-3 animate-fade-in-up">
                        <Link
                            href="/"
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/#direktori"
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Direktori
                        </Link>
                        <Link
                            href="/#tentang"
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Tentang
                        </Link>
                        <Link
                            href="/submit"
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Ajukan Perusahaan
                        </Link>
                        <div className="px-3 pt-2">
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="w-full border-primary/30 text-primary hover:bg-primary/10"
                            >
                                <a
                                    href="https://saweria.co/temukarir"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Heart className="mr-1.5 h-3.5 w-3.5" />
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
