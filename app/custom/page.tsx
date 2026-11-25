import type { Metadata } from "next";
import CustomStudio from "@/components/CustomStudio";

export const metadata: Metadata = {
  title: "Custom orders",
  description: "Turn your photo or logo into a neon or LED frame. Preview it, pick the light, order on WhatsApp.",
};

export default function CustomPage() {
  return (
    <main>
      <CustomStudio page />
    </main>
  );
}
