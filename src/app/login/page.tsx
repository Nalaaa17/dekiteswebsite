"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await authClient.signIn.email({
            email,
            password,
            callbackURL: "/", // Setelah login balik ke beranda
        }, {
            onError: (ctx) => {
                alert(ctx.error.message || "Gagal masuk. Periksa kembali email dan password Anda.");
                setLoading(false);
            },
            onSuccess: (ctx) => {
                if ((ctx.data.user as any).role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");
                }
                router.refresh();
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* --- SISI KIRI: VISUAL (HANYA MUNCUL DI DESKTOP) --- */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop"
                    alt="De'Kites Luxury Interior"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-multiply" />
                <div className="relative z-10 m-auto text-center px-12">
                    <h2 className="text-4xl font-serif text-white mb-4 tracking-tight">Selamat Datang Kembali</h2>
                    <p className="text-slate-200 font-light tracking-widest uppercase text-xs">
                        Eksklusivitas menanti di balik pintu ini.
                    </p>
                </div>
            </div>

            {/* --- SISI KANAN: FORM --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
                <Link
                    href="/"
                    className="absolute top-8 right-8 flex items-center text-xs tracking-widest text-slate-400 hover:text-slate-900 transition-colors uppercase"
                >
                    <ChevronLeft size={14} className="mr-1" /> Kembali ke Beranda
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm space-y-8"
                >
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-3xl font-serif text-slate-900">Masuk ke De'Kites</h1>
                        <p className="text-sm text-slate-500 font-light">
                            Masukkan detail akun Anda untuk melanjutkan akses layanan premium.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-slate-400">Email Anda</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                required
                                className="rounded-none border-0 border-b border-slate-200 focus-visible:ring-0 focus-visible:border-slate-900 transition-all px-0"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-slate-400">Kata Sandi</Label>
                                <Link href="#" className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900">Lupa?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                className="rounded-none border-0 border-b border-slate-200 focus-visible:ring-0 focus-visible:border-slate-900 transition-all px-0"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-none bg-slate-900 hover:bg-slate-800 text-white py-6 tracking-[0.2em] text-xs transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "MASUK SEKARANG"}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-slate-400 font-light tracking-wide">
                        Belum menjadi anggota?{" "}
                        <Link href="/register" className="text-slate-900 font-medium hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}