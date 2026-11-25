"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import SocialIcons from "./SocialIcons";
import { CATEGORY_LABEL, PRODUCTS, priceLabel } from "@/lib/shop";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Custom orders", href: "/custom" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export default function GlassNav() {
  const cart = useCart();
  const path = usePathname();
  const router = useRouter();
  const isActive = (href: string) => path === href || path.startsWith(href + "/");
  const ref = useRef<HTMLElement>(null);
  const [onLight, setOnLight] = useState(false);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [moving, setMoving] = useState(false);
  const moveT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const flash = () => {
    setMoving(true);
    clearTimeout(moveT.current);
    moveT.current = setTimeout(() => setMoving(false), 700);
  };
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const closedW = useRef(0);
  const [lens, setLens] = useState<{ map: string; w: number; h: number } | null>(null);

  // Real refraction: build a displacement map for the bar's exact shape, so the edges bend
  // the scene behind them like thick curved glass. Chromium browsers can apply an SVG filter
  // to the backdrop; Safari and Firefox keep the frosted glass.
  useEffect(() => {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    if (!brands?.some((b) => /Chromium/.test(b.brand))) return;
    const el = ref.current;
    if (!el) return;
    const build = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const img = ctx.createImageData(w, h);
      const r = h / 2;
      const bezel = Math.min(22, h * 0.42);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          // capsule: distance from the centre line, normal pointing out of the glass
          const px = Math.min(Math.max(x + 0.5, r), w - r);
          const dx = x + 0.5 - px;
          const dy = y + 0.5 - r;
          const dist = Math.hypot(dx, dy) || 1;
          const inside = r - dist;
          let R = 128;
          let G = 128;
          if (inside < bezel) {
            const t = 1 - Math.max(0, inside) / bezel; // 0 inside, 1 at the rim
            const mag = t * t * (3 - 2 * t);
            R = 128 - (dx / dist) * mag * 127;
            G = 128 - (dy / dist) * mag * 127;
          }
          const i = (y * w + x) * 4;
          img.data[i] = R;
          img.data[i + 1] = G;
          img.data[i + 2] = 128;
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      setLens({ map: c.toDataURL(), w, h });
    };
    build();
    let rt: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(build, 200);
    });
    ro.observe(el);
    document.documentElement.dataset.lens = "1";
    return () => {
      ro.disconnect();
      delete document.documentElement.dataset.lens;
    };
  }, []);

  // switch to light glass while the bar sits over a light section
  useEffect(() => {
    let raf = 0;
    const check = () => {
      const y = 44;
      let light = false;
      document.querySelectorAll<HTMLElement>(".light").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) light = true;
      });
      setOnLight(light);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    const t = setTimeout(check, 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);

  // a specular highlight that follows the pointer across the glass
  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  // search: the whole bar widens into a search field and drops a results panel
  function openSearch() {
    const el = ref.current;
    if (!el) return;
    closedW.current = el.offsetWidth;
    el.style.width = `${closedW.current}px`;
    void el.offsetWidth;
    el.style.width = `min(680px, calc(100vw - 24px))`;
    setOpen(false);
    flash();
    setSearching(true);
    setTimeout(() => inputRef.current?.focus(), 120);
  }
  function closeSearch() {
    const el = ref.current;
    if (!el || !searching) return;
    el.style.width = `${closedW.current}px`;
    flash();
    setSearching(false);
    setQ("");
    setTimeout(() => el.style.removeProperty("width"), 560);
  }
  useEffect(() => {
    if (!searching) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && closeSearch();
    const down = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closeSearch();
    };
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", down);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching]);
  useEffect(() => closeSearch(), [path]); // eslint-disable-line react-hooks/exhaustive-deps

  const term = q.trim().toLowerCase();
  const results = term
    ? PRODUCTS.filter((p) => `${p.name} ${p.category} ${CATEGORY_LABEL[p.category]}`.toLowerCase().includes(term))
    : PRODUCTS.slice(0, 4);

  const S = 34; // how far the rim bends the image, in px

  return (
    <>
      {lens && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter
            id="mf-lens"
            x="0"
            y="0"
            width={lens.w}
            height={lens.h}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={lens.map} x="0" y="0" width={lens.w} height={lens.h} preserveAspectRatio="none" result="map" />
            {/* each colour bends a little differently: a faint prism fringe at the rim */}
            <feDisplacementMap in="SourceGraphic" in2="map" scale={S * 1.1} xChannelSelector="R" yChannelSelector="G" result="dr" />
            <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={S} xChannelSelector="R" yChannelSelector="G" result="dg" />
            <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={S * 0.9} xChannelSelector="R" yChannelSelector="G" result="db" />
            <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </filter>
        </svg>
      )}
      {/* the logo sits on its own, outside the glass */}
      <div className="float-brand" data-light={onLight || undefined}>
        <Link href="/" className="logo float-logo" data-light={onLight || undefined} aria-label="MU-FRAME home">
          MU-FRAME
        </Link>
        <SocialIcons className="brand-social" />
      </div>
      <header
        ref={ref}
        className="glass glass-nav"
        data-light={onLight || undefined}
        data-flat={searching || moving || undefined}
        onPointerMove={onMove}
        onPointerLeave={() => ref.current?.style.removeProperty("--mx")}
      >
        <span className="glass-rim" aria-hidden="true" />
        <span className="glass-sheen" aria-hidden="true" />

        <div className="glass-row">
          <nav className="glass-links hidden items-center md:flex" aria-label="Main" aria-hidden={searching}>
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} tabIndex={searching ? -1 : 0} className="glass-link" aria-current={isActive(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>

          <form
            className="glass-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (results[0]) {
                router.push(`/shop/${results[0].id}`);
              }
            }}
          >
            <button type="button" className="glass-link glass-icon glass-search-btn" aria-label="Search frames" onClick={() => (searching ? inputRef.current?.focus() : openSearch())}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </button>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              tabIndex={searching ? 0 : -1}
              placeholder="Search frames, cars, sport, art"
              aria-label="Search frames"
              autoComplete="off"
              className="glass-input"
            />
            <button type="button" className="glass-link glass-icon glass-search-close" aria-label="Close search" tabIndex={searching ? 0 : -1} onClick={closeSearch}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </form>

          <button
            type="button"
            onClick={() => cart.setOpen(true)}
            aria-label={`Open cart, ${cart.count} items`}
            className="glass-link glass-icon glass-cart-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            {cart.count > 0 && <span className="glass-badge">{cart.count}</span>}
          </button>

          <button
          type="button"
          className="glass-link glass-icon glass-menu-btn"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 9h16M4 15h16" />}
          </svg>
          </button>
        </div>

        <div className="glass-results" data-open={searching || undefined} aria-hidden={!searching}>
          <div className="glass-results-in">
            <p className="glass-results-label">{term ? `${results.length} ${results.length === 1 ? "frame" : "frames"}` : "Popular frames"}</p>
            {results.length === 0 ? (
              <p className="glass-empty">
                Nothing matches “{q.trim()}”. <Link href="/custom" onClick={closeSearch} className="underline">Design a custom frame</Link>
              </p>
            ) : (
              <ul>
                {results.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link href={`/shop/${p.id}`} className="glass-hit" tabIndex={searching ? 0 : -1} onClick={closeSearch}>
                      <img src={p.src} alt="" className="glass-hit-img" />
                      <span className="glass-hit-name">{p.name}</span>
                      <span className="glass-hit-meta">{CATEGORY_LABEL[p.category]} · {priceLabel(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {open && (
        <nav className="glass glass-menu md:hidden" data-light={onLight || undefined} aria-label="Main">
          <span className="glass-rim" aria-hidden="true" />
          <span className="glass-sheen" aria-hidden="true" />
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className="glass-link text-base" aria-current={isActive(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
