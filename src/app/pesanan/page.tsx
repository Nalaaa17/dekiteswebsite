import { getUserBookings } from "@/lib/actions/booking";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, ShoppingBag } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BookingCard from "./booking-card";

export default async function PesananPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/login");
    }

    const bookings = await getUserBookings();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 py-12 md:py-24 max-w-5xl">
                <div className="mb-12 border-b pb-6">
                    <h1 className="text-3xl font-serif text-slate-900 flex items-center gap-3">
                        <CalendarDays className="h-8 w-8 text-emerald-600" />
                        Pesanan Saya
                    </h1>
                    <p className="text-slate-500 mt-2">Daftar riwayat penyewaan kamar Anda di De'Kites. Kelola pesanan dan konfirmasi pembayaran di sini.</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                            <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-medium text-slate-700 mb-2">Belum Ada Pesanan</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">Anda belum memiliki riwayat pesanan kamar apa pun. Pesan kamar idaman Anda sekarang.</p>
                        <Link href="/#kamar">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full h-12 uppercase tracking-wide text-xs">
                                Mulai Pesan
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((booking: any) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}