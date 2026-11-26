// Shop settings and catalogue.
// Catalogue. Add each new frame here (image in /public/products or /public/hero).
// PLACEHOLDER: the price below is a stand-in until the real price is set.

export const SHOP = {
  // WhatsApp number, digits only, country code first. Set NEXT_PUBLIC_WHATSAPP in .env.local
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "250000000000",
  instagram: "mu.frames",
  tiktok: "mu.frames",
};

export type Category = "cars" | "sport" | "art";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number | null; // RWF. null = price given on WhatsApp
  src: string;
  glow: string;
  tint?: string;
};

// Real product photos, cleaned up. Prices: add them here when ready (null shows "Price on request").
export const PRODUCTS: Product[] = [
  { id: "neon-muse", name: "Neon Muse", category: "art", price: 85000, src: "/hero/frame-01.webp", glow: "#ff1f4b" },
  { id: "porsche-gt3", name: "Porsche GT3", category: "cars", price: 95000, src: "/products/porsche-gt3.webp", glow: "#ff2a3a" },
  { id: "skyline-r34", name: "Skyline R34", category: "cars", price: 95000, src: "/products/skyline-r34.webp", glow: "#2f5bff" },
  { id: "man-united", name: "Manchester United", category: "sport", price: 75000, src: "/products/man-united.webp", glow: "#ff2a1f" },
  { id: "neon-face", name: "Neon Face", category: "art", price: 65000, src: "/products/neon-face.webp", glow: "#c45bff" },
  { id: "shelby-raptor", name: "Shelby Raptor", category: "cars", price: 110000, src: "/products/shelby-raptor.webp", glow: "#ff2a3a" },
  { id: "real-madrid", name: "Real Madrid", category: "sport", price: 75000, src: "/products/real-madrid.webp", glow: "#ff3b3b" },
  { id: "supra-mk4", name: "Supra MK4", category: "cars", price: 95000, src: "/products/supra-mk4.webp", glow: "#3d4bff" },
  { id: "f1-helmet", name: "F1 Helmet", category: "sport", price: 70000, src: "/products/f1-helmet.webp", glow: "#ff7a1f" },
  { id: "itachi", name: "Itachi", category: "art", price: 60000, src: "/products/itachi.webp", glow: "#ff2a55" },
  { id: "fc-barcelona", name: "FC Barcelona", category: "sport", price: 75000, src: "/products/fc-barcelona.webp", glow: "#3b5bff" },
  { id: "49ers-helmet", name: "49ers Helmet", category: "sport", price: 70000, src: "/products/49ers-helmet.webp", glow: "#ff3b1f" },
  { id: "mercedes-amg", name: "Mercedes-AMG", category: "cars", price: 105000, src: "/products/mercedes-amg.webp", glow: "#cfd8ff" },
  { id: "arsenal-art", name: "Arsenal Cannon", category: "sport", price: 65000, src: "/products/arsenal-art.webp", glow: "#ff2a2a" },
  { id: "connect-to-god", name: "Connect to God", category: "art", price: 80000, src: "/products/connect-to-god.webp", glow: "#ff6a3a" },
  { id: "arsenal-crest", name: "Arsenal Crest", category: "sport", price: 65000, src: "/products/arsenal-crest.webp", glow: "#ff1f3a" },
];

// Frame sizes (cm, width × height). PLACEHOLDER sizes and price steps: set the real ones here.
// `mult` scales a product's base price (the base price is the Small size).
export const SIZES = [
  { id: "s", label: "Small", w: 30, h: 40, mult: 1 },
  { id: "m", label: "Medium", w: 40, h: 60, mult: 1.5 },
  { id: "l", label: "Large", w: 60, h: 90, mult: 2.3 },
] as const;
export type SizeId = (typeof SIZES)[number]["id"];
export const sizeCm = (s: { w: number; h: number }) => `${s.w} × ${s.h} cm`;
export const sizePrice = (base: number | null, mult: number) => (base === null ? null : Math.round((base * mult) / 5000) * 5000);

export const CATEGORY_LABEL: Record<Category, string> = { cars: "Cars", sport: "Sport", art: "Art" };

export const GLOWS = [
  { id: "red", name: "Red", hex: "#ff1f4b" },
  { id: "pink", name: "Pink", hex: "#ff3d9a" },
  { id: "violet", name: "Violet", hex: "#a04bff" },
  { id: "blue", name: "Blue", hex: "#2f7bff" },
  { id: "cyan", name: "Cyan", hex: "#19e3ff" },
  { id: "amber", name: "Amber", hex: "#ff8a1f" },
  { id: "white", name: "Warm white", hex: "#ffe6c4" },
] as const;

export const fmt = (n: number) => `RWF ${new Intl.NumberFormat("en-US").format(n)}`;
export const priceLabel = (n: number | null) => (n === null ? "Price on request" : fmt(n));
export const waLink = (text: string) => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
