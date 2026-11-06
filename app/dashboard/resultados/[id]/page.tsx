"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { guardarResultado, editarResultado } from "@/lib/tournament";
import { esFormatoZonas, zonaDelPartido, fechaDelPartido } from "@/lib/zonas";

const JUEGOS_CON_GOLES = ["EA SPORTS FC 26", "EA SPORTS FC 27"];

interface Partido {
  id: string;
  ronda: number;
  numero_partido: number;
  jugador1: string;
  jugador2: string;

  goles_jugador1: number | null;
  goles_jugador2: number | null;

  penales_jugador1: number | null;
  penales_jugador2: number | null;

  ganador: string | null;
  estado: string;

  // Detalle por mapa (final al mejor de 3): [[13,9],[8,13],[13,11]]
  mapas: (number | null)[][] | null;
}

// Los 3 casilleros de mapas de un partido al mejor de 3 (vacíos si no hay datos)
function casillerosMapas(p: Partido): (number | null)[][] {
  return [0, 1, 2].map((i) => {
    const m = p.mapas?.[i];
    return [m?.[0] ?? null, m?.[1] ?? null];
  });
}

// Valida los mapas cargados y devuelve los mapas ganados por cada uno, o un error.
function resultadoBO3(p: Partido):
  | { error: string }
  | { ganados1: number; ganados2: number; mapas: number[][] } {
  const mapas: number[][] = [];
  let ganados1 = 0;
  let ganados2 = 0;

  for (const [i, [r1, r2]] of casillerosMapas(p).entries()) {
    const vacio = r1 === null && r2 === null;
    if (vacio) continue;
    if (r1 === null || r2 === null) return { error: `Completá las rondas de los dos equipos en el mapa ${i + 1}.` };
    if (ganados1 === 2 || ganados2 === 2) {
      return { error: `La serie ya estaba definida: el mapa ${i + 1} tiene que quedar vacío.` };
    }
    if (mapas.length !== i) return { error: `Cargá los mapas en orden: falta el mapa ${mapas.length + 1}.` };
    if (r1 === r2) return { error: `El mapa ${i + 1} no puede terminar empatado.` };
    mapas.push([r1, r2]);
    if (r1 > r2) ganados1++;
    else ganados2++;
  }

  if (ganados1 < 2 && ganados2 < 2) {
    return { error: "Al mejor de 3 alguien tiene que ganar 2 mapas. Cargá los mapas que faltan." };
  }

  return { ganados1, ganados2, mapas };
}

export default function AdministrarResultadosPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [juego, setJuego] = useState<string>("");
  const [formatoZonas, setFormatoZonas] = useState(false);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [ganadoresElegidos, setGanadoresElegidos] = useState<Record<string, string>>({});

  const esJuegoConGoles = JUEGOS_CON_GOLES.includes(juego);

  const esCS2 = juego === "Counter-Strike 2";

  // FC: goles. CS2: rondas (o mapas en un BO3) en todos los partidos, para que
  // la llave muestre el resultado. Fase de zonas: siempre rondas.
  const usaMarcador = (p: { ronda: number }) =>
    esJuegoConGoles || esCS2 || (formatoZonas && p.ronda === 1);

  // La final de CS2 se juega al mejor de 3 mapas: se carga mapa por mapa.
  const rondaFinal = partidos.length ? Math.max(...partidos.map((p) => p.ronda)) : 0;
  const esBO3 = (p: { ronda: number }) => esCS2 && p.ronda === rondaFinal && rondaFinal > 1;

  const cambiarMapa = (index: number, mapa: number, lado: 0 | 1, valor: string) => {
    const copia = [...partidos];
    const mapas = casillerosMapas(copia[index]);
    mapas[mapa][lado] = valor === "" ? null : Number(valor);
    copia[index] = { ...copia[index], mapas };
    setPartidos(copia);
  };

  const tituloPartido = (p: { ronda: number; numero_partido: number }) => {
    if (!formatoZonas) return `Ronda ${p.ronda} • Partido ${p.numero_partido}`;
    if (p.ronda === 1) {
      return `Zona ${zonaDelPartido(p.numero_partido)} • Fecha ${fechaDelPartido(p.numero_partido)}`;
    }
    if (p.ronda === 2) return `Semifinal ${p.numero_partido}`;
    return "Final";
  };

  useEffect(() => {
    cargarTorneoYPartidos();
  }, []);

  async function cargarTorneoYPartidos() {
    const { data: torneoData } = await supabase
      .from("torneos")
      .select("juego, jugadores_max")
      .eq("id", id)
      .single();

    setJuego(torneoData?.juego ?? "");
    setFormatoZonas(esFormatoZonas(torneoData?.jugadores_max));

    const { data, error } = await supabase
      .from("partidos")
      .select("*")
      .eq("torneo_id", id)
      .order("ronda", { ascending: true })
      .order("numero_partido", { ascending: true });

    if (!error && data) {
      setPartidos(data as Partido[]);
    }

    setLoading(false);
  }

  async function guardar(partido: Partido) {
    const yaFinalizado = partido.estado === "Finalizado";

    if (yaFinalizado) {
      const confirmar = window.confirm(
        "Este partido ya tiene un resultado cargado. ¿Querés corregirlo? Esto va a recalcular el ranking de los jugadores involucrados."
      );

      if (!confirmar) return;
    }

    const funcionAGuardar = yaFinalizado ? editarResultado : guardarResultado;

    try {
      setGuardando(true);

      if (esBO3(partido)) {
        const r = resultadoBO3(partido);

        if ("error" in r) {
          alert(r.error);
          setGuardando(false);
          return;
        }

        await funcionAGuardar({
          partidoId: partido.id,
          torneoId: id as string,
          juego,
          golesJugador1: r.ganados1,
          golesJugador2: r.ganados2,
          mapas: r.mapas,
        });
      } else if (usaMarcador(partido)) {
        if (
          partido.goles_jugador1 === null ||
          partido.goles_jugador2 === null
        ) {
          alert("Completá ambos resultados.");
          setGuardando(false);
          return;
        }

        await funcionAGuardar({
          partidoId: partido.id,
          torneoId: id as string,
          juego,
          golesJugador1: partido.goles_jugador1,
          golesJugador2: partido.goles_jugador2,
          penalesJugador1: partido.penales_jugador1,
          penalesJugador2: partido.penales_jugador2,
        });
      } else {
        const ganador = ganadoresElegidos[partido.id] ?? partido.ganador;

        if (!ganador) {
          alert("Elegí quién ganó el partido.");
          setGuardando(false);
          return;
        }

        await funcionAGuardar({
          partidoId: partido.id,
          torneoId: id as string,
          juego,
          ganadorDirecto: ganador,
        });
      }

      await cargarTorneoYPartidos();

      alert(
        yaFinalizado
          ? "Resultado corregido correctamente."
          : "Resultado guardado correctamente."
      );
    } catch (error: any) {
      alert(error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-5xl font-black">
          Administrar Partidos
        </h1>

        <p className="text-zinc-400 mt-3">
          {juego && `${juego} · `}Cargá los resultados del torneo.
        </p>

        {loading ? (
          <h2 className="mt-10 text-2xl">
            Cargando...
          </h2>
        ) : (
          <div className="space-y-6 mt-10">
            {partidos.map((partido, index) => (
              <div
                key={partido.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <div className="flex justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {tituloPartido(partido)}
                  </h2>

                  <span className="text-red-500 font-bold">
                    {partido.estado}
                  </span>
                </div>

                {esBO3(partido) ? (
                  <>
                    <p className="text-zinc-400 text-sm mb-4">
                      Final al mejor de 3: cargá las rondas de cada mapa (por ejemplo 13 y 9). Si un
                      equipo gana los 2 primeros, dejá el mapa 3 vacío. Los mapas ganados y el campeón
                      se calculan solos.
                    </p>

                    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 gap-y-3">
                      <span />
                      {[1, 2, 3].map((n) => (
                        <span key={n} className="w-20 text-center text-xs font-bold text-zinc-500">
                          Mapa {n}
                        </span>
                      ))}

                      {([0, 1] as const).map((lado) => (
                        <div key={lado} className="contents">
                          <span className="font-semibold truncate">
                            {lado === 0 ? partido.jugador1 : partido.jugador2}
                          </span>
                          {casillerosMapas(partido).map((mapa, m) => (
                            <input
                              key={m}
                              type="number"
                              min={0}
                              aria-label={`Mapa ${m + 1}, rondas de ${lado === 0 ? partido.jugador1 : partido.jugador2}`}
                              className="w-20 bg-black border border-zinc-700 rounded-lg p-2 text-center"
                              value={mapa[lado] ?? ""}
                              onChange={(e) => cambiarMapa(index, m, lado, e.target.value)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    {(() => {
                      const r = resultadoBO3(partido);
                      return "error" in r ? null : (
                        <p className="mt-4 text-sm text-zinc-300">
                          Serie: <b>{partido.jugador1} {r.ganados1}</b> - <b>{r.ganados2} {partido.jugador2}</b>
                        </p>
                      );
                    })()}
                  </>
                ) : usaMarcador(partido) ? (
                  <>
                    {!esJuegoConGoles && (
                      <p className="text-zinc-400 text-sm mb-4">
                        Cargá las rondas de cada equipo (por ejemplo 13 y 9). No puede haber empate.
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <span>{partido.jugador1}</span>

                      <input
                        type="number"
                        className="w-20 bg-black border border-zinc-700 rounded-lg p-2 text-center"
                        value={partido.goles_jugador1 ?? ""}
                        onChange={(e) => {
                          const copia = [...partidos];
                          copia[index].goles_jugador1 =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value);
                          setPartidos(copia);
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span>{partido.jugador2}</span>

                      <input
                        type="number"
                        className="w-20 bg-black border border-zinc-700 rounded-lg p-2 text-center"
                        value={partido.goles_jugador2 ?? ""}
                        onChange={(e) => {
                          const copia = [...partidos];
                          copia[index].goles_jugador2 =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value);
                          setPartidos(copia);
                        }}
                      />
                    </div>

                    {esJuegoConGoles &&
                      !(formatoZonas && partido.ronda === 1) &&
                      partido.goles_jugador1 === partido.goles_jugador2 &&
                      partido.goles_jugador1 !== null && (
                        <>
                          <h3 className="mt-6 mb-3 text-red-500 font-bold">
                            Penales
                          </h3>

                          <div className="flex justify-between items-center">
                            <span>{partido.jugador1}</span>

                            <input
                              type="number"
                              className="w-20 bg-black border border-zinc-700 rounded-lg p-2 text-center"
                              value={partido.penales_jugador1 ?? ""}
                              onChange={(e) => {
                                const copia = [...partidos];

                                copia[index].penales_jugador1 =
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value);

                                setPartidos(copia);
                              }}
                            />
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <span>{partido.jugador2}</span>

                            <input
                              type="number"
                              className="w-20 bg-black border border-zinc-700 rounded-lg p-2 text-center"
                              value={partido.penales_jugador2 ?? ""}
                              onChange={(e) => {
                                const copia = [...partidos];

                                copia[index].penales_jugador2 =
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value);

                                setPartidos(copia);
                              }}
                            />
                          </div>
                        </>
                      )}
                  </>
                ) : (
                  <div>
                    <p className="text-zinc-400 text-sm mb-3">
                      ¿Quién ganó este partido?
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {[partido.jugador1, partido.jugador2].map(
                        (jugador) => (
                          <button
                            key={jugador}
                            onClick={() =>
                              setGanadoresElegidos((prev) => ({
                                ...prev,
                                [partido.id]: jugador,
                              }))
                            }
                            className={`rounded-xl py-4 font-bold border transition ${
                              ganadoresElegidos[partido.id] === jugador ||
                          (!ganadoresElegidos[partido.id] &&
                            partido.ganador === jugador)
                                ? "bg-green-700 border-green-500"
                                : "bg-black border-zinc-700 hover:border-red-600"
                            }`}
                          >
                            {jugador}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => guardar(partido)}
                  disabled={guardando}
                  className={`mt-6 w-full rounded-xl py-3 font-bold transition disabled:opacity-50 ${
                    partido.estado === "Finalizado"
                      ? "bg-zinc-700 hover:bg-zinc-600"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {partido.estado === "Finalizado"
                    ? "Corregir Resultado"
                    : "Guardar Resultado"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
