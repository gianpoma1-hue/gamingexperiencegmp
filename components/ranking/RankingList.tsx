"use client";

import { RankingPlayer } from "@/app/ranking/page";

interface Props {
  players: RankingPlayer[];
  mostrarGoles?: boolean;
}

export default function RankingList({ players, mostrarGoles = true }: Props) {
  return (
    <section className="mt-20">

      <h2 className="text-4xl font-black mb-10">
        Ranking General
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full bg-zinc-900 rounded-2xl overflow-hidden">

          <thead className="bg-zinc-800">

            <tr className="text-left">

              <th className="p-5">#</th>
              <th className="p-5">Jugador</th>
              <th className="p-5 text-center">PJ</th>
              <th className="p-5 text-center">V</th>
              <th className="p-5 text-center">D</th>
              {mostrarGoles && <th className="p-5 text-center">GF</th>}
              {mostrarGoles && <th className="p-5 text-center">GC</th>}
              {mostrarGoles && <th className="p-5 text-center">DG</th>}
              <th className="p-5 text-center">🏆</th>

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

                  <td className="p-5 font-black text-red-500">
                   {index === 0
  ? "🥇"
  : index === 1
  ? "🥈"
  : index === 2
  ? "🥉"
  : `#${index + 1}`}
                  </td>

                  <td className="p-5 font-bold">
                    {jugador.usuario}
                  </td>

                  <td className="p-5 text-center">
                    {jugador.partidos_jugados}
                  </td>

                  <td className="p-5 text-center text-green-400">
                    {jugador.victorias}
                  </td>

                  <td className="p-5 text-center text-red-400">
                    {jugador.derrotas}
                  </td>

                  {mostrarGoles && (
                    <td className="p-5 text-center">
                      {jugador.goles_favor}
                    </td>
                  )}

                  {mostrarGoles && (
                    <td className="p-5 text-center">
                      {jugador.goles_contra}
                    </td>
                  )}

                  {mostrarGoles && (
                    <td
                      className={`p-5 text-center font-bold ${
                        dg >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {dg > 0 ? `+${dg}` : dg}
                    </td>
                  )}

                  <td className="p-5 text-center text-yellow-400 font-bold">
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
