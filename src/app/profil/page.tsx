"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilPage() {
    const router = useRouter();
    const { data: session, isPending, refetch } = authClient.useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Image Upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB Limit
            toast.warning("Ukuran gambar maksimal 2MB untuk menjaga performa.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (!isPending) {
            if (!session) {
                router.push("/login");
            } else {
                setName(session.user.name || "");
                setEmail(session.user.email || "");
                setAvatarUrl(session.user.image || "");
            }
        }
    }, [session, isPending, router]);

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            toast.error("Nama tidak boleh kosong.");
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await authClient.updateUser({
                name,
                image: avatarUrl || undefined
            });

            if (error) {
                toast.error("Gagal memperbarui profil: " + error.message);
            } else {
                toast.success("Profil berhasil diperbarui!");
                await refetch();
            }
        } catch (err: any) {
            toast.error("Terjadi kesalahan teknis saat memperbarui profil.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword) {
            toast.warning("Silakan isi password lama dan password baru.");
            return;
        }

        if (newPassword.length < 8) {
            toast.warning("Password baru minimal 8 karakter.");
            return;
        }

        setIsChangingPassword(true);
        try {
            const { error } = await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: true
            });

            if (error) {
                toast.error("Gagal mengganti password: " + error.message);
            } else {
                toast.success("Password berhasil diubah. Sesi lain telah dikeluarkan.");
                setCurrentPassword("");
                setNewPassword("");
            }
        } catch (err: any) {
            toast.error("Terjadi kesalahan sistem saat mengganti password.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                <Navbar />
                {/* Skeleton Header */}
                <div className="bg-slate-950 pt-32 pb-24 shadow-inner relative">
                    <div className="container mx-auto px-6 md:px-16 flex flex-col items-center">
                        <Skeleton className="h-10 w-64 bg-slate-800 mb-4" />
                        <Skeleton className="h-4 w-96 bg-slate-800/50" />
                    </div>
                </div>

                {/* Skeleton Content */}
                <main className="flex-1 container mx-auto px-6 md:px-16 -mt-12 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 z-20">
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-none shadow-xl rounded-sm overflow-hidden bg-white">
                            <div className="h-2 w-full bg-slate-200" />
                            <CardContent className="p-8 flex flex-col items-center space-y-4">
                                <Skeleton className="w-24 h-24 rounded-full" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-3 w-48 mt-1" />
                                <Skeleton className="h-8 w-40 rounded-full mt-4" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="border border-slate-200 shadow-sm rounded-sm bg-white p-6 md:p-8">
                            <Skeleton className="h-6 w-48 mb-6" />
                            <div className="space-y-6">
                                <div>
                                    <Skeleton className="h-3 w-24 mb-2" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div>
                                    <Skeleton className="h-3 w-24 mb-2" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div>
                                    <Skeleton className="h-3 w-24 mb-2" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* HEADER */}
            <div className="bg-slate-950 pt-32 pb-24 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
                <div className="container mx-auto px-6 md:px-16 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-4">Pengaturan Profil</h1>
                    <p className="text-slate-400 font-light text-lg">Kelola informasi pribadi dan keamanan akun Anda.</p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 container mx-auto px-6 md:px-16 -mt-12 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 z-20">
                {/* KIRI: Informasi Utama */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-xl rounded-sm overflow-hidden">
                        <div className="h-2 w-full bg-emerald-500" />
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-md" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center ring-4 ring-white shadow-md text-slate-400">
                                        <UserCircle size={48} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif text-slate-900">{session.user.name}</h2>
                                <p className="text-slate-500 text-sm mt-1">{session.user.email}</p>
                            </div>
                            <div className="pt-4 flex items-center text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                                <ShieldCheck size={16} className="mr-2" />
                                {((session.user as any).role === "admin") ? "Administrator" : "User Terverifikasi"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* KANAN: Form Pengaturan */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Data Diri */}
                    <Card className="border border-slate-200 shadow-sm rounded-sm">
                        <CardHeader className="bg-white border-b border-slate-100 pb-6">
                            <CardTitle className="font-serif text-2xl text-slate-900">Data Pribadi</CardTitle>
                            <CardDescription className="text-slate-500">Perbarui informasi identitas profil Anda di sini.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6 bg-slate-50/50">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Alamat Email <span className="text-red-400">*</span></Label>
                                <Input
                                    id="email"
                                    value={email}
                                    disabled
                                    className="bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-slate-400 italic">Email digunakan sebagai identitas login utama dan tidak dapat diubah.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-slate-300 focus-visible:ring-emerald-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="avatarUrl" className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Unggah Foto Profil (Galeri)</Label>
                                <Input
                                    id="avatarUrl"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="border-slate-300 focus-visible:ring-emerald-500 file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer h-12"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Pilih dari perangkat lokal Anda (Maksimal 2MB).</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={isSaving}
                                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-sm px-8"
                                >
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Keamanan */}
                    <Card className="border border-red-100 shadow-sm rounded-sm">
                        <CardHeader className="bg-white border-b border-red-50 pb-6">
                            <CardTitle className="font-serif text-2xl text-red-900">Keamanan Akun</CardTitle>
                            <CardDescription className="text-red-500/80">Ubah kata sandi Anda secara berkala untuk menjaga keamanan akun.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6 bg-red-50/10">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword" className="text-xs uppercase tracking-widest text-slate-600 font-semibold">Password Saat Ini</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="border-slate-300 focus-visible:ring-emerald-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-xs uppercase tracking-widest text-slate-600 font-semibold">Password Baru</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="border-slate-300 focus-visible:ring-emerald-500"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    onClick={handlePasswordChange}
                                    disabled={isChangingPassword}
                                    variant="outline"
                                    className="border-red-200 text-red-700 hover:bg-red-50 rounded-sm px-8"
                                >
                                    {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                    Perbarui Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
