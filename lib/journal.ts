export type Block =
  | { t: "p"; x: string }
  | { t: "h"; x: string }
  | { t: "quote"; x: string }
  | { t: "list"; x: string[] };

export type Post = {
  slug: string;
  title: string;
  kicker: string;
  date: string; // ISO
  excerpt: string;
  cover: string; // a real frame photo
  glow: string;
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "neon-or-led",
    title: "Neon or LED: which one should you hang?",
    kicker: "Choosing",
    date: "2026-11-12",
    excerpt: "Same room, same wall, two very different frames. How to tell which one your picture wants to be.",
    cover: "/products/neon-face.webp",
    glow: "#c45bff",
    body: [
      { t: "p", x: "People usually ask which one is better. It is the wrong question, because the two do different jobs. A neon frame draws. An LED frame lights." },
      { t: "h", x: "Neon draws the picture" },
      { t: "p", x: "In a neon frame the glow is a line that traces the artwork: the edge of a face, the roof of a car, the shape of a crest. You look at the line, so the line has to say something. That is why neon suits pictures that are strong in outline, like faces in profile, cars, helmets, logos, a few words." },
      { t: "h", x: "LED lights the wall" },
      { t: "p", x: "An LED frame is lit from behind, so the light does not stay inside the frame. It spreads onto the wall around it and the whole picture glows like a screen with no screen. This suits full-colour artwork and busy images, where there is no single line to follow." },
      { t: "h", x: "A quick way to decide" },
      { t: "list", x: [
        "If you can draw your picture with one pen without lifting it, choose neon.",
        "If the picture is full of colour and texture, choose LED.",
        "If it is a logo or a word, neon almost always reads cleaner.",
        "If you want the wall around the frame to glow, choose LED.",
      ] },
      { t: "h", x: "Not sure?" },
      { t: "p", x: "Send us the picture on WhatsApp. We will tell you honestly which one will look better, and sometimes the answer is to simplify the picture first. That costs nothing and saves you from a frame you will not love." },
    ],
  },
  {
    slug: "where-to-hang-a-glowing-frame",
    title: "Where to hang a frame that glows",
    kicker: "At home",
    date: "2026-11-19",
    excerpt: "Height, wall, window and cable. Five decisions that make the difference between a frame and a feature.",
    cover: "/products/skyline-r34.webp",
    glow: "#2f5bff",
    body: [
      { t: "p", x: "A glowing frame behaves differently from a poster. It adds light to the room, so where you put it changes how the whole room feels. A few things are worth deciding before you pick up a drill." },
      { t: "h", x: "1. Hang it lower than you think" },
      { t: "p", x: "The usual gallery rule is to put the centre of the picture at about eye level, around 145 to 150 cm from the floor. In a bedroom or lounge where people sit more than they stand, go a little lower. The frame should feel like it belongs to the people in the room, not to the ceiling." },
      { t: "h", x: "2. Mind the window" },
      { t: "p", x: "Daylight is the enemy of glow. A frame facing a window will look flat all afternoon and come alive only after dark. If you can, hang it on a wall that does not catch direct sun. If you cannot, accept that it is an evening piece." },
      { t: "h", x: "3. Give it a plain wall" },
      { t: "p", x: "A calm, darker wall makes colour look deeper. Busy wallpaper or shelves behind the frame compete with it. This matters most for LED frames, because their light lands on the wall and needs somewhere clean to land." },
      { t: "h", x: "4. Plan the cable first" },
      { t: "p", x: "Know where the socket is before you mark the wall. Decide whether the cable will run down behind furniture or along a skirting line. A good frame in the right place can still be spoiled by a cable crossing the wall." },
      { t: "h", x: "5. Keep it dry" },
      { t: "p", x: "Rooms with steam and splashes, like bathrooms and kitchens, are the wrong home for a lit frame. A bedroom, lounge, studio, salon or shop is better." },
      { t: "quote", x: "The best place is usually the wall you look at when you are tired at the end of the day." },
      { t: "p", x: "If you are unsure, send us a photo of the wall and its size. We will suggest a frame and a height." },
    ],
  },
  {
    slug: "from-photo-to-one-line",
    title: "How we turn a photo into one line",
    kicker: "Behind the studio",
    date: "2026-11-24",
    excerpt: "Why a photograph cannot be copied into a glowing line directly, and what the custom studio does about it.",
    cover: "/hero/frame-01.webp",
    glow: "#ff1f4b",
    body: [
      { t: "p", x: "A photograph has millions of colours and no edges. A glowing frame is the opposite: it has one colour per line, and everything depends on the lines. Turning one into the other is mostly a question of deciding what to leave out." },
      { t: "h", x: "You choose what glows" },
      { t: "p", x: "In the custom studio you upload your photo and tap the thing you want lit: a person, a car, a dog. The studio finds the outline of what you tapped. If it chooses wrongly, you tap again or draw the line yourself, and you can undo or erase as you go." },
      { t: "h", x: "One clean outline" },
      { t: "p", x: "The outline it finds is rough. We smooth it into a single clean line, and fine details like strands of hair or the spokes of a wheel are simplified so the line stays readable at wall size. This is deliberate. A frame with every detail looks busy. A frame with the right details looks confident." },
      { t: "h", x: "A colour for every area" },
      { t: "p", x: "Each area you add can have its own colour. Pick red for the car and a cool blue for the person next to it, and the preview shows the result glowing on a dark wall before anything is made." },
      { t: "h", x: "Nothing leaves your phone until you say so" },
      { t: "p", x: "The tracing runs in your browser. Your photo is not uploaded when you play with it. It is only saved if you choose to save the design online, or when you send the file to us on WhatsApp." },
      { t: "p", x: "When you are happy, you download the preview or save it as a link, and send it to us with your size and colours. We check it, confirm the details with you, and start building." },
    ],
  },
];

export const readingMinutes = (p: Post) => {
  const words = p.body.map((b) => (b.t === "list" ? b.x.join(" ") : b.x)).join(" ").split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
};
export const fmtDate = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
