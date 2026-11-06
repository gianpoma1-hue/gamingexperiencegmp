"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { avisar } from "@/lib/avisos";
import { inicioDelTorneo, partesCuenta, useFaltaParaInicio } from "@/lib/inicioTorneo";

// El check-in se abre 30 minutos antes del inicio y cierra a la hora del torneo.
export const VENTANA_CHECKIN_MS = 30 * 60 * 1000;

type Estado = { confirmado: boolean; checkin_at: string | null } | null;

function horaArgentina(d: Date) {
  return d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

// Se muestra solo a quien tiene la inscripción confirmada en el torneo
// (el jugador, o el capitán en torneos por equipos).
export default function CheckIn({
  torneoId,
  fecha,
  hora,
  estadoTorneo,
  className = "",
}: {
  torneoId: string;
  fecha: string;
  hora?: string | null;
  estadoTorneo: string;
  className?: string;
}) {
  const [estado, setEstado] = useState<Estado>(null);
  const [enviando, setEnviando] = useState(false);

  const inicio = inicioDelTorneo(fecha, hora);
  const falta = useFaltaParaInicio(inicio);

  useEffect(() => {
    let activo = true;
    supabase.rpc("mi_checkin", { p_torneo: torneoId }).then(({ data }) => {
      if (!activo) return;
      const fila = Array.isArray(data) ? data[0] : null;
      setEstado(fila ? { confirmado: !!fila.confirmado, checkin_at: fila.checkin_at } : null);
    });
    return () => {
      activo = false;
    };
  }, [torneoId]);

  async function hacerCheckin() {
    setEnviando(true);
    const { data, error } = await supabase.rpc("hacer_checkin", { p_torneo: torneoId });
    setEnviando(false);

    if (error) {
      avisar(error.message, "error");
      return;
    }

    setEstado((prev) => (prev ? { ...prev, checkin_at: data as string } : prev));
    avisar("Check-in hecho. ¡Estás listo para jugar!", "exito");
  }

  if (!estado?.confirmado || !inicio || falta === null || estadoTorneo === "Finalizado") {
    return null;
  }

  const base = `rounded-xl border px-4 py-3 text-sm ${className}`;

  if (estado.checkin_at) {
    return (
      <div className={`${base} flex items-center gap-2 border-green-700/60 bg-green-950/30 text-green-400`}>
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="font-bold">Check-in hecho</span>
        <span className="text-green-500/80">· a las {horaArgentina(new Date(estado.checkin_at))}hs</span>
      </div>
    );
  }

  if (falta > VENTANA_CHECKIN_MS) {
    const abre = new Date(inicio.getTime() - VENTANA_CHECKIN_MS);
    return (
      <div className={`${base} flex items-center gap-2 border-zinc-700 bg-zinc-900/60 text-zinc-300`}>
        <Clock className="h-5 w-5 shrink-0 text-zinc-500" />
        <span>
          Check-in: se abre a las <b className="text-white">{horaArgentina(abre)}hs</b> (30 min antes).
          Si no lo hacés, podés perder por W.O.
        </span>
      </div>
    );
  }

  if (falta > 0) {
    const { minutos, segundos } = partesCuenta(falta);
    return (
      <div className={`${base} border-red-600 bg-red-950/30`}>
        <p className="flex items-center gap-2 font-bold text-red-400">
          <span className="h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse" />
          Check-in abierto · cierra en {minutos}:{String(segundos).padStart(2, "0")}
        </p>
        <button
          onClick={hacerCheckin}
          disabled={enviando}
          className="mt-3 w-full rounded-lg bg-gradient-to-r from-red-600 to-red-500 py-2.5 font-black tracking-wide transition hover:from-red-500 hover:to-red-400 active:scale-[0.98] disabled:opacity-60"
        >
          {enviando ? "Confirmando..." : "HACER CHECK-IN"}
        </button>
      </div>
    );
  }

  return (
    <div className={`${base} flex items-center gap-2 border-yellow-700/60 bg-yellow-950/20 text-yellow-400`}>
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <span>No hiciste check-in a tiempo. Si querés jugar, hablá ya con la organización.</span>
    </div>
  );
}
