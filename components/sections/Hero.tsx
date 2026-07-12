import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden pt-32">

      {/* Luces de fondo */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-red-600/20 blur-[180px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-red-700/20 blur-[180px]" />

      <div className="relative max-w-7xl mx-auto px-8">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Texto */}
          <div>

            <p className="uppercase tracking-[6px] text-red-600 font-bold mb-6">
              Gaming Experience GMP
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
              SUBÍ DE NIVEL
            </h1>

            <h2 className="text-5xl md:text-7xl font-black text-red-600 mt-3">
              GANÁ PREMIOS
            </h2>

            <p className="text-zinc-400 text-xl leading-8 mt-8 max-w-xl">
              Competí en torneos de EA SPORTS FC contra los mejores jugadores,
              escalá posiciones en el ranking y ganá premios reales.
            </p>

            {/* Botones */}
            <div className="flex flex-wrap gap-5 mt-10">

              <button className="bg-red-600 hover:bg-red-700 transition duration-300 px-8 py-4 rounded-xl font-bold text-lg">
                INSCRIBIRME
              </button>

              <button className="border border-zinc-700 hover:border-red-600 hover:text-red-500 transition duration-300 px-8 py-4 rounded-xl font-bold flex items-center gap-2">
                VER TORNEOS
                <FaArrowRight />
              </button>

            </div>

            {/* Contador visual */}
            <div className="mt-16">

              <p className="uppercase text-zinc-500 tracking-[5px] mb-6">
                Próximo torneo
              </p>

              <div className="grid grid-cols-4 gap-4 max-w-xl">

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-5 text-center">
                  <h3 className="text-4xl font-black text-red-600">03</h3>
                  <p className="text-zinc-400">Días</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-5 text-center">
                  <h3 className="text-4xl font-black text-red-600">14</h3>
                  <p className="text-zinc-400">Horas</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-5 text-center">
                  <h3 className="text-4xl font-black text-red-600">26</h3>
                  <p className="text-zinc-400">Min</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-5 text-center">
                  <h3 className="text-4xl font-black text-red-600">58</h3>
                  <p className="text-zinc-400">Seg</p>
                </div>

              </div>

            </div>

          </div>

          {/* Imagen */}
          <div className="flex justify-center">

            <Image
              src="/images/fifa.png"
              alt="Gaming Experience GMP"
              width={650}
              height={700}
              priority
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "650px",
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
}