

const players = [
  {
    position: "🥇",
    name: "GianP",
    wins: 18,
    tournaments: 5,
    winrate: "86%",
  },
  {
    position: "🥈",
    name: "NicoFC",
    wins: 15,
    tournaments: 6,
    winrate: "81%",
  },
  {
    position: "🥉",
    name: "Mati23",
    wins: 14,
    tournaments: 5,
    winrate: "78%",
  },
];

export default function Ranking() {
  return (
    <section className="bg-black py-24 px-6">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-black text-white">
            Ranking de <span className="text-red-600">Jugadores</span>
          </h2>

          <p className="text-zinc-400 mt-4 text-lg">
            Los mejores competidores de Gaming Experience GMP.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {players.map((player) => (

            <div
              key={player.name}
              className="bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-red-600 transition-all duration-300 p-8 text-center hover:-translate-y-2"
            >

              <div className="text-6xl mb-4">
                {player.position}
              </div>

              <h3 className="text-3xl font-bold text-white">
                {player.name}
              </h3>

              <div className="mt-8 space-y-4">

                <div className="flex justify-between">
                  <span className="text-zinc-400">Victorias</span>
                  <span className="font-bold">{player.wins}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">Torneos</span>
                  <span className="font-bold">{player.tournaments}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">Win Rate</span>
                  <span className="font-bold text-green-400">
                    {player.winrate}
                  </span>
                </div>

              </div>

            </div>

          ))}

        </div>

        <div className="flex justify-center mt-14">

          <button className="border border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-all px-8 py-4 rounded-xl font-bold">
            VER RANKING COMPLETO
          </button>

        </div>

      </div>

    </section>
  );
}