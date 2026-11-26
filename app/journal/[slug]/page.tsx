import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, fmtDate, readingMinutes } from "@/lib/journal";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main>
      <article className="relative isolate overflow-hidden bg-[#05060f] px-5 pb-24 pt-32 sm:px-8 lg:px-[5vw] lg:pb-36 lg:pt-44">
        <div className="mx-auto max-w-[1180px]">
          <Link href="/journal" className="inline-flex items-center gap-2 text-[14px] font-semibold text-white/50 transition hover:text-white">
            <span aria-hidden="true">&larr;</span> Journal
          </Link>
          <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/45">{post.kicker} · {fmtDate(post.date)} · {readingMinutes(post)} min read</p>
          <h1 className="mt-5 max-w-[16ch] text-[clamp(2.4rem,6.6vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">{post.title}</h1>

          <div className="jr-cover jr-cover-wide mt-12 sm:mt-16" style={{ "--g": post.glow } as React.CSSProperties}>
            <img src={post.cover} alt="" />
          </div>

          <div className="mx-auto mt-14 max-w-[660px] sm:mt-20">
            {post.body.map((b, i) => {
              if (b.t === "h") return <h2 key={i} className="mb-4 mt-12 text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-white">{b.x}</h2>;
              if (b.t === "quote") return <blockquote key={i} className="my-12 border-l-2 border-neon pl-6 text-[clamp(1.4rem,2.8vw,2rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-white">{b.x}</blockquote>;
              if (b.t === "list") return (
                <ul key={i} className="my-6 space-y-3">
                  {b.x.map((li) => (
                    <li key={li} className="relative pl-7 text-[18px] leading-[1.65] text-white/75 before:absolute before:left-0 before:top-[0.72em] before:h-[2px] before:w-4 before:bg-neon">{li}</li>
                  ))}
                </ul>
              );
              return <p key={i} className="mt-5 text-[18px] leading-[1.8] text-white/70">{b.x}</p>;
            })}

            <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-10">
              <Link href="/custom" className="btn-primary">
                Build your own
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/shop" className="btn-text">See the frames</Link>
            </div>
          </div>

          <div className="mx-auto mt-24 max-w-[1180px] border-t border-white/10 pt-10 sm:mt-32">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/45">Keep reading</p>
            <div className="mt-6 grid gap-x-12 md:grid-cols-2">
              {others.map((p) => (
                <Link key={p.slug} href={`/journal/${p.slug}`} className="group block border-b border-white/10 py-6">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">{p.kicker}</span>
                  <span className="mt-2 block text-[clamp(1.3rem,2.2vw,1.7rem)] font-bold leading-[1.15] tracking-[-0.03em] transition group-hover:text-neon">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
