import { SHOP } from "@/lib/shop";

const size = 20;
const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg {...common} aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.2L4 20Z" /><path d="M9 9.2c.3 2.3 2.4 4.5 5 5.4l1.3-1.2-1.8-1-.9.7c-.8-.4-1.5-1.1-1.9-1.9l.7-.9-1-1.8L9 9.2Z" /></svg>
      </a>
      <a href={`https://www.instagram.com/${SHOP.instagram}/`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg {...common} aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></svg>
      </a>
      <a href={`https://www.tiktok.com/@${SHOP.tiktok}`} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
        <svg {...common} aria-hidden="true"><path d="M14 4v10.2a3.7 3.7 0 1 1-3.7-3.7" /><path d="M14 4c.3 2.4 1.9 4 4.5 4.2" /></svg>
      </a>
    </div>
  );
}
