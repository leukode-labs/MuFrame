export default function About({ page = false }: { page?: boolean }) {
  const H = page ? "h1" : "h2";
  return (
    <section id="about" className="scroll-mt-6">
      {/* Kigali at night: a dark photo band that opens the section */}
      <div className="relative flex min-h-[78svh] items-end overflow-hidden bg-[#05060f]">
        <img
          src="/kigali-night.webp"
          alt="Kigali's hills lit up at night"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#05060f] via-[#05060f]/35 to-[#05060f]/70" />
        <span className="pattern-dots absolute inset-0 opacity-60" />
        <div className="relative w-full px-5 pb-20 pt-40 sm:px-8 lg:px-[5vw] lg:pb-28">
          <H className="text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-white">
            Made in Kigali.
            <br />
            <span className="neon-text">Made to glow.</span>
          </H>
        </div>
        <a
          href="https://commons.wikimedia.org/wiki/File:Panoramic_view_of_Kigali_(Rwanda)_at_night_02.jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-5 text-[10px] tracking-wide text-white/35 hover:text-white/70 sm:right-8 lg:right-[5vw]"
        >
          Photo: Adoscam, CC BY-SA 4.0
        </a>
      </div>

      {/* the story */}
      <div className="bg-[#05060f] px-5 py-24 sm:px-8 lg:px-[5vw] lg:py-36">
        <div className="mx-auto max-w-[1100px]">
          <p className="max-w-[24ch] text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
            It started with one frame on one wall, and a room that suddenly felt different.
          </p>

          <div className="mt-16 grid gap-10 text-lg leading-[1.7] text-white/60 md:grid-cols-2 md:gap-16 lg:mt-24">
            <p>
              MU-FRAME began in Kigali with a simple idea: a picture should do more than hang there. We wanted art that lights up the room it lives in. A car you dream about, a club you would follow anywhere, a face, a few words that matter to you, all glowing like they belong to the night.
            </p>
            <p>
              Every frame is made by hand. We cut it, wire it, light it and test it ourselves, then bring it to your door in Kigali. No warehouse and no shipping from the other side of the world. Just the people who made it, and a WhatsApp number that gets answered.
            </p>
            <p>
              Some of our favourite frames started as somebody&rsquo;s own photo: a family portrait, a shop logo, a car parked outside the house. Send us yours, choose neon or LED and the colour it glows, and we build it.
            </p>
            <p className="text-white">
              We make them for living rooms, bedrooms, studios, salons and shops. Anywhere a wall could be doing more.
            </p>
          </div>

          <a href="/shop" className="mt-16 inline-flex items-center gap-3 text-xl font-bold text-white transition hover:text-neon">
            See the frames <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
