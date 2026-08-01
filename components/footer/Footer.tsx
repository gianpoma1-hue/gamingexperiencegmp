"use client";

import { useRouter } from "next/navigation";
import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-black border-t border-zinc-800 mt-24">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-16">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">

          {/* Logo */}

          <div className="col-span-2 md:col-span-1">

            <h2 className="text-xl lg:text-2xl font-black text-white">
              Gaming Experience
            </h2>

            <span className="text-red-600 font-bold text-sm lg:text-base">
              GMP
            </span>

            <p className="text-zinc-400 mt-3 lg:mt-5 text-sm lg:text-base leading-6 lg:leading-7">
              La plataforma competitiva para
jugadores de videojuegos.
Competí contra los mejores y ganá
premios reales.
            </p>

          </div>

          {/* Plataforma */}

          <div>

            <h3 className="font-bold text-white mb-3 lg:mb-4 text-sm lg:text-base">
              Plataforma
            </h3>

            <div className="flex flex-col gap-2 lg:gap-3 text-zinc-400 text-sm lg:text-base">

              <button
                onClick={() => router.push("/torneos")}
                className="text-left hover:text-red-500 transition"
              >
                Torneos
              </button>

              <button
                onClick={() => router.push("/ranking")}
                className="text-left hover:text-red-500 transition"
              >
                Ranking
              </button>


              <button
                onClick={() => router.push("/reglamento")}
                className="text-left hover:text-red-500 transition"
              >
                Reglamento
              </button>

            </div>

          </div>

          {/* Ayuda */}

          <div>

            <h3 className="font-bold text-white mb-3 lg:mb-4 text-sm lg:text-base">
              Ayuda
            </h3>

            <div className="flex flex-col gap-2 lg:gap-3 text-zinc-400 text-sm lg:text-base">

              <button
                onClick={() => router.push("/faq")}
                className="text-left hover:text-red-500 transition"
              >
                Preguntas Frecuentes
              </button>

              <button
                onClick={() => router.push("/contacto")}
                className="text-left hover:text-red-500 transition"
              >
                Contacto
              </button>

              <button
                onClick={() => router.push("/terminos")}
                className="text-left hover:text-red-500 transition"
              >
                Términos y Condiciones
              </button>

            </div>

          </div>

          {/* Redes */}

          <div>

            <h3 className="font-bold text-white mb-3 lg:mb-4 text-sm lg:text-base">
              Seguinos y unite a nuestra comunidad
            </h3>

            <div className="flex gap-4 lg:gap-5 text-2xl lg:text-3xl text-red-600">

              <a href="https://www.instagram.com/gaminggmp/" target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:scale-110 transition cursor-pointer" /></a>

              <a href="https://chat.whatsapp.com/ChY0liNPMEYDDov655CDJI" target="_blank" rel="noopener noreferrer"><FaWhatsapp className="hover:scale-110 transition cursor-pointer" /></a>

            </div>

            <p className="text-zinc-400 mt-3 text-xs lg:text-sm leading-6">
              Seguinos en instagram y sumate anuestra comunidad de WhatsApp: ahí avisamos todos los
              torneos, inscripciones abiertas y novedades.
            </p>

          </div>

        </div>

      </div>

      <div className="border-t border-zinc-800 py-4 lg:py-6 text-center text-zinc-500 text-xs sm:text-sm px-4">

        © 2026 Gaming Experience GMP · Todos los derechos reservados.

      </div>

    </footer>
  );
}
