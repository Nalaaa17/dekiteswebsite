"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Loader2, Minus, Plus } from "lucide-react";
import { format, addMonths } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { createBookingWithPolar } from "@/lib/actions/booking";
import { addToCart } from "@/lib/actions/cart";
import { getRoomById } from "@/lib/actions/rooms";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RoomDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const router = useRouter();
    const { data: session } = authClient.useSession();

    // Data State
    const [room, setRoom] = useState<any | null>(null);
    const [pageLoading, setPageLoading] = useState(true);

    // Booking States
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form States
    const [checkIn, setCheckIn] = useState<Date>(new Date());
    const [durationMonths, setDurationMonths] = useState<number>(1);
    const [ktpName, setKtpName] = useState("");
    const [ktpNumber, setKtpNumber] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            setPageLoading(true);
            const res = await getRoomById(resolvedParams.id);
            if (res.success && res.data) {
                setRoom(res.data);
            } else {
                toast.error(res.message || "Kamar tidak ditemukan.");
                router.push("/");
            }
            setPageLoading(false);
        };
        fetchRoom();
    }, [resolvedParams.id, router]);

    const handleAddToCart = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        setCartLoading(true);
        try {
            const res = await addToCart(resolvedParams.id);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal menambahkan ke keranjang.");
        } finally {
            setCartLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!ktpName || !ktpNumber) {
            toast.error("Mohon lengkapi Nama dan NIK KTP Anda.");
            return;
        }

        if (ktpNumber.length !== 16) {
            toast.warning("NIK harus berjumlah 16 digit.");
            return;
        }

        if (!room) return;

        setLoading(true);
        try {
            // Karena backend createBookingWithPolar awalnya dirancang hanya mengirim `room.price`,
            // dan kita sekarang punya kuantitas "berapa bulan",
            // kita harus hitung totalHarga di sisi client lalu lempar jika server menampungnya.
            // Saat ini function createBookingWithPolar signature-nya:
            // createBookingWithPolar(roomId, total, ktpName, ktpNumber)
            const totalPrice = room.price * durationMonths;

            // TODO: Kalau db punya fields `checkOut` dan server action butuh tanggal durasi:
            // kita lewatkan calculate end date: addMonths(checkIn, durationMonths) (perlu modif di server actions booking)
            // Untuk saat ini, asumsikan total price adalah yang utama ditembak ke Polar
            const response = await createBookingWithPolar(resolvedParams.id, totalPrice, ktpName, ktpNumber);

            if (response.success && response.url) {
                window.location.href = response.url;
            } else {
                toast.error("Pemesanan gagal diproses. Silakan coba lagi nanti.");
            }
        } catch (error) {
            console.error("Booking Error:", error);
            toast.error("Terjadi kesalahan sistem saat menghubungi server pembayaran.");
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
        }
    };

    // UI Loading state
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-slate-500 animate-spin mb-4" />
                <p className="text-slate-400 font-serif tracking-widest text-sm uppercase">Menyiapkan Kamar...</p>
            </div>
        );
    }

    if (!room) return null;

    const imagesArray: string[] = room.images && room.images.length > 0
        ? room.images
        : ["https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1200&auto=format&fit=crop"];

    // Calculate dates
    const checkOutDate = addMonths(checkIn, durationMonths);
    const totalPrice = room.price * durationMonths;

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            <Navbar />

            {/* --- HERO IMAGE CAROUSEL --- */}
            <div className="relative w-full h-[60vh] md:h-[75vh] mt-20 group bg-slate-900">
                <Carousel opts={{ loop: true }} className="w-full h-full">
                    <CarouselContent className="h-full ml-0">
                        {imagesArray.map((img: string, idx: number) => (
                            <CarouselItem key={idx} className="h-full pl-0 relative">
                                <img
                                    src={img}
                                    alt={`${room.name} Image ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {imagesArray.length > 1 && (
                        <>
                            <CarouselPrevious className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white border-white/10 opacity-0 group-hover:opacity-100 transition-all rounded-full h-12 w-12 z-20" />
                            <CarouselNext className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white border-white/10 opacity-0 group-hover:opacity-100 transition-all rounded-full h-12 w-12 z-20" />
                        </>
                    )}
                </Carousel>

                <Link href="/#kamar" className="absolute top-8 left-6 md:left-16 flex items-center text-xs tracking-widest text-white uppercase hover:text-slate-300 transition-colors z-30 backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10">
                    <ChevronLeft size={14} className="mr-2" /> Kembali ke Katalog
                </Link>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 relative">

                {/* KIRI: Deskripsi Kamar */}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight">{room.name}</h1>
                        <p className="text-sm font-light uppercase tracking-[0.2em] text-slate-400 flex items-center">
                            IDR <span className="text-white font-medium ml-2">{room.price.toLocaleString("id-ID")}</span> <span className="text-[10px] lowercase text-slate-500 ml-2">/ Bulan</span>
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xs uppercase tracking-widest font-medium text-slate-500 border-b border-slate-800 pb-2">Tentang Kamar Ini</h2>
                        <p className="text-slate-300 leading-relaxed font-light text-justify">
                            {room.description || "Kamar modern dengan desain elegan yang memadukan kenyamanan dan kemewahan fungsional. Dilengkapi dengan fasilitas utama premium."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xs uppercase tracking-widest font-medium text-slate-500 border-b border-slate-800 pb-2">Fasilitas Eksklusif</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                            {["AC", "Kamar Mandi Dalam", "WiFi Cepat", "Kasur Springbed", "Lemari Pakaian", "Meja Belajar"].map((facility, idx) => (
                                <div key={idx} className="flex items-center text-sm font-light text-slate-300">
                                    <CheckCircle2 size={14} className="text-emerald-500 mr-3 flex-shrink-0" />
                                    {facility}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {imagesArray.slice(1, 5).map((img, idx) => (
                            <div key={idx} className="relative aspect-video overflow-hidden group rounded-sm ring-1 ring-white/5">
                                <img
                                    src={img}
                                    alt={`Gallery ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5000ms]"
                                />
                                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* KANAN: Booking Widget */}
                <div className="relative">
                    <Card className="sticky top-32 bg-slate-900/40 border border-slate-800 rounded-lg shadow-2xl backdrop-blur-xl overflow-hidden">

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-emerald-500/20" />

                        <CardContent className="p-8 space-y-8">
                            <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full backdrop-blur-md z-10">
                                {room.stock > 0 ? (
                                    <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                        Tersisa {room.stock} Kamar
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-red-400 font-medium tracking-widest uppercase flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                                        Habis Dipesan
                                    </span>
                                )}
                            </div>

                            <div className="text-center space-y-2 border-b border-slate-800 pb-6 pt-2">
                                <p className="text-[10px] uppercase font-medium tracking-[0.3em] text-emerald-500 mb-4">Mulai Reservasi</p>
                                <div className="text-3xl font-serif text-white tracking-tight flex justify-center items-end space-x-2">
                                    <span className="text-sm text-slate-500 font-sans mb-1">Rp</span>
                                    <span>{room.price.toLocaleString("id-ID")}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-light mt-2">per bulan (termasuk pajak)</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-[10px] uppercase tracking-widest text-slate-500">Mulai Sewa (Check-in)</Label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border border-slate-700 bg-slate-950/80 rounded-md text-slate-200">
                                            {/* TODO: In the future implement a Date Picker, for now using current date */}
                                            <span className="font-medium text-sm">{format(checkIn, "dd MMMM yyyy", { locale: id })}</span>
                                            <CalendarIcon size={16} className="text-emerald-500" />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-[10px] uppercase tracking-widest text-slate-500">Durasi Sewa</Label>
                                            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-sm">Fleksibel</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 border border-slate-700 bg-slate-950/80 rounded-md">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800"
                                                onClick={() => setDurationMonths(Math.max(1, durationMonths - 1))}
                                            >
                                                <Minus size={16} />
                                            </Button>
                                            <div className="text-center flex-1">
                                                <span className="text-lg font-medium text-white">{durationMonths}</span>
                                                <span className="text-xs text-slate-400 ml-2">Bulan</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800"
                                                onClick={() => setDurationMonths(Math.min(12, durationMonths + 1))}
                                            >
                                                <Plus size={16} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 font-light flex items-center justify-center">
                                            Est. Check-out: <span className="text-slate-300 ml-2 border-b border-slate-800 pb-0.5">{format(checkOutDate, "dd MMMM yyyy", { locale: id })}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-950/50 p-5 rounded-md border border-slate-800/80 text-sm space-y-4 font-light">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Rp {room.price.toLocaleString("id-ID")} x {durationMonths} bulan</span>
                                        <span className="text-slate-300">Rp {totalPrice.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Biaya Layanan & Admin</span>
                                        <span className="text-emerald-500 flex items-center">
                                            Gratis
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-white">
                                        <span className="font-medium text-xs tracking-widest uppercase text-slate-400">Total Akhir</span>
                                        <span className="font-serif text-xl tracking-tight text-emerald-400">Rp {totalPrice.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading || room.stock < 1}
                                    variant="outline"
                                    className="w-full h-14 rounded-md border-slate-700 text-slate-300 hover:text-white uppercase tracking-[0.2em] text-xs transition-all font-medium bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600 disabled:opacity-50"
                                >
                                    {cartLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "SIMPAN KE KERANJANG"}
                                </Button>

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            disabled={room.stock < 1}
                                            onClick={(e) => {
                                                if (!session) {
                                                    e.preventDefault();
                                                    router.push("/login");
                                                }
                                            }}
                                            className="w-full h-14 rounded-md bg-white text-slate-950 hover:bg-slate-200 uppercase tracking-[0.2em] text-xs transition-all font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50"
                                        >
                                            {room.stock < 1 ? "STOK HABIS" : "PESAN SEKARANG"}
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="bg-slate-950 border border-slate-800 text-slate-200 sm:max-w-[450px] p-0 overflow-hidden shadow-2xl">
                                        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

                                        <div className="p-8 space-y-8">
                                            <DialogHeader className="space-y-3">
                                                <DialogTitle className="text-2xl font-serif tracking-tight text-white flex items-center">
                                                    Verifikasi Identitas
                                                </DialogTitle>
                                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                                    Sesuai kebijakan keamanan, harap masukkan identitas asli Anda untuk dihubungkan pada kontrak penyewaan {room.name}.
                                                </p>
                                            </DialogHeader>

                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Nama Lengkap (Sesuai KTP)</Label>
                                                    <Input
                                                        value={ktpName}
                                                        onChange={(e) => setKtpName(e.target.value)}
                                                        className="bg-slate-900/50 border-slate-700 h-12 px-4 rounded-md text-slate-200 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-colors"
                                                        placeholder="Contoh: Budi Santoso"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Nomor NIK KTP</Label>
                                                        <span className="text-[10px] text-slate-600 font-mono tracking-widest">{ktpNumber.length}/16</span>
                                                    </div>
                                                    <Input
                                                        value={ktpNumber}
                                                        onChange={(e) => setKtpNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                        className={`bg-slate-900/50 h-12 px-4 rounded-md text-slate-200 transition-colors ${ktpNumber.length > 0 && ktpNumber.length !== 16 ? 'border-amber-500/50 focus-visible:ring-amber-500' : 'border-slate-700 focus-visible:border-emerald-500 focus-visible:ring-emerald-500'}`}
                                                        placeholder="16 Digit NIK KTP Anda"
                                                        type="text"
                                                        inputMode="numeric"
                                                    />
                                                    {ktpNumber.length > 0 && ktpNumber.length !== 16 && (
                                                        <p className="text-[10px] text-amber-500/90 font-light">Mohon pastikan NIK berisi tepat 16 digit angka.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <DialogFooter className="pt-4 border-t border-slate-800/50">
                                                <Button
                                                    onClick={handleBooking}
                                                    disabled={loading || ktpNumber.length !== 16 || !ktpName.trim()}
                                                    className="w-full h-14 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 uppercase tracking-[0.2em] text-xs transition-all font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:shadow-none"
                                                >
                                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `BAYAR RP ${totalPrice.toLocaleString("id-ID")}`}
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <p className="text-center text-[10px] text-slate-500 font-light uppercase tracking-widest leading-relaxed">
                                Transaksi diamankan dengan enkripsi standar.<br />
                                KTP dijaga privasinya.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
}
