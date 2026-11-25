import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Collection from "@/components/Collection";
import CustomStudio from "@/components/CustomStudio";
import About from "@/components/About";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Collection />
      <CustomStudio />
      <About />
      <Faq />
    </main>
  );
}
