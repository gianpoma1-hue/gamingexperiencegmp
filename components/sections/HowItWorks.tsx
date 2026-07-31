import Link from "next/link";
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
    href: "/register",
  },
  {
    icon: <FaGamepad />,
    number: "2",
    title: "Inscribite",
    description:
      "Elegí el torneo disponible, aboná la inscripción y asegurá tu lugar.",
    href: "/torneos",
  },
  {
    icon: <FaTrophy />,
    number: "3",
    title: "Competí",
    description:
      "Jugá tus partidos en el horario asignado y avanzá ronda tras ronda.",
    href: undefined as string | undefined,
  },
  {
    icon: <FaMoneyBillWave />,
    number: "4",
    title: "Ganá Premios",
    description:
      "Llegá a la final, ganá el torneo y retirás tu premio de forma segura.",
    href: "/ranking",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-16 lg:py-32 overflow-hidden">

      {/* Glow */}
      <div className="absolute left-0 top-0 w-[220px] h-[220px] lg:w-[450px] lg:h-[450px] rounded-full bg-blue-600/5 blur-[80px] lg:blur-[180px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[240px] h-[240px] lg:w-[500px] lg:h-[500px] rounded-full bg-red-600/5 blur-[80px] lg:blur-[180px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-8 lg:mb-20">

          <p className="uppercase tracking-[3px] sm:tracking-[6px] text-sm sm:text-base text-red-600 font-bold mb-5">
            Gaming Experience GMP
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight">

            ¿Cómo <span className="text-red-600">Funciona</span>?

          </h2>

          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl mt-4 lg:mt-6 max-w-2xl mx-auto leading-7 lg:leading-8">

            Empezar a competir es muy simple. Seguí estos pasos y
            comenzá a jugar por premios reales.

          </p>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">

          {steps.map((step) => {
            const contenido = (
              <>
                {/* Glow interno */}
                <div className="absolute inset-0 opacity-0 lg:group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5" />

                {/* Número */}
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 text-3xl sm:text-5xl lg:text-6xl font-black text-white/5 select-none">

                  {step.number}

                </div>

                {/* Icono */}
                <div className="relative w-9 h-9 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 text-base sm:text-2xl lg:text-4xl mb-3 sm:mb-5 lg:mb-8 transition duration-500 lg:group-hover:scale-110 lg:group-hover:rotate-6">

                  {step.icon}

                </div>

                <span className="relative text-red-500 uppercase tracking-[2px] sm:tracking-[4px] text-[10px] sm:text-xs font-bold">

                  Paso {step.number}

                </span>

                <h3 className="relative text-base sm:text-xl lg:text-3xl font-black mt-1.5 sm:mt-3 mb-1.5 sm:mb-3 lg:mt-4 lg:mb-5 text-white">

                  {step.title}

                </h3>

                <p className="relative text-zinc-400 text-xs sm:text-sm lg:text-base leading-5 sm:leading-6 lg:leading-8">

                  {step.description}

                </p>
              </>
            );

            const claseCard =
              "group relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-zinc-800 bg-white/[0.03] lg:backdrop-blur-xl p-3 sm:p-6 lg:p-8 transition-all duration-500 lg:hover:-translate-y-3 hover:border-red-600 lg:hover:shadow-[0_0_45px_rgba(220,38,38,.15)]";

            return step.href ? (
              <Link
                key={step.number}
                href={step.href}
                className={claseCard}
              >
                {contenido}
              </Link>
            ) : (
              <div key={step.number} className={claseCard}>
                {contenido}
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}