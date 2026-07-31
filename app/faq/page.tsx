"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import FAQ from "@/components/sections/FAQ";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="pt-24 lg:pt-36 pb-10">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h1 className="text-6xl font-black">
            Preguntas <span className="text-red-600">Frecuentes</span>
          </h1>

          <p className="text-zinc-400 mt-6 text-lg leading-8">
            Encontrá respuestas a las dudas más comunes sobre los torneos,
            las inscripciones y el funcionamiento de Gaming Experience GMP.
          </p>

        </div>

      </section>

<FAQ showHeader={false} />

      <Footer />

    </main>
  );
}