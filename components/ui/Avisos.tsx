"use client";

import { useSyncExternalStore } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import {
  cerrarAviso,
  leerAvisos,
  leerAvisosServidor,
  suscribirAvisos,
  type TipoAviso,
} from "@/lib/avisos";

const ESTILO: Record<TipoAviso, { caja: string; icono: string }> = {
  exito: { caja: "border-green-700/60", icono: "text-green-400" },
  error: { caja: "border-red-700/70", icono: "text-red-400" },
  info: { caja: "border-zinc-700", icono: "text-zinc-300" },
};

const ICONO = { exito: CheckCircle2, error: AlertCircle, info: Info };

export default function Avisos() {
  const avisos = useSyncExternalStore(suscribirAvisos, leerAvisos, leerAvisosServidor);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      {avisos.map((a) => {
        const Icono = ICONO[a.tipo];
        return (
          <div
            key={a.id}
            role={a.tipo === "error" ? "alert" : "status"}
            className={`aviso-entrada pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border bg-zinc-900/95 px-4 py-3 text-sm text-white shadow-2xl shadow-black/60 backdrop-blur ${ESTILO[a.tipo].caja}`}
          >
            <Icono className={`mt-0.5 h-5 w-5 shrink-0 ${ESTILO[a.tipo].icono}`} />
            <p className="flex-1 whitespace-pre-line break-words leading-snug">{a.texto}</p>
            <button
              onClick={() => cerrarAviso(a.id)}
              aria-label="Cerrar aviso"
              className="-mr-1 shrink-0 rounded-md p-1 text-zinc-500 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
