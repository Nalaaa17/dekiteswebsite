import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-16">
            <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4 space-y-4">
                    <h3 className="text-2xl font-serif text-white tracking-widest uppercase">De'Kites</h3>
                    <p className="text-sm leading-relaxed pr-8">Hunian eksklusif dengan fasilitas lengkap untuk gaya hidup modern Anda.</p>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h4 className="text-white font-semibold tracking-wide">Tautan Cepat</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="/" className="hover:text-emerald-400 transition-colors">Beranda</a></li>
                        <li><a href="/#kamar" className="hover:text-emerald-400 transition-colors">Kamar</a></li>
                        <li><a href="/fasilitas" className="hover:text-emerald-400 transition-colors">Fasilitas</a></li>
                    </ul>
                </div>

                <div className="md:col-span-3 space-y-4">
                    <h4 className="text-white font-semibold tracking-wide">Kontak Kami</h4>
                    <div className="flex items-start space-x-3 text-sm">
                        <MapPin size={18} className="mt-1 flex-shrink-0 text-emerald-500" />
                        <p className="leading-relaxed">Jl. Kebon Jeruk No. 123, Jakarta Barat, DKI Jakarta 11530</p>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <Mail size={18} className="text-emerald-500" />
                        <p>info@dekites.com</p>
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all cursor-pointer group">
                            <Instagram size={18} className="text-slate-400 group-hover:text-white" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all cursor-pointer group">
                            <Facebook size={18} className="text-slate-400 group-hover:text-white" />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                    <h4 className="text-white font-semibold tracking-wide">Lokasi Utama</h4>
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-slate-800 group relative">
                        <div className="absolute inset-0 bg-emerald-500/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5050893397945!2d106.7725923!3d-6.1969242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6df8f79611f%3A0xcb1b5e5eb4f47514!2sKebon%20Jeruk%2C%20West%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1707576566617!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Peta Lokasi De'Kites"
                            className="grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 md:px-16 mt-16 pt-8 border-t border-slate-800 text-center text-xs">
                © 2026 De'Kites Premium Living. Seluruh hak cipta dilindungi.
            </div>
        </footer>
    );
}