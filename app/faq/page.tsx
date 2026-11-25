import type { Metadata } from "next";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "How ordering, payment, custom photos and delivery work at MU-FRAME.",
};

export default function FaqPage() {
  return (
    <main>
      <Faq page />
    </main>
  );
}
