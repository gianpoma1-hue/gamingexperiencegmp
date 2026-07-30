import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import CyberBackground from "./CyberBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-0 lg:min-h-[900px] flex items-center">
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

      <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 items-center gap-10">
          <div className="max-w-2xl">
            <h1 className="font-black leading-[1.05] lg:leading-[0.95]">
              <span className="block text-[36px] sm:text-[46px] lg:text-[64px] text-white">
                SUBI DE NIVEL
              </span>
              <span className="block text-[36px] sm:text-[46px] lg:text-[64px] text-red-600 mt-2 lg:mt-3">
                GANA PREMIOS
              </span>
            </h1>

            <p className="mt-6 lg:mt-10 text-zinc-400 text-base sm:text-lg lg:text-2xl leading-7 lg:leading-10">
              Competi­ en torneos de los mejores videojuegos,
              escala posiciones y consegui­ premios reales.
            </p>

            <Link
              href="/torneos"
              className="inline-flex items-center gap-3 mt-8 lg:mt-14 border border-red-600 rounded-xl px-6 py-4 lg:px-10 lg:py-5 font-bold text-base lg:text-lg hover:bg-red-600/10 transition"
            >
              VER TORNEOS
              <FaArrowRight />
            </Link>
          </div>

          <div className="relative h-[340px] sm:h-[460px] lg:h-[820px] flex justify-center lg:justify-end items-center mt-4 lg:mt-0">
            <div
              className="absolute right-1/2 lg:right-[-250px] translate-x-1/2 lg:translate-x-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[1100px] lg:h-[1100px] rounded-full blur-[90px] lg:blur-[220px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,30,30,.45) 0%, rgba(255,30,30,.15) 45%, transparent 80%)",
              }}
            />

            <div className="relative z-10 w-[260px] sm:w-[380px] md:w-[520px] lg:w-auto">
              <Image
                src="/images/fifa.webp"
                alt="Gaming Experience GMP"
                width={900}
                height={600}
                priority
                sizes="(max-width: 1024px) 60vw, 900px"
                className="w-full h-auto lg:max-w-none lg:w-auto drop-shadow-[0_40px_100px_rgba(0,0,0,.9)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-[-10%] w-[120%] rotate-[-2deg]">
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
