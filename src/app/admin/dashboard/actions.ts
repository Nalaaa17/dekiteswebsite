"use server";

import { prisma } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function getAdminDashboardData() {
    try {
        // 1. Ambil Statistik
        const totalRevenue = await prisma.booking.aggregate({
            where: { status: "Dikonfirmasi" },
            _sum: { total: true }
        });

        const activeBookings = await prisma.booking.count({
            where: { status: "Dikonfirmasi" }
        });

        const newUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)) // 7 hari terakhir
                }
            }
        });

        // 2. Ambil Daftar Booking Terbaru
        const recentBookings = await prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true } },
                room: { select: { name: true } }
            }
        });

        // 3. Ambil Semua Kamar
        const allRooms = await prisma.room.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // 4. Ambil Semua Pelanggan
        const allUsers = await prisma.user.findMany({
            where: { role: "user" },
            orderBy: { createdAt: 'desc' }
        });

        return {
            stats: {
                revenue: totalRevenue._sum.total || 0,
                active: activeBookings,
                customers: newUsers
            },
            bookings: recentBookings,
            rooms: allRooms,
            users: allUsers
        };
    } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        return null;
    }
}

export async function updateBookingStatus(bookingId: string, newStatus: string) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { user: true, room: true }
        });
        if (!booking) throw new Error("Booking tidak ditemukan");

        await prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: newStatus }
            });

            if (newStatus === "Dibatalkan" && booking.status !== "Dibatalkan") {
                await tx.room.update({
                    where: { id: booking.roomId },
                    data: { stock: { increment: 1 } }
                });
            }
        });

        // NOTIFIKASI EMAIL SECARA ASINKRON JIKA DIKONFIRMASI
        if (newStatus === "Dikonfirmasi" && booking.user?.email && process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "De'Kites <onboarding@resend.dev>", // Ganti ke custom domain saat production
                    to: booking.user.email,
                    subject: "✅ Horee! Pesanan Kamar De'Kites Anda Dikonfirmasi",
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #0f172a; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <h2 style="color: #10b981; margin-bottom: 5px;">Halo ${booking.user.name},</h2>
                            <p style="font-size: 16px;">Kabar gembira! Pembayaran dan pemesanan Anda untuk kamar <strong>${booking.room?.name}</strong> telah berhasil ditinjau dan dikonfirmasi oleh Administrator kami.</p>
                            
                            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 0; font-size: 14px; color: #64748b;">ID Pesanan: <span style="color: #0f172a; font-family: monospace;">${booking.id}</span></p>
                                <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Total Pembayaran: <strong style="color: #10b981; font-size: 18px;">Rp ${booking.total.toLocaleString("id-ID")}</strong></p>
                            </div>

                            <p style="font-size: 14px; line-height: 1.6;">Silakan hubungi staf operasional kami saat Anda siap untuk melakukan <em>Check-In</em> atau pengambilan kunci. Terima kasih telah memilih De'Kites Premium Living!</p>
                            
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Email ini dihasilkan secara otomatis oleh Sistem Manajemen De'Kites.</p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Gagal mengirim email notifikasi:", emailError);
            }
        }

        revalidatePath("/admin/dashboard");
        revalidatePath("/pesanan");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Gagal mengupdate status" };
    }
}

export async function deleteRoom(roomId: string) {
    try {
        await prisma.room.delete({
            where: { id: roomId }
        });
        revalidatePath("/admin/dashboard");
        revalidatePath("/kamar");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Gagal menghapus kamar. Pastikan tidak ada booking aktif." };
    }
}

export async function addRoom(formData: any) {
    try {
        const room = await prisma.room.create({
            data: {
                name: formData.name,
                description: formData.description + (formData.facilities ? `\n\nFasilitas: ${formData.facilities}` : ""),
                price: parseInt(formData.price),
                stock: parseInt(formData.stock) || 1,
                images: formData.images, // Array string URL foto
                isAvailable: true,
            },
        });

        revalidatePath("/admin/dashboard");
        return { success: true, room };
    } catch (error) {
        console.error("Gagal menambah kamar:", error);
        return { success: false };
    }
}