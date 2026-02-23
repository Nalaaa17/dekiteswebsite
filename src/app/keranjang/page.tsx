import { getUserCart, removeFromCart } from "@/lib/actions/cart";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RemoveFromCartButton from "./remove-button";

export default async function KeranjangPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/login");
    }

    const cartItems = await getUserCart();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 py-12 md:py-24 max-w-5xl">
                <div className="mb-12 border-b pb-6">
                    <h1 className="text-3xl font-serif text-slate-900 flex items-center gap-3">
                        <ShoppingBag className="h-8 w-8 text-emerald-600" />
                        Keranjang Saya
                    </h1>
                    <p className="text-slate-500 mt-2">Daftar kamar yang telah Anda simpan.</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                            <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-medium text-slate-700 mb-2">Keranjang Anda Kosong</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">Anda belum menambahkan kamar apa pun ke keranjang. Jelajahi pilihan kamar premium kami dan temukan hunian ideal Anda.</p>
                        <Link href="/#kamar">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full h-12 uppercase tracking-wide text-xs">
                                Cari Kamar
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {cartItems.map((item: any) => (
                            <Card key={item.id} className="overflow-hidden border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 bg-white hover:-translate-y-1 group relative">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-1/3 md:w-1/4 h-48 sm:h-auto relative overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10 duration-500" />
                                        <img
                                            src={item.room.images?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1470&auto=format&fit=crop"}
                                            alt={item.room.name}
                                            className="w-full h-full object-cover absolute inset-0 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                    <CardContent className="p-6 sm:w-2/3 md:w-3/4 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-serif text-slate-900 mb-1">{item.room.name}</h3>
                                                <p className="text-emerald-600 font-bold mb-4">
                                                    Rp {item.room.price.toLocaleString("id-ID")} <span className="text-slate-500 font-normal text-sm">/ bulan</span>
                                                </p>
                                            </div>
                                            <RemoveFromCartButton cartId={item.id} />
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                            <span className="text-xs text-slate-400">
                                                Ditambahkan pada {new Date(item.createdAt).toLocaleDateString("id-ID")}
                                            </span>
                                            <Link href={`/kamar/${item.room.id}?cartId=${item.id}`}>
                                                <Button variant="default" className="bg-slate-900 hover:bg-slate-800 text-white rounded-none px-6">
                                                    Lanjut Pesan <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
