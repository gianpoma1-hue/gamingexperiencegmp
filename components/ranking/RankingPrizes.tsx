export default function RankingPrizes() {
  return (
    <section className="mt-20">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

        <h2 className="text-4xl font-black mb-10 text-center">
          🏆 Premios del Ranking Mensual
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-8 text-center">

            <div className="text-6xl mb-5">
              🥇
            </div>

            <h3 className="text-2xl font-black">
              1° Puesto
            </h3>

            <p className="text-4xl font-black text-yellow-400 mt-5">
              $30.000
            </p>

          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 text-center">

            <div className="text-6xl mb-5">
              🥈
            </div>

            <h3 className="text-2xl font-black">
              2° Puesto
            </h3>

            <p className="text-4xl font-black text-zinc-300 mt-5">
              $10.000
            </p>

          </div>

          <div className="bg-amber-900/20 border border-amber-700 rounded-2xl p-8 text-center">

            <div className="text-6xl mb-5">
              🥉
            </div>

            <h3 className="text-2xl font-black">
              3° Puesto
            </h3>

            <p className="text-xl font-bold text-amber-400 mt-5">
              Inscripción Gratuita
            </p>

            <p className="text-zinc-400 mt-3">
              Aplicable únicamente a torneos de hasta
            </p>

            <p className="text-2xl font-black text-red-500 mt-2">
              $8.000
            </p>

          </div>

        </div>

        <div className="mt-10 bg-black border border-zinc-800 rounded-2xl p-6">

          <h3 className="text-xl font-bold mb-4">
            📅 Información
          </h3>

          <ul className="space-y-3 text-zinc-400 leading-7">

            <li>• El ranking se reinicia el primer día de cada mes.</li>

            <li>• Solo se contabilizan torneos oficiales de Gaming Experience GMP.</li>

            <li>• En caso de empate, la organización resolverá según el reglamento.</li>

            <li>• La inscripción gratuita no es canjeable por dinero.</li>

          </ul>

        </div>

      </div>

    </section>
  );
}