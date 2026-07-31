"use client";

import { RankingPlayer } from "@/app/ranking/page";

interface Props {
  players: RankingPlayer[];
  mostrarGoles?: boolean;
}

export default function RankingList({ players, mostrarGoles = true }: Props) {
  return (
    <section className="mt-10 lg:mt-20">

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 lg:mb-10">
        Ranking General
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full bg-zinc-900 rounded-2xl overflow-hidden">

          <thead className="bg-zinc-800">

            <tr className="text-left">

              <th className="p-2 sm:p-3 lg:p-5 text-xs sm:text-sm lg:text-base whitespace-nowrap">#</th>
              <th className="p-2 sm:p-3 lg:p-5 text-xs sm:text-sm lg:text-base whitespace-nowrap">Jugador</th>
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">PJ</th>
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">V</th>
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">D</th>
              {mostrarGoles && <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">GF</th>}
              {mostrarGoles && <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">GC</th>}
              {mostrarGoles && <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">DG</th>}
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">🏆</th>

            </tr>

          </thead>

          <tbody>

            {players.map((jugador, index) => {

              const dg =
                jugador.goles_favor - jugador.goles_contra;

              return (

                <tr
                  key={jugador.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800 transition"
                >

                  <td className="p-2 sm:p-3 lg:p-5 font-black text-red-500 text-xs sm:text-sm lg:text-base whitespace-nowrap">
                   {index === 0
  ? "🥇"
  : index === 1
  ? "🥈"
  : index === 2
  ? "🥉"
  : `#${index + 1}`}
                  </td>

                  <td className="p-2 sm:p-3 lg:p-5 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    {jugador.usuario}
                  </td>

                  <td className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    {jugador.partidos_jugados}
                  </td>

                  <td className="p-2 sm:p-3 lg:p-5 text-center text-green-400 text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    {jugador.victorias}
                  </td>

                  <td className="p-2 sm:p-3 lg:p-5 text-center text-red-400 text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    {jugador.derrotas}
                  </td>

                  {mostrarGoles && (
                    <td className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">
                      {jugador.goles_favor}
                    </td>
                  )}

                  {mostrarGoles && (
                    <td className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">
                      {jugador.goles_contra}
                    </td>
                  )}

                  {mostrarGoles && (
                    <td
                      className={`p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap font-bold ${
                        dg >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {dg > 0 ? `+${dg}` : dg}
                    </td>
                  )}

                  <td className="p-2 sm:p-3 lg:p-5 text-center text-yellow-400 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    {jugador.torneos_ganados}
                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </section>
  );
}
