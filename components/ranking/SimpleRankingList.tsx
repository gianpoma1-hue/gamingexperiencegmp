"use client";

interface SimplePlayer {
  usuario: string;
  partidos_jugados: number;
  victorias: number;
  derrotas: number;
  torneos_ganados: number;
}

interface Props {
  players: SimplePlayer[];
}

export default function SimpleRankingList({ players }: Props) {
  return (
    <section className="mt-20">

      <h2 className="text-4xl font-black mb-10">
        Ranking General
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full bg-zinc-900 rounded-2xl overflow-hidden">

          <thead className="bg-zinc-800">
            <tr className="text-left">
              <th className="p-2 sm:p-3 lg:p-5 text-xs sm:text-sm lg:text-base whitespace-nowrap">#</th>
              <th className="p-2 sm:p-3 lg:p-5 text-xs sm:text-sm lg:text-base whitespace-nowrap">Jugador</th>
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">PJ</th>
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">Ganadas</th>
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">Perdidas</th>
              <th className="p-2 sm:p-3 lg:p-5 text-center text-xs sm:text-sm lg:text-base whitespace-nowrap">🏆</th>
            </tr>
          </thead>

          <tbody>
            {players.map((jugador, index) => (
              <tr
                key={jugador.usuario}
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

                <td className="p-2 sm:p-3 lg:p-5 text-center text-yellow-400 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                  {jugador.torneos_ganados}
                </td>
              </tr>
            ))}

            {players.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Todavía no hay estadísticas cargadas.
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </section>
  );
}
