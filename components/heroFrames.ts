// Frames shown in the hero, in scroll order.
// To add a frame: export it as a transparent PNG/WebP, trimmed to the frame's edges,
// in the same upright perspective as frame-01, drop it in /public/hero, and add a line here.
// `glow` is the colour the frame throws onto the wall and floor.

export type HeroFrame = {
  id: string;
  src: string;
  name: string;
  glow: string;
  tint?: string; // optional CSS filter, only used by the placeholders below
};

export const HERO_FRAMES: HeroFrame[] = [
  { id: "01", src: "/hero/frame-01.webp", name: "Neon Muse", glow: "#ff1f4b" },
  { id: "02", src: "/hero/frame-02.webp", name: "Manchester United", glow: "#ff1a2e" },
  { id: "03", src: "/hero/frame-03.webp", name: "Offroad Neon", glow: "#ff2442" },
];
