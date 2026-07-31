import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fondo compartido */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/45" />

      <div
        className="absolute left-[-100px] bottom-[60px] w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] rounded-full blur-[60px] lg:blur-[130px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,.55) 0%, rgba(37,99,235,.25) 40%, transparent 72%)",
        }}
      />

      {/* ================= MOBILE (< lg) ================= */}
      <div className="lg:hidden relative z-10">
        <div className="px-6 pt-28 pb-2">
          <h1 className="font-black leading-[1.05]">
            <span className="block text-[36px] sm:text-[46px] text-white">
              SUBI DE NIVEL
            </span>
            <span className="block text-[36px] sm:text-[46px] text-red-600 mt-2">
              GANA PREMIOS
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 text-base sm:text-lg leading-7">
            Competí en torneos de los mejores videojuegos,
            escalá posiciones y consegui premios reales.
          </p>

          <Link
            href="/torneos"
            className="inline-flex items-center gap-3 mt-8 border border-red-600 rounded-xl px-6 py-4 font-bold text-base hover:bg-red-600/10 transition"
          >
            VER TORNEOS
            <FaArrowRight />
          </Link>
        </div>

        <div className="relative flex justify-center mt-2">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[100px] pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle, rgba(255,30,30,.45) 0%, rgba(255,30,30,.15) 45%, transparent 80%)",
            }}
          />

          <Image
            src="/images/fifa.webp"
            alt="Gaming Experience GMP"
            width={900}
            height={600}
            priority
            sizes="100vw"
            className="relative z-10 w-[105%] max-w-none h-auto drop-shadow-[0_40px_100px_rgba(0,0,0,.9)] select-none pointer-events-none"
          />
        </div>

        <div className="relative z-20 -mt-3 px-4 pb-10">
          <div
            className="h-[2px] w-full rotate-[-2deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,40,40,.15) 15%, rgba(255,40,40,.85) 50%, rgba(255,40,40,.15) 85%, transparent 100%)",
              boxShadow: "0 0 20px rgba(255,40,40,.45)",
            }}
          />
        </div>
      </div>

      {/* ================= DESKTOP (lg+) ================= */}
      <div className="hidden lg:flex lg:min-h-[900px] lg:items-center relative z-10">
        <div className="max-w-[1600px] mx-auto w-full px-8">
          <div className="grid grid-cols-2 items-center gap-10">
            <div className="max-w-2xl">
              <h1 className="font-black leading-[0.95]">
                <span className="block text-[64px] text-white">
                  SUBI DE NIVEL
                </span>
                <span className="block text-[64px] text-red-600 mt-3">
                  GANA PREMIOS
                </span>
              </h1>

              <p className="mt-10 text-zinc-400 text-2xl leading-10">
                Competí en torneos de los mejores videojuegos,
                escalá posiciones y consegui premios reales.
              </p>

              <Link
                href="/torneos"
                className="inline-flex items-center gap-3 mt-14 border border-red-600 rounded-xl px-10 py-5 font-bold text-lg hover:bg-red-600/10 transition"
              >
                VER TORNEOS
                <FaArrowRight />
              </Link>
            </div>

            <div className="relative h-[820px] flex justify-end items-center">
              <div
                className="absolute right-[-250px] top-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full blur-[220px] pointer-events-none z-0"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,30,30,.45) 0%, rgba(255,30,30,.15) 45%, transparent 80%)",
                }}
              />

              <Image
                src="/images/fifa.webp"
                alt="Gaming Experience GMP"
                width={900}
                height={600}
                priority
                sizes="900px"
                className="relative z-10 max-w-none w-auto h-auto drop-shadow-[0_40px_100px_rgba(0,0,0,.9)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-10 left-[-10%] w-[120%] rotate-[-2deg] z-20 pointer-events-none">
        <div
          className="h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,40,40,.15) 15%, rgba(255,40,40,.85) 50%, rgba(255,40,40,.15) 85%, transparent 100%)",
            boxShadow: "0 0 20px rgba(255,40,40,.45)",
          }}
        />
      </div>
    </section>
  );
}
