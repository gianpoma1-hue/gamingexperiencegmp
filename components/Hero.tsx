import { FaTrophy, FaUsers, FaMoneyBillWave } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0A0A0A] text-white flex items-center overflow-hidden">
      {/* Luces de fondo */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-700/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[140px]" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 px-8">

        {/* Texto */}
        <div className="flex flex-col justify-center">

          <span className="text-red-600 font-bold uppercase tracking-widest mb-4">
            Gaming Experience GMP
          </span>

          <h1 className="text-7xl font-black leading-none">
            SUBÍ DE NIVEL
          </h1>

          <h2 className="text-7xl font-black text-red-600 mb-8">
            GANÁ PREMIOS
          </h2>

          <p className="text-xl text-zinc-400 max-w-xl leading-8">
            Competí contra los mejores jugadores de EA Sports FC.
            Demostrá tu nivel, ascendé en el ranking y ganá premios reales.
          </p>

          <div className="flex gap-5 mt-10">
            <button className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-xl font-bold">
              INSCRIBIRME AHORA
            </button>

            <button className="border border-zinc-600 hover:border-red-600 hover:text-red-500 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-xl">
              VER TORNEOS
            </button>
          </div>

          <div className="grid grid-cols-3 gap-5 mt-16">

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <FaTrophy className="text-red-600 text-3xl mb-3" />
              <p className="text-zinc-400 text-sm">Premio</p>
              <h3 className="text-3xl font-bold">$40.000</h3>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <FaUsers className="text-red-600 text-3xl mb-3" />
              <p className="text-zinc-400 text-sm">Jugadores</p>
              <h3 className="text-3xl font-bold">8</h3>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <FaMoneyBillWave className="text-red-600 text-3xl mb-3" />
              <p className="text-zinc-400 text-sm">Inscripción</p>
              <h3 className="text-3xl font-bold">$6.000</h3>
            </div>

          </div>

        </div>

        {/* Imagen temporal */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-[520px] h-[620px] rounded-3xl bg-gradient-to-b from-red-700 via-red-900 to-black flex items-center justify-center shadow-[0_0_120px_rgba(220,38,38,.45)]">
            <span className="text-9xl">🎮</span>
          </div>
        </div>

      </div>
    </section>
  );
}