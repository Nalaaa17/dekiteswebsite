import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import AboutSection from "@/components/about-section";
import RoomSection from "@/components/room-section";
import Footer from "@/components/footer";
import { prisma, auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  const rooms = await prisma.room.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <AboutSection />
      <RoomSection rooms={rooms} />
      {/* Tambahkan section fasilitas di sini nanti jika perlu */}
      <Footer />
    </main>
  );
}