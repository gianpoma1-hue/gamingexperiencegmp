"use client";

import { useState } from "react";
import { MessageCircle, ImageUp } from "lucide-react";
import ChatPartido from "./ChatPartido";
import ReportarResultado from "./ReportarResultado";

type MatchCardProps = {
  id: string;
  torneoId: string;

  seed1?: number;
  seed2?: number;

  jugador1: string;
  jugador2: string;

  capitan1?: string | null;
  capitan2?: string | null;

  golesJugador1: number | null;
  golesJugador2: number | null;

  penalesJugador1: number | null;
  penalesJugador2: number | null;

  ganador?: string | null;

  miUsuario?: string | null;
};

export default function MatchCard({
  id,
  torneoId,
  seed1,
  seed2,
  jugador1,
  jugador2,
  capitan1,
  capitan2,
  golesJugador1,
  golesJugador2,
  penalesJugador1,
  penalesJugador2,
  ganador,
  miUsuario,
}: MatchCardProps) {
  const [chatAbierto, setChatAbierto] = useState(false);
  const [reporteAbierto, setReporteAbierto] = useState(false);

  const soyJugador1 = !!miUsuario && miUsuario === capitan1;
  const soyJugador2 = !!miUsuario && miUsuario === capitan2;

  const puedoChatear =
    (soyJugador1 || soyJugador2) && !!jugador1 && !!jugador2;

  const rival = soyJugador1 ? jugador2 : jugador1;

  const gano1 = ganador === jugador1;
  const gano2 = ganador === jugador2;

  function Fila({
    seed,
    nombre,
    goles,
    penales,
    gano,
  }: {
    seed?: number;
    nombre: string;
    goles: number | null;
    penales: number | null;
    gano: boolean;
  }) {
    return (
      <div
        className={`flex items-center justify-between px-3 py-2 transition ${
          gano
            ? "bg-gradient-to-r from-red-700/20 to-red-500/5"
            : "bg-zinc-900"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {seed !== undefined && (
            <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold flex items-center justify-center">
              {seed}
            </div>
          )}

          <span
            className={`truncate text-sm font-semibold ${
              gano ? "text-white" : "text-zinc-300"
            }`}
          >
            {nombre || "Pendiente"}
          </span>
        </div>

        {goles !== null && (
          <div
            className={`min-w-[30px] text-center rounded-md px-2 py-1 text-xs font-black ${
              gano
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-300"
            }`}
          >
            {goles}
            {penales !== null ? ` (${penales})` : ""}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="w-[250px] rounded-2xl border border-red-500/15 bg-zinc-950 shadow-[0_0_30px_rgba(255,0,0,.06)] overflow-hidden">

        <Fila
          seed={seed1}
          nombre={jugador1}
          goles={golesJugador1}
          penales={penalesJugador1}
          gano={gano1}
        />

        <div className="h-px bg-zinc-800" />

        <Fila
          seed={seed2}
          nombre={jugador2}
          goles={golesJugador2}
          penales={penalesJugador2}
          gano={gano2}
        />

        {puedoChatear && (
          <div className="grid grid-cols-2 border-t border-zinc-800">
            <button
              onClick={() => setChatAbierto(true)}
              className="flex items-center justify-center gap-2 py-2 text-[11px] font-semibold text-red-400 border-r border-zinc-800 hover:bg-red-600/10 transition"
            >
              <MessageCircle size={13} />
              Chat rival
            </button>

            <button
              onClick={() => setReporteAbierto(true)}
              className="flex items-center justify-center gap-2 py-2 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-600/10 transition"
            >
              <ImageUp size={13} />
              Reportar resultado
            </button>
          </div>
        )}
      </div>

      {chatAbierto && miUsuario && (
        <ChatPartido
          partidoId={id}
          miUsuario={miUsuario}
          rival={rival}
          onClose={() => setChatAbierto(false)}
        />
      )}

      {reporteAbierto && miUsuario && (
        <ReportarResultado
          partidoId={id}
          torneoId={torneoId}
          miUsuario={miUsuario}
          rival={rival}
          onClose={() => setReporteAbierto(false)}
        />
      )}
    </>
  );
}
