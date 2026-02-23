"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAdminDashboardData, addRoom, updateBookingStatus, deleteRoom } from "./actions";
import { toast } from "sonner";
import {
    LayoutDashboard, BedDouble, Users, Wallet, Search, Filter,
    MoreVertical, CheckCircle2, XCircle, Clock, Plus, ImagePlus, X, ArrowLeft, Trash2, Download, Menu
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("ringkasan");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [newRoom, setNewRoom] = useState({
        name: "", price: "", stock: "1", description: "", images: [] as string[], facilities: ""
    });

    const [realData, setRealData] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(true);

    const fetchDashboard = async () => {
        setLoadingData(true);
        const result = await getAdminDashboardData();
        if (result) setRealData(result);
        setLoadingData(false);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleAddImage = () => {
        if (newRoom.images.length < 5) {
            const url = prompt("Masukkan URL Foto Kamar (Gunakan Unsplash untuk sementara):");
            if (url) setNewRoom({ ...newRoom, images: [...newRoom.images, url] });
        } else {
            toast.error("Maksimal 5 foto untuk menjaga eksklusivitas.");
        }
    };

    const submitRoom = async () => {
        if (!newRoom.name || !newRoom.price) {
            toast.error("Nama dan Harga kamar wajib diisi!");
            return;
        }

        const res = await addRoom(newRoom);
        if (res.success) {
            toast.success("Kamar berhasil dipublikasikan!");
            setIsDialogOpen(false);
            setNewRoom({ name: "", price: "", stock: "1", description: "", images: [], facilities: "" });
            fetchDashboard();
        } else {
            toast.error("Gagal menambahkan kamar.");
        }
    };

    const handleUpdateBookingStatus = async (id: string, status: string) => {
        toast.loading("Memperbarui status...");
        const res = await updateBookingStatus(id, status);
        toast.dismiss();
        if (res.success) {
            toast.success(`Pesanan berhasil diubah menjadi ${status}`);
            fetchDashboard();
        } else {
            toast.error(res.message);
        }
    };

    const handleDeleteRoom = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
            toast.loading("Menghapus kamar...");
            const res = await deleteRoom(id);
            toast.dismiss();
            if (res.success) {
                toast.success("Kamar berhasil dihapus");
                fetchDashboard();
            } else {
                toast.error(res.message);
            }
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-screen bg-slate-950 text-slate-300">
                {/* Skeleton Sidebar Kiri */}
                <aside className="w-64 border-r border-slate-900 hidden lg:flex flex-col p-6 space-y-8 bg-slate-950/50">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 bg-slate-800" />
                        <Skeleton className="h-3 w-40 bg-slate-800/50" />
                    </div>
                    <nav className="space-y-4">
                        <Skeleton className="h-10 w-full bg-slate-800" />
                        <Skeleton className="h-10 w-full bg-slate-800" />
                        <Skeleton className="h-10 w-full bg-slate-800" />
                    </nav>
                </aside>
                {/* Skeleton Konten Utama */}
                <main className="flex-1 p-8 md:p-12 space-y-10 w-full">
                    <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-900 pb-6">
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-64 bg-slate-800" />
                            <Skeleton className="h-4 w-96 bg-slate-800/50" />
                        </div>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton className="h-28 w-full bg-slate-900" />
                        <Skeleton className="h-28 w-full bg-slate-900" />
                        <Skeleton className="h-28 w-full bg-slate-900" />
                    </div>
                    <Skeleton className="h-[400px] w-full bg-slate-900" />
                </main>
            </div>
        );
    }

    if (!session || (session.user as any).role !== "admin") {
        router.push("/");
        return null;
    }

    const stats = [
        { title: "Total Pendapatan", value: realData ? `Rp ${realData.stats.revenue.toLocaleString('id-ID')}` : "Rp 0", icon: Wallet, color: "text-emerald-500" },
        { title: "Booking Aktif", value: realData ? realData.stats.active.toString() : "0", icon: BedDouble, color: "text-blue-500" },
        { title: "Pelanggan Baru", value: realData ? realData.stats.customers.toString() : "0", icon: Users, color: "text-amber-500" },
    ];

    const bookings = realData?.bookings || [];
    const rooms = realData?.rooms || [];
    const users = realData?.users || [];

    const processChartData = (bookingsList: any[]) => {
        const dataMap: Record<string, number> = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            dataMap[`${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`] = 0;
        }

        bookingsList.forEach(b => {
            if (b.status === "Dikonfirmasi") {
                const date = new Date(b.createdAt);
                const key = `${months[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
                if (dataMap[key] !== undefined) {
                    dataMap[key] += b.total;
                }
            }
        });

        return Object.keys(dataMap).map(k => ({ name: k, total: dataMap[k] }));
    };

    const chartData = processChartData(bookings);

    const handleExportCSV = () => {
        if (!bookings || bookings.length === 0) {
            toast.error("Tidak ada data pesanan untuk diekspor.");
            return;
        }

        // Tentukan Header CSV
        const headers = ["ID Pesanan", "Nama Pelanggan", "Kamar", "Tanggal Pemesanan", "Status", "Alasan Pembatalan", "Total (Rp)"];

        // Bentuk Baris Data
        const csvRows = bookings.map((b: any) => [
            b.id,
            b.user?.name || "N/A",
            b.room?.name || "N/A",
            new Date(b.createdAt).toLocaleDateString("id-ID"),
            b.status,
            b.cancelReason ? `"${b.cancelReason.replace(/"/g, '""')}"` : "-", // Handle koma dalam alasan
            b.total
        ]);

        // Gabungkan Header dan Baris menggunakan koma
        const csvContent = [
            headers.join(","),
            ...csvRows.map((row: any[]) => row.join(","))
        ].join("\n");

        // Proses Unduh
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Laporan_Pesanan_DeKites_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Laporan CSV berhasil diunduh.");
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-300">
            {/* --- MOBILE HEADER & OVERLAY SIDEBAR --- */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-emerald-600 rounded-sm flex items-center justify-center shadow-lg">
                        <LayoutDashboard className="text-white h-4 w-4" />
                    </div>
                    <span className="font-serif text-white tracking-widest text-sm uppercase">De'Kites Admin</span>
                </div>
                <Button variant="ghost" className="text-slate-400 p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="h-6 w-6 text-emerald-500" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="relative w-64 h-full border-r border-slate-900 bg-slate-950 flex flex-col p-6 space-y-8 shadow-2xl animate-in slide-in-from-left-2 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-xl font-serif text-emerald-500 tracking-widest">ADMIN PANEL</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">De'Kites Control Center</p>
                        </div>
                        <nav className="space-y-2 flex-1">
                            <Button
                                variant={activeTab === "ringkasan" ? "secondary" : "ghost"}
                                className={`w-full justify-start rounded-none ${activeTab === "ringkasan" ? "bg-white text-slate-950 hover:bg-slate-200" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
                                onClick={() => { setActiveTab("ringkasan"); setIsMobileMenuOpen(false); }}
                            >
                                <LayoutDashboard className="mr-3 h-4 w-4" /> Ringkasan Booking
                            </Button>
                            <Button
                                variant={activeTab === "kamar" ? "secondary" : "ghost"}
                                className={`w-full justify-start rounded-none ${activeTab === "kamar" ? "bg-white text-slate-950 hover:bg-slate-200" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
                                onClick={() => { setActiveTab("kamar"); setIsMobileMenuOpen(false); }}
                            >
                                <BedDouble className="mr-3 h-4 w-4" /> Kelola Kamar
                            </Button>
                            <Button
                                variant={activeTab === "pelanggan" ? "secondary" : "ghost"}
                                className={`w-full justify-start rounded-none ${activeTab === "pelanggan" ? "bg-white text-slate-950 hover:bg-slate-200" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
                                onClick={() => { setActiveTab("pelanggan"); setIsMobileMenuOpen(false); }}
                            >
                                <Users className="mr-3 h-4 w-4" /> Daftar Pelanggan
                            </Button>
                        </nav>
                        <div className="mt-auto space-y-2 border-t border-slate-900 pt-6">
                            <Link href="/">
                                <Button variant="ghost" className="w-full justify-start rounded-none text-slate-500 hover:text-white hover:bg-slate-900/50">
                                    <ArrowLeft className="mr-3 h-4 w-4" /> Menuju Web De'Kites
                                </Button>
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* --- DESKTOP SIDEBAR KIRI --- */}
            <aside className="w-64 border-r border-slate-900 h-screen sticky top-0 hidden lg:flex flex-col p-6 space-y-8 bg-slate-950/50 backdrop-blur-xl">
                <div className="space-y-1">
                    <h2 className="text-xl font-serif text-white tracking-widest">ADMIN PANEL</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">De'Kites Control Center</p>
                </div>

                <nav className="space-y-2">
                    <Button
                        variant={activeTab === "ringkasan" ? "secondary" : "ghost"}
                        className={`w-full justify-start rounded-none ${activeTab === "ringkasan" ? "bg-white text-slate-950 hover:bg-slate-200" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
                        onClick={() => setActiveTab("ringkasan")}
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4" /> Ringkasan Booking
                    </Button>
                    <Button
                        variant={activeTab === "kamar" ? "secondary" : "ghost"}
                        className={`w-full justify-start rounded-none ${activeTab === "kamar" ? "bg-white text-slate-950 hover:bg-slate-200" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
                        onClick={() => setActiveTab("kamar")}
                    >
                        <BedDouble className="mr-3 h-4 w-4" /> Kelola Kamar
                    </Button>
                    <Button
                        variant={activeTab === "pelanggan" ? "secondary" : "ghost"}
                        className={`w-full justify-start rounded-none ${activeTab === "pelanggan" ? "bg-white text-slate-950 hover:bg-slate-200" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
                        onClick={() => setActiveTab("pelanggan")}
                    >
                        <Users className="mr-3 h-4 w-4" /> Daftar Pelanggan
                    </Button>
                </nav>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-8 md:p-12 space-y-10 overflow-y-auto w-full">

                <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-900 pb-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-serif text-white">
                            {activeTab === "ringkasan" && "Monitoring Reservasi"}
                            {activeTab === "kamar" && "Kelola Inventaris Kamar"}
                            {activeTab === "pelanggan" && "Daftar Pelanggan"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {loadingData ? "Sinkronisasi data database..." : "Halo Admin, kelola aset properti De'Kites Anda."}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white tracking-widest text-[10px] uppercase px-8 py-6">
                                    <Plus className="mr-2 h-4 w-4" /> Tambah Kamar Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-950 border border-slate-800 text-white min-w-[90vw] max-w-[1200px] p-10 md:p-14 rounded-none shadow-[0_0_100px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
                                <DialogHeader className="mb-10 text-center flex flex-col items-center">
                                    <DialogTitle className="font-serif text-4xl md:text-5xl font-light tracking-tight text-white flex items-center justify-center gap-4 mb-4">
                                        <BedDouble className="h-10 w-10 text-emerald-500" />
                                        Registrasi Kamar Baru
                                    </DialogTitle>
                                    <p className="text-slate-400 text-lg max-w-2xl text-center">Formulir besar dan nyaman. Daftarkan inventaris kamar baru ke dalam sistem De'Kites dengan detail yang lengkap dan akurat.</p>
                                </DialogHeader>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 py-4">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <Label className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Nama Kamar</Label>
                                            <Input
                                                className="bg-slate-900 border-none rounded-none h-16 text-xl px-6 focus-visible:ring-1 focus-visible:ring-emerald-500"
                                                placeholder="Contoh: Royal Suite #101"
                                                value={newRoom.name}
                                                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Harga Bulanan</Label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-light">Rp</span>
                                                    <Input
                                                        type="number"
                                                        className="bg-slate-900 border-none rounded-none h-16 text-xl pl-16 pr-6 focus-visible:ring-1 focus-visible:ring-emerald-500"
                                                        placeholder="5000000"
                                                        value={newRoom.price}
                                                        onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Stok Kamar</Label>
                                                <Input
                                                    type="number" min="1"
                                                    className="bg-slate-900 border-none rounded-none h-16 text-xl px-6 focus-visible:ring-1 focus-visible:ring-emerald-500 text-center"
                                                    placeholder="1"
                                                    value={newRoom.stock}
                                                    onChange={(e) => setNewRoom({ ...newRoom, stock: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Fasilitas Utama</Label>
                                            <Input
                                                className="bg-slate-900 border-none rounded-none h-16 text-xl px-6 focus-visible:ring-1 focus-visible:ring-emerald-500"
                                                placeholder="Pisahkan dengan koma (contoh: AC, WiFi Cepat, Smart TV)"
                                                value={newRoom.facilities}
                                                onChange={(e) => setNewRoom({ ...newRoom, facilities: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <Label className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Deskripsi Kamar</Label>
                                            <Textarea
                                                className="bg-slate-900 border-none rounded-none h-48 text-xl p-6 focus-visible:ring-1 focus-visible:ring-emerald-500 resize-none leading-relaxed"
                                                placeholder="Ceritakan keunggulan eksklusif kamar ini..."
                                                value={newRoom.description}
                                                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="flex justify-between text-sm uppercase tracking-widest text-emerald-500 font-semibold mb-2">
                                                <span>Galeri Foto</span>
                                                <span className="text-slate-500">{newRoom.images.length}/5</span>
                                            </Label>
                                            <div className="flex flex-wrap gap-4">
                                                {newRoom.images.map((img, idx) => (
                                                    <div key={idx} className="relative w-28 h-28 rounded-none overflow-hidden ring-1 ring-slate-800 group hover:ring-emerald-500 transition-all">
                                                        <img src={img} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2" onClick={() => setNewRoom({ ...newRoom, images: newRoom.images.filter((_, i) => i !== idx) })}>
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {newRoom.images.length < 5 && (
                                                    <button onClick={handleAddImage} className="w-28 h-28 rounded-none border border-slate-800 bg-slate-900 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all text-slate-500 gap-2 cursor-pointer">
                                                        <ImagePlus size={28} />
                                                        <span className="text-xs tracking-wide uppercase">Add URL</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-12 border-t border-slate-900 pt-8 flex justify-end gap-4">
                                    <Button variant="ghost" className="rounded-none text-slate-400 hover:text-white text-lg px-8 h-16 uppercase tracking-widest" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                    <Button className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white uppercase tracking-widest text-lg px-12 h-16" onClick={submitRoom}>
                                        <CheckCircle2 className="mr-3 h-6 w-6" /> Publikasikan Kamar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Link href="/login">
                            <Button variant="outline" className="rounded-none border-slate-800 text-slate-400 hover:text-white px-6 py-6 h-[48px]">
                                <ArrowLeft className="mr-2 h-4 w-4" /> LogOut
                            </Button>
                        </Link>
                    </div>
                </header>

                {activeTab === "ringkasan" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((item, i) => (
                                <Card key={i} className="bg-slate-900/40 border-slate-800 rounded-none shadow-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-widest">{item.title}</CardTitle>
                                        <item.icon className={`h-4 w-4 ${item.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-white tracking-tight">{item.value}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* --- CHART SECTION --- */}
                        <Card className="bg-slate-900/40 border-slate-800 rounded-none shadow-2xl mt-8 pt-6">
                            <CardHeader className="pb-8 border-b border-slate-800/50 mb-6 mx-6 px-0">
                                <CardTitle className="text-xl font-serif text-white">Tren Pendapatan (6 Bulan Terakhir)</CardTitle>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Berdasarkan reservasi terkonfirmasi</p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis
                                                stroke="#64748b"
                                                fontSize={10}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `Rp ${value >= 1000000 ? (value / 1000000) + ' Jt' : value}`}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '4px', fontSize: '12px' }}
                                                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                                formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pendapatan"]}
                                                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                            />
                                            <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-slate-800 rounded-none shadow-2xl overflow-hidden mt-8">
                            <CardHeader className="border-b border-slate-800 flex flex-col md:flex-row items-center justify-between py-6 gap-4">
                                <div className="flex items-center space-x-4 w-full md:w-auto">
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                                        <Input
                                            placeholder="Cari pesanan berdasarkan user atau kamar..."
                                            className="pl-10 rounded-sm bg-slate-950 border-slate-800 text-white focus:border-slate-600 transition-all h-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleExportCSV}
                                    variant="outline"
                                    className="w-full md:w-auto rounded-sm border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 uppercase tracking-widest text-[10px]"
                                >
                                    <Download className="mr-2 h-4 w-4 text-emerald-500" /> Unduh Laporan (CSV)
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-950/80">
                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                            <TableHead className="text-[10px] uppercase tracking-widest text-slate-500 py-4">ID</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-slate-500">Pelanggan</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-slate-500">Kamar</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-slate-500">Status</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-slate-500">Total Harga</TableHead>
                                            <TableHead className="text-right text-[10px] uppercase tracking-widest text-slate-500">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.filter((b: any) =>
                                            b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            b.room?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((booking: any) => (
                                            <TableRow key={booking.id} className="border-slate-800 hover:bg-slate-900/50 transition-colors py-4">
                                                <TableCell className="font-mono text-xs text-slate-400 py-4">{booking.id.substring(0, 6).toUpperCase()}</TableCell>
                                                <TableCell className="text-white font-medium">{booking.user?.name}</TableCell>
                                                <TableCell className="text-slate-400 text-sm font-light italic">{booking.room?.name}</TableCell>
                                                <TableCell>
                                                    <Badge className={`rounded-none border-none text-[10px] uppercase tracking-widest py-1 px-3 ${booking.status === "Dikonfirmasi" ? "bg-emerald-500/10 text-emerald-500" :
                                                        booking.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                                                            booking.status === "Menunggu Pembatalan" ? "bg-orange-500/10 text-orange-500" : "bg-red-500/10 text-red-500"
                                                        }`}>
                                                        {booking.status}
                                                    </Badge>
                                                    {booking.cancelReason && (
                                                        <div className="text-xs text-red-400 mt-1 mt-1 max-w-[200px] truncate" title={booking.cancelReason}>Alasan: {booking.cancelReason}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-emerald-500 font-bold">Rp {booking.total.toLocaleString("id-ID")}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-white">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300 rounded-none shadow-xl min-w-[160px]">
                                                            <DropdownMenuLabel className="font-serif">Manajemen Status</DropdownMenuLabel>
                                                            {booking.status === "Menunggu Pembatalan" ? (
                                                                <>
                                                                    <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-emerald-500" onClick={() => handleUpdateBookingStatus(booking.id, "Dibatalkan")}>
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Setujui Pembatalan
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-red-500" onClick={() => handleUpdateBookingStatus(booking.id, "Dikonfirmasi")}>
                                                                        <XCircle className="mr-2 h-4 w-4" /> Tolak Pembatalan
                                                                    </DropdownMenuItem>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {booking.status !== "Dikonfirmasi" && (
                                                                        <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-emerald-500" onClick={() => handleUpdateBookingStatus(booking.id, "Dikonfirmasi")}>
                                                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Konfirmasi Pesanan
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-amber-500" onClick={() => handleUpdateBookingStatus(booking.id, "Pending")}>
                                                                        <Clock className="mr-2 h-4 w-4" /> Tandai Pending
                                                                    </DropdownMenuItem>
                                                                    {booking.status !== "Dibatalkan" && (
                                                                        <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-red-500" onClick={() => handleUpdateBookingStatus(booking.id, "Dibatalkan")}>
                                                                            <XCircle className="mr-2 h-4 w-4" /> Tolak/Batalkan Pesanan
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeTab === "kamar" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room: any) => (
                            <Card key={room.id} className="bg-slate-900/40 border-slate-800 rounded-none overflow-hidden group">
                                <div className="h-48 relative overflow-hidden">
                                    <img src={room.images?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1470&auto=format&fit=crop"} alt={room.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-4 right-4 bg-slate-950/80 px-3 py-1 text-xs text-white border border-slate-800">
                                        Stok: {room.stock}
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="font-serif text-xl text-white mb-2">{room.name}</h3>
                                    <p className="text-emerald-500 font-bold mb-4">Rp {room.price.toLocaleString("id-ID")}/bulan</p>
                                    <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-4">
                                        <Badge variant="outline" className="border-slate-700 text-slate-400 rounded-none">{room.isAvailable ? "Tersedia" : "Penuh"}</Badge>
                                        <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 px-3 rounded-sm" onClick={() => handleDeleteRoom(room.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === "pelanggan" && (
                    <Card className="bg-slate-900/40 border-slate-800 rounded-none shadow-2xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-950/80">
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase tracking-widest text-slate-500 py-4">ID Pelanggan</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest text-slate-500">Nama</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest text-slate-500">Email</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest text-slate-500">Register Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user: any) => (
                                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-900/50 transition-colors py-4">
                                        <TableCell className="font-mono text-xs text-slate-400 py-4">{user.id.substring(0, 8)}</TableCell>
                                        <TableCell className="text-white font-medium">{user.name}</TableCell>
                                        <TableCell className="text-slate-400 text-sm font-light">{user.email}</TableCell>
                                        <TableCell className="text-slate-500 text-sm">{new Date(user.createdAt).toLocaleDateString("id-ID")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

            </main>
        </div>
    );
}