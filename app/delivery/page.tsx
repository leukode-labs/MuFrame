import type { Metadata } from "next";
import DeliveryPage from "@/components/DeliveryPage";

export const metadata: Metadata = {
  title: "Delivery and returns",
  description: "How MU-FRAME delivers in Kigali and across Rwanda, what to check when your frame arrives, and what we do if something is wrong.",
};

export default function Page() {
  return (
    <main>
      <DeliveryPage />
    </main>
  );
}
