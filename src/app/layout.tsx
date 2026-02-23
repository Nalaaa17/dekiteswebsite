import { Inter, Playfair_Display } from "next/font/google"; // Import font
import "./globals.css";
import ScrollToTop from "@/components/scroll-to-top";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-emerald-200 selection:text-emerald-900`}>
        <ScrollToTop />
        {children}
        <Toaster />
      </body>
    </html>
  );
}