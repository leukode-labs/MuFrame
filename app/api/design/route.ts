import { NextResponse } from "next/server";

// Stores the customer's neon design so the WhatsApp order can carry a link.
// Needs SUPABASE_URL, SUPABASE_SERVICE_KEY and a public bucket named "designs".
export async function POST(req: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return NextResponse.json({ error: "storage not configured" }, { status: 501 });

  const body = await req.arrayBuffer();
  if (!body.byteLength || body.byteLength > 6_000_000) return NextResponse.json({ error: "bad size" }, { status: 400 });

  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.png`;
  const r = await fetch(`${url}/storage/v1/object/designs/${name}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "image/png" },
    body,
  });
  if (!r.ok) return NextResponse.json({ error: "upload failed" }, { status: 502 });
  return NextResponse.json({ url: `${url}/storage/v1/object/public/designs/${name}` });
}
