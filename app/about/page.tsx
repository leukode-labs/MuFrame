import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About",
  description: "MU-FRAME makes neon and LED frames in Kigali for homes, bedrooms, studios and shops.",
};

export default function AboutPage() {
  return (
    <main>
      <About page />
    </main>
  );
}
