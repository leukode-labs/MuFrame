import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import GlassNav from "@/components/GlassNav";
import Closing from "@/components/Closing";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: { default: "MU-FRAME | Neon and LED frames, Kigali", template: "%s | MU-FRAME" },
  description: "Neon and LED frames for your walls. Choose a design or turn your own photo into one.",
};

export const viewport: Viewport = { themeColor: "#05060f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} style={{ scrollBehavior: "smooth" }}>
      <body className="antialiased">
        <CartProvider>
          <GlassNav />
          {children}
          <Closing />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
