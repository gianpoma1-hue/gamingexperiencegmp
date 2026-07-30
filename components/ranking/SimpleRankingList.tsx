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
              <th className="p-5">#</th>
              <th className="p-5">Jugador</th>
              <th className="p-5 text-center">PJ</th>
              <th className="p-5 text-center">Ganadas</th>
              <th className="p-5 text-center">Perdidas</th>
              <th className="p-5 text-center">🏆</th>
            </tr>
          </thead>

          <tbody>
            {players.map((jugador, index) => (
              <tr
                key={jugador.usuario}
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

                <td className="p-5 text-center text-yellow-400 font-bold">
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
