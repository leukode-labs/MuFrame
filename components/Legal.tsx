import Link from "next/link";
import { INFO } from "@/lib/info";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function Legal({ kicker, title, lead, sections }: { kicker: string; title: string; lead: string; sections: LegalSection[] }) {
  return (
    <main>
      <section className="relative isolate bg-[#05060f] px-5 pb-28 pt-36 sm:px-8 lg:px-[5vw] lg:pb-40 lg:pt-44">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/45">{kicker}</p>
          <h1 className="mt-5 text-[clamp(2.6rem,7vw,5.8rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">{title}</h1>
          <p className="mt-6 max-w-[52ch] text-[18px] leading-relaxed text-white/60">{lead}</p>
          <p className="mt-4 text-[13px] text-white/35">Last updated {INFO.updated}</p>

          <div className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-[260px_1fr] lg:gap-24">
            <nav aria-label="On this page" className="hidden lg:block">
              <ol className="sticky top-32 space-y-3 text-[14px]">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="group flex gap-3 text-white/45 transition hover:text-white">
                      <span className="w-5 tabular-nums text-white/25 transition group-hover:text-neon">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-[680px]">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-white/10 py-9 first:border-t-0 first:pt-0">
                  <h2 className="flex items-baseline gap-4 text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-[-0.03em]">
                    <span className="text-[12px] tabular-nums tracking-[0.2em] text-neon lg:hidden">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[16.5px] leading-[1.75] text-white/65 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-neon [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.8em] [&_li]:before:h-[2px] [&_li]:before:w-2.5 [&_li]:before:bg-neon [&_ul]:space-y-2">{s.body}</div>
                </section>
              ))}
              <p className="mt-6 border-t border-white/10 pt-8 text-[14px] text-white/40">
                Questions about this page? Message us on WhatsApp, or read the <Link href="/faq" className="text-white/70 underline underline-offset-4">FAQ</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
