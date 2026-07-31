"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { juegos } from "@/lib/games";

export default function TorneosPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="text-center mb-10 lg:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black">
            Elegí tu <span className="text-red-600">Juego</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg mt-3 lg:mt-4">
            Seleccioná el juego en el que querés competir.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {[...juegos].sort((a,b)=>Number(b.disponible)-Number(a.disponible)).map((juego) => (
            <div
              key={juego.nombre}
              className="group overflow-hidden rounded-2xl lg:rounded-3xl border border-zinc-800 bg-zinc-900 hover:border-red-600 transition-all duration-300"
            >
              <div className="relative h-[200px] sm:h-[260px] lg:h-[320px] overflow-hidden">
                <Image
                  src={juego.imagen}
                  alt={juego.nombre}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6">
                  <h2 className="text-xl sm:text-2xl lg:text-4xl font-black">
                    {juego.nombre}
                  </h2>

                  <p
                    className={`mt-1 lg:mt-2 text-sm sm:text-base font-semibold ${
                      juego.disponible
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {juego.disponible
                      ? "Disponible"
                      : "Próximamente"}
                  </p>
                </div>
              </div>

              <div className="p-4 lg:p-6">
                <button
                  onClick={() => router.push(juego.ruta)}
                  className={`w-full rounded-xl py-3 lg:py-4 font-bold text-base lg:text-lg transition ${
                    juego.disponible
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  Ver torneos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}



