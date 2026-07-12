import { FaInstagram, FaDiscord, FaTrophy } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-red-600/20 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-14">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <h2 className="text-2xl font-black text-red-600">
              Gaming Experience GMP
            </h2>

            <p className="text-zinc-400 mt-4 leading-7">
              Competí contra los mejores jugadores de EA SPORTS FC y
              ganá premios reales en torneos organizados.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h3 className="font-bold text-white mb-4">
              Plataforma
            </h3>

            <ul className="space-y-3 text-zinc-400">
              <li>Torneos</li>
              <li>Ranking</li>
              <li>Premios</li>
              <li>Estadísticas</li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-bold text-white mb-4">
              Ayuda
            </h3>

            <ul className="space-y-3 text-zinc-400">
              <li>Reglamento</li>
              <li>Preguntas frecuentes</li>
              <li>Contacto</li>
              <li>Términos y condiciones</li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h3 className="font-bold text-white mb-4">
              Seguinos
            </h3>

            <div className="flex gap-5 text-3xl text-red-600">

              <FaInstagram className="hover:scale-110 cursor-pointer transition" />

              <FaDiscord className="hover:scale-110 cursor-pointer transition" />

              <FaTrophy className="hover:scale-110 cursor-pointer transition" />

            </div>

          </div>

        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-500">

          © 2026 Gaming Experience GMP · Todos los derechos reservados.

        </div>

      </div>
    </footer>
  );
}