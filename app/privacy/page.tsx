import type { Metadata } from "next";
import Legal, { type LegalSection } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What MU-FRAME collects when you order or use the custom studio, why, and how to have it deleted.",
};

const S: LegalSection[] = [
  { id: "short", title: "The short version", body: <p>We collect only what we need to make and deliver your frame. We do not sell your information and we do not run advertising trackers on this site.</p> },
  { id: "collect", title: "What we collect", body: (<><ul><li><strong className="font-semibold text-white">What you tell us.</strong> Your name, phone number, delivery address and order details, when you message us on WhatsApp.</li><li><strong className="font-semibold text-white">Your photos.</strong> If you send a photo for a custom frame, we receive it so that we can make the frame.</li><li><strong className="font-semibold text-white">Your cart.</strong> Items you add to the cart are remembered in your own browser so they are still there when you come back. They are not sent to us until you send your order.</li></ul></>) },
  { id: "studio", title: "The custom studio", body: (<><p>When you play with a photo in the custom studio, the tracing happens in your browser. The photo is not uploaded while you work on it.</p><p>It is uploaded only if you choose to save your design online. In that case we store a picture of your design and give you a link to it. Anyone who has that link can see the picture, so share it only with people you trust.</p></>) },
  { id: "use", title: "How we use it", body: <p>To confirm your order, make your frame, arrange delivery, take payment and answer your questions. We do not use your photos for anything else, and we do not show them publicly without asking you first.</p> },
  { id: "others", title: "Who else handles it", body: (<><p>We rely on a few services to run the shop:</p><ul><li>WhatsApp, where our chats with you take place.</li><li>Your Mobile Money provider, for payments.</li><li>Our website host and file storage, which keep the site running and hold designs you choose to save. Like any website host, they keep ordinary technical logs of visits.</li></ul><p>These services have their own privacy policies. We share with them only what is needed for them to do their job.</p></>) },
  { id: "keep", title: "How long we keep it", body: <p>We keep your order details and photos while we make and deliver your frame, and for a reasonable time afterwards in case you need a repair or a repeat order. If you want us to delete them sooner, ask and we will.</p> },
  { id: "rights", title: "Your choices", body: (<><p>You can ask us at any time to show you what we hold about you, to correct it, or to delete it, including your photos and any saved design link. Message us on WhatsApp and we will do it.</p><p>If you saved a design online and want the link to stop working, tell us and we will remove it.</p></>) },
  { id: "kids", title: "Children", body: <p>The shop is meant for adults, or for young people ordering with an adult. If you think a child has sent us their details by mistake, tell us and we will delete them.</p> },
  { id: "update", title: "Changes to this page", body: <p>If we change how we handle your information, we will update this page and the date at the top.</p> },
];

export default function Page() {
  return <Legal kicker="Privacy" title="Your photos stay yours." lead="You send us pictures of your family, your car, your shop. Here is exactly what we do with them." sections={S} />;
}
