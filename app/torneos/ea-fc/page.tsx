"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";

type Torneo = {
  id: string;
  nombre: string;
  juego: string;
  plataforma: string;
  jugadores_max: number;
  premio: number;
  inscripcion: number;
  fecha: string;
  hora: string;
  descripcion: string;
  estado: string;
  campeon: string | null;
  inscritos: number;
  segundoPuesto?: string | null;
  tercerPuesto?: string | null;
};

export default function EAFCTorneosPage() {
  const router = useRouter();

  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTorneos();
  }, []);

  async function cargarTorneos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("torneos")
      .select("*")
      .eq("juego", "EA SPORTS FC 26")
      .order("fecha", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const torneosActualizados = await Promise.all(
      (data || []).map(async (torneo) => {
        const { count } = await supabase
          .from("inscripciones")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("torneo_id", torneo.id);

        let segundoPuesto: string | null = null;
        let tercerPuesto: string | null = null;

        if (torneo.estado === "Finalizado") {
          const { data: partidos } = await supabase
            .from("partidos")
            .select("ronda, jugador1, jugador2, ganador")
            .eq("torneo_id", torneo.id);

          if (partidos && partidos.length > 0) {
            const maxRonda = Math.max(...partidos.map((p) => p.ronda));

            const final = partidos.find((p) => p.ronda === maxRonda);

            if (final && final.ganador) {
              segundoPuesto =
                final.jugador1 === final.ganador
                  ? final.jugador2
                  : final.jugador1;
            }

            if (maxRonda > 1) {
              const semis = partidos.filter(
                (p) => p.ronda === maxRonda - 1
              );

              const perdedoresSemis = semis
                .map((p) =>
                  p.ganador
                    ? p.jugador1 === p.ganador
                      ? p.jugador2
                      : p.jugador1
                    : null
                )
                .filter((nombre): nombre is string => !!nombre);

              if (perdedoresSemis.length > 0) {
                tercerPuesto = perdedoresSemis.join(" y ");
              }
            }
          }
        }

        return {
          ...torneo,
          inscritos: count || 0,
          segundoPuesto,
          tercerPuesto,
        };
      })
    );

    setTorneos(torneosActualizados);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-20">

        <button
          onClick={() => router.push("/torneos")}
          className="mb-8 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-xl font-bold transition"
        >
          ← Volver a Juegos
        </button>

        <h1 className="text-5xl font-black">
          EA SPORTS FC <span className="text-red-600">26</span>
        </h1>

        <p className="text-zinc-400 mt-4 mb-12 text-lg">
          Elegí un torneo y comenzá a competir.
        </p>

        {loading ? (
          <p className="text-zinc-400 text-xl">
            Cargando torneos...
          </p>
        ) : torneos.length === 0 ? (
          <p className="text-zinc-400 text-xl">
            No hay torneos disponibles.
          </p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {torneos.map((torneo) => {
              const completo =
                torneo.inscritos >= torneo.jugadores_max;

              return (
                <div
                  key={torneo.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-600 transition"
                >
                  <h2 className="text-3xl font-black">
                    {torneo.nombre}
                  </h2>

                  <p className="text-zinc-400 mt-2">
                    {torneo.juego}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mt-8">

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Premio
                      </p>

                      <h3 className="text-green-500 text-2xl font-black">
                        ${torneo.premio.toLocaleString("es-AR")}
                      </h3>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Inscripción
                      </p>

                      <h3 className="text-2xl font-black">
                        ${torneo.inscripcion.toLocaleString("es-AR")}
                      </h3>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Jugadores
                      </p>

                      <h3 className="text-red-500 text-2xl font-black">
                        {torneo.inscritos} / {torneo.jugadores_max}
                      </h3>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Fecha
                      </p>

                      <h3 className="text-xl font-bold">
                        {new Date(torneo.fecha).toLocaleDateString("es-AR")}
                      </h3>
                    </div>

                  </div>

                  {torneo.estado === "En curso" ? (

                    <button
                      onClick={() =>
                        router.push(`/torneos/llave/${torneo.id}`)
                      }
                      className="mt-10 w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 font-bold text-lg transition"
                    >
                      🏆 VER LLAVE DEL TORNEO
                    </button>

                  ) : torneo.estado === "Finalizado" ? (

                    <div className="mt-10">
                      <button
                        onClick={() =>
                          router.push(`/torneos/llave/${torneo.id}`)
                        }
                        className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-xl py-4 font-bold text-lg transition"
                      >
                        TORNEO FINALIZADO — VER LLAVE
                      </button>

                      <div className="mt-4 text-center space-y-3">
                        <div>
                          <p className="text-zinc-400 text-sm">
                            🏆 Campeón
                          </p>

                          <p className="text-2xl font-black text-yellow-400">
                            {torneo.campeon ?? "Sin definir"}
                          </p>
                        </div>

                        {torneo.segundoPuesto && (
                          <div>
                            <p className="text-zinc-400 text-sm">
                              🥈 2do puesto
                            </p>

                            <p className="text-lg font-bold text-zinc-300">
                              {torneo.segundoPuesto}
                            </p>
                          </div>
                        )}

                        {torneo.tercerPuesto && (
                          <div>
                            <p className="text-zinc-400 text-sm">
                              🥉 3er puesto
                            </p>

                            <p className="text-lg font-bold text-zinc-400">
                              {torneo.tercerPuesto}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                  ) : completo ? (

                    <button
                      disabled
                      className="mt-10 w-full bg-zinc-700 cursor-not-allowed rounded-xl py-4 font-bold text-lg"
                    >
                      TORNEO COMPLETO
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        router.push(`/torneos/inscripcion/${torneo.id}`)
                      }
                      className="mt-10 w-full bg-red-600 hover:bg-red-700 rounded-xl py-4 font-bold text-lg transition"
                    >
                      INSCRIBIRME
                    </button>

                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}