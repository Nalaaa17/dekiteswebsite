"use server";

import { prisma } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Polar } from "@polar-sh/sdk";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN || "",
    server: "sandbox", // <--- 1. TAMBAHKAN BARIS INI UNTUK MODE SANDBOX
});

export async function createBookingWithPolar(roomId: string, amount: number, ktpName: string, ktpNumber: string, fromCartId?: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Silakan login");

    try {
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, message: "Kamar tidak ditemukan" };

        // If not from cart, ensure there's enough stock to decrement
        if (!fromCartId && room.stock < 1) {
            return { success: false, message: "Stok kamar habis" };
        }

        // 1. Transaction to handle booking + stock logic
        const [booking] = await prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
                data: {
                    userId: session.user.id,
                    roomId: roomId,
                    checkIn: new Date(),
                    checkOut: new Date(Date.now() + 86400000),
                    ktpName: ktpName,
                    ktpNumber: ktpNumber,
                    total: amount,
                    status: "Pending",
                },
            });

            if (fromCartId) {
                // Hapus dari keranjang. Stok TETAP KARENA saat di keranjang stok sudah dikurangi.
                await tx.cart.delete({ where: { id: fromCartId } }).catch(() => { });
            } else {
                // Booking langsung tanpa keranjang -> kurangi stok.
                await tx.room.update({
                    where: { id: roomId },
                    data: { stock: { decrement: 1 } }
                });
            }

            return [newBooking];
        });

        // 2. Buat Checkout di Polar
        const result = await polar.checkouts.create({
            amount: amount,
            products: ["362e0441-90a8-4116-8075-4877759cd324"], // ID Produk dari dashboard Polar kamu
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pesanan`,
            customerEmail: session.user.email,
            metadata: {
                bookingId: booking.id, // ID ini penting untuk Webhook nanti
            },
        });

        return { success: true, url: result.url };
    } catch (error) {
        console.error("Polar Error:", error);
        return { success: false };
    }
}

export async function getUserBookings() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return [];

    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: session.user.id },
            include: { room: true },
            orderBy: { createdAt: "desc" }
        });
        return bookings;
    } catch (error) {
        console.error("Failed to fetch user bookings:", error);
        return [];
    }
}

import { revalidatePath } from "next/cache";

export async function cancelBooking(id: string, reason: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        await prisma.booking.update({
            where: { id },
            data: {
                status: "Menunggu Pembatalan",
                cancelReason: reason
            }
        });
        revalidatePath("/pesanan");
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Gagal membatalkan pesanan" };
    }
}

export async function forceConfirmLocal(id: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: "Dikonfirmasi" },
            include: { user: true, room: true }
        });

        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "De'Kites Admin <onboarding@resend.dev>",
                    to: updatedBooking.user.email,
                    subject: `Invoice Pembayaran Lunas - ${updatedBooking.room.name}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                            <h2 style="color: #0f172a; text-transform: uppercase; letter-spacing: 2px;">De'Kites Premium Living</h2>
                            <p style="color: #64748b;">Halo <strong>${updatedBooking.user.name}</strong>,</p>
                            <p style="color: #64748b;">Terima kasih! Pembayaran Anda telah kami terima (Verifikasi Manual Developer).</p>
                            
                            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
                            <h3 style="margin: 0 0 10px 0;">Detail Reservasi:</h3>
                            <ul style="list-style: none; padding: 0; margin: 0; color: #334155;">
                                <li style="margin-bottom: 5px;"><strong>Kamar:</strong> ${updatedBooking.room.name}</li>
                                <li style="margin-bottom: 5px;"><strong>Periode:</strong> ${new Date(updatedBooking.checkIn).toLocaleDateString("id-ID")} - ${new Date(updatedBooking.checkOut).toLocaleDateString("id-ID")}</li>
                                <li style="margin-bottom: 5px;"><strong>Total Bayar:</strong> Rp ${updatedBooking.total.toLocaleString("id-ID")}</li>
                                <li style="margin-bottom: 5px;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">LUNAS</span></li>
                            </ul>
                            </div>
                            
                            <p style="color: #64748b; font-size: 12px;">Simpan email ini sebagai bukti pembayaran yang sah.</p>
                        </div>
                    `
                });
            } catch (error) {
                console.log("Email test error:", error);
            }
        }

        revalidatePath("/pesanan");
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (err) {
        return { success: false, message: "Server error" };
    }
}