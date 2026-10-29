"use client";

import { useState } from "react";
import { MessageCircle, ImageUp } from "lucide-react";
import ChatPartido from "./ChatPartido";
import ReportarResultado from "./ReportarResultado";

type MatchCardProps = {
  id: string;
  torneoId: string;

  // Número de partido dentro del torneo (opcional, se muestra en el encabezado)
  numero?: number;

  seed1?: number;
  seed2?: number;

  jugador1: string;
  jugador2: string;

  // Escudos de los equipos (opcionales)
  escudo1?: string | null;
  escudo2?: string | null;

  trucoId1?: string | null;
  trucoId2?: string | null;

  capitan1?: string | null;
  capitan2?: string | null;

  golesJugador1: number | null;
  golesJugador2: number | null;

  penalesJugador1: number | null;
  penalesJugador2: number | null;

  ganador?: string | null;

  miUsuario?: string | null;
};

function iniciales(nombre: string) {
  const limpio = nombre.trim();
  if (!limpio) return "?";
  return limpio.slice(0, 2).toUpperCase();
}

function Fila({
  nombre,
  escudo,
  trucoId,
  goles,
  penales,
  gano,
  perdio,
  esMio,
}: {
  nombre: string;
  escudo?: string | null;
  trucoId?: string | null;
  goles: number | null;
  penales: number | null;
  gano: boolean;
  perdio: boolean;
  esMio: boolean;
}) {
  const pendiente = !nombre;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 ${
        gano ? "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" : ""
      }`}
    >
      {escudo && !pendiente ? (
        <div className="w-8 h-8 shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={escudo}
            alt={`Escudo de ${nombre}`}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div
          className={`w-8 h-8 shrink-0 rounded-md text-[10px] font-bold flex items-center justify-center ${
            pendiente
              ? "bg-zinc-900 text-zinc-600"
              : gano
              ? "bg-[var(--accent)] text-black"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {iniciales(nombre)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm font-semibold ${
            pendiente
              ? "text-zinc-600 italic font-normal"
              : perdio
              ? "text-zinc-500"
              : "text-white"
          }`}
        >
          {nombre || "Por definir"}
        </span>

        {trucoId && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">
            ID: {trucoId}
          </span>
        )}
      </div>

      {esMio && (
        <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">
          Vos
        </span>
      )}

      {goles !== null && (
        <div
          className={`min-w-[32px] shrink-0 rounded-md px-2 py-1 text-center text-xs font-black tabular-nums ${
            gano
              ? "bg-[var(--accent)] text-black"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {goles}
          {penales !== null ? ` (${penales})` : ""}
        </div>
      )}
    </div>
  );
}

export default function MatchCard({
  id,
  torneoId,
  numero,
  jugador1,
  jugador2,
  escudo1,
  escudo2,
  trucoId1,
  trucoId2,
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

  const gano1 = !!ganador && ganador === jugador1;
  const gano2 = !!ganador && ganador === jugador2;

  const finalizado = gano1 || gano2;
  const listo = !!jugador1 && !!jugador2;

  const estado = finalizado
    ? { texto: "Finalizado", punto: "bg-zinc-500", color: "text-zinc-400" }
    : listo
    ? { texto: "Por jugar", punto: "bg-[var(--accent)]", color: "text-[var(--accent)]" }
    : { texto: "Por definir", punto: "bg-zinc-700", color: "text-zinc-500" };

  return (
    <>
      <div
        className={`w-full overflow-hidden rounded-xl border bg-[#0d0d10] ${
          soyJugador1 || soyJugador2
            ? "border-[color-mix(in_srgb,var(--accent)_45%,transparent)]"
            : "border-zinc-800"
        }`}
      >
        {/* Encabezado: estado del partido + acciones */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 bg-white/[0.02] px-3 h-9">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`h-1.5 w-1.5 rounded-full ${estado.punto}`} />
            <span className={`text-[11px] font-semibold truncate ${estado.color}`}>
              {estado.texto}
            </span>
            {numero !== undefined && (
              <span className="text-[11px] text-zinc-600">· P{numero}</span>
            )}
          </div>

          {puedoChatear && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setChatAbierto(true)}
                title="Chat con el rival"
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
              >
                <MessageCircle size={12} />
                Chat
              </button>

              <button
                onClick={() => setReporteAbierto(true)}
                title="Reportar resultado"
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/10 transition"
              >
                <ImageUp size={12} />
                Reportar
              </button>
            </div>
          )}
        </div>

        <Fila
          nombre={jugador1}
          escudo={escudo1}
          trucoId={trucoId1}
          goles={golesJugador1}
          penales={penalesJugador1}
          gano={gano1}
          perdio={gano2}
          esMio={soyJugador1}
        />

        <div className="h-px bg-zinc-800/80" />

        <Fila
          nombre={jugador2}
          escudo={escudo2}
          trucoId={trucoId2}
          goles={golesJugador2}
          penales={penalesJugador2}
          gano={gano2}
          perdio={gano1}
          esMio={soyJugador2}
        />
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
