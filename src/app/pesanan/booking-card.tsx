"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cancelBooking, forceConfirmLocal } from "@/lib/actions/booking";
import { toast } from "sonner";

export default function BookingCard({ booking }: { booking: any }) {
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Mohon sertakan alasan pembatalan");
            return;
        }

        setLoading(true);
        toast.loading("Memproses pembatalan...");
        const res = await cancelBooking(booking.id, cancelReason);
        toast.dismiss();

        if (res.success) {
            toast.success("Pengajuan pembatalan berhasil dikirim.");
            setIsCancelOpen(false);
            window.location.reload(); // Segarkan untuk memperbarui status server
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    const handleForceConfirm = async () => {
        setLoading(true);
        toast.loading("Memicu Webhook Pembayaran Lokal...");
        const res = await forceConfirmLocal(booking.id);
        toast.dismiss();

        if (res.success) {
            toast.success("Pembayaran disimulasikan! Cek email Anda untuk melihat Invois.");
            window.location.reload();
        } else {
            toast.error("Gagal melakukan simulasi webhook.");
        }
        setLoading(false);
    };

    return (
        <Card className="overflow-hidden border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 bg-white relative hover:-translate-y-1 group">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10 duration-500" />
                    <img
                        src={booking.room.images?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1470&auto=format&fit=crop"}
                        alt={booking.room.name}
                        className="w-full h-full object-cover absolute inset-0 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {booking.status === "Pending" && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center shadow-sm whitespace-nowrap">
                                <Clock className="w-3 h-3 mr-1" /> Menunggu Pembayaran
                            </span>
                        )}
                        {booking.status === "Dikonfirmasi" && (
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center shadow-sm whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Dikonfirmasi
                            </span>
                        )}
                        {booking.status === "Menunggu Pembatalan" && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center shadow-sm whitespace-nowrap">
                                <AlertCircle className="w-3 h-3 mr-1" /> Menunggu Validasi Pembatalan
                            </span>
                        )}
                        {booking.status === "Dibatalkan" && (
                            <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center shadow-sm whitespace-nowrap">
                                <XCircle className="w-3 h-3 mr-1" /> Dibatalkan
                            </span>
                        )}
                    </div>
                </div>
                <CardContent className="p-6 md:w-3/4 flex flex-col justify-between w-full">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                        <div>
                            <div className="text-xs text-slate-500 mb-1">ID Pesanan: <span className="font-mono">{booking.id.split("-")[0]}</span></div>
                            <h3 className="text-xl font-serif text-slate-900 mb-2">{booking.room.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center">
                                    <CalendarDays className="w-4 h-4 mr-2 text-emerald-600" />
                                    <span>
                                        {new Date(booking.checkIn).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' })}
                                        {" - "}
                                        {new Date(booking.checkOut).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="md:text-right bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[200px]">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1 relative top-[-2px]">Total Biaya</p>
                            <p className="text-2xl font-bold text-emerald-600 tracking-tight">Rp {booking.total.toLocaleString("id-ID")}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-5 border-t border-slate-100 gap-4 w-full">
                        <span className="text-xs text-slate-400">
                            Dipesan pada {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                        </span>

                        <div className="flex gap-3 w-full sm:w-auto">
                            {(booking.status === "Pending" || booking.status === "Dikonfirmasi") && (
                                <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs h-10 px-4 w-full sm:w-auto shadow-sm tracking-wide">
                                            Batalkan Pesanan
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="font-serif text-2xl text-slate-900">Konfirmasi Pembatalan</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                Apakah Anda yakin ingin membatalkan pesanan kamar <strong>{booking.room.name}</strong>? Pembatalan ini akan diteruskan ke pihak pengelola untuk dikonfirmasi.
                                            </p>
                                            <Textarea
                                                placeholder="Beri tahu kami alasan pembatalan Anda..."
                                                className="resize-none h-24"
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>Kembali</Button>
                                            <Button variant="destructive" onClick={handleCancel} disabled={loading}>
                                                Kirim Pengajuan
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}

                            {booking.status === "Pending" && (
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        onClick={handleForceConfirm}
                                        disabled={loading}
                                        className="h-10 text-xs shadow-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                                    >
                                        Simulasi Sukses (Dev)
                                    </Button>
                                    <Link href={`/kamar/${booking.roomId}`} className="w-full sm:w-auto">
                                        <Button disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs h-10 w-full shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] px-6 tracking-wide transition-all hover:translate-y-[-1px]">
                                            Selesaikan Pembayaran
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
