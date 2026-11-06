"use client";

import { Shield } from "lucide-react";
import MatchCard from "./MatchCard";
import {
  calcularTablas,
  fechaDelPartido,
  zonaDelPartido,
  type PartidoZona,
  type Zona,
} from "@/lib/zonas";

type Partido = PartidoZona & {
  id: string;
  capitan1?: string | null;
  capitan2?: string | null;
  penales_jugador1: number | null;
  penales_jugador2: number | null;
};

type Props = {
  partidos: Partido[];
  torneoId: string;
  miUsuario?: string | null;
  escudos?: Record<string, string>;
};

const ZONAS: Zona[] = ["A", "B"];

export default function FaseZonas({
  partidos,
  torneoId,
  miUsuario,
  escudos = {},
}: Props) {
  const delaFase = partidos.filter((p) => p.ronda === 1);
  const tablas = calcularTablas(delaFase);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {ZONAS.map((zona) => {
          const tabla = tablas[zona];
          const partidosZona = delaFase
            .filter((p) => zonaDelPartido(p.numero_partido) === zona)
            .sort((a, b) => a.numero_partido - b.numero_partido);

          return (
            <section
              key={zona}
              className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-4 sm:p-5"
            >
              <header className="mb-4 flex items-center justify-between">
                <h3
                  className="text-sm font-extrabold uppercase tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  Zona {zona}
                </h3>
                <span className="text-xs text-zinc-500">
                  {tabla.completa ? "Zona completa" : "En juego"}
                </span>
              </header>

              {/* Tabla de posiciones */}
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-zinc-500">
                      <th className="w-8 py-2 pl-3 text-left font-semibold">#</th>
                      <th className="py-2 text-left font-semibold">Equipo</th>
                      <th className="w-9 py-2 text-center font-semibold" title="Partidos jugados">PJ</th>
                      <th className="w-9 py-2 text-center font-semibold" title="Partidos ganados">PG</th>
                      <th className="w-9 py-2 text-center font-semibold" title="Partidos perdidos">PP</th>
                      <th className="w-12 py-2 pr-3 text-center font-semibold" title="Diferencia de rondas">DR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabla.filas.map((f, i) => {
                      const clasifica = tabla.completa && !tabla.empateSinResolver && i < 2;
                      const esMio = !!miUsuario && partidosZona.some(
                        (p) =>
                          (p.jugador1 === f.equipo && p.capitan1 === miUsuario) ||
                          (p.jugador2 === f.equipo && p.capitan2 === miUsuario)
                      );
                      const escudo = escudos[f.equipo];

                      return (
                        <tr
                          key={f.equipo}
                          className={`border-t border-zinc-800/80 ${
                            clasifica
                              ? "bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                              : ""
                          }`}
                        >
                          <td className="py-2.5 pl-3 font-bold text-zinc-400">{i + 1}</td>
                          <td className="py-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-700 bg-black">
                                {escudo ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={escudo} alt={`Escudo de ${f.equipo}`} className="h-full w-full object-contain" />
                                ) : (
                                  <Shield size={14} className="text-zinc-600" />
                                )}
                              </div>
                              <span className="truncate font-semibold text-white">{f.equipo}</span>
                              {esMio && (
                                <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">
                                  Vos
                                </span>
                              )}
                              {clasifica && (
                                <span
                                  className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                                  style={{
                                    color: "var(--accent)",
                                    background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                                  }}
                                >
                                  Clasifica
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 text-center tabular-nums text-zinc-300">{f.pj}</td>
                          <td className="py-2.5 text-center font-bold tabular-nums text-white">{f.pg}</td>
                          <td className="py-2.5 text-center tabular-nums text-zinc-300">{f.pp}</td>
                          <td className="py-2.5 pr-3 text-center tabular-nums text-zinc-300">
                            {f.dif > 0 ? `+${f.dif}` : f.dif}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {tabla.empateSinResolver && (
                <p className="mt-3 rounded-lg border border-yellow-500/40 bg-yellow-500/[0.06] px-3 py-2 text-xs text-yellow-400">
                  Hay un empate total en la zona. La organización define con una partida de desempate quiénes clasifican.
                </p>
              )}

              {/* Partidos de la zona */}
              <div className="mt-5 space-y-3">
                {partidosZona.map((p) => (
                  <MatchCard
                    key={p.id}
                    id={p.id}
                    torneoId={torneoId}
                    etiqueta={`Fecha ${fechaDelPartido(p.numero_partido)}`}
                    jugador1={p.jugador1 ?? ""}
                    jugador2={p.jugador2 ?? ""}
                    escudo1={escudos[p.jugador1 ?? ""] ?? null}
                    escudo2={escudos[p.jugador2 ?? ""] ?? null}
                    capitan1={p.capitan1 ?? null}
                    capitan2={p.capitan2 ?? null}
                    golesJugador1={p.goles_jugador1}
                    golesJugador2={p.goles_jugador2}
                    penalesJugador1={p.penales_jugador1}
                    penalesJugador2={p.penales_jugador2}
                    ganador={p.ganador ?? null}
                    miUsuario={miUsuario}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500">
        Cada equipo juega 2 partidos a BO1 contra los otros 2 de su zona. Clasifican los 2 primeros de cada zona.
        Orden de posiciones: partidos ganados, diferencia de rondas (DR) y rondas ganadas en total.
        Si sigue el empate, se juega una partida de desempate.
      </p>
    </div>
  );
}
