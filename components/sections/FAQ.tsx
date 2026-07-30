"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const preguntas = [
  {
    pregunta: "¿Cómo me inscribo a un torneo?",
    respuesta:
      "Elegí el torneo disponible, completá el formulario de inscripción y realizá el pago. Una vez confirmado, tu lugar quedará reservado.",
  },
  {
    pregunta: "¿Cómo recibo el premio?",
    respuesta:
      "Los premios se entregan mediante transferencia bancaria o Mercado Pago dentro del plazo indicado en el reglamento.",
  },
  {
    pregunta: "¿Qué pasa si mi rival no se presenta?",
    respuesta:
      "Se aplicará el reglamento oficial del torneo. Si el rival no se presenta dentro del tiempo establecido, se otorgará la victoria por W.O.",
  },
  {
    pregunta: "¿En qué plataforma se juega?",
    respuesta:
      "Actualmente los torneos se disputan en PlayStation 5, PC y Xbox Series X/S.",
  },
];

interface FAQProps {
  showHeader?: boolean;
}

export default function FAQ({ showHeader = true }: FAQProps) {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section className="relative py-32 overflow-hidden">

      {/* Luces */}
      <div className="absolute -left-40 bottom-0 w-[550px] h-[550px] rounded-full bg-blue-600/5 blur-[200px]" />

      <div className="absolute -right-40 top-0 w-[550px] h-[550px] rounded-full bg-red-600/5 blur-[200px]" />

      <div className="relative max-w-5xl mx-auto px-6">

        {showHeader && (
          <div className="text-center mb-20">

            <p className="uppercase tracking-[6px] text-red-600 font-bold mb-5">
              Gaming Experience GMP
            </p>

            <h2 className="text-5xl md:text-6xl font-black">

              Preguntas{" "}

              <span className="text-red-600">
                Frecuentes
              </span>

            </h2>

            <p className="text-zinc-400 text-xl mt-6 leading-8 max-w-2xl mx-auto">

              Respondemos las dudas más comunes para que solamente te
              preocupes por competir.

            </p>

          </div>
        )}

        <div className="space-y-6">

          {preguntas.map((item, index) => (

            <div
              key={index}
              className="group overflow-hidden rounded-3xl border border-zinc-800 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:border-red-600 hover:shadow-[0_0_35px_rgba(220,38,38,.12)]"
            >

              <button
                onClick={() =>
                  setAbierta(abierta === index ? null : index)
                }
                className="w-full flex items-center justify-between px-8 py-7 text-left"
              >

                <span className="text-xl font-bold">

                  {item.pregunta}

                </span>

                <ChevronDown
                  className={`text-red-500 transition duration-300 ${
                    abierta === index ? "rotate-180" : ""
                  }`}
                  size={28}
                />

              </button>

              <div
                className={`grid transition-all duration-500 ${
                  abierta === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">

                  <div className="px-8 pb-8 text-zinc-400 leading-8">

                    {item.respuesta}

                  </div>

                </div>
              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
