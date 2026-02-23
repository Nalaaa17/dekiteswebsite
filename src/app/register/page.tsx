"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/",
        }, {
            onError: (ctx) => {
                alert(ctx.error.message || "Gagal mendaftar. Silakan coba lagi.");
                setLoading(false);
            },
            onSuccess: () => {
                router.push("/");
                router.refresh();
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* --- SISI KIRI: DESKRIPSI LAYANAN --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-24 flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-5xl font-serif mb-6 leading-tight">Bergabung dengan Komunitas De'Kites</h2>
                    <p className="text-slate-400 font-light text-lg max-w-md">
                        Dapatkan akses eksklusif untuk pemesanan kamar premium dan layanan prioritas kami.
                    </p>
                </div>
                <div className="relative z-10 border-t border-slate-800 pt-8">
                    <p className="text-xs uppercase tracking-[0.3em] font-light">Eksklusivitas • Kenyamanan • Kemewahan</p>
                </div>
                {/* Dekorasi halus */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* --- SISI KANAN: FORM REGISTER --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
                <Link href="/login" className="absolute top-8 right-8 text-xs tracking-widest text-slate-400 hover:text-slate-900 flex items-center uppercase">
                    <ChevronLeft size={14} className="mr-1" /> Masuk ke Akun
                </Link>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-serif text-slate-900">Pendaftaran Anggota</h1>
                        <p className="text-sm text-slate-500 font-light">Mulailah perjalanan menginap Anda bersama kami.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-400">Nama Lengkap</Label>
                            <Input
                                required
                                className="rounded-none border-0 border-b border-slate-200 focus-visible:ring-0 focus-visible:border-slate-900 transition-all px-0 bg-transparent"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-400">Alamat Email</Label>
                            <Input
                                type="email"
                                required
                                className="rounded-none border-0 border-b border-slate-200 focus-visible:ring-0 focus-visible:border-slate-900 transition-all px-0 bg-transparent"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-400">Buat Kata Sandi</Label>
                            <Input
                                type="password"
                                required
                                className="rounded-none border-0 border-b border-slate-200 focus-visible:ring-0 focus-visible:border-slate-900 transition-all px-0 bg-transparent"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button disabled={loading} className="w-full rounded-none bg-slate-900 hover:bg-slate-800 text-white py-6 tracking-[0.2em] text-xs transition-all">
                            {loading ? <Loader2 className="animate-spin" /> : "DAFTAR SEKARANG"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}