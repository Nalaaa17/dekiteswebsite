import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle2, ShieldCheck, Wifi, MapPin, Car, Droplets } from "lucide-react";
import Image from "next/image";
import * as motion from "framer-motion/client";

export const metadata = {
    title: "Fasilitas Premium | De'Kites",
    description: "Nikmati hunian eksklusif dengan fasilitas kelas satu di De'Kites.",
};

export default function FasilitasPage() {
    const facilities = [
        {
            title: "Koneksi WiFi Super Cepat",
            description: "Dilengkapi dengan router dedicated berlari hingga 100Mbps per kamar untuk memastikan produktivitas kerja dan hiburan Anda tanpa batas.",
            icon: <Wifi className="h-8 w-8 text-emerald-500" />,
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1470&auto=format&fit=crop"
        },
        {
            title: "Desain Kamar Bersih & Elegan",
            description: "Tim kebersihan profesional kami rutin memastikan setiap sudut ruangan higienis, bebas debu, dan memancarkan wangi yang menenangkan setiap harinya.",
            icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />,
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop"
        },
        {
            title: "Keamanan 24/7 Terjamin",
            description: "Sistem keamanan modern dengan Smart Lock Door di setiap kamar dan CCTV yang memantau area publik hunian selama 24 jam penuh.",
            icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1470&auto=format&fit=crop"
        },
        {
            title: "Akses Parkir Luas & Aman",
            description: "Kapasitas parkir kendaraan roda dua dan roda empat yang sangat memadai dengan pengawasan penuh, menunjang mobilitas Anda.",
            icon: <Car className="h-8 w-8 text-emerald-500" />,
            image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1470&auto=format&fit=crop"
        },
        {
            title: "Area Resapan Tinggi (Bebas Banjir)",
            description: "Terletak di dataran stabil dengan sistem drainase premium. De'Kites menjamin keamanan aset dan kenyamanan Anda bahkan di puncak musim hujan.",
            icon: <Droplets className="h-8 w-8 text-emerald-500" />,
            image: "https://images.unsplash.com/photo-1497215458101-856f4ea42174?q=80&w=1470&auto=format&fit=crop"
        },
        {
            title: "Lokasi Sangat Strategis",
            description: "Hanya 5 menit menuju pusat perkantoran terbesar, pusat perbelanjaan elit, dan berbagai fasilitas publik seperti rumah sakit serta stasiun.",
            icon: <MapPin className="h-8 w-8 text-emerald-500" />,
            image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop"
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            {/* HEADER HERO */}
            <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2674&auto=format&fit=crop"
                        alt="Fasilitas Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div className="relative container mx-auto px-6 md:px-16 text-center z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-emerald-500 uppercase tracking-[0.3em] font-medium text-xs md:text-sm mb-4">Kemewahan dalam Kenyamanan</p>
                        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight mb-6">
                            Fasilitas Eksklusif <br className="hidden md:block" />
                            <span className="italic font-light">De'Kites Premium</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Kami dedikasikan seluruh kualitas dan komitmen pelayanan terbaik untuk menunjang gaya hidup modern Anda, tanpa kompromi.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* FACILITIES GRID LIST */}
            <main className="flex-1 py-16 md:py-24 container mx-auto px-6 md:px-16">
                <div className="flex flex-col gap-16 md:gap-24">
                    {facilities.map((fac, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 lg:gap-20`}
                        >
                            <div className="w-full md:w-1/2">
                                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl group">
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <img
                                        src={fac.image}
                                        alt={fac.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 space-y-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner border border-emerald-100">
                                    {fac.icon}
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 leading-tight">
                                    {fac.title}
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
                                    {fac.description}
                                </p>
                                <div className="pt-4">
                                    <div className="h-0.5 w-12 bg-emerald-600" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* BOTTOM CALL TO ACTION */}
            <section className="bg-slate-900 py-24 text-center mt-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" />
                <div className="container mx-auto px-6 relative z-10 space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif text-white">Rasakan Langsung Kemewahannya!</h2>
                    <p className="text-slate-400 max-w-lg mx-auto text-lg mb-8">Pesan kamar idaman Anda sekarang dan nikmati seluruh pengalaman tak terlupakan bersama De'Kites.</p>
                    <a href="/#kamar">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white uppercase tracking-widest text-sm px-10 py-5 font-semibold transition-all transform hover:-translate-y-1 shadow-[0_10px_40px_rgba(16,185,129,0.3)]">
                            JELAJAHI KAMAR
                        </button>
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}
