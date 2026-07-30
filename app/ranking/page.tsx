"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import TopPodium from "@/components/ranking/TopPodium";
import RankingList from "@/components/ranking/RankingList";
import RankingPrizes from "@/components/ranking/RankingPrizes";
import GameSelector from "@/components/reglamento/GameSelector";
import { supabase } from "@/lib/supabase";
import { juegos } from "@/lib/games";
import { JUEGOS_CON_GOLES } from "@/lib/ranking";

export interface RankingPlayer {
  id: string;
  usuario: string;
  partidos_jugados: number;
  victorias: number;
  derrotas: number;
  goles_favor: number;
  goles_contra: number;
  torneos_ganados: number;
}

export default function RankingPage() {
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState<"individual" | "equipo">("individual");

  // La modalidad es por torneo, no por juego: cualquier juego puede tener
  // torneos individuales o de equipo. Por eso en la pestaña Individual se
  // muestran todos los juegos.
  const juegosIndividuales = juegos;

  const [selectedId, setSelectedId] = useState(juegosIndividuales[0]?.id ?? "ea-fc");
  const selectedGame = juegos.find((juego) => juego.id === selectedId)!;

  const esJuegoConGoles = JUEGOS_CON_GOLES.includes(selectedGame.nombre);

  useEffect(() => {
    if (modo === "individual" && selectedGame.disponible) {
      cargarRanking();
    }
  }, [modo, selectedId]);

  function cambiarModo(nuevoModo: "individual" | "equipo") {
    setModo(nuevoModo);

    if (nuevoModo === "individual" && juegosIndividuales[0]) {
      setSelectedId(juegosIndividuales[0].id);
    }
  }

  async function cargarRanking() {
    setLoading(true);

    if (esJuegoConGoles) {
      // EA SPORTS FC 26: estadísticas globales de goles en la tabla usuarios
      const { data, error } = await supabase
        .from("usuarios")
        .select(
          "id,usuario,partidos_jugados,victorias,derrotas,goles_favor,goles_contra,torneos_ganados"
        )
        .gt("partidos_jugados", 0);

      if (error) {
        console.error(error);
        setPlayers([]);
        setLoading(false);
        return;
      }

      setPlayers(ordenarRanking(data ?? []));
      setLoading(false);
      return;
    }

    // Resto de los juegos (ej: Truco Blyts): solo PJ / V / D, por juego.
    const { data, error } = await supabase
      .from("estadisticas_juego")
      .select("id,usuario,partidos_jugados,victorias,derrotas,torneos_ganados")
      .eq("juego", selectedGame.nombre)
      .gt("partidos_jugados", 0);

    if (error) {
      console.error(error);
      setPlayers([]);
      setLoading(false);
      return;
    }

    const conGolesEnCero = (data ?? []).map((fila: any) => ({
      ...fila,
      goles_favor: 0,
      goles_contra: 0,
    }));

    setPlayers(ordenarRanking(conGolesEnCero));
    setLoading(false);
  }

  function ordenarRanking(data: RankingPlayer[]) {
    return [...data].sort((a, b) => {
      if (b.torneos_ganados !== a.torneos_ganados)
        return b.torneos_ganados - a.torneos_ganados;

      if (b.victorias !== a.victorias)
        return b.victorias - a.victorias;

      if (!esJuegoConGoles) return 0;

      const dgA = a.goles_favor - a.goles_contra;
      const dgB = b.goles_favor - b.goles_contra;

      if (dgB !== dgA)
        return dgB - dgA;

      return b.goles_favor - a.goles_favor;
    });
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center">

            <h1 className="text-6xl font-black">
              Ranking <span className="text-red-600">Mensual</span>
            </h1>

            <p className="text-zinc-400 text-xl mt-6 max-w-3xl mx-auto leading-8">
              Competí durante todo el mes, escalá posiciones y conseguí los
              mejores premios de Gaming Experience GMP.
            </p>

          </div>

          {/* TABS INDIVIDUAL / EQUIPOS */}
          <div className="mt-10 flex justify-center gap-3">
            <button
              onClick={() => cambiarModo("individual")}
              className={`rounded-full border px-6 py-3 font-bold text-sm transition ${
                modo === "individual"
                  ? "border-red-600 bg-red-600/10 text-white"
                  : "border-zinc-800 bg-[#111111] text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              Ranking Individual
            </button>

            <button
              onClick={() => cambiarModo("equipo")}
              className={`rounded-full border px-6 py-3 font-bold text-sm transition ${
                modo === "equipo"
                  ? "border-red-600 bg-red-600/10 text-white"
                  : "border-zinc-800 bg-[#111111] text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              Ranking en Equipo
            </button>
          </div>

          {modo === "individual" ? (
            <>
              <div className="mt-8">
                <GameSelector
                  games={juegosIndividuales}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>

              {selectedGame.disponible ? (
                loading ? (
                  <p className="text-center text-zinc-400 mt-20">
                    Cargando ranking...
                  </p>
                ) : (
                  <>
                    <TopPodium players={players.slice(0, 3)} mostrarGoles={esJuegoConGoles} />
                    <RankingList players={players} mostrarGoles={esJuegoConGoles} />
                  </>
                )
              ) : (
                <div className="max-w-3xl mx-auto mt-16 text-center">
                  <div className="rounded-2xl border border-zinc-800 bg-[#111111] px-8 py-16">
                    <p className="text-2xl font-bold text-white">
                      El ranking de {selectedGame.nombre} todavía no está disponible
                    </p>
                    <p className="mt-4 text-zinc-400 leading-8">
                      Vamos a publicarlo apenas habilitemos torneos de este juego en
                      la plataforma.
                    </p>
                  </div>
                </div>
              )}

              <RankingPrizes />
            </>
          ) : (
            <div className="mt-10">
              <div className="max-w-3xl mx-auto mt-8 text-center">
                <div className="rounded-2xl border border-zinc-800 bg-[#111111] px-8 py-16">
                  <p className="text-2xl font-bold text-white">
                    Ranking en Equipo — Próximamente
                  </p>
                  <p className="mt-4 text-zinc-400 leading-8">
                    Estamos preparando el ranking para los torneos de equipos.
                    Todavía no cuenta para el ranking individual.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
