import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

export default function KeranjangLoading() {
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

                <div className="grid grid-cols-1 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <Skeleton className="sm:w-1/3 md:w-1/4 h-48 sm:h-auto" />
                            <div className="p-6 sm:w-2/3 md:w-3/4 flex flex-col justify-between w-full">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-5 w-1/2" />
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 w-full">
                                    <Skeleton className="h-3 w-32" />
                                    <Skeleton className="h-10 w-36" />
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
