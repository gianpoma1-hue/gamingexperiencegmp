import { FaUsers, FaGamepad, FaTrophy, FaMoneyBillWave } from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers size={35} />,
    number: "+500",
    title: "Jugadores"
  },
  {
    icon: <FaGamepad size={35} />,
    number: "+800",
    title: "Partidos"
  },
  {
    icon: <FaTrophy size={35} />,
    number: "+35",
    title: "Torneos"
  },
  {
    icon: <FaMoneyBillWave size={35} />,
    number: "$1.500.000+",
    title: "Premios entregados"
  }
];

export default function Stats() {
  return (
    <section className="bg-[#0A0A0A] py-28 text-white">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-black text-center mb-16">
          Gaming Experience GMP en números
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:border-red-600 hover:scale-105 transition-all duration-300"
            >
              <div className="text-red-600 flex justify-center mb-5">
                {stat.icon}
              </div>

              <h3 className="text-4xl font-black">
                {stat.number}
              </h3>

              <p className="text-zinc-400 mt-3">
                {stat.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}