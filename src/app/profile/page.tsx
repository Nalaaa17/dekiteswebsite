"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    User,
    Settings,
    LogOut,
    ShoppingBag,
    History,
    MapPin,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getUserCart, removeFromCart } from "@/lib/actions/cart";
import { Loader2, Trash2 } from "lucide-react";

// IMPORT KOMPONEN KONSISTEN
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [cartItems, setCartItems] = React.useState<any[]>([]);
    const [cartLoading, setCartLoading] = React.useState(false);

    React.useEffect(() => {
        if (session) {
            fetchCart();
        }
    }, [session]);

    const fetchCart = async () => {
        setCartLoading(true);
        const carts = await getUserCart();
        setCartItems(carts);
        setCartLoading(false);
    };

    const handleRemoveCart = async (id: string) => {
        const res = await removeFromCart(id);
        if (res.success) fetchCart();
    };

    if (isPending) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <p className="font-serif italic text-slate-400 animate-pulse">Memuat kemewahan De'Kites...</p>
        </div>
    );

    if (!session) {
        router.push("/login");
        return null;
    }

    const user = session.user;

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 border-none">
            {/* --- NAVBAR --- */}
            <Navbar />

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-grow pt-32 pb-20 px-6 md:px-16">
                <div className="max-w-6xl mx-auto space-y-10">

                    {/* HEADER PROFIL (DARI KODE SEBELUMNYA) */}
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 bg-slate-950 p-8 border border-slate-800 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <Avatar className="h-24 w-24 border-4 border-slate-800 shadow-xl">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-white text-slate-900 text-2xl font-serif">
                                    {user.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium">Anggota Premium</p>
                                <h1 className="text-3xl font-serif text-white">{user.name}</h1>
                                <p className="text-slate-400 text-sm font-light">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="outline" className="flex-1 md:flex-none rounded-none px-6 text-xs tracking-widest uppercase border-slate-700 text-white bg-transparent hover:bg-slate-800 hover:text-white">
                                <Settings className="mr-2 h-4 w-4" /> Pengaturan
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 md:flex-none rounded-none px-6 text-xs tracking-widest uppercase"
                                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Keluar
                            </Button>
                        </div>
                    </div>

                    {/* TABS DENGAN TABEL LENGKAP */}
                    <Tabs defaultValue="pesanan" className="w-full">
                        <TabsList className="bg-transparent border-b border-slate-800 w-full justify-start rounded-none h-auto p-0 space-x-8">
                            <TabsTrigger value="pesanan" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 px-0 pb-4 text-xs tracking-[0.2em] uppercase font-semibold">
                                Pesanan Kamar
                            </TabsTrigger>
                            <TabsTrigger value="keranjang" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-400 px-0 pb-4 text-xs tracking-[0.2em] uppercase font-semibold">
                                Keranjang Saya
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pesanan" className="pt-8">
                            <Card className="rounded-none border-none shadow-none bg-transparent">
                                <CardHeader className="px-0">
                                    <CardTitle className="font-serif text-2xl text-white">Riwayat Reservasi</CardTitle>
                                </CardHeader>
                                <CardContent className="px-0 bg-slate-950 border border-slate-800 shadow-sm overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-900">
                                            <TableRow className="hover:bg-transparent border-slate-800">
                                                <TableHead className="text-[10px] uppercase tracking-widest text-slate-400 py-4">Tipe Kamar</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-slate-400">Check-In</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                                                <TableHead className="text-right text-[10px] uppercase tracking-widest text-slate-400">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* BARIS DATA INI TETAP ADA SEPERTI SEBELUMNYA */}
                                            <TableRow className="group cursor-pointer border-slate-800 hover:bg-slate-900 transition-colors">
                                                <TableCell className="font-medium py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-16 bg-slate-800 rounded-sm overflow-hidden">
                                                            <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=150" alt="Room" className="object-cover h-full w-full" />
                                                        </div>
                                                        <span className="font-serif text-white">Deluxe Suite Room #204</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-400 font-light italic">25 Feb 2026</TableCell>
                                                <TableCell>
                                                    <span className="px-3 py-1 bg-green-950/50 text-green-400 text-[10px] uppercase tracking-widest font-bold border border-green-900/50">
                                                        Aktif
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-white">Rp 4.000.000</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <div className="p-6 border-t border-slate-800 flex justify-center">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400">Menampilkan pesanan terbaru Anda</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="keranjang" className="pt-8">
                            <Card className="rounded-none border-none shadow-none bg-transparent">
                                <CardHeader className="px-0">
                                    <CardTitle className="font-serif text-2xl text-white">Keranjang Saya</CardTitle>
                                </CardHeader>
                                <CardContent className="px-0 bg-slate-950 border border-slate-800 shadow-sm overflow-hidden min-h-[50vh]">
                                    {cartLoading ? (
                                        <div className="py-24 flex justify-center items-center"><Loader2 className="animate-spin text-slate-400" /></div>
                                    ) : cartItems.length === 0 ? (
                                        <div className="py-24 text-center">
                                            <p className="text-slate-400 font-serif italic text-lg">Keranjang Anda masih kosong.</p>
                                            <Button variant="link" className="text-white uppercase tracking-widest text-[10px] mt-4" onClick={() => router.push("/")}>
                                                Mulai Jelajahi De'Kites
                                            </Button>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableBody>
                                                {cartItems.map((cart) => (
                                                    <TableRow key={cart.id} className="group border-slate-800 hover:bg-slate-900 transition-colors">
                                                        <TableCell className="font-medium py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-16 w-24 bg-slate-800 rounded-none overflow-hidden border border-slate-700">
                                                                    <img src={cart.room.images[0]} alt="Room" className="object-cover h-full w-full" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-serif text-white text-lg">{cart.room.name}</span>
                                                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Rp {cart.room.price.toLocaleString("id-ID")}</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button onClick={() => router.push(`/kamar/${cart.room.id}`)} className="mr-3 rounded-none bg-white text-slate-950 hover:bg-slate-200 text-[10px] uppercase tracking-widest h-10 px-6 font-medium">
                                                                Checkout Details
                                                            </Button>
                                                            <Button variant="destructive" onClick={() => handleRemoveCart(cart.id)} className="rounded-none text-[10px] uppercase tracking-widest h-10 px-4">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                </div>
            </main>

            {/* --- FOOTER --- */}
            <Footer />
        </div>
    );
}