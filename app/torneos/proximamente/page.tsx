"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function ProximamentePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">

        <div className="text-8xl mb-6">🎮</div>

        <h1 className="text-5xl md:text-6xl font-black">
          Próximamente
        </h1>

        <p className="text-zinc-400 text-xl mt-6 max-w-2xl">
          Estamos preparando los torneos para este juego.
          Muy pronto vas a poder competir por premios,
          sumar victorias y escalar en el ranking de Gaming Experience GMP.
        </p>

        <button
          onClick={() => router.push("/torneos")}
          className="mt-10 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-lg transition"
        >
          ← Volver a Juegos
        </button>

      </div>
    </main>
  );
}