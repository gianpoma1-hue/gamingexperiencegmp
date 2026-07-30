"use client";

import { useRouter } from "next/navigation";
import {
  FaInstagram,
  FaDiscord,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-black border-t border-zinc-800 mt-24">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        {/* Logo */}

        <div>

          <h2 className="text-2xl font-black text-white">
            Gaming Experience
          </h2>

          <span className="text-red-600 font-bold">
            GMP
          </span>

          <p className="text-zinc-400 mt-5 leading-7">
            La plataforma competitiva para
jugadores de videojuegos.
Competí contra los mejores y ganá
premios reales.
          </p>

        </div>

        {/* Plataforma */}

        <div>

          <h3 className="font-bold text-white mb-4">
            Plataforma
          </h3>

          <div className="flex flex-col gap-3 text-zinc-400">

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

          <h3 className="font-bold text-white mb-4">
            Ayuda
          </h3>

          <div className="flex flex-col gap-3 text-zinc-400">

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

          <h3 className="font-bold text-white mb-4">
            Seguinos
          </h3>

          <div className="flex gap-5 text-3xl text-red-600">

            <a href="https://instagram.com/gmp_esports" target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:scale-110 transition cursor-pointer" /></a>

            <FaDiscord className="hover:scale-110 transition cursor-pointer" />

            <FaTiktok className="hover:scale-110 transition cursor-pointer" />

          </div>

        </div>

      </div>

      <div className="border-t border-zinc-800 py-6 text-center text-zinc-500">

        © 2026 Gaming Experience GMP · Todos los derechos reservados.

      </div>

    </footer>
  );
}
