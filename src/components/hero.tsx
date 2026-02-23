"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion"; // Library untuk efek paralaks halus

export default function Hero() {
    const { scrollY } = useScroll();
    // Paralaks: Saat di-scroll ke bawah 1000px, gambar ikut turun 300px lambat
    const yHeroBg = useTransform(scrollY, [0, 1000], [0, 300]);

    return (
        <section className="relative h-screen min-h-[600px] w-full flex items-center justify-start overflow-hidden">
            {/* --- 1. BACKGROUND IMAGE AREA (Parallax) --- */}
            <motion.div
                className="absolute inset-0 z-0 scale-110 origin-top"
                style={{ y: yHeroBg }}
            >
                {/* GANTI src="/hero-placeholder.jpg" dengan "/hero-bg.jpg" jika fotomu sudah siap di folder public */}
                <Image
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470&auto=format&fit=crop"
                    alt="De'Kites Premium Room"
                    fill
                    className="object-cover w-full h-full"
                    priority // Gambar ini dimuat prioritas utama
                />
                {/* Overlay Gelap: Agar teks di atasnya lebih mudah dibaca */}
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            {/* --- 2. FLOATING CONTENT CARD --- */}
            <div className="relative z-10 container mx-auto px-6 md:px-16">
                {/* Animasi Framer Motion: Muncul dari bawah ke atas */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="max-w-lg"
                >
                    {/* Kartu dengan Efek Kaca (Glassmorphism) */}
                    <Card className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-none shadow-2xl rounded-none md:rounded-lg overflow-hidden">
                        <CardContent className="p-8 md:p-10 flex flex-col items-start space-y-6">

                            {/* Tagline Kecil */}
                            <div className="flex items-center space-x-4">
                                <div className="h-[1px] w-12 bg-slate-400"></div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">
                                    Eksklusif Living
                                </p>
                            </div>

                            {/* Headline Utama (Font Serif) */}
                            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white leading-tight">
                                Nikmati Kemewahan Hunian Premium di Pusat Kota.
                            </h1>

                            {/* Deskripsi Pendek */}
                            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                                Kombinasi sempurna antara kenyamanan apartemen modern dan pelayanan setara hotel berbintang. Tempat terbaik untuk istirahat Anda.
                            </p>

                            {/* Tombol Aksi (CTA) */}
                            <div className="pt-4 w-full md:w-auto overflow-visible p-1 -m-1">
                                <Link href="#kamar">
                                    <Button className="w-full md:w-auto rounded-none px-8 py-6 text-xs uppercase tracking-[0.2em] font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 shadow-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 active:translate-y-0 active:scale-95">
                                        Jelajahi Kamar
                                    </Button>
                                </Link>
                            </div>

                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}