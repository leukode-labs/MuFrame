import SectionHead from "./SectionHead";

const FAQ = [
  {
    q: "How do I order?",
    a: "Add frames to your cart and tap “Send order on WhatsApp”. Your order arrives in our chat already written out, and we confirm everything with you there.",
  },
  {
    q: "Can I use my own photo?",
    a: "Yes. Use the custom frame section to preview your photo, then send the original file in the WhatsApp chat. A sharp, well-lit photo gives the best result.",
  },
  {
    q: "How do I pay?",
    a: "With Mobile Money. We send the payment details once your order is confirmed.",
  },
  {
    q: "What is the difference between neon and LED?",
    a: "Neon frames have a glowing line that outlines the artwork. LED frames are lit from behind, so the light spreads onto the wall around them.",
  },
  {
    q: "Can I change my order after sending it?",
    a: "Yes. Message us in the same WhatsApp chat before we start making it.",
  },
];

export default function Faq({ page = false }: { page?: boolean }) {
  return (
    <section id="faq" className={`light pattern-mat relative isolate scroll-mt-6 px-5 sm:px-8 lg:px-[5vw] ${page ? "min-h-[80svh] pb-28 pt-36 lg:pb-36 lg:pt-44" : "border-t border-black/5 py-20 sm:py-28 lg:py-36"}`}>
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead as={page ? "h1" : "h2"} title="Good to" accent="know." />
        <div className="border-t border-fg/10">
          {FAQ.map((f) => (
            <details key={f.q} className="faq group border-b border-fg/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold sm:py-6 sm:text-xl">
                {f.q}
                <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full border border-fg/20 transition group-open:rotate-45 group-open:border-neon group-open:text-neon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </summary>
              <p className="max-w-[60ch] pb-7 leading-relaxed text-fg/60">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
