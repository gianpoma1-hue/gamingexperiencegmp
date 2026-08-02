export default function RankingPrizes() {
  return (
    <section className="mt-10 lg:mt-20">

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-10">

        <h2 className="text-xl sm:text-2xl lg:text-4xl font-black mb-6 lg:mb-10 text-center">
          ðŸ† Premios del Ranking Mensual
        </h2>

        <div className="grid sm:grid-cols-3 gap-4 lg:gap-8">

          <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-5 lg:p-8 text-center">

            <div className="text-4xl lg:text-6xl mb-3 lg:mb-5">
              ðŸ¥‡
            </div>

            <h3 className="text-lg lg:text-2xl font-black">
              1Â° Puesto
            </h3>

            <p className="text-2xl lg:text-4xl font-black text-yellow-400 mt-3 lg:mt-5">
              $30.000
            </p>

          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 lg:p-8 text-center">

            <div className="text-4xl lg:text-6xl mb-3 lg:mb-5">
              ðŸ¥ˆ
            </div>

            <h3 className="text-lg lg:text-2xl font-black">
              2Â° Puesto
            </h3>

            <p className="text-2xl lg:text-4xl font-black text-zinc-300 mt-3 lg:mt-5">
              $15.000
            </p>

          </div>

          <div className="bg-amber-900/20 border border-amber-700 rounded-2xl p-5 lg:p-8 text-center">

            <div className="text-4xl lg:text-6xl mb-3 lg:mb-5">
              ðŸ¥‰
            </div>

            <h3 className="text-lg lg:text-2xl font-black">
              3Â° Puesto
            </h3>

            <p className="text-base lg:text-xl font-bold text-amber-400 mt-3 lg:mt-5">
              InscripciÃ³n Gratuita
            </p>

            <p className="text-zinc-400 mt-3 text-sm lg:text-base">
              Aplicable Ãºnicamente a torneos de hasta
            </p>

            <p className="text-lg lg:text-2xl font-black text-red-500 mt-2">
              $10.000
            </p>

          </div>

        </div>

        <div className="mt-6 lg:mt-10 bg-black border border-zinc-800 rounded-2xl p-5 lg:p-6">

          <h3 className="text-lg lg:text-xl font-bold mb-4">
            ðŸ“… InformaciÃ³n
          </h3>

          <ul className="space-y-3 text-zinc-400 text-sm lg:text-base leading-6 lg:leading-7">

            <li>â€¢ El ranking se reinicia el primer dÃ­a de cada mes.</li>

            <li>â€¢ Solo se contabilizan torneos oficiales de Gaming Experience GMP.</li>

            <li>â€¢ En caso de empate, la organizaciÃ³n resolverÃ¡ segÃºn el reglamento.</li>

            <li>â€¢ La inscripciÃ³n gratuita no es canjeable por dinero.</li>

          </ul>

        </div>

      </div>

    </section>
  );
}
