"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import {
  FaWhatsapp,
  FaInstagram,
  FaDiscord,
  FaTiktok,
  FaEnvelope,
} from "react-icons/fa";

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="pt-24 lg:pt-36 pb-16 lg:pb-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">

            <h1 className="text-6xl font-black">
              <span className="text-white">Contacto</span>{" "}
              <span className="text-red-600">GMP</span>
            </h1>

            <p className="text-zinc-400 text-lg mt-6 max-w-3xl mx-auto leading-8">
              ¿Tenés alguna duda, consulta o necesitás ayuda?
              Elegí cualquiera de nuestros canales de contacto.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition">

              <FaWhatsapp className="text-5xl text-green-500 mb-6" />

              <h2 className="text-2xl font-bold mb-3">
                WhatsApp
              </h2>

              <p className="text-zinc-400 mb-8">
                Atención rápida para consultas sobre torneos e inscripciones.
              </p>

              <button className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-3 font-bold transition">
                Escribinos
              </button>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-pink-500 transition">

              <FaInstagram className="text-5xl text-pink-500 mb-6" />

              <h2 className="text-2xl font-bold mb-3">
                Instagram
              </h2>

              <p className="text-zinc-400 mb-8">
                Seguinos para enterarte de nuevos torneos y novedades.
              </p>

              <a
                href="https://www.instagram.com/gaminggmp/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-pink-600 hover:bg-pink-700 rounded-xl py-3 font-bold transition"
              >
                Ir a Instagram
              </a>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-indigo-500 transition">

              <FaDiscord className="text-5xl text-indigo-500 mb-6" />

              <h2 className="text-2xl font-bold mb-3">
                Discord
              </h2>

              <p className="text-zinc-400 mb-8">
                Unite a la comunidad oficial y hablá con otros jugadores.
              </p>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl py-3 font-bold transition">
                Unirme
              </button>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-500 transition">

              <FaEnvelope className="text-5xl text-red-500 mb-6" />

              <h2 className="text-2xl font-bold mb-3">
                Email
              </h2>

              <p className="text-zinc-400 mb-8">
                Para consultas generales o soporte técnico.
              </p>

              <button className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 font-bold transition">
                Enviar Email
              </button>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500 transition">

              <FaTiktok className="text-5xl text-cyan-400 mb-6" />

              <h2 className="text-2xl font-bold mb-3">
                TikTok
              </h2>

              <p className="text-zinc-400 mb-8">
                Mirá jugadas, clips y contenido exclusivo.
              </p>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-xl py-3 font-bold transition text-black">
                Ver Perfil
              </button>

            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 flex flex-col justify-center">

              <h2 className="text-3xl font-black mb-4">
                Gaming Experience GMP
              </h2>

              <p className="text-white/90 leading-8">
                Estamos disponibles para ayudarte antes, durante y después de cada torneo.
              </p>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}