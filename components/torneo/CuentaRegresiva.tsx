"use client";

import { Clock } from "lucide-react";
import { partesCuenta, textoInicio } from "@/lib/inicioTorneo";

// Cartel de la llave antes de la hora de inicio: la llave ya está armada,
// pero el torneo arranca a la hora establecida.
export default function CuentaRegresiva({
  inicio,
  falta,
  llaveArmada,
}: {
  inicio: Date;
  falta: number;
  llaveArmada: boolean;
}) {
  const { dias, horas, minutos, segundos } = partesCuenta(falta);
  const dos = (n: number) => String(n).padStart(2, "0");

  const bloques = [
    ...(dias > 0 ? [{ valor: String(dias), texto: dias === 1 ? "día" : "días" }] : []),
    { valor: dos(horas), texto: "horas" },
    { valor: dos(minutos), texto: "min" },
    { valor: dos(segundos), texto: "seg" },
  ];

  return (
    <section
      aria-label="Cuenta regresiva para el inicio del torneo"
      className="mb-8 flex flex-col gap-5 rounded-2xl border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
      style={{
        borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
        background: "color-mix(in srgb, var(--accent) 6%, #09090b)",
      }}
    >
      <div className="flex items-start gap-3">
        <Clock className="mt-0.5 shrink-0" size={22} style={{ color: "var(--accent)" }} />
        <div>
          <p className="text-lg font-black">El torneo empieza en</p>
          <p className="mt-1 text-sm text-zinc-400">
            {textoInicio(inicio)}.{" "}
            {llaveArmada
              ? "La llave ya está armada: mirá contra quién jugás y coordiná por el chat. Los resultados se reportan desde la hora de inicio."
              : "La llave se arma antes del inicio."}
          </p>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3" aria-live="off">
        {bloques.map((b) => (
          <div
            key={b.texto}
            className="min-w-[64px] rounded-xl bg-black/50 px-3 py-2 text-center sm:min-w-[76px]"
          >
            <div className="text-2xl font-black tabular-nums sm:text-3xl" style={{ color: "var(--accent)" }}>
              {b.valor}
            </div>
            <div className="text-[11px] font-semibold text-zinc-500">{b.texto}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
