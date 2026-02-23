"use server";

import { prisma } from "@/lib/auth";

export async function getRoomById(id: string) {
    try {
        const room = await prisma.room.findUnique({
            where: { id: id }
        });

        if (!room) {
            return { success: false, data: null, message: "Kamar tidak ditemukan" };
        }

        return { success: true, data: room, message: "Kamar berhasil dimuat" };
    } catch (error) {
        console.error("Fetch Room Error:", error);
        return { success: false, data: null, message: "Terjadi kesalahan sistem saat memuat kamar" };
    }
}
