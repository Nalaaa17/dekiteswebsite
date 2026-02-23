import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";

export default function PesananLoading() {
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

                <div className="grid grid-cols-1 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <Skeleton className="md:w-1/4 h-48 md:h-auto" />
                            <div className="p-6 md:w-3/4 flex flex-col justify-between w-full">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                    <div className="space-y-3 w-full">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-6 w-3/4 max-w-[250px]" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <div className="min-w-[200px] space-y-2 py-2">
                                        <Skeleton className="h-3 w-20 ml-auto" />
                                        <Skeleton className="h-8 w-32 ml-auto" />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-5 border-t border-slate-100 gap-4 w-full">
                                    <Skeleton className="h-3 w-40" />
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Skeleton className="h-10 w-full sm:w-32" />
                                        <Skeleton className="h-10 w-full sm:w-40" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
