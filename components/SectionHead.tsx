export default function SectionHead({
  title,
  accent,
  text,
  children,
  as: Tag = "h2",
}: {
  as?: "h1" | "h2";
  title: string;
  accent?: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <Tag className="text-[clamp(2.4rem,5.2vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          {title} {accent && <span className="neon-text whitespace-nowrap">{accent}</span>}
        </Tag>
        {text && <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-fg/60">{text}</p>}
      </div>
      {children}
    </div>
  );
}
