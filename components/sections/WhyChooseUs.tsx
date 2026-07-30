import {
  FaTrophy,
  FaUsers,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa";

const cards = [
  {
    icon: <FaTrophy />,
    title: "Los mejores premios",
    text: "Competí por los mejores premios a un precio imperdible.",
  },
  {
    icon: <FaUsers />,
    title: "Comunidad Competitiva",
    text: "Enfrentate a jugadores de tu nivel y mejorá tu ranking para ganar más premios.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Organización Profesional",
    text: "Reglamentos claros, soporte y administración durante toda la competencia.",
  },
  {
    icon: <FaBolt />,
    title: "Partidas Rápidas",
    text: "Horarios organizados, resultados rápidos y una experiencia sin complicaciones.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-32 overflow-hidden">

      {/* Luces */}
      <div className="absolute -left-32 top-20 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[180px]" />

      <div className="absolute -right-32 bottom-10 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[180px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <p className="uppercase tracking-[6px] text-red-600 font-bold mb-5">
            Gaming Experience GMP
          </p>

          <h2 className="text-5xl md:text-6xl font-black leading-tight">

            ¿Por qué elegir{" "}

            <span className="text-red-600">
              Gaming Experience GMP
            </span>

            ?

          </h2>

          <p className="text-zinc-400 text-xl mt-6 max-w-3xl mx-auto leading-8">

            Una plataforma creada para ofrecer torneos organizados,
            competencia de alto nivel y premios reales.

          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

          {cards.map((card) => (

            <div
              key={card.title}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-red-600 hover:shadow-[0_0_45px_rgba(220,38,38,.18)]"
            >

              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5" />

              {/* Icono */}
              <div className="relative w-20 h-20 rounded-2xl border border-red-600/20 bg-red-600/10 flex items-center justify-center text-red-600 text-4xl mb-8 transition duration-500 group-hover:scale-110 group-hover:rotate-6">

                {card.icon}

              </div>

              <h3 className="relative text-3xl font-black mb-5">

                {card.title}

              </h3>

              <p className="relative text-zinc-400 leading-8">

                {card.text}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}