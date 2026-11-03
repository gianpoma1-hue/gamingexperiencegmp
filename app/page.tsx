import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProximosTorneos from "@/components/sections/ProximosTorneos";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Footer from "@/components/footer/Footer";

import BackgroundEffects from "@/components/background/BackgroundEffects";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">

      {/* Fondo Global */}
      <BackgroundEffects />

      {/* Contenido */}
      <Navbar />

      <Hero />

      <ProximosTorneos />

      <HowItWorks />

      <WhyChooseUs />

      <Footer />

    </main>
  );
}
