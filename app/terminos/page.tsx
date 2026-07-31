"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="pt-24 lg:pt-36 pb-16 lg:pb-24">

        <div className="max-w-5xl mx-auto px-6">

          <h1 className="text-6xl font-black text-center">
            Términos y <span className="text-red-600">Condiciones</span>
          </h1>

          <p className="text-zinc-400 text-center text-lg mt-6 leading-8">
            Al utilizar Gaming Experience GMP y participar en nuestros torneos,
            aceptás los siguientes términos y condiciones.
          </p>

          <div className="mt-16 space-y-10">

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-5">
                Uso de la Plataforma
              </h2>

              <p className="text-zinc-400 leading-8">
                Gaming Experience GMP ofrece una plataforma para la organización
                de torneos competitivos de EA SPORTS FC. Al utilizar nuestros
                servicios, el usuario acepta cumplir con el reglamento y las
                decisiones de la organización.
              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-5">
                Responsabilidad del Usuario
              </h2>

              <p className="text-zinc-400 leading-8">
                Cada participante es responsable de proporcionar información
                correcta, cumplir los horarios establecidos y respetar las
                normas de convivencia durante el torneo.
              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-5">
                Pagos y Premios
              </h2>

              <p className="text-zinc-400 leading-8">
                Los pagos de inscripción y la entrega de premios estarán sujetos
                a las condiciones particulares de cada torneo. Gaming Experience
                GMP podrá verificar la identidad del ganador antes de realizar
                cualquier pago.
              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-5">
                Modificaciones
              </h2>

              <p className="text-zinc-400 leading-8">
                Gaming Experience GMP podrá actualizar estos términos y
                condiciones cuando resulte necesario para mejorar el servicio o
                adaptarse a cambios legales y operativos.
              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-5">
                Aceptación
              </h2>

              <p className="text-zinc-400 leading-8">
                Al registrarte y participar en un torneo, confirmás que leíste,
                comprendiste y aceptaste estos términos y condiciones, así como
                el Reglamento Oficial de Gaming Experience GMP.
              </p>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}