import type { Metadata } from "next";
import Link from "next/link";
import { POSTS, fmtDate, readingMinutes } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the MU-FRAME studio in Kigali: choosing neon or LED, hanging a lit frame, and how a photo becomes a line.",
};

export default function JournalPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = posts;
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#05060f] px-5 pb-28 pt-36 sm:px-8 lg:px-[5vw] lg:pb-40 lg:pt-48">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/45">Journal</p>
          <h1 className="mt-5 text-[clamp(2.8rem,8.4vw,7.2rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
            Notes from
            <br />
            <span className="neon-text">the studio.</span>
          </h1>

          <Link href={`/journal/${lead.slug}`} className="jr-lead group mt-16 grid gap-8 sm:mt-24 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14" style={{ "--g": lead.glow } as React.CSSProperties}>
            <span className="jr-cover">
              <img src={lead.cover} alt="" />
            </span>
            <span className="block">
              <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/45">{lead.kicker} · {fmtDate(lead.date)}</span>
              <span className="mt-4 block text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.04em] transition group-hover:text-neon">{lead.title}</span>
              <span className="mt-5 block max-w-[44ch] text-lg leading-relaxed text-white/60">{lead.excerpt}</span>
              <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-white/80">{readingMinutes(lead)} min read <span aria-hidden="true" className="transition group-hover:translate-x-1">&rarr;</span></span>
            </span>
          </Link>

          <div className="mt-20 border-t border-white/10 sm:mt-28">
            {rest.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className="group grid gap-3 border-b border-white/10 py-8 sm:py-10 md:grid-cols-[200px_1fr_auto] md:items-baseline md:gap-10">
                <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">{p.kicker}<br className="hidden md:block" /> <span className="md:mt-1 md:inline-block">{fmtDate(p.date)}</span></span>
                <span>
                  <span className="block text-[clamp(1.4rem,2.6vw,2.1rem)] font-bold leading-[1.1] tracking-[-0.03em] transition group-hover:text-neon">{p.title}</span>
                  <span className="mt-3 block max-w-[56ch] leading-relaxed text-white/55">{p.excerpt}</span>
                </span>
                <span className="text-[14px] font-semibold text-white/50">{readingMinutes(p)} min</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
