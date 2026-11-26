import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/shop";
import { POSTS } from "@/lib/journal";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mu-frames.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/custom", "/about", "/faq", "/delivery", "/journal", "/terms", "/privacy"];
  return [
    ...pages.map((p) => ({ url: base + p })),
    ...PRODUCTS.map((p) => ({ url: `${base}/shop/${p.id}` })),
    ...POSTS.map((p) => ({ url: `${base}/journal/${p.slug}`, lastModified: p.date })),
  ];
}
