"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { fmt, waLink } from "@/lib/shop";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const priced = items.filter((i) => i.price !== null);
  const subtotal = priced.reduce((a, i) => a + (i.price ?? 0) * i.qty, 0);
  const hasCustom = items.some((i) => i.price === null);
  const hasPhoto = items.some((i) => i.photo);

  const message = [
    "Hello MU-FRAME, I would like to order:",
    ...items.map((i) => `• ${i.qty}× ${i.name} (${i.detail})${i.price !== null ? ` = ${fmt(i.price * i.qty)}` : " = price on request"}`),
    "",
    priced.length ? `Subtotal: ${fmt(subtotal)}${hasCustom ? " + items priced on request" : ""}` : "",
    `Name: ${name}`,
    `Delivery area: ${area}`,
    hasPhoto ? "I will send my photo in this chat." : "",
  ]
    .filter(Boolean)
    .join("\n");

  const valid = name.trim() && area.trim();

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#090a17] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <h2 className="text-xl font-bold">Your cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-white/50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-white/60">Nothing here yet.</p>
            <a href="/shop" onClick={() => setOpen(false)} className="rounded-full bg-neon px-6 py-3 font-semibold">
              Browse frames
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 py-5">
                  <div className="relative grid h-24 w-20 flex-none place-items-center overflow-hidden rounded-xl bg-[#11122a]">
                    <span className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at 50% 55%, ${i.glow}, transparent 70%)` }} />
                    {i.src ? (
                      <img src={i.src} alt="" className="relative h-[82%] w-auto" style={{ filter: i.tint }} />
                    ) : (
                      <span className="relative h-[70%] w-[64%] rounded-sm border-2" style={{ borderColor: i.glow, boxShadow: `0 0 12px ${i.glow}` }} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{i.name}</p>
                        <p className="truncate text-sm text-white/55">{i.detail}</p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold tabular-nums">
                        {i.price !== null ? fmt(i.price * i.qty) : "On request"}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center gap-4 pt-3">
                      <div className="flex items-center rounded-full border border-white/15">
                        <button aria-label="Decrease quantity" className="h-8 w-8" onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                        <span className="w-6 text-center text-sm tabular-nums">{i.qty}</span>
                        <button aria-label="Increase quantity" className="h-8 w-8" onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                      </div>
                      <button onClick={() => remove(i.key)} className="text-sm text-white/50 underline-offset-4 hover:text-white hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-white/10 p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-white/60">Subtotal</span>
                <span className="text-right text-xl font-bold tabular-nums">
                  {priced.length ? fmt(subtotal) : "Confirmed on WhatsApp"}
                  {hasCustom && priced.length > 0 && (
                    <span className="block text-xs font-normal text-white/50">+ items priced on WhatsApp</span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field id="cart-name" label="Your name" value={name} onChange={setName} invalid={tried && !name.trim()} autoComplete="name" />
                <Field id="cart-area" label="Delivery area" value={area} onChange={setArea} invalid={tried && !area.trim()} placeholder="e.g. Kimihurura" />
              </div>
              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!valid) {
                    e.preventDefault();
                    setTried(true);
                  }
                }}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-neon font-semibold shadow-[0_0_30px_rgba(255,31,75,0.4)]"
              >
                Send order on WhatsApp
              </a>
              {tried && !valid && <p className="text-sm text-[#ff7b8f]">Add your name and delivery area first.</p>}
              <p className="text-xs leading-relaxed text-white/45">
                WhatsApp opens with your order written out. We confirm the details and Mobile Money payment there.
                {hasPhoto && " Send your photo in the same chat."}
              </p>
              <button onClick={clear} className="text-xs text-white/40 underline underline-offset-4 hover:text-white">
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Field(p: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={p.id} className="flex flex-col gap-1.5 text-xs font-medium text-white/60">
      {p.label}
      <input
        id={p.id}
        value={p.value}
        placeholder={p.placeholder}
        autoComplete={p.autoComplete}
        aria-invalid={p.invalid || undefined}
        onChange={(e) => p.onChange(e.target.value)}
        className={`h-11 rounded-xl border bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/60 ${p.invalid ? "border-[#ff4d6a]" : "border-white/15"}`}
      />
    </label>
  );
}
