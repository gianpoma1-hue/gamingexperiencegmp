"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { guardarResultado } from "@/lib/tournament";

const JUEGOS_CON_GOLES = ["EA SPORTS FC 26"];

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
}

export default function AdministrarResultadosPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [juego, setJuego] = useState<string>("");
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [ganadoresElegidos, setGanadoresElegidos] = useState<Record<string, string>>({});

  const esJuegoConGoles = JUEGOS_CON_GOLES.includes(juego);

  useEffect(() => {
    cargarTorneoYPartidos();
  }, []);

  async function cargarTorneoYPartidos() {
    const { data: torneoData } = await supabase
      .from("torneos")
      .select("juego")
      .eq("id", id)
      .single();

    setJuego(torneoData?.juego ?? "");

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
    try {
      setGuardando(true);

      if (esJuegoConGoles) {
        if (
          partido.goles_jugador1 === null ||
          partido.goles_jugador2 === null
        ) {
          alert("Completá ambos resultados.");
          setGuardando(false);
          return;
        }

        await guardarResultado({
          partidoId: partido.id,
          torneoId: id as string,
          juego,
          golesJugador1: partido.goles_jugador1,
          golesJugador2: partido.goles_jugador2,
          penalesJugador1: partido.penales_jugador1,
          penalesJugador2: partido.penales_jugador2,
        });
      } else {
        const ganador = ganadoresElegidos[partido.id];

        if (!ganador) {
          alert("Elegí quién ganó el partido.");
          setGuardando(false);
          return;
        }

        await guardarResultado({
          partidoId: partido.id,
          torneoId: id as string,
          juego,
          ganadorDirecto: ganador,
        });
      }

      await cargarTorneoYPartidos();

      alert("Resultado guardado correctamente.");
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
                    Ronda {partido.ronda} • Partido {partido.numero_partido}
                  </h2>

                  <span className="text-red-500 font-bold">
                    {partido.estado}
                  </span>
                </div>

                {esJuegoConGoles ? (
                  <>
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

                    {partido.goles_jugador1 === partido.goles_jugador2 &&
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
                              ganadoresElegidos[partido.id] === jugador
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
                  className="mt-6 w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 font-bold transition disabled:opacity-50"
                >
                  Guardar Resultado
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
