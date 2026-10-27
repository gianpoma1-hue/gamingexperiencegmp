"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
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
  completa: boolean;
};

const ANCHO_CARD = 264;
const ANCHO_CAMPEON = 232;
const ORO = "#f5b301";
const VIOLETA = "#a78bfa";

// Trazo con codo redondeado entre la salida de un partido y la entrada del siguiente.
function trazo(l: Linea) {
  const dy = l.y2 - l.y1;
  if (Math.abs(dy) < 2) return `M ${l.x1} ${l.y1} H ${l.x2}`;

  const mx = l.x1 + (l.x2 - l.x1) / 2;
  const r = Math.min(10, Math.abs(dy) / 2, Math.abs(mx - l.x1));
  const s = dy > 0 ? 1 : -1;

  return [
    `M ${l.x1} ${l.y1}`,
    `H ${mx - r}`,
    `Q ${mx} ${l.y1} ${mx} ${l.y1 + s * r}`,
    `V ${l.y2 - s * r}`,
    `Q ${mx} ${l.y2} ${mx + r} ${l.y2}`,
    `H ${l.x2}`,
  ].join(" ");
}

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

  // Se decide en el cliente si mostramos la llave completa (escritorio)
  // o las rondas apiladas (celular).
  const [esDesktop, setEsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setEsDesktop(mq.matches);

    const escuchar = (e: MediaQueryListEvent) => setEsDesktop(e.matches);
    mq.addEventListener("change", escuchar);
    return () => mq.removeEventListener("change", escuchar);
  }, []);

  // ---------- Datos ----------
  const rondas = partidos.reduce<Record<number, Partido[]>>((acc, p) => {
    if (!acc[p.ronda]) acc[p.ronda] = [];
    acc[p.ronda].push(p);
    return acc;
  }, {});

  Object.values(rondas).forEach((lista) =>
    lista.sort((a, b) => (a.numero_partido ?? 0) - (b.numero_partido ?? 0))
  );

  const rondasOrden = Object.keys(rondas)
    .map(Number)
    .sort((a, b) => a - b);

  const totalRondas = rondasOrden.length > 0 ? Math.max(...rondasOrden) : 0;
  const partidoFinal = rondas[totalRondas]?.[0];

  const subcampeon =
    finalTerminada && partidoFinal && campeon
      ? partidoFinal.jugador1 === campeon
        ? partidoFinal.jugador2
        : partidoFinal.jugador1
      : null;

  function nombreRonda(ronda: number) {
    switch (totalRondas - ronda) {
      case 5:
        return "32avos de final";
      case 4:
        return "16avos de final";
      case 3:
        return "Octavos de final";
      case 2:
        return "Cuartos de final";
      case 1:
        return "Semifinales";
      case 0:
        return "Gran final";
      default:
        return `Ronda ${ronda}`;
    }
  }

  // Color del encabezado de cada ronda: final dorada, semis violeta, el resto el color del juego.
  function colorRonda(ronda: number) {
    switch (totalRondas - ronda) {
      case 0:
        return ORO;
      case 1:
        return VIOLETA;
      default:
        return "var(--accent)";
    }
  }

  function encabezadoRonda(ronda: number) {
    const color = colorRonda(ronda);
    return (
      <div
        className="rounded-md border px-3 py-2 text-center text-xs font-extrabold uppercase tracking-widest"
        style={{
          color,
          borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
          background: `color-mix(in srgb, ${color} 10%, transparent)`,
        }}
      >
        {nombreRonda(ronda)}
      </div>
    );
  }

  function renderCard(p: Partido, numero?: number) {
    return (
      <MatchCard
        id={p.id}
        torneoId={torneoId}
        numero={numero}
        jugador1={p.jugador1 ?? ""}
        jugador2={p.jugador2 ?? ""}
        capitan1={p.capitan1 ?? null}
        capitan2={p.capitan2 ?? null}
        golesJugador1={p.goles_jugador1}
        golesJugador2={p.goles_jugador2}
        penalesJugador1={p.penales_jugador1}
        penalesJugador2={p.penales_jugador2}
        ganador={p.ganador ?? null}
        miUsuario={miUsuario}
      />
    );
  }

  // ---------- Líneas conectoras (solo escritorio) ----------
  useEffect(() => {
    if (!esDesktop) return;

    const contenedor = contenidoRef.current;
    if (!contenedor) return;

    function calcular() {
      const cont = contenidoRef.current;
      if (!cont) return;

      const base = cont.getBoundingClientRect();
      const nuevas: Linea[] = [];

      function medir(
        origenKey: string,
        destinoKey: string,
        completa: boolean
      ) {
        const o = cardRefs.current[origenKey];
        const d = cardRefs.current[destinoKey];
        if (!o || !d) return;

        const ro = o.getBoundingClientRect();
        const rd = d.getBoundingClientRect();

        nuevas.push({
          x1: ro.right - base.left,
          y1: ro.top + ro.height / 2 - base.top,
          x2: rd.left - base.left,
          y2: rd.top + rd.height / 2 - base.top,
          completa,
        });
      }

      rondasOrden.forEach((r, i) => {
        const lista = rondas[r] ?? [];
        const esUltima = i === rondasOrden.length - 1;

        lista.forEach((p, idx) => {
          const completa = !!p.ganador;
          const destino = esUltima
            ? "CAMPEON"
            : `${rondasOrden[i + 1]}-${Math.floor(idx / 2)}`;
          medir(`${r}-${idx}`, destino, completa);
        });
      });

      // Las completas se dibujan al final para quedar por encima.
      nuevas.sort((a, b) => Number(a.completa) - Number(b.completa));
      setLineas(nuevas);
    }

    const frame = requestAnimationFrame(calcular);
    const observer = new ResizeObserver(() => calcular());
    observer.observe(contenedor);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partidos, esDesktop, finalTerminada]);

  // ---------- Tarjeta de campeón ----------
  function tarjetaCampeon() {
    return (
      <div
        className="w-full rounded-xl border px-5 py-6 text-center"
        style={{
          borderColor: `color-mix(in srgb, ${ORO} 40%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${ORO} 12%, transparent), transparent)`,
        }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border"
          style={{
            borderColor: `color-mix(in srgb, ${ORO} 50%, transparent)`,
            color: ORO,
          }}
        >
          <Trophy size={28} />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Campeón
        </p>

        <p
          className={`mt-1 pb-3 text-xl font-black border-b ${
            finalTerminada ? "text-white" : "text-zinc-500"
          }`}
          style={{ borderColor: `color-mix(in srgb, ${ORO} 40%, transparent)` }}
        >
          {finalTerminada && campeon ? campeon : "Por definir"}
        </p>

        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
          Subcampeón
        </p>

        <p
          className={`mt-1 text-base font-semibold ${
            subcampeon ? "text-zinc-300" : "text-zinc-600"
          }`}
        >
          {subcampeon || "Por definir"}
        </p>

        {mostrarReclamar && (
          <button
            onClick={onReclamarPremio}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-500"
          >
            <Trophy size={16} />
            Reclamar mi premio
          </button>
        )}
      </div>
    );
  }

  // Primer render (servidor): no mostramos nada para evitar parpadeos.
  if (esDesktop === null) {
    return <div className="min-h-[200px]" />;
  }

  // ================= CELULAR / TABLET: rondas apiladas =================
  if (!esDesktop) {
    return (
      <div className="space-y-10">
        {rondasOrden.map((r) => (
          <div key={`mobile-ronda-${r}`}>
            <div className="mb-4">
              {encabezadoRonda(r)}
            </div>

            <div className="space-y-3">
              {(rondas[r] ?? []).map((p, idx) => (
                <div key={p.id}>{renderCard(p, idx + 1)}</div>
              ))}
            </div>
          </div>
        ))}

        {tarjetaCampeon()}
      </div>
    );
  }

  // ================= ESCRITORIO: llave de izquierda a derecha =================
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div
        ref={contenidoRef}
        className="relative flex w-max min-w-full items-stretch gap-14"
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          {lineas.map((l, i) => (
            <path
              key={i}
              d={trazo(l)}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              stroke={
                l.completa
                  ? "color-mix(in srgb, var(--accent) 70%, transparent)"
                  : "#27272a"
              }
            />
          ))}
        </svg>

        {rondasOrden.map((r) => (
          <div
            key={`ronda-${r}`}
            className="relative z-10 flex shrink-0 flex-col"
            style={{ width: ANCHO_CARD }}
          >
            {encabezadoRonda(r)}

            <div className="mt-5 flex flex-1 flex-col justify-around gap-5">
              {(rondas[r] ?? []).map((p, idx) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardRefs.current[`${r}-${idx}`] = el;
                  }}
                >
                  {renderCard(p, idx + 1)}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div
          className="relative z-10 flex shrink-0 flex-col"
          style={{ width: ANCHO_CAMPEON }}
        >
          <div
            className="rounded-md border px-3 py-2 text-center text-xs font-extrabold uppercase tracking-widest"
            style={{
              color: ORO,
              borderColor: `color-mix(in srgb, ${ORO} 35%, transparent)`,
              background: `color-mix(in srgb, ${ORO} 10%, transparent)`,
            }}
          >
            Podio
          </div>

          <div className="mt-5 flex flex-1 items-center">
            <div
              className="w-full"
              ref={(el) => {
                cardRefs.current["CAMPEON"] = el;
              }}
            >
              {tarjetaCampeon()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
