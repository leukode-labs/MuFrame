"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GLOWS, SIZES, sizeCm } from "@/lib/shop";
import { useCart } from "./CartProvider";

const STYLES = [
  { id: "neon", label: "Neon outline" },
  { id: "led", label: "LED backlight" },
] as const;

const TOOLS = [
  { id: "tap", label: "Tap" },
  { id: "draw", label: "Draw" },
  { id: "erase", label: "Erase" },
  { id: "move", label: "Move" },
] as const;
type Tool = (typeof TOOLS)[number]["id"];

const NW = 600;
const NH = 800;
const SAMPLE = "/hero/bg-mobile.webp";

type Pt = [number, number];
type Area =
  | { id: number; color: string; kind: "mask"; fill: Uint8Array; line: Uint8Array }
  | { id: number; color: string; kind: "pen"; pts: Pt[] };

/* ---------- image helpers ---------- */
function cropTo(img: HTMLImageElement, cv: HTMLCanvasElement) {
  const ctx = cv.getContext("2d")!;
  const ir = img.naturalWidth / img.naturalHeight;
  const fr = NW / NH;
  let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
  if (ir > fr) { sw = sh * fr; sx = (img.naturalWidth - sw) / 2; } else { sh = sw / fr; sy = (img.naturalHeight - sh) / 2; }
  ctx.clearRect(0, 0, NW, NH);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, NW, NH);
}

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
/* white-hot tube core, tinted by the gas colour */
function core(hex: string) {
  const [r, g, b] = rgb(hex);
  return `rgb(${Math.round((r + 255 * 1.2) / 2.2)},${Math.round((g + 255 * 1.2) / 2.2)},${Math.round((b + 255 * 1.2) / 2.2)})`;
}

function boxBlur(src: Float32Array, r: number): Float32Array {
  const tmp = new Float32Array(NW * NH);
  const dst = new Float32Array(NW * NH);
  for (let y = 0; y < NH; y++) {
    let s = 0;
    for (let k = -r; k <= r; k++) s += src[y * NW + Math.min(NW - 1, Math.max(0, k))];
    for (let x = 0; x < NW; x++) {
      tmp[y * NW + x] = s / (2 * r + 1);
      s += src[y * NW + Math.min(NW - 1, x + r + 1)] - src[y * NW + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < NW; x++) {
    let s = 0;
    for (let k = -r; k <= r; k++) s += tmp[Math.min(NH - 1, Math.max(0, k)) * NW + x];
    for (let y = 0; y < NH; y++) {
      dst[y * NW + x] = s / (2 * r + 1);
      s += tmp[Math.min(NH - 1, y + r + 1) * NW + x] - tmp[Math.max(0, y - r) * NW + x];
    }
  }
  return dst;
}

/* flip small islands (val) so the outline stays one clean line */
function dropSmall(bin: Uint8Array, val: number, minArea: number, keepBorder: boolean) {
  const seen = new Uint8Array(NW * NH);
  const stack: number[] = [];
  for (let s = 0; s < bin.length; s++) {
    if (seen[s] || bin[s] !== val) continue;
    const comp: number[] = [];
    let border = false;
    stack.push(s);
    seen[s] = 1;
    while (stack.length) {
      const i = stack.pop()!;
      comp.push(i);
      const x = i % NW, y = (i / NW) | 0;
      if (x === 0 || y === 0 || x === NW - 1 || y === NH - 1) border = true;
      const nb = [x > 0 ? i - 1 : -1, x < NW - 1 ? i + 1 : -1, y > 0 ? i - NW : -1, y < NH - 1 ? i + NW : -1];
      for (const j of nb) if (j >= 0 && !seen[j] && bin[j] === val) { seen[j] = 1; stack.push(j); }
    }
    if (comp.length < minArea && !(keepBorder && border)) for (const i of comp) bin[i] = 1 - val;
  }
}

function buildMask(conf: Float32Array, mw: number, mh: number): { fill: Uint8Array; line: Uint8Array } | null {
  const f = new Float32Array(NW * NH);
  for (let y = 0; y < NH; y++) {
    const my = Math.min(mh - 1, Math.floor((y * mh) / NH));
    for (let x = 0; x < NW; x++) f[y * NW + x] = conf[my * mw + Math.min(mw - 1, Math.floor((x * mw) / NW))];
  }
  const sm = boxBlur(boxBlur(f, 3), 3);
  const fill = new Uint8Array(NW * NH);
  let n = 0;
  for (let i = 0; i < fill.length; i++) if (sm[i] > 0.5) { fill[i] = 1; n++; }
  if (n < 400) return null;
  dropSmall(fill, 1, 350, false);
  dropSmall(fill, 0, 700, true);
  const edge = new Uint8Array(NW * NH);
  for (let y = 0; y < NH; y++) {
    for (let x = 0; x < NW; x++) {
      const i = y * NW + x;
      if (!fill[i]) continue;
      // outside of the picture counts as subject, so no line runs along the frame edge
      const l = x > 0 ? fill[i - 1] : 1, r = x < NW - 1 ? fill[i + 1] : 1, u = y > 0 ? fill[i - NW] : 1, d = y < NH - 1 ? fill[i + NW] : 1;
      if (!l || !r || !u || !d) edge[i] = 1;
    }
  }
  const line = new Uint8Array(NW * NH);
  for (let y = 1; y < NH - 1; y++) for (let x = 1; x < NW - 1; x++) {
    if (!edge[y * NW + x]) continue;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) line[(y + dy) * NW + x + dx] = 1;
  }
  return { fill, line };
}

function strokePath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last[0], last[1]);
  ctx.stroke();
}

function paintArea(ctx: CanvasRenderingContext2D, a: Pick<Area, "color"> & ({ kind: "mask"; line: Uint8Array } | { kind: "pen"; pts: Pt[] })) {
  ctx.clearRect(0, 0, NW, NH);
  const c = core(a.color);
  if (a.kind === "mask") {
    const img = ctx.createImageData(NW, NH);
    const m = c.match(/\d+/g)!.map(Number);
    for (let i = 0; i < a.line.length; i++) if (a.line[i]) {
      const k = i * 4;
      img.data[k] = m[0]; img.data[k + 1] = m[1]; img.data[k + 2] = m[2]; img.data[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  } else if (a.pts.length > 1) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = c;
    strokePath(ctx, a.pts);
  }
}

function glowCss(color: string) {
  return `drop-shadow(0 0 1.5px ${color}) drop-shadow(0 0 6px ${color}) drop-shadow(0 0 16px ${color}) drop-shadow(0 0 34px ${color}aa)`;
}

function Tube({ area }: { area: Pick<Area, "color"> & ({ kind: "mask"; line: Uint8Array } | { kind: "pen"; pts: Pt[] }) }) {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = cv.current?.getContext("2d");
    if (ctx) paintArea(ctx, area);
  }, [area]);
  return <canvas ref={cv} width={NW} height={NH} className="pointer-events-none absolute inset-0 h-full w-full" style={{ filter: glowCss(area.color) }} />;
}

/* MediaPipe prints its info lines (GL version etc.) through console.error; keep them out of the dev overlay */
const MP_LOG = /^[IWE]\d{4} \d\d:\d\d:\d\d\.\d+/;
if (typeof window !== "undefined" && !(console.error as unknown as { mp?: boolean }).mp) {
  const orig = console.error.bind(console);
  const patched = (...a: unknown[]) => { if (typeof a[0] === "string" && MP_LOG.test(a[0])) return; orig(...a); };
  (patched as unknown as { mp: boolean }).mp = true;
  console.error = patched;
}

/* ---------- segmentation model (loaded on demand, runs in the browser) ---------- */
type Seg = import("@mediapipe/tasks-vision").InteractiveSegmenter;
let segPromise: Promise<Seg> | null = null;
function loadSegmenter(): Promise<Seg> {
  if (!segPromise) {
    segPromise = (async () => {
      const { FilesetResolver, InteractiveSegmenter } = await import("@mediapipe/tasks-vision");
      const fileset = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
      return InteractiveSegmenter.createFromOptions(fileset, { baseOptions: { modelAssetPath: "/models/interactive_segmentation.task" } });
    })();
    segPromise.catch(() => { segPromise = null; });
  }
  return segPromise;
}

function distToSeg(p: Pt, a: Pt, b: Pt) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
function hit(areas: Area[], p: Pt, reach: number): Area | null {
  for (let i = areas.length - 1; i >= 0; i--) {
    const a = areas[i];
    if (a.kind === "mask") {
      const x = Math.round(p[0]), y = Math.round(p[1]);
      if (x >= 0 && y >= 0 && x < NW && y < NH && a.fill[y * NW + x]) return a;
    } else {
      for (let j = 1; j < a.pts.length; j++) if (distToSeg(p, a.pts[j - 1], a.pts[j]) < reach) return a;
    }
  }
  return null;
}

/* ---------- flatten the design to one image ---------- */
function render(base: HTMLCanvasElement, areas: Area[]): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = NW * 2;
  out.height = NH * 2;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#07070c";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.drawImage(base, 0, 0, out.width, out.height);
  ctx.restore();
  for (const a of areas) {
    const layer = document.createElement("canvas");
    layer.width = NW;
    layer.height = NH;
    paintArea(layer.getContext("2d")!, a);
    for (const [blur, alpha] of [[70, 0.55], [32, 0.8], [12, 1], [3, 1]] as const) {
      ctx.save();
      ctx.shadowColor = a.color;
      ctx.shadowBlur = blur;
      ctx.globalAlpha = alpha;
      ctx.drawImage(layer, 0, 0, out.width, out.height);
      ctx.restore();
    }
    ctx.drawImage(layer, 0, 0, out.width, out.height);
  }
  return out;
}

export default function CustomStudio({ page = false }: { page?: boolean }) {
  const { add } = useCart();
  const [photo, setPhoto] = useState<{ url: string; name: string } | null>(null);
  const [glow, setGlow] = useState<(typeof GLOWS)[number]>(GLOWS[0]);
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("neon");
  const [tool, setTool] = useState<Tool>("tap");
  const [areas, setAreas] = useState<Area[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Pt[] | null>(null);
  const [model, setModel] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState<"s" | "m" | "l" | "custom">("m");
  const [cw, setCw] = useState("");
  const [ch, setCh] = useState("");
  const [saving, setSaving] = useState(false);

  const baseRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<Seg | null>(null);
  const nextId = useRef(1);
  const drawing = useRef(false);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const ptrs = useRef(new Map<number, [number, number]>());
  const last = useRef<{ d: number; cx: number; cy: number } | null>(null);
  const pan = useRef<[number, number] | null>(null);
  const sizeRef = useRef(0);
  sizeRef.current = areas.length;

  const photoSrc = photo?.url ?? SAMPLE;
  const neon = style === "neon";

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);

  /* draw the photo into the 3:4 working canvas, then let the model read it once */
  useEffect(() => {
    let dead = false;
    setAreas([]);
    setActiveId(null);
    setView({ s: 1, x: 0, y: 0 });
    const im = new Image();
    im.onload = async () => {
      if (dead || !baseRef.current) return;
      cropTo(im, baseRef.current);
      if (!neon) return;
      try {
        setModel("loading");
        const seg = await loadSegmenter();
        if (dead) return;
        seg.setImage(baseRef.current);
        segRef.current = seg;
        setModel("ready");
      } catch (err) {
        console.error("studio model", err);
        if (!dead) setModel("error");
      }
    };
    im.src = photoSrc;
    return () => { dead = true; segRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoSrc]);

  /* switching to neon later needs the model too */
  useEffect(() => {
    if (!neon || model !== "idle" || !baseRef.current) return;
    let dead = false;
    (async () => {
      try {
        setModel("loading");
        const seg = await loadSegmenter();
        if (dead || !baseRef.current) return;
        seg.setImage(baseRef.current);
        segRef.current = seg;
        setModel("ready");
      } catch (err) { console.error("studio model", err); if (!dead) setModel("error"); }
    })();
    return () => { dead = true; };
  }, [neon, model]);

  function onFile(f?: File) {
    if (!f || !f.type.startsWith("image/")) return;
    setModel("idle");
    setPhoto({ url: URL.createObjectURL(f), name: f.name });
  }

  const pointAt = useCallback((e: React.PointerEvent): Pt => {
    const r = stageRef.current!.getBoundingClientRect();
    const lx = e.clientX - r.left, ly = e.clientY - r.top;
    return [(((lx - view.x) / view.s) / r.width) * NW, (((ly - view.y) / view.s) / r.height) * NH];
  }, [view]);

  const zoomAt = useCallback((f: number, cx?: number, cy?: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    setView((v) => {
      const ns = Math.max(1, Math.min(6, v.s * f));
      const px = cx ?? r.width / 2, py = cy ?? r.height / 2;
      const k = ns / v.s;
      const clamp = (t: number, size: number) => Math.min(0, Math.max(size * (1 - ns), t));
      return ns === 1 ? { s: 1, x: 0, y: 0 } : { s: ns, x: clamp(px - (px - v.x) * k, r.width), y: clamp(py - (py - v.y) * k, r.height) };
    });
  }, []);

  const panBy = useCallback((dx: number, dy: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    setView((v) => ({ ...v, x: Math.min(0, Math.max(r.width * (1 - v.s), v.x + dx)), y: Math.min(0, Math.max(r.height * (1 - v.s), v.y + dy)) }));
  }, []);

  /* mouse wheel / trackpad pinch zoom (needs a non-passive listener) */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !neon) return;
    const h = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey && view.s === 1) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025)), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, [neon, view.s, zoomAt]);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg((m) => (m === t ? "" : m)), 2600);
  }

  function pick(a: Area) {
    setActiveId(a.id);
    const g = GLOWS.find((x) => x.hex === a.color);
    if (g) setGlow(g);
  }

  function onDown(e: React.PointerEvent) {
    if (!neon) return;
    const r0 = stageRef.current!.getBoundingClientRect();
    ptrs.current.set(e.pointerId, [e.clientX - r0.left, e.clientY - r0.top]);
    if (ptrs.current.size === 2) {
      // second finger: cancel any stroke and switch to pinch
      drawing.current = false;
      setDraft(null);
      const [a, b] = Array.from(ptrs.current.values());
      last.current = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), cx: (a[0] + b[0]) / 2, cy: (a[1] + b[1]) / 2 };
      return;
    }
    if (tool === "move") {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      pan.current = [e.clientX, e.clientY];
      return;
    }
    const p = pointAt(e);
    if (tool === "draw") {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      drawing.current = true;
      setDraft([p]);
      return;
    }
    if (tool === "erase") {
      const a = hit(areas, p, 16);
      if (a) {
        setAreas((arr) => arr.filter((x) => x.id !== a.id));
        setActiveId((id) => (id === a.id ? null : id));
      }
      return;
    }
    // tap: select an existing area, otherwise ask the model for the subject under the finger
    const existing = hit(areas, p, 16);
    if (existing) { pick(existing); return; }
    const seg = segRef.current;
    if (!seg || busy) { if (model === "loading") flash("Still reading your photo…"); return; }
    setBusy(true);
    setTimeout(async () => {
      try {
        const m = seg.segment([{ brushMode: 1 /* POSITIVE */, point: [{ x: p[0] / NW, y: p[1] / NH }], isCompleted: true }]);
        const conf = m.getAsFloat32Array();
        const built = buildMask(conf, m.width, m.height);
        m.close();
        if (!built) { flash("Couldn’t find a shape there. Tap again, or draw it."); }
        else {
          const id = nextId.current++;
          setAreas((arr) => [...arr, { id, color: glow.hex, kind: "mask", fill: built.fill, line: built.line }]);
          setActiveId(null);
        }
      } catch (err) {
        console.error("studio segment", err);
        flash("Couldn’t trace that. Try drawing it.");
      } finally {
        setBusy(false);
      }
    }, 20);
  }

  function onMove(e: React.PointerEvent) {
    if (ptrs.current.has(e.pointerId)) {
      const r0 = stageRef.current!.getBoundingClientRect();
      ptrs.current.set(e.pointerId, [e.clientX - r0.left, e.clientY - r0.top]);
    }
    if (ptrs.current.size === 2 && last.current) {
      const [a, b] = Array.from(ptrs.current.values());
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
      zoomAt(d / last.current.d, cx, cy);
      panBy(cx - last.current.cx, cy - last.current.cy);
      last.current = { d, cx, cy };
      return;
    }
    if (pan.current) {
      panBy(e.clientX - pan.current[0], e.clientY - pan.current[1]);
      pan.current = [e.clientX, e.clientY];
      return;
    }
    if (!drawing.current) return;
    const p = pointAt(e);
    setDraft((d) => {
      if (!d) return d;
      const l = d[d.length - 1];
      return Math.hypot(p[0] - l[0], p[1] - l[1]) < 2.5 ? d : [...d, p];
    });
  }

  function onUp(e: React.PointerEvent) {
    ptrs.current.delete(e.pointerId);
    if (ptrs.current.size < 2) last.current = null;
    pan.current = null;
    if (!drawing.current) return;
    drawing.current = false;
    setDraft((d) => {
      if (d && d.length > 2) {
        const id = nextId.current++;
        setAreas((arr) => [...arr, { id, color: glow.hex, kind: "pen", pts: d }]);
        setActiveId(null);
      }
      return null;
    });
  }

  function chooseColour(g: (typeof GLOWS)[number]) {
    setGlow(g);
    if (activeId !== null) setAreas((arr) => arr.map((a) => (a.id === activeId ? { ...a, color: g.hex } : a)));
  }

  function undo() {
    setAreas((arr) => {
      const next = arr.slice(0, -1);
      setActiveId(null);
      return next;
    });
  }

  function designBlob(): Promise<Blob | null> {
    return new Promise((res) => render(baseRef.current!, areas).toBlob((b) => res(b), "image/png"));
  }

  async function download() {
    const b = await designBlob();
    if (!b) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = "mu-frames-design.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  async function addToCart() {
    const styleLabel = STYLES.find((s) => s.id === style)!.label;
    let link = "";
    if (neon && areas.length) {
      setSaving(true);
      try {
        const b = await designBlob();
        if (b) {
          const r = await fetch("/api/design", { method: "POST", headers: { "Content-Type": "image/png" }, body: b });
          if (r.ok) link = (await r.json()).url;
        }
      } catch { /* the download button stays as the backup */ }
      setSaving(false);
    }
    const preset = SIZES.find((x) => x.id === size);
    const sizeText = preset ? `${preset.label} ${sizeCm(preset)}` : cw && ch ? `custom ${cw} × ${ch} cm` : "size to confirm";
    const colours = Array.from(new Set(areas.map((a) => GLOWS.find((g) => g.hex === a.color)?.name ?? a.color))).join(", ");
    add({
      key: `custom-${style}-${size}-${Date.now()}`,
      name: "Custom frame",
      detail: [
        styleLabel,
        sizeText,
        neon && areas.length ? `${areas.length} neon ${areas.length === 1 ? "line" : "lines"} (${colours})` : glow.name,
        note.trim() ? `note: ${note.trim()}` : "",
        link ? `design: ${link}` : "",
      ].filter(Boolean).join(", "),
      price: null,
      glow: (areas.find((a) => a.id === activeId)?.color ?? glow.hex),
      photo: !!photo,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  }

  const H = page ? "h1" : "h2";
  const hint =
    model === "error" ? "The tracing model didn’t load. Use Draw instead."
    : msg ? msg
    : busy ? "Tracing…"
    : model === "loading" && tool === "tap" ? "Reading your photo…"
    : tool === "tap" ? (areas.length ? "Tap another subject, or tap a line to recolour it." : "Tap what should glow.")
    : tool === "move" ? "Drag to move around. Pinch or use + to zoom."
    : tool === "draw" ? "Draw the line with your finger or mouse."
    : "Tap a line to remove it.";

  return (
    <section id="custom" className={`cs-room relative isolate scroll-mt-6 overflow-hidden px-5 sm:px-8 lg:px-[5vw] ${page ? "pb-16 pt-32 lg:pt-36" : "py-20 lg:py-24"}`}>
      <span className="cs-wash" aria-hidden="true" style={{ "--c": glow.hex } as React.CSSProperties} />
      <span className="cs-floor" aria-hidden="true" />

      <div className="cs-grid relative">
        <div className="cs-copy">
          <H className="text-[clamp(2.8rem,6.4vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            Make it
            <br />
            <span className="neon-text" style={{ color: glow.hex }}>yours.</span>
          </H>
          <p className="mt-7 max-w-[34ch] text-lg leading-relaxed text-white/60">
            Send us any photo. Choose what glows. We build the frame in Kigali and deliver it to your door.
          </p>
        </div>

        <div className="cs-stage" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}>
          <div className="cs-col">
            <div className="cs-framewrap">
            {neon && (
                  <div className="cs-zoom" role="group" aria-label="Zoom">
                    <button type="button" onClick={() => zoomAt(1.5)} disabled={view.s >= 6} aria-label="Zoom in">+</button>
                    <button type="button" onClick={() => setView({ s: 1, x: 0, y: 0 })} aria-label="Reset zoom">{Math.round(view.s * 100)}%</button>
                    <button type="button" onClick={() => zoomAt(1 / 1.5)} disabled={view.s <= 1} aria-label="Zoom out">−</button>
                  </div>
                )}
            <div
              className="cs-frame"
              style={
                neon
                  ? { padding: "1.6%", boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px -30px #000` }
                  : { padding: "1.4%", boxShadow: `0 0 0 1px ${glow.hex}66, 0 0 36px 4px ${glow.hex}cc, 0 0 130px 26px ${glow.hex}66` }
              }
            >
              <div
                ref={stageRef}
                className="relative h-full w-full overflow-hidden"
                style={{ touchAction: neon ? "none" : "manipulation", cursor: neon ? (tool === "tap" ? "pointer" : tool === "move" ? "grab" : "crosshair") : "default" }}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                <div className="absolute inset-0 will-change-transform" style={{ transformOrigin: "0 0", transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}>
                <canvas
                  ref={baseRef}
                  width={NW}
                  height={NH}
                  role="img"
                  aria-label={photo ? "Your photo in the frame" : "Sample photo in the frame"}
                  className="h-full w-full transition-[filter] duration-700"
                  style={{ filter: neon ? "brightness(0.4) saturate(0.75) contrast(1.1)" : "none" }}
                />
                {neon && areas.map((a) => <Tube key={a.id + a.color} area={a} />)}
                {neon && draft && draft.length > 1 && <Tube area={{ kind: "pen", pts: draft, color: glow.hex }} />}
                {!neon && <span className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ boxShadow: `inset 0 0 70px 6px ${glow.hex}66` }} />}
                </div>
              </div>
            </div>
            </div>
            <p className="cs-hint" aria-live="polite">{neon ? hint : "Soft light behind the frame."}</p>
          </div>
        </div>

        <div className="cs-dock">
          <label className="cs-pill cs-upload">
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
            <span className="truncate">{photo ? photo.name : "Upload photo"}</span>
          </label>

          <div className="cs-seg" role="group" aria-label="Light" style={{ "--i": STYLES.findIndex((x) => x.id === style), "--n": 2 } as React.CSSProperties}>
            <span className="cs-seg-thumb" aria-hidden="true" />
            {STYLES.map((x) => (
              <button key={x.id} type="button" aria-pressed={style === x.id} onClick={() => setStyle(x.id)}>
                {x.id === "neon" ? "Neon" : "LED"}
              </button>
            ))}
          </div>

          {neon && (
            <>
              <div className="cs-seg cs-tools" role="group" aria-label="Tool" style={{ "--i": TOOLS.findIndex((x) => x.id === tool), "--n": 4 } as React.CSSProperties}>
                <span className="cs-seg-thumb" aria-hidden="true" />
                {TOOLS.map((x) => (
                  <button key={x.id} type="button" aria-pressed={tool === x.id} onClick={() => { setTool(x.id); setActiveId(null); }}>{x.label}</button>
                ))}
              </div>
              <button type="button" className="cs-pill cs-mini" onClick={undo} disabled={!areas.length} aria-label="Undo last line">Undo</button>
            </>
          )}

          <div className="cs-seg cs-sizes" role="group" aria-label="Size" style={{ "--i": ["s", "m", "l", "custom"].indexOf(size), "--n": 4 } as React.CSSProperties}>
            <span className="cs-seg-thumb" aria-hidden="true" />
            {([...SIZES.map((x) => [x.id, x.label] as const), ["custom", "Custom"] as const]).map(([id, label]) => (
              <button key={id} type="button" aria-pressed={size === id} onClick={() => setSize(id as typeof size)}>{label}</button>
            ))}
          </div>

          <div className="cs-size" aria-live="polite">
            {size === "custom" ? (
              <>
                <input inputMode="decimal" type="number" min="10" max="300" value={cw} onChange={(e) => setCw(e.target.value)} placeholder="W" aria-label="Width in centimetres" />
                <span>×</span>
                <input inputMode="decimal" type="number" min="10" max="300" value={ch} onChange={(e) => setCh(e.target.value)} placeholder="H" aria-label="Height in centimetres" />
                <span>cm</span>
              </>
            ) : (
              sizeCm(SIZES.find((x) => x.id === size)!)
            )}
          </div>

          <div className="cs-swatches" role="group" aria-label="Colour">
            {GLOWS.map((g) => (
              <button key={g.id} type="button" aria-label={g.name} aria-pressed={glow.id === g.id} onClick={() => chooseColour(g)} style={{ background: g.hex, "--c": g.hex } as React.CSSProperties} />
            ))}
          </div>

          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Name, size, deadline…" aria-label="Anything we should know" className="cs-pill cs-note" />

          {neon && areas.length > 0 && (
            <button type="button" className="cs-pill cs-mini" onClick={download}>Download design</button>
          )}
          <button type="button" onClick={addToCart} disabled={saving} className="cs-add">
            {saving ? "Saving design…" : added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </section>
  );
}
