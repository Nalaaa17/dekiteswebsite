"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Room } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { Filter } from "lucide-react";

interface RoomSectionProps {
    rooms: Room[];
}

export default function RoomSection({ rooms }: RoomSectionProps) {
    const [filterPrice, setFilterPrice] = useState<string>("all");
    const [filterStock, setFilterStock] = useState<string>("all");

    // Logic filtering di Client-Side
    const filteredRooms = rooms.filter((room) => {
        // Filter by Price
        if (filterPrice === "under2m" && room.price >= 2000000) return false;
        if (filterPrice === "2mTo5m" && (room.price < 2000000 || room.price > 5000000)) return false;
        if (filterPrice === "over5m" && room.price <= 5000000) return false;

        // Filter by Stock
        if (filterStock === "available" && room.stock < 1) return false;
        if (filterStock === "soldout" && room.stock > 0) return false;

        return true;
    });

    return (
        <section id="kamar" className="py-24 bg-slate-50 relative">
            {/* Dekorasi Latar Belakang */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-emerald-50/50 rounded-bl-[100px] pointer-events-none -z-0" />

            <div className="container mx-auto px-6 md:px-16 text-center space-y-12 relative z-10">
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif text-slate-900">Koleksi Kamar Kami</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Pilih ruang yang sesuai dengan gaya hidup dan kebutuhan Anda.</p>
                </div>

                {/* --- BAR FILTER PENCARIAN --- */}
                <div className="bg-white p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-3 text-slate-500 font-medium px-2">
                        <Filter size={18} className="text-emerald-500" />
                        <span className="text-sm uppercase tracking-widest">Filter:</span>
                    </div>

                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 flex-1 justify-end">
                        <select
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 outline-none transition-all cursor-pointer"
                        >
                            <option value="all">Semua Harga</option>
                            <option value="under2m">Di Bawah Rp 2 Juta</option>
                            <option value="2mTo5m">Rp 2 Juta - Rp 5 Juta</option>
                            <option value="over5m">Di Atas Rp 5 Juta</option>
                        </select>

                        <select
                            value={filterStock}
                            onChange={(e) => setFilterStock(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 outline-none transition-all cursor-pointer"
                        >
                            <option value="all">Semua Ketersediaan</option>
                            <option value="available">Kamar Tersedia</option>
                            <option value="soldout">Habis Dipesan</option>
                        </select>
                    </div>
                </div>

                {/* --- GRID KAMAR (Animated) --- */}
                {filteredRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredRooms.map((k, index) => (
                                <motion.div
                                    key={k.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Card className="rounded-xl border-none overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                        <div className="h-72 overflow-hidden relative">
                                            <img src={k.images?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1470&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={k.name} />
                                            {/* Tag Stok */}
                                            <div className="absolute top-4 right-4 bg-slate-950/80 px-4 py-1.5 text-[10px] uppercase tracking-widest text-white border border-slate-700 rounded-full backdrop-blur-sm">
                                                {k.stock > 0 ? `Sisa ${k.stock} Kamar` : 'Habis'}
                                            </div>
                                        </div>
                                        <CardContent className="p-6 text-left flex flex-col justify-between flex-1">
                                            <div>
                                                <h4 className="text-xl font-serif mb-2 text-slate-900 group-hover:text-emerald-600 transition-colors">{k.name}</h4>
                                                <p className="text-slate-500 text-sm mb-6">Mulai dari <span className="text-slate-900 font-bold">Rp {k.price.toLocaleString("id-ID")}</span>/bulan</p>
                                            </div>
                                            <Link href={`/kamar/${k.id}`}>
                                                <Button variant="outline" className="w-full rounded-md tracking-widest text-xs uppercase bg-white hover:bg-emerald-600 hover:text-white border-slate-200 hover:border-emerald-600 transition-all shadow-sm">
                                                    Lihat Detail Kamar
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 text-center border border-dashed border-slate-300 rounded-xl bg-white"
                    >
                        <h3 className="text-2xl font-serif text-slate-800 mb-2">Kamar Tidak Ditemukan</h3>
                        <p className="text-slate-500">Silakan sesuaikan filter pencarian harga atau ketersediaan untuk menemukan kamar lain.</p>
                        <Button variant="link" onClick={() => { setFilterPrice("all"); setFilterStock("all") }} className="mt-4 text-emerald-600">Reset Filter</Button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}