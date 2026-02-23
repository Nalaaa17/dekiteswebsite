"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ShoppingBag, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Kamar", href: "/#kamar" },
        { name: "Fasilitas", href: "/fasilitas" },
    ];

    const isHeroBackgroundPage = pathname === "/" || pathname === "/profil" || pathname.startsWith("/kamar/");
    const forceSolidNav = !isHeroBackgroundPage;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 md:px-16 ${isScrolled || forceSolidNav
                    ? "bg-white/95 backdrop-blur-md shadow-sm text-slate-900 border-b border-slate-100"
                    : "bg-transparent text-white"
                }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* --- LOGO --- */}
                <Link href="/" className="group">
                    <h1 className="text-2xl md:text-3xl font-serif tracking-tighter transition-all group-hover:tracking-widest">
                        DE'KITES
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-light text-center">Premium Living</p>
                </Link>

                {/* --- DESKTOP MENU --- */}
                <div className="hidden md:flex items-center space-x-10 text-sm uppercase tracking-widest font-light">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="hover:opacity-60 transition">
                            {link.name}
                        </Link>
                    ))}

                    {!isPending && (
                        <>
                            {session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-200">
                                            <User className="h-5 w-5 text-slate-900" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {/* --- LINK PROFIL --- */}
                                        <DropdownMenuItem asChild>
                                            <Link href="/profil" className="cursor-pointer flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profil Saya</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href="/keranjang" className="cursor-pointer flex items-center">
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                <span>Keranjang Saya</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href="/pesanan" className="cursor-pointer flex items-center">
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                <span>Pesanan Kamar</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        {/* --- LINK ADMIN DASHBOARD (Pengecekan Role) --- */}
                                        {(session.user as any).role === "admin" && (
                                            <DropdownMenuItem asChild className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50">
                                                <Link href="/admin/dashboard" className="cursor-pointer flex items-center">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Dashboard Admin</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600 cursor-pointer flex items-center"
                                            onClick={async () => await authClient.signOut()}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Keluar</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login">
                                    <Button variant={isScrolled ? "outline" : "secondary"} className="rounded-none px-8 py-5">
                                        MASUK
                                    </Button>
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* --- MOBILE BUTTON --- */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU OVERLAY --- */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white text-slate-900 flex flex-col items-center space-y-6 py-10 shadow-xl md:hidden">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-light tracking-widest uppercase">
                            {link.name}
                        </Link>
                    ))}
                    {session ? (
                        <>
                            <Link
                                href="/profil"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-light tracking-widest uppercase border-t border-slate-100 pt-6 w-3/4 text-center"
                            >
                                Profil Saya
                            </Link>
                            <Link href="/keranjang" onClick={() => setIsOpen(false)} className="text-lg font-light tracking-widest uppercase">
                                Keranjang Saya
                            </Link>
                            <Link href="/pesanan" onClick={() => setIsOpen(false)} className="text-lg font-light tracking-widest uppercase border-b border-slate-100 pb-6 w-3/4 text-center">
                                Pesanan Saya
                            </Link>

                            {/* --- MUNCUL DI MOBILE JUGA JIKA ADMIN --- */}
                            {(session.user as any).role === "admin" && (
                                <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium text-emerald-600 tracking-widest uppercase">
                                    Dashboard Admin
                                </Link>
                            )}

                            <Button variant="destructive" onClick={() => authClient.signOut()} className="w-3/4 rounded-none">KELUAR</Button>
                        </>
                    ) : (
                        <Link href="/login" className="w-full px-10">
                            <Button className="w-full rounded-none py-6 tracking-widest">MASUK</Button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}