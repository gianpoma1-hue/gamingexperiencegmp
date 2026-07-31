"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import RuleAccordion from "@/components/reglamento/RuleAccordion";
import { eaFcRules } from "@/lib/rules/eaFcRules";

export default function ReglamentoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-24 lg:pt-36 pb-12 lg:pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-6xl font-black text-center">
            Reglamento <span className="text-red-600">General</span>
          </h1>

          <p className="text-zinc-400 text-center text-lg mt-6 max-w-3xl mx-auto leading-8">
            Este reglamento aplica a todos los torneos organizados por Gaming
            Experience GMP, independientemente del videojuego disputado.
            Cada torneo podrá contar con reglas específicas adicionales,
            las cuales serán informadas antes del inicio de la competencia.
          </p>
        </div>
      </section>

      <RuleAccordion rules={eaFcRules} />

      <Footer />
    </main>
  );
}
