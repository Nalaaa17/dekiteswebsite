import { prisma } from "@/lib/auth";
import { Webhook } from "@polar-sh/sdk/webhooks";
import { Resend } from "resend"; // 1. Import Resend

// Inisialisasi Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("polar-signature") || "";

    try {
        const event = Webhook.verify(
            body,
            signature,
            process.env.POLAR_WEBHOOK_SECRET!
        );

        if (event.type === "checkout.updated" && event.data.status === "succeeded") {
            const bookingId = event.data.metadata.bookingId;

            // 2. Update status dan AMBIL data user + kamar sekaligus
            const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: { status: "Dikonfirmasi" },
                include: {
                    user: true, // Ambil email user
                    room: true, // Ambil nama kamar
                }
            });

            // 3. Susun dan Kirim Email Invoice
            await resend.emails.send({
                from: "De'Kites Admin <onboarding@resend.dev>", // Email default testing dari Resend
                to: updatedBooking.user.email, // Targetkan ke email user yang booking
                subject: `Invoice Pembayaran Lunas - ${updatedBooking.room.name}`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #0f172a; text-transform: uppercase; letter-spacing: 2px;">De'Kites Premium Living</h2>
            <p style="color: #64748b;">Halo <strong>${updatedBooking.user.name}</strong>,</p>
            <p style="color: #64748b;">Terima kasih! Pembayaran Anda telah kami terima.</p>
            
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
        `,
            });

            console.log("Email invoice berhasil dikirim ke:", updatedBooking.user.email);
        }

        return new Response("Webhook Berhasil", { status: 200 });
    } catch (err) {
        console.error("Webhook Error:", err);
        return new Response("Webhook Error", { status: 400 });
    }
}