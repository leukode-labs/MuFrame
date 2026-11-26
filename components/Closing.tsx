import { SHOP } from "@/lib/shop";
import SocialIcons from "./SocialIcons";

const COLS = [
  { title: "Shop", links: [{ href: "/shop", label: "Shop" }, { href: "/custom", label: "Custom orders" }] },
  { title: "Help", links: [{ href: "/faq", label: "FAQ" }, { href: "/delivery", label: "Delivery and returns" }] },
  { title: "Studio", links: [{ href: "/about", label: "About" }, { href: "/journal", label: "Journal" }] },
];

export default function Closing() {
  return (
    <footer className="relative overflow-hidden bg-[#05060f] px-5 pt-24 sm:px-8 lg:px-[5vw] lg:pt-32">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-x-16 gap-y-12">
        <a
          href={`https://wa.me/${SHOP.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="foot-cta group"
        >
          <span className="block text-sm font-medium text-white/50">Ready when you are</span>
          <span className="mt-2 flex items-center gap-4 text-[clamp(2rem,4.6vw,4rem)] font-extrabold leading-none tracking-[-0.035em]">
            Order on WhatsApp
            <span className="foot-arrow" aria-hidden="true">↗</span>
          </span>
        </a>

        <div className="flex items-end gap-12 text-[15px] font-medium sm:gap-16">
          <nav className="grid grid-cols-2 gap-x-10 gap-y-8 text-white/70 sm:grid-cols-3 sm:gap-x-14" aria-label="Footer">
            {COLS.map((c) => (
              <div key={c.title} className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">{c.title}</span>
                {c.links.map((l) => (
                  <a key={l.href} href={l.href} className="transition hover:text-white">{l.label}</a>
                ))}
              </div>
            ))}
          </nav>
          <SocialIcons className="foot-social" />
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[1320px] border-t border-white/10 pt-6 text-xs text-white/40 flex justify-between gap-6">
        <span>© {new Date().getFullYear()} MU-FRAME · Kigali, Rwanda</span>
        <span className="flex gap-5">
          <a href="/terms" className="transition hover:text-white/80">Terms</a>
          <a href="/privacy" className="transition hover:text-white/80">Privacy</a>
        </span>
      </div>

      <p className="foot-mark" aria-hidden="true">
        MU-FRAME
      </p>
    </footer>
  );
}
