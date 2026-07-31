"use client";

import { useEffect, useRef, useState } from "react";
import RoundColumn from "./RoundColumn";

type Partido = {
  id: string;
  ronda: number;

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
  // Partidos de esta mitad, de la ronda 1 hasta la ronda anterior a la
  // final (la final se muestra aparte, centrada).
  rondas: Record<number, Partido[]>;
  // Total de rondas del torneo completo (incluida la final), para poder
  // calcular el nombre de cada ronda (Cuartos, Semifinal, etc.)
  totalRondas: number;
  miUsuario?: string | null;
  torneoId: string;
  // true para la mitad derecha: todo el contenedor viene con
  // scaleX(-1) desde el componente padre.
  espejado?: boolean;
  // Desde qué número de seed arranca esta mitad en la ronda 1 (para
  // que la numeración de jugadores siga de corrido entre ambos lados).
  seedInicial?: number;
};

type Linea = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export default function BracketMitad({
  rondas,
  totalRondas,
  miUsuario,
  torneoId,
  espejado = false,
  seedInicial = 1,
}: Props) {
  const contenidoRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [lineas, setLineas] = useState<Linea[]>([]);
  const [tamano, setTamano] = useState({
    ancho: 0,
    alto: 0,
  });

  const numerosRonda = Object.keys(rondas)
    .map(Number)
    .filter((n) => (rondas[n] ?? []).length > 0);

  if (numerosRonda.length === 0) {
    return null;
  }

  const rondaMin = Math.min(...numerosRonda);
  const rondaMax = Math.max(...numerosRonda);

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
      default:
        return `Ronda ${ronda}`;
    }
  }

  useEffect(() => {
    function calcular() {
      const contenedor = contenidoRef.current;

      if (!contenedor) return;

      const contRect = contenedor.getBoundingClientRect();

      const nuevas: Linea[] = [];

      for (let ronda = rondaMin; ronda < rondaMax; ronda++) {
        const actuales = rondas[ronda] ?? [];

        actuales.forEach((_, idx) => {
          const origen = cardRefs.current[`${ronda}-${idx + 1}`];

          const destino =
            cardRefs.current[`${ronda + 1}-${Math.ceil((idx + 1) / 2)}`];

          if (!origen || !destino) return;

          const o = origen.getBoundingClientRect();
          const d = destino.getBoundingClientRect();

          nuevas.push({
            x1: o.right - contRect.left,
            y1: o.top + o.height / 2 - contRect.top,
            x2: d.left - contRect.left,
            y2: d.top + d.height / 2 - contRect.top,
          });
        });
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
  }, [rondas, rondaMin, rondaMax]);

  return (
    <div
      ref={contenidoRef}
      className="relative flex items-center gap-12"
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        width={tamano.ancho}
        height={tamano.alto}
      >
        <defs>
          <marker
            id={`flecha-bracket-${espejado ? "der" : "izq"}`}
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
              markerEnd={`url(#flecha-bracket-${espejado ? "der" : "izq"})`}
            />
          );
        })}
      </svg>

      {Array.from({ length: rondaMax - rondaMin + 1 }, (_, i) => {
        const numero = rondaMin + i;

        return (
          <div key={numero} className="flex justify-center">
            <RoundColumn
              ronda={numero}
              titulo={obtenerNombreRonda(numero)}
              partidos={rondas[numero] ?? []}
              miUsuario={miUsuario}
              torneoId={torneoId}
              seedInicial={seedInicial}
              espejado={espejado}
              registrarRef={(n, el) => {
                cardRefs.current[`${numero}-${n}`] = el;
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
