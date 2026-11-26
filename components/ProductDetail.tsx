"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORY_LABEL, PRODUCTS, SIZES, priceLabel, sizeCm, sizePrice, waLink } from "@/lib/shop";
import { useCart } from "./CartProvider";

export default function ProductDetail({ id }: { id: string }) {
  const p = PRODUCTS.find((x) => x.id === id)!;
  const { add } = useCart();
  const [dark, setDark] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeId, setSizeId] = useState<(typeof SIZES)[number]["id"]>("s");
  const size = SIZES.find((x) => x.id === sizeId)!;
  const price = sizePrice(p.price, size.mult);

  const related = [
    ...PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id),
    ...PRODUCTS.filter((x) => x.category !== p.category),
  ].slice(0, 3);

  function addToCart() {
    add({ key: `${p.id}-${size.id}`, name: p.name, detail: `${CATEGORY_LABEL[p.category]} frame, ${size.label} ${sizeCm(size)}`, price, src: p.src, tint: p.tint, glow: p.glow });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <>
      <section className="pattern-dots-soft relative isolate px-5 pb-24 pt-32 sm:px-8 lg:px-[5vw] lg:pt-40">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/50">
          <Link href="/shop" className="hover:text-white">Shop</Link>
          <span aria-hidden="true">/</span>
          <span>{CATEGORY_LABEL[p.category]}</span>
          <span aria-hidden="true">/</span>
          <span className="text-white/80">{p.name}</span>
        </nav>

        <div className="grid items-start gap-12 lg:grid-cols-[1.25fr_1fr]">
          {/* the frame on a wall, with its own light switch */}
          <div
            className="detail-wall relative flex h-[min(78svh,720px)] min-h-[440px] items-end justify-center overflow-hidden rounded-[2rem] border border-white/10"
            data-dark={dark || undefined}
            style={{ "--g": p.glow, "--tint": p.tint ?? "none" } as React.CSSProperties}
          >
            <span className="detail-light absolute inset-0" />
            <span className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-black/50 to-transparent" />
            <img src={p.src} alt={`${p.name} frame`} className="detail-img relative mb-[9%] h-[78%] w-auto max-w-[80%] object-contain" />
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-pressed={dark}
              className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur transition hover:border-white/40"
            >
              <span className={`h-2 w-2 rounded-full ${dark ? "bg-white/40" : "bg-white"}`} style={dark ? undefined : { boxShadow: "0 0 8px #fff" }} />
              {dark ? "Lights on" : "Lights off"}
            </button>
          </div>

          <div className="lg:sticky lg:top-32">
            <h1 className="text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">{p.name}</h1>
            <p className="mt-4 text-xl font-semibold tabular-nums text-white/80">{priceLabel(price)}</p>
            <p className="mt-6 max-w-[44ch] leading-relaxed text-white/60">
              A lit frame from the MU-FRAME collection. Pick a size, add it to your cart, and we confirm the details with you on WhatsApp.
            </p>

            <fieldset className="mt-8">
              <legend className="mb-3 text-sm font-semibold text-white/55">Size</legend>
              <div className="size-grid">
                {SIZES.map((z) => (
                  <button key={z.id} type="button" className="size-opt" aria-pressed={sizeId === z.id} onClick={() => setSizeId(z.id)}>
                    <span className="size-name">{z.label}</span>
                    <span className="size-cm">{sizeCm(z)}</span>
                    <span className="size-price">{priceLabel(sizePrice(p.price, z.mult))}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-white/45">Need another size? Ask us on WhatsApp.</p>
            </fieldset>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <button type="button" onClick={addToCart} className="btn-primary">
                {added ? "Added to cart ✓" : "Add to cart"}
              </button>
              <a
                href={waLink(`Hello MU-FRAME, I'm interested in the ${p.name} frame. I'd like the ${size.label} size (${sizeCm(size)}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-text"
              >
                Ask on WhatsApp
              </a>
            </div>

            <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 text-sm text-white/65">
              <li className="flex gap-3"><Tick /> Order on WhatsApp, we reply and confirm everything there</li>
              <li className="flex gap-3"><Tick /> Pay with Mobile Money once your order is confirmed</li>
              <li className="flex gap-3"><Tick /> Delivered in Kigali</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-[5vw]">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em]">More frames</h2>
          <Link href="/shop" className="text-sm font-semibold text-white/70 hover:text-white">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.id}
              href={`/shop/${r.id}`}
              className="product group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0b19]"
              style={{ "--g": r.glow, "--tint": r.tint ?? "none" } as React.CSSProperties}
            >
              <div className="relative flex h-[300px] items-end justify-center overflow-hidden">
                <span className="product-wall absolute inset-0" />
                <img src={r.src} alt={`${r.name} frame`} loading="lazy" className="product-img relative mb-[10%] h-[74%] w-auto max-w-[80%] object-contain" />
              </div>
              <div className="flex items-center justify-between border-t border-white/10 p-5">
                <span className="font-bold">{r.name}</span>
                <span className="text-sm text-white/50">{CATEGORY_LABEL[r.category]}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function Tick() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1f4b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-px flex-none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
