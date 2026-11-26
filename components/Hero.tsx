"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HERO_FRAMES } from "./heroFrames";

const N = HERO_FRAMES.length;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Scroll-scrubbed swap: the frame on the wall lifts straight up out of view, then the next
 * one drops in from above, lands on the floor and settles with a small bounce.
 * Scrolling back plays it in reverse.
 */
function swapState(p: number) {
  if (N < 2) return { seg: 0, k: 0 };
  const f = p * (N - 1);
  const seg = Math.min(Math.floor(f), N - 2);
  const k = clamp((f - seg - 0.22) / 0.56); // the swap happens in the middle of each segment
  return { seg, k };
}

export default function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [dark, setDark] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    let raf = 0;
    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const max = el.offsetHeight - window.innerHeight;
      setProgress(max > 0 ? clamp(-el.getBoundingClientRect().top / max) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const { seg, k } = swapState(progress);
  const cur = N < 2 ? 0 : k < 0.5 ? seg : seg + 1;
  const active = HERO_FRAMES[cur];
  const OUT = 118; // % of the frame's height: far enough to clear the top of the screen

  // vertical position of frame i, in % of its height (0 = standing on the floor, negative = up)
  function frameY(i: number): number | null {
    if (N < 2) return 0;
    if (i === seg && k < 0.5) {
      const t = k * 2;
      return -OUT * t * t; // lifts off, accelerating upwards
    }
    if (i === seg + 1 && k >= 0.5) {
      const t = (k - 0.5) * 2;
      if (t < 0.82) {
        const u = t / 0.82;
        return -OUT * (1 - u * u); // falls, accelerating like a real drop
      }
      return -3.2 * Math.sin((Math.PI * (t - 0.82)) / 0.18); // small bounce on landing
    }
    return null;
  }

  const shown = HERO_FRAMES.map((_, i) => frameY(i));
  const nearest = Math.min(...shown.map((y) => (y === null ? Infinity : Math.abs(y))));
  // the room light follows the frame: full when it stands on the floor, dim while it is away
  const light = 0.2 + 0.8 * (1 - clamp(nearest / 70));

  function frameStyle(i: number): React.CSSProperties {
    const y = shown[i];
    const base = { "--fglow": HERO_FRAMES[i].glow, "--tint": HERO_FRAMES[i].tint ?? "none" } as Record<string, string | number>;
    if (y === null) return { ...base, opacity: 0, visibility: "hidden" } as React.CSSProperties;
    if (reduce) return { ...base, opacity: 1 - clamp(Math.abs(y) / OUT), visibility: "visible" } as React.CSSProperties;
    const away = clamp(Math.abs(y) / 60);
    return {
      ...base,
      "--ry": `${-2 * y}%`, // the reflection moves the other way, mirrored in the floor
      "--rf": 1 - away, // and fades as the frame leaves the floor
      opacity: 1,
      visibility: "visible",
      transform: `translateY(${y}%)`,
    } as React.CSSProperties;
  }

  useEffect(() => {
    document.documentElement.style.setProperty("--glow", active.glow);
  }, [active.glow]);

  return (
    <section
      ref={trackRef}
      id="top"
      aria-label="Featured frames"
      className="relative"
      style={{ height: `calc(100svh + ${Math.max(0, N - 1)} * 95svh)` }}
    >
      <div className="hero-pin">
        {/* ---------- scene ---------- */}
        <div
          className="stage"
          data-dark={dark || undefined}
          style={{ "--glow": active.glow, "--zoom": 1 + progress * 0.03, "--light": light } as React.CSSProperties}
        >
          <picture aria-hidden="true">
            <source media="(max-aspect-ratio: 1/1)" srcSet="/hero/bg-mobile-2.webp" />
            <img className="stage-bg" src="/hero/bg-desktop.webp" alt="" fetchPriority="high" />
          </picture>
          <div className="wall-light" aria-hidden="true" />
          <div className="frame-slot" aria-hidden="true">
            {HERO_FRAMES.map((f, i) => (
              <div
                key={f.id}
                className="frame frame-revolve"
                style={frameStyle(i)}
              >
                <img className="frame-refl" src={f.src} alt="" />
                <img className="frame-img" src={f.src} alt="" />
              </div>
            ))}
          </div>

          {/* a real switch on the wall: turns the room lights off so only the frame glows */}
          <button
            type="button"
            className="wall-switch"
            aria-pressed={dark}
            aria-label={dark ? "Turn the room lights back on" : "Turn the room lights off"}
            onClick={() => setDark((d) => !d)}
          >
            <span className="switch-plate">
              <span className="switch-rocker" />
            </span>
            <span className="switch-hint">{dark ? "Lights on" : "Lights off"}</span>
          </button>
        </div>
        <div className="shade" data-dark={dark || undefined} aria-hidden="true" />

        {/* ---------- interface ---------- */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* intro: short line and the two actions */}
          <div className="hero-intro pointer-events-auto rise" style={{ "--d": "420ms" } as React.CSSProperties}>
            <p className="text-[15px] leading-relaxed text-white/75 sm:text-[17px]">
              Neon and LED frames for your walls. Choose one of our designs, or turn your own photo into one.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/shop" className="btn-primary">
                Shop frames
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link href="/custom" className="btn-text">
                Create your own
              </Link>
            </div>
          </div>

          {/* the title stands on the floor, like the frame and the woman, and reflects in it */}
          <div className="hero-title">
            <h1>
              <span className="rise block text-white" style={{ "--d": "120ms" } as React.CSSProperties}>Light up</span>
              <span className="rise neon-text block" style={{ "--d": "240ms" } as React.CSSProperties}>your world.</span>
            </h1>
            <div className="title-refl" aria-hidden="true">
              <span className="block text-white">Light up</span>
              <span className="neon-text block">your world.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

