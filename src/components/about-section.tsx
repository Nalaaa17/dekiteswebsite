"use client";
import { motion } from "framer-motion";

export default function AboutSection() {
    return (
        <section id="tentang" className="py-24 bg-white">
            <div className="container mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 space-y-6"
                >
                    <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Tentang De'Kites</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
                        Definisi Baru Kenyamanan di Tengah Kota
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Terinspirasi dari kebutuhan akan ketenangan, De'Kites hadir untuk memberikan pengalaman menginap yang tak terlupakan. Setiap sudut ruangan dirancang dengan material premium untuk memastikan kenyamanan maksimal bagi Anda.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex-1 relative h-[400px] w-full"
                >
                    <img
                        src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1470&auto=format&fit=crop"
                        alt="Interior Mewah"
                        className="w-full h-full object-cover shadow-2xl rounded-sm"
                    />
                </motion.div>
            </div>
        </section>
    );
}