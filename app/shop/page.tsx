import type { Metadata } from "next";
import Collection from "@/components/Collection";

export const metadata: Metadata = {
  title: "Shop frames",
  description: "Neon and LED frames: cars, sport and art. Order on WhatsApp, pay with Mobile Money, delivered in Kigali.",
};

export default function ShopPage() {
  return (
    <main>
      <Collection page />
    </main>
  );
}
