"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import RoundColumn from "./RoundColumn";
import MatchCard from "./MatchCard";

type Partido = {
  id: string;
  ronda: number;
  numero_partido?: number;

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
  jugadoresMax: number;
  partidos: Partido[];
  miUsuario?: string | null;
  torneoId: string;

  finalTerminada?: boolean;
  campeon?: string | null;
  mostrarReclamar?: boolean;
  onReclamarPremio?: () => void;
};

type Linea = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export default function Bracket({
  partidos,
  miUsuario,
  torneoId,
  finalTerminada,
  campeon,
  mostrarReclamar,
  onReclamarPremio,
}: Props) {
  const contenidoRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [lineas, setLineas] = useState<Linea[]>([]);
  const [tamano, setTamano] = useState({ ancho: 0, alto: 0 });

  const rondas = partidos.reduce<Record<number, Partido[]>>((acc, partido) => {
    if (!acc[partido.ronda]) acc[partido.ronda] = [];
    acc[partido.ronda].push(partido);
    return acc;
  }, {});

  Object.values(rondas).forEach((lista) =>
    lista.sort(
      (a, b) => (a.numero_partido ?? 0) - (b.numero_partido ?? 0)
    )
  );

  const numerosRonda = Object.keys(rondas).map(Number);
  const totalRondas =
    numerosRonda.length > 0 ? Math.max(...numerosRonda) : 0;

  const partidoFinal = rondas[totalRondas]?.[0];

  const rondasPrevias = numerosRonda
    .filter((r) => r < totalRondas)
    .sort((a, b) => a - b);

  const izquierda: Record<number, Partido[]> = {};
  const derecha: Record<number, Partido[]> = {};

  rondasPrevias.forEach((r) => {
    const lista = rondas[r] ?? [];
    const mitad = Math.ceil(lista.length / 2);

    izquierda[r] = lista.slice(0, mitad);
    derecha[r] = lista.slice(mitad);
  });

  function obtenerNombreRonda(ronda: number) {
    const indice = totalRondas - ronda;

    switch (indice) {
      case 5:
        return "32avos de Final";
      case 4:
        return "16avos de Final";
      case 3:
        return "Octavos de Final";
      case 2:
        return "Cuartos de Final";
      case 1:
        return "Semifinal";
      case 0:
        return "Final";
      default:
        return `Ronda ${ronda}`;
    }
  }

  const rondasIzqOrden = [...rondasPrevias];
  const rondasDerOrden = [...rondasPrevias].reverse();

  const subcampeon =
    finalTerminada && partidoFinal && campeon
      ? partidoFinal.jugador1 === campeon
        ? partidoFinal.jugador2
        : partidoFinal.jugador1
      : null;

  useEffect(() => {
    function calcular() {
      const contenedor = contenidoRef.current;
      if (!contenedor) return;

      const contRect = contenedor.getBoundingClientRect();
      const nuevas: Linea[] = [];

      function medirLinea(
        origenKey: string,
        destinoKey: string,
        origenEdge: "left" | "right",
        destinoEdge: "left" | "right"
      ) {
        const origen = cardRefs.current[origenKey];
        const destino = cardRefs.current[destinoKey];
        if (!origen || !destino) return;

        const o = origen.getBoundingClientRect();
        const d = destino.getBoundingClientRect();

        const x1 = (origenEdge === "right" ? o.right : o.left) - contRect.left;
        const y1 = o.top + o.height / 2 - contRect.top;

        const x2 = (destinoEdge === "right" ? d.right : d.left) - contRect.left;
        const y2 = d.top + d.height / 2 - contRect.top;

        nuevas.push({ x1, y1, x2, y2 });
      }

      for (let i = 0; i < rondasIzqOrden.length - 1; i++) {
        const r = rondasIzqOrden[i];
        const siguiente = rondasIzqOrden[i + 1];

        (izquierda[r] ?? []).forEach((_, idx) => {
          medirLinea(
            `L-${r}-${idx + 1}`,
            `L-${siguiente}-${Math.ceil((idx + 1) / 2)}`,
            "right",
            "left"
          );
        });
      }

      for (let i = 0; i < rondasIzqOrden.length - 1; i++) {
        const r = rondasIzqOrden[i];
        const siguiente = rondasIzqOrden[i + 1];

        (derecha[r] ?? []).forEach((_, idx) => {
          medirLinea(
            `R-${r}-${idx + 1}`,
            `R-${siguiente}-${Math.ceil((idx + 1) / 2)}`,
            "left",
            "right"
          );
        });
      }

      const ultimaPrevia = rondasPrevias[rondasPrevias.length - 1];

      if (ultimaPrevia !== undefined) {
        if ((izquierda[ultimaPrevia] ?? []).length > 0) {
          medirLinea(`L-${ultimaPrevia}-1`, "FINAL", "right", "left");
        }

        if ((derecha[ultimaPrevia] ?? []).length > 0) {
          medirLinea(`R-${ultimaPrevia}-1`, "FINAL", "left", "right");
        }
      }

      setLineas(nuevas);
      setTamano({
        ancho: contenedor.clientWidth,
        alto: contenedor.clientHeight,
      });
    }

    const id = requestAnimationFrame(calcular);
    window.addEventListener("resize", calcular);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", calcular);
    };
  }, [partidos, totalRondas]);

  return (
    <div className="w-full overflow-x-auto">
      <div
        ref={contenidoRef}
        className="relative flex items-center justify-center gap-14 w-max min-w-full py-8 mx-auto"
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          width={tamano.ancho}
          height={tamano.alto}
        >
          <defs>
            <marker
              id="flecha-bracket"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 L8 4 L0 8 Z" fill="#dc2626" />
            </marker>
          </defs>

          {lineas.map((l, i) => {
            const medio = l.x1 + (l.x2 - l.x1) / 2;

            return (
              <path
                key={i}
                d={`M ${l.x1} ${l.y1} H ${medio} V ${l.y2} H ${l.x2}`}
                stroke="#dc2626"
                strokeWidth={2}
                fill="none"
                markerEnd="url(#flecha-bracket)"
              />
            );
          })}
        </svg>

        <div className="flex items-center gap-14">
          {rondasIzqOrden.map((r) => (
            <div key={`izq-${r}`} className="flex-1 min-w-0 flex justify-center">
              <RoundColumn
                ronda={r}
                titulo={obtenerNombreRonda(r)}
                partidos={izquierda[r] ?? []}
                miUsuario={miUsuario}
                torneoId={torneoId}
                registrarRef={(n, el) => {
                  cardRefs.current[`L-${r}-${n}`] = el;
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-8 shrink-0 z-10">
          {partidoFinal && (
            <div className="flex flex-col items-center">
              <h2 className="text-center text-red-500 font-extrabold uppercase tracking-[0.25em] mb-8">
                Final
              </h2>

              <div ref={(el) => { cardRefs.current["FINAL"] = el; }}>
                <MatchCard
                  id={partidoFinal.id}
                  torneoId={torneoId}
                  jugador1={partidoFinal.jugador1 ?? ""}
                  jugador2={partidoFinal.jugador2 ?? ""}
                  capitan1={partidoFinal.capitan1 ?? null}
                  capitan2={partidoFinal.capitan2 ?? null}
                  golesJugador1={partidoFinal.goles_jugador1}
                  golesJugador2={partidoFinal.goles_jugador2}
                  penalesJugador1={partidoFinal.penales_jugador1}
                  penalesJugador2={partidoFinal.penales_jugador2}
                  ganador={partidoFinal.ganador ?? null}
                  miUsuario={miUsuario}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col items-center w-64 rounded-2xl border border-red-600/60 bg-gradient-to-b from-red-950/40 to-zinc-950 px-6 py-8">
            <div className="rounded-2xl border-2 border-red-600 p-4 mb-4">
              <Trophy className="text-red-500" size={34} />
            </div>

            <p className="text-zinc-400 text-xs font-bold tracking-widest">
              CAMPEÓN
            </p>

            <p className="text-xl font-black mt-1 text-center border-b-2 border-red-600 pb-2 w-full">
              {finalTerminada ? campeon : "Por definir"}
            </p>

            <p className="text-zinc-500 text-xs font-bold tracking-widest mt-4">
              SUBCAMPEÓN
            </p>

            <p className="text-base font-bold mt-1 text-center text-zinc-300">
              {finalTerminada ? subcampeon : "Por definir"}
            </p>

            {mostrarReclamar && (
              <button
                onClick={onReclamarPremio}
                className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition"
              >
                <Trophy size={16} />
                Reclamar mi premio
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-14">
          {rondasDerOrden.map((r) => (
            <div key={`der-${r}`} className="flex-1 min-w-0 flex justify-center">
              <RoundColumn
                ronda={r}
                titulo={obtenerNombreRonda(r)}
                partidos={derecha[r] ?? []}
                miUsuario={miUsuario}
                torneoId={torneoId}
                registrarRef={(n, el) => {
                  cardRefs.current[`R-${r}-${n}`] = el;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
