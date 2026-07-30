"use client";

import MatchCard from "./MatchCard";

type Partido = {
  id: string;

  jugador1: string;
  jugador2: string;

  capitan1?: string | null;
  capitan2?: string | null;

  goles_jugador1: number | null;
  goles_jugador2: number | null;

  penales_jugador1: number | null;
  penales_jugador2: number | null;

  ganador?: string | null;
};

type Props = {
  titulo: string;
  partidos: Partido[];
  ronda: number;
  miUsuario?: string | null;
  torneoId: string;
  registrarRef?: (
    numeroPartido: number,
    el: HTMLDivElement | null
  ) => void;
};

export default function RoundColumn({
  titulo,
  partidos,
  ronda,
  miUsuario,
  torneoId,
  registrarRef,
}: Props) {
  // Centrado vertical de cada ronda
  const marginTop = Math.pow(2, ronda - 1) * 42 - 42;

  // Separación entre partidos
  const gap = Math.pow(2, ronda - 1) * 90;

  return (
    <div
      className="relative flex flex-col items-center flex-1 z-10"
      style={{
        marginTop,
        maxWidth: 320,
      }}
    >
      <div className="mb-8">
        <h2 className="text-center text-red-500 font-extrabold uppercase tracking-[0.25em]">
          {titulo}
        </h2>
      </div>

      <div
        className="flex flex-col items-center"
        style={{
          gap,
        }}
      >
        {partidos.map((partido, index) => (
          <div
            key={partido.id}
            ref={(el) => registrarRef?.(index + 1, el)}
          >
            <MatchCard
              id={partido.id}
              torneoId={torneoId}
              seed1={ronda === 1 ? index * 2 + 1 : undefined}
              seed2={ronda === 1 ? index * 2 + 2 : undefined}
              jugador1={partido.jugador1 ?? ""}
              jugador2={partido.jugador2 ?? ""}
              capitan1={partido.capitan1 ?? null}
              capitan2={partido.capitan2 ?? null}
              golesJugador1={partido.goles_jugador1}
              golesJugador2={partido.goles_jugador2}
              penalesJugador1={partido.penales_jugador1}
              penalesJugador2={partido.penales_jugador2}
              ganador={partido.ganador ?? null}
              miUsuario={miUsuario}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
