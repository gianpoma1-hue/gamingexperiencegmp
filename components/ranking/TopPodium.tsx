"use client";

import { RankingPlayer } from "@/app/ranking/page";

interface Props {
  players: RankingPlayer[];
  mostrarGoles?: boolean;
}

export default function TopPodium({ players, mostrarGoles = true }: Props) {
  if (players.length === 0) return null;

  const segundo = players[1];
  const primero = players[0];
  const tercero = players[2];

  return (
    <section className="mt-20">
      <div className="grid lg:grid-cols-3 gap-8 items-end">

        {/* Segundo */}
        {segundo ? (
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center h-[320px] flex flex-col justify-center">

            <div className="text-6xl mb-4">🥈</div>

            <h2 className="text-3xl font-black">
              {segundo.usuario}
            </h2>

            <p className="text-zinc-400 mt-3">
              🏆 {segundo.torneos_ganados} torneos
            </p>

            <p className="text-zinc-400">
              ✅ {segundo.victorias} victorias
            </p>

          </div>
        ) : <div />}

        {/* Primero */}
        <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-900/10 border-2 border-yellow-500 rounded-3xl p-10 text-center h-[420px] flex flex-col justify-center shadow-2xl">

          <div className="text-7xl mb-5">👑</div>

          <h2 className="text-5xl font-black">
            {primero.usuario}
          </h2>

          <p className="text-xl mt-5">
            🏆 {primero.torneos_ganados} torneos ganados
          </p>

          {mostrarGoles ? (
            <p className="text-lg mt-2">
              ⚽ {primero.goles_favor} goles
            </p>
          ) : (
            <p className="text-lg mt-2">
              ✅ {primero.victorias} victorias
            </p>
          )}

          <p className="text-5xl font-black text-yellow-400 mt-8">
            #1
          </p>

        </div>

        {/* Tercero */}
        {tercero ? (
          <div className="bg-amber-900/20 border border-amber-700 rounded-3xl p-8 text-center h-[320px] flex flex-col justify-center">

            <div className="text-6xl mb-4">🥉</div>

            <h2 className="text-3xl font-black">
              {tercero.usuario}
            </h2>

            <p className="text-zinc-400 mt-3">
              🏆 {tercero.torneos_ganados} torneos
            </p>

            <p className="text-zinc-400">
              ✅ {tercero.victorias} victorias
            </p>

          </div>
        ) : <div />}

      </div>
    </section>
  );
}
