const WORDS = ["Light up your world", "Neon frames", "LED frames", "Custom portraits", "Kigali"];

export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
      {WORDS.map((w, i) => (
        <span key={w} className="flex items-center gap-10">
          <span className={i % 2 === 0 ? "outline-text" : "neon-solid"}>{w}</span>
          <span className="h-3 w-3 rotate-45 bg-neon shadow-[0_0_14px_#ff1f4b]" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#05060f] py-7">
      <p className="sr-only">Neon frames, LED frames and custom portraits from Kigali.</p>
      <div className="marquee flex w-max text-[clamp(2rem,5vw,4.2rem)] font-extrabold uppercase leading-none tracking-[-0.03em]">
        {row}
        {row}
      </div>
    </div>
  );
}
