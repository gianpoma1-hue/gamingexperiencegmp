import {
  FaUserPlus,
  FaGamepad,
  FaTrophy,
  FaMoneyBillWave,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus />,
    number: "1",
    title: "Registrate",
    description:
      "Creá tu cuenta gratis y completá tu perfil de jugador para comenzar a competir.",
  },
  {
    icon: <FaGamepad />,
    number: "2",
    title: "Inscribite",
    description:
      "Elegí el torneo disponible, aboná la inscripción y asegurá tu lugar.",
  },
  {
    icon: <FaTrophy />,
    number: "3",
    title: "Competí",
    description:
      "Jugá tus partidos en el horario asignado y avanzá ronda tras ronda.",
  },
  {
    icon: <FaMoneyBillWave />,
    number: "4",
    title: "Ganá Premios",
    description:
      "Llegá a la final, ganá el torneo y retirás tu premio de forma segura.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden">

      {/* Glow */}
      <div className="absolute left-0 top-0 w-[450px] h-[450px] rounded-full bg-blue-600/5 blur-[180px]" />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[180px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <p className="uppercase tracking-[6px] text-red-600 font-bold mb-5">
            Gaming Experience GMP
          </p>

          <h2 className="text-5xl md:text-6xl font-black leading-tight">

            ¿Cómo <span className="text-red-600">Funciona</span>?

          </h2>

          <p className="text-zinc-400 text-xl mt-6 max-w-2xl mx-auto leading-8">

            Empezar a competir es muy simple. Seguí estos pasos y
            comenzá a jugar por premios reales.

          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

          {steps.map((step) => (

            <div
              key={step.number}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-red-600 hover:shadow-[0_0_45px_rgba(220,38,38,.15)]"
            >

              {/* Glow interno */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5" />

              {/* Número */}
              <div className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none">

                {step.number}

              </div>

              {/* Icono */}
              <div className="relative w-20 h-20 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 text-4xl mb-8 transition duration-500 group-hover:scale-110 group-hover:rotate-6">

                {step.icon}

              </div>

              <span className="relative text-red-500 uppercase tracking-[4px] text-xs font-bold">

                Paso {step.number}

              </span>

              <h3 className="relative text-3xl font-black mt-4 mb-5 text-white">

                {step.title}

              </h3>

              <p className="relative text-zinc-400 leading-8">

                {step.description}

              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}