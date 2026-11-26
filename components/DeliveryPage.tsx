import Link from "next/link";
import { INFO, orAsk } from "@/lib/info";
import { waLink } from "@/lib/shop";

const GLANCE: [string, string][] = [
  ["Made to order", "Every frame is made after you confirm"],
  ["Making time", orAsk(INFO.makeTime)],
  ["Delivery in Kigali", orAsk(INFO.deliveryKigali)],
  ["Delivery in the rest of Rwanda", orAsk(INFO.deliveryRwanda)],
  ["Payment", "Mobile Money, after we confirm"],
];

const PARTS: { n: string; title: string; body: React.ReactNode }[] = [
  {
    n: "01",
    title: "In Kigali",
    body: (
      <>
        <p>We make the frame here and bring it to your door ourselves. We message you on WhatsApp when it is ready and agree a time that suits you, so nobody is left waiting by a gate.</p>
        <p>Each frame travels wrapped and boxed. We ask you to open it with us on the chat, so we can see the light come on together.</p>
      </>
    ),
  },
  {
    n: "02",
    title: "Beyond Kigali",
    body: (
      <p>We can send frames to other towns in Rwanda. The cost and the time depend on where you are, so we confirm both with you on WhatsApp before you pay. Tell us the town when you order and we will come back with a clear price.</p>
    ),
  },
  {
    n: "03",
    title: "When it arrives",
    body: (
      <>
        <p>Check three things before we leave, or straight away if it was sent: the box and wrapping are intact, the frame lights up fully, and the colours are the ones we agreed.</p>
        <p>If something looks wrong, take a photo or a short video and send it to us in the same chat.</p>
      </>
    ),
  },
  {
    n: "04",
    title: "If something is wrong",
    body: (
      <>
        <p>If your frame arrives damaged, or does not light as it should, message us {INFO.damageWindow ? <strong className="font-semibold text-white">{INFO.damageWindow}</strong> : "as soon as you notice"} with photos. We look at it and either repair it or make you a new one. You do not need to argue your case: we made it, so we want it right.</p>
        <p>A frame that was made exactly as we agreed, and arrives in good order, is yours. If you simply change your mind, talk to us first: we will always tell you honestly what is possible.</p>
      </>
    ),
  },
  {
    n: "05",
    title: "Changing or cancelling",
    body: (
      <p>You can change your order any time before we start making it. Message us in the same chat. Once we have started, we will tell you what can still be changed. Custom frames are built around your picture, so we cannot give them to someone else.</p>
    ),
  },
];

export default function DeliveryPage() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05060f] px-5 pb-28 pt-36 sm:px-8 lg:px-[5vw] lg:pb-40 lg:pt-48">
      <span className="pattern-dots pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <span className="pointer-events-none absolute -right-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,31,75,0.22),transparent)]" />

      <div className="mx-auto max-w-[1180px]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/45">Delivery and returns</p>
        <h1 className="mt-5 text-[clamp(2.8rem,8.4vw,7.2rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
          Made here.
          <br />
          <span className="neon-text">Brought to you.</span>
        </h1>

        {/* the numbers, set like a ticket: label ........ value */}
        <dl className="mt-14 max-w-[760px] sm:mt-20">
          {GLANCE.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 border-b border-white/10 py-4 text-[15px] sm:flex-row sm:items-baseline sm:gap-3 sm:text-[17px]">
              <dt className="whitespace-nowrap font-semibold text-white">{k}</dt>
              <span className="mb-1 hidden min-w-4 flex-1 border-b border-dotted border-white/20 sm:block" aria-hidden="true" />
              <dd className="text-white/60 sm:text-right">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 sm:mt-32">
          {PARTS.map((p) => (
            <div key={p.n} className="grid gap-5 border-t border-white/10 py-10 sm:py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
              <div className="flex items-baseline gap-5 md:sticky md:top-32 md:self-start">
                <span className="text-[13px] font-semibold tabular-nums tracking-[0.2em] text-neon">{p.n}</span>
                <h2 className="text-[clamp(1.7rem,3.4vw,2.8rem)] font-bold leading-none tracking-[-0.035em]">{p.title}</h2>
              </div>
              <div className="max-w-[58ch] space-y-5 text-[17px] leading-[1.75] text-white/65">{p.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-10">
          <a href={waLink("Hi MU-FRAME, I have a question about delivery.")} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Ask about delivery
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <Link href="/faq" className="btn-text">Read the FAQ</Link>
        </div>
      </div>
    </section>
  );
}
