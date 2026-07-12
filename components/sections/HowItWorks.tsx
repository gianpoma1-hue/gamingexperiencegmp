import { FaUserPlus, FaMoneyCheckAlt, FaUpload, FaGamepad, FaTrophy } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus size={34} />,
    title: "Creá tu cuenta",
    description: "Registrate en Gaming Experience GMP."
  },
  {
    icon: <FaMoneyCheckAlt size={34} />,
    title: "Pagá la inscripción",
    description: "Realizá la transferencia para reservar tu lugar."
  },
  {
    icon: <FaUpload size={34} />,
    title: "Subí el comprobante",
    description: "Nosotros verificamos el pago."
  },
  {
    icon: <FaGamepad size={34} />,
    title: "Competí",
    description: "Jugá el torneo en el horario asignado."
  },
  {
    icon: <FaTrophy size={34} />,
    title: "Ganá premios",
    description: "Llegá a la final y llevate el premio."
  }
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0A0A0A] text-white py-28">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-black text-center mb-16">
          ¿Cómo funciona?
        </h2>

        <div className="grid md:grid-cols-5 gap-6">

          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-red-600 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-red-600 flex justify-center mb-5">
                {step.icon}
              </div>

              <h3 className="font-bold text-xl mb-3">
                {step.title}
              </h3>

              <p className="text-zinc-400 text-sm">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}