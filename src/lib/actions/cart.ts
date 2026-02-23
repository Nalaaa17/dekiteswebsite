"use server";

import { prisma } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addToCart(roomId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Silakan log in terlebih dahulu");

    try {
        const existing = await prisma.cart.findFirst({
            where: { userId: session.user.id, roomId }
        });

        if (existing) {
            return { success: false, message: "Kamar sudah ada di keranjang" };
        }

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room || room.stock < 1) {
            return { success: false, message: "Kamar tidak tersedia atau stok habis" };
        }

        // Jalankan transaction agar aman
        await prisma.$transaction([
            prisma.cart.create({
                data: {
                    userId: session.user.id,
                    roomId
                }
            }),
            prisma.room.update({
                where: { id: roomId },
                data: { stock: { decrement: 1 } }
            })
        ]);

        revalidatePath("/profile");
        return { success: true, message: "Berhasil ditambahkan ke keranjang" };
    } catch (error) {
        console.error("Cart Add Error:", error);
        return { success: false, message: "Gagal menambahkan ke keranjang" };
    }
}

export async function getUserCart() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return [];

    try {
        const carts = await prisma.cart.findMany({
            where: { userId: session.user.id },
            include: {
                room: true
            },
            orderBy: { createdAt: "desc" }
        });
        return carts;
    } catch (error) {
        console.error("Cart Fetch Error:", error);
        return [];
    }
}

export async function removeFromCart(cartId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    try {
        const cart = await prisma.cart.findUnique({ where: { id: cartId } });
        if (!cart || cart.userId !== session.user.id) throw new Error("Not Found");

        await prisma.$transaction([
            prisma.cart.delete({
                where: { id: cartId }
            }),
            prisma.room.update({
                where: { id: cart.roomId },
                data: { stock: { increment: 1 } }
            })
        ]);
        revalidatePath("/profile");
        return { success: true, message: "Berhasil dihapus dari keranjang" };
    } catch (error) {
        console.error("Cart Remove Error:", error);
        return { success: false, message: "Gagal menghapus dari keranjang" };
    }
}
