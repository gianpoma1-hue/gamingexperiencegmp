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
  const outerRef = useRef<HTMLDivElement>(null);
  const contenidoRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [lineas, setLineas] = useState<Linea[]>([]);
  const [tamano, setTamano] = useState({ ancho: 0, alto: 0 });
  const [escala, setEscala] = useState(1);

  // Determina una sola vez, en el cliente, si hay que mostrar la versión
  // apilada (celular) o la versión con líneas conectoras (escritorio).
  // Se decide con JS (no solo con clases responsive) para que sea
  // imposible que las dos versiones queden montadas al mismo tiempo.
  const [esDesktop, setEsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    setEsDesktop(mq.matches);

    const escuchar = (e: MediaQueryListEvent) => setEsDesktop(e.matches);

    mq.addEventListener("change", escuchar);
    return () => mq.removeEventListener("change", escuchar);
  }, []);

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

  // 1) Mide el tamaño natural (sin escalar) del contenido y decide
  // cuánto hay que achicarlo para que entre en el ancho disponible.
  useEffect(() => {
    if (!esDesktop) return;

    function medirTamano() {
      const contenedor = contenidoRef.current;
      if (!contenedor) return;

      const anchoNatural = contenedor.scrollWidth;
      const altoNatural = contenedor.scrollHeight;

      setTamano({ ancho: anchoNatural, alto: altoNatural });

      const anchoDisponible =
        outerRef.current?.clientWidth ?? anchoNatural;

      if (anchoNatural > 0) {
        const nuevaEscala = Math.min(
          1,
          Math.max(0.45, anchoDisponible / anchoNatural)
        );
        setEscala(nuevaEscala);
      }
    }

    const id = requestAnimationFrame(medirTamano);
    window.addEventListener("resize", medirTamano);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", medirTamano);
    };
  }, [partidos, totalRondas, esDesktop]);

  // 2) Una vez que el achicado (escala) ya se aplicó de verdad en
  // pantalla, recién ahí medimos dónde quedó cada tarjeta para dibujar
  // las líneas. Si esto se hiciera antes de aplicar la escala (o con
  // una escala vieja), las líneas terminan dibujadas en el lugar
  // equivocado, como se vio con las flechas rotas.
  useEffect(() => {
    if (!esDesktop) return;

    function calcularLineas() {
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

        // Los rects ya vienen en píxeles de pantalla (post-escala), así
        // que dividimos por la escala actual para volver a las
        // coordenadas "naturales" que usa el SVG (que siempre se mide
        // sin escalar).
        const x1 =
          ((origenEdge === "right" ? o.right : o.left) - contRect.left) /
          escala;
        const y1 = (o.top + o.height / 2 - contRect.top) / escala;

        const x2 =
          ((destinoEdge === "right" ? d.right : d.left) - contRect.left) /
          escala;
        const y2 = (d.top + d.height / 2 - contRect.top) / escala;

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
    }

    // Esperamos dos frames para asegurarnos de que el navegador ya
    // pintó el nuevo "transform: scale(...)" antes de medir.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(calcularLineas)
    );
    window.addEventListener("resize", calcularLineas);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", calcularLineas);
    };
  }, [partidos, totalRondas, esDesktop, escala]);

  const rondasOrdenVertical = [...numerosRonda].sort((a, b) => a - b);

  // Todavía no sabemos si es mobile o desktop (primer render en el
  // servidor) -> no mostramos nada para evitar cualquier parpadeo.
  if (esDesktop === null) {
    return <div className="min-h-[200px]" />;
  }

  if (!esDesktop) {
    return (
      <div className="space-y-10">
        {rondasOrdenVertical.map((r) => (
          <div key={`mobile-ronda-${r}`}>
            <h3 className="text-center text-red-500 font-extrabold uppercase tracking-[0.2em] text-sm mb-4">
              {obtenerNombreRonda(r)}
            </h3>

            <div className="space-y-4">
              {(rondas[r] ?? []).map((partido) => (
                <MatchCard
                  key={partido.id}
                  id={partido.id}
                  torneoId={torneoId}
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
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center w-full rounded-2xl border border-red-600/60 bg-gradient-to-b from-red-950/40 to-zinc-950 px-6 py-8">
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
    );
  }

  // ================= DESKTOP: llave completa con líneas conectoras =================
  return (
    <div ref={outerRef} className="w-full overflow-x-auto">
      <div
        style={{
          height: tamano.alto * escala || undefined,
        }}
      >
        <div
          ref={contenidoRef}
          style={{
            transform: `scale(${escala})`,
            transformOrigin: "top left",
          }}
          className="relative flex items-center justify-center gap-14 w-max py-8"
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
    </div>
  );
}
