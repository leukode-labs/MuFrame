"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORY_LABEL, PRODUCTS, priceLabel, type Category, type Product } from "@/lib/shop";
import { useCart } from "./CartProvider";

const FILTERS: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cars", label: "Cars" },
  { id: "sport", label: "Sport" },
  { id: "art", label: "Art" },
];


export default function Collection({ featured = false, page = false }: { featured?: boolean; page?: boolean }) {
  const [filter, setFilter] = useState<"all" | Category>("all");
  const all = PRODUCTS.filter((p) => filter === "all" || p.category === filter);
  const list = featured ? all.slice(0, 6) : all;
  const H = page ? "h1" : "h2";
  const secRef = useRef<HTMLElement>(null);
  const phRef = useRef<HTMLDivElement>(null);
  const fRef = useRef<HTMLDivElement>(null);

  // the filter travels from the page into the nav row as you scroll, and stays there
  useEffect(() => {
    if (featured) return;
    let raf = 0;
    const run = () => {
      const ph = phRef.current;
      const f = fRef.current;
      const sec = secRef.current;
      if (!ph || !f || !sec) return;
      const r = ph.getBoundingClientRect();
      const w = f.offsetWidth;
      // dock in the free gap between the logo and the nav pill; if it doesn't fit, sit just under the bar
      const logo = document.querySelector(".float-brand")?.getBoundingClientRect();
      const nav = document.querySelector(".glass-nav")?.getBoundingClientRect();
      const gapL = logo ? logo.right + 24 : 0;
      const gapR = nav ? nav.left - 24 : window.innerWidth;
      const fits = gapR - gapL >= w;
      const topT = fits ? 19 : 76;
      const leftT = fits ? (gapL + gapR) / 2 - w / 2 : (window.innerWidth - w) / 2;
      const range = 240;
      const raw = Math.min(1, Math.max(0, 1 - (r.top - topT) / range));
      const p = raw * raw * (3 - 2 * raw);
      const x = r.left + (leftT - r.left) * p;
      const y = Math.max(topT, r.top);
      f.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      f.dataset.docked = raw >= 1 ? "1" : "";
      const away = sec.getBoundingClientRect().bottom < 140;
      f.style.opacity = away ? "0" : "1";
      f.style.pointerEvents = away ? "none" : "auto";
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = setTimeout(run, 200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [featured]);

  return (
    <section
      ref={secRef}
      id="collection"
      className={`fr-section relative isolate scroll-mt-6 px-5 sm:px-8 lg:px-[5vw] ${page ? "pb-32 pt-36 lg:pb-44 lg:pt-44" : "py-28 lg:py-40"}`}
    >
      <div className="fr-wrap">
        <div className="fr-head">
          <div>
            <H className="text-[clamp(2.6rem,6vw,5.6rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
              Frames that <span className="neon-text whitespace-nowrap">switch on.</span>
            </H>
          </div>
          {!featured && <div ref={phRef} className="fr-filter-ph" aria-hidden="true" />}
          {!featured && (
            <div ref={fRef} className="fr-filter" role="group" aria-label="Filter frames" style={{ "--i": FILTERS.findIndex((f) => f.id === filter) } as React.CSSProperties}>
              <span className="fr-thumb" aria-hidden="true" />
              {FILTERS.map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="fr-grid">
          {list.map((p) => (
            <Frame key={p.id} product={p} />
          ))}
        </div>

        {featured && (
          <div className="mt-24 flex justify-center">
            <Link href="/shop" className="btn-primary">
              View all frames
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function Frame({ product: p }: { product: Product }) {
  const { add } = useCart();
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);
  const [added, setAdded] = useState(false);

  // touch screens have no hover: a frame switches on while it is in the middle of the screen
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setLit(e.isIntersecting), { rootMargin: "-35% 0px -35% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} data-lit={lit || undefined} className="fr" style={{ "--g": p.glow, ...(p.tint ? { "--tint": p.tint } : {}) } as React.CSSProperties}>
      <Link href={`/shop/${p.id}`} className="fr-link" aria-label={`${p.name}, ${priceLabel(p.price)}`}>
        <span className="fr-stage">
          <span className="fr-glow" aria-hidden="true" />
          <img src={p.src} alt={`${p.name} frame`} loading="lazy" className="fr-img" />
          <span className="fr-floor" aria-hidden="true" />
        </span>
        <span className="fr-info">
          <span className="fr-name">{p.name}</span>
          <span className="fr-price">{priceLabel(p.price)}</span>
        </span>
      </Link>
      <button
        type="button"
        className="fr-add"
        onClick={() => {
          add({ key: p.id, name: p.name, detail: `${CATEGORY_LABEL[p.category]} frame`, price: p.price, src: p.src, tint: p.tint, glow: p.glow });
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }}
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </article>
  );
}
