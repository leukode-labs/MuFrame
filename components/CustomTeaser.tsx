import Link from "next/link";
import SectionHead from "./SectionHead";

const STEPS = ["Upload your photo", "Choose neon or LED, and the colour", "Order on WhatsApp"];

export default function CustomTeaser() {
  return (
    <section className="light pattern-mat relative isolate overflow-hidden px-5 py-20 sm:py-28 sm:px-8 lg:px-[5vw] lg:py-36">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionHead
            title="Your photo."
            accent="In light."
            text="Turn a portrait, a logo or any photo you love into a lit frame. Preview it on the page before you order."
          />
          <ol className="mt-10 grid gap-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-4 text-lg font-semibold">
                <span className="text-sm font-bold tabular-nums text-neon">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link href="/custom" className="btn-primary mt-10">
            Design yours
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* a static preview: the same dark "room" as on the custom orders page */}
        <Link
          href="/custom"
          className="dark-scope group relative grid h-[min(70svh,600px)] min-h-[420px] place-items-center overflow-hidden rounded-[2rem] bg-[#0b0c1d] shadow-[0_30px_80px_-30px_rgba(13,14,26,0.55)]"
          aria-label="Open the custom frame designer"
        >
          <span className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 60% at 50% 48%, #ff1f4b55, transparent 70%)" }} />
          <span className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/60 to-transparent" />
          <span
            className="relative aspect-[3/4] h-[74%] transition duration-500 group-hover:scale-[1.02]"
            style={{
              background: "#07070c",
              padding: "5%",
              border: "3px solid color-mix(in srgb, #ff1f4b 75%, white)",
              boxShadow: "0 0 8px #ff1f4b, 0 0 26px #ff1f4b, 0 0 70px #ff1f4b88, inset 0 0 18px #ff1f4b88",
            }}
          >
            <img src="/hero/bg-mobile.webp" alt="" className="h-full w-full object-cover" />
          </span>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            Try it with your photo
          </span>
        </Link>
      </div>
    </section>
  );
}
