export default function NextTournament() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-5xl font-black text-white">
            Próximo <span className="text-red-600">Torneo</span>
          </h2>

          <p className="text-zinc-400 mt-4 text-lg">
            Reservá tu lugar y competí por el premio.
          </p>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-red-600/40 rounded-3xl p-10 shadow-2xl">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <p className="text-zinc-500 uppercase text-sm">Torneo</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                GMP CUP #1
              </h3>
            </div>

            <div>
              <p className="text-zinc-500 uppercase text-sm">Premio</p>
              <h3 className="text-4xl font-black text-green-400 mt-2">
                $100.000
              </h3>
            </div>

            <div>
              <p className="text-zinc-500 uppercase text-sm">Inscripción</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                $8.000
              </h3>
            </div>

            <div>
              <p className="text-zinc-500 uppercase text-sm">Cupos</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">
                0 / 16
              </h3>
            </div>

          </div>

          <div className="mt-12">

            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>Cupos disponibles</span>
              <span>16 lugares</span>
            </div>

            <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">

              <div className="bg-red-600 h-4 rounded-full w-0 transition-all"></div>

            </div>

          </div>

          <div className="mt-12 flex justify-center">

            <button className="bg-red-600 hover:bg-red-700 transition px-10 py-4 rounded-xl font-bold text-lg">
              INSCRIBIRME AL TORNEO
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}