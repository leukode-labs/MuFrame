import type { Metadata } from "next";
import Link from "next/link";
import Legal, { type LegalSection } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Terms",
  description: "The simple terms for ordering a frame from MU-FRAME in Kigali: orders, custom photos, payment, delivery and changes.",
};

const S: LegalSection[] = [
  { id: "who", title: "Who we are", body: <p>MU-FRAME makes neon and LED frames in Kigali, Rwanda. When these terms say &ldquo;we&rdquo;, they mean MU-FRAME. When they say &ldquo;you&rdquo;, they mean the person placing an order.</p> },
  { id: "orders", title: "How an order works", body: (<><p>When you press &ldquo;Send order on WhatsApp&rdquo;, your order is written out in a chat with us. That message is a request, not a purchase. Your order is only confirmed when we reply and agree the details with you: the design, the size, the colours and the price.</p><p>Nothing is made until you have confirmed it.</p></>) },
  { id: "price", title: "Prices and payment", body: (<><p>Prices are in Rwandan francs (RWF). The price you see on the site is a guide. The price we confirm in the chat is the price you pay.</p><p>We take payment by Mobile Money, and we send the payment details once your order is confirmed.</p></>) },
  { id: "custom", title: "Custom frames and your photos", body: (<><p>For a custom frame you send us a photo or a design. By sending it you confirm that it is yours, or that you have permission to use it, and that it does not infringe anyone else&rsquo;s rights.</p><ul><li>We may decline a picture that we cannot make well, or that we are not able to use. We will tell you why.</li><li>The preview in the studio is a guide to how the frame will look. A real light is never exactly like a screen, so small differences in colour and detail are normal.</li><li>You keep the rights to your photo. We use it only to make your frame.</li></ul></>) },
  { id: "making", title: "Making and delivery", body: <p>How long a frame takes and how delivery works are on the <Link href="/delivery">delivery page</Link>. Times are our best estimate and we confirm them with you when you order.</p> },
  { id: "changes", title: "Changes and cancelling", body: <p>You can change or cancel your order any time before we start making it, by messaging us in the same chat. Once we have started, we will tell you what can still be changed. Custom frames are made around your picture, so we cannot offer them to someone else.</p> },
  { id: "faults", title: "Damage and faults", body: <p>If your frame arrives damaged or does not light as agreed, tell us with photos or a short video and we will repair it or make you a new one. More detail is on the <Link href="/delivery">delivery page</Link>.</p> },
  { id: "care", title: "Using your frame safely", body: <p>Keep your frame dry and away from heat, and do not use it if the cable or the frame is visibly damaged. We send care notes with every frame. Follow them and your frame will last.</p> },
  { id: "law", title: "The law that applies", body: <p>These terms are governed by the laws of Rwanda. If we cannot agree something between us, we would like to talk first and solve it together.</p> },
  { id: "changes-terms", title: "Changes to these terms", body: <p>We may update these terms from time to time. The date at the top of this page shows when they last changed. The terms that apply to your order are the ones on the day we confirmed it.</p> },
];

export default function Page() {
  return <Legal kicker="Terms" title="Plain terms for a plain deal." lead="We would rather you understood the deal than skim it. Here is how ordering from MU-FRAME works." sections={S} />;
}
