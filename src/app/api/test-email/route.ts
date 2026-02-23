import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(req: Request) {
    // 1. Ambil URL endpoint untuk mengetahui origin
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get("email");

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({
            success: false,
            message: "⚠️ RESEND_API_KEY belum terpasang di file .env Anda."
        }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const data = await resend.emails.send({
            from: "De'Kites Test <onboarding@resend.dev>",
            to: targetEmail || "delivered@resend.dev", // Kirim ke target atau default simulasi
            subject: "🛠️ Percobaan Resend API - De'Kites",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #10b981;">Integrasi Resend Berhasil! 🎉</h2>
                    <p style="color: #334155;">Jika Anda menerima email ini, berarti API Key Resend Anda valid dan aplikasi De'Kites sudah bisa mengirimkan struk pembayaran secara otomatis kepada pelanggan sesaat sesudah pesanan dikonfirmasi oleh Admin.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #f1f5f9;" />
                    <p style="font-size: 12px; color: #94a3b8;">Sistem Notifikasi Resmi De'Kites Premium</p>
                </div>
            `
        });

        return NextResponse.json({
            success: true,
            message: "Email percobaan berhasil dikirim!",
            data
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Gagal mengirim email. Periksa kembali API Key dan Setelan Domain Anda.",
            error: error.message
        }, { status: 500 });
    }
}
