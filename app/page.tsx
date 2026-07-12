import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import NextTournament from "@/components/sections/NextTournament";
import Ranking from "@/components/sections/Ranking";
import HowItWorks from "@/components/sections/HowItWorks";
import Footer from "@/components/footer/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <NextTournament />
      <Ranking />
      <HowItWorks />
      <Footer />
    </>
  );
}