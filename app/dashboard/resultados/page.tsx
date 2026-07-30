"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";

interface Torneo {
  id: string;
  nombre: string;
  juego: string;
  jugadores_max: number;
  estado: string;
}

export default function ResultadosPage() {
  const [loading, setLoading] = useState(true);
  const [torneos, setTorneos] = useState<Torneo[]>([]);

  useEffect(() => {
    cargarTorneos();
  }, []);

  async function cargarTorneos() {
    const { data, error } = await supabase
      .from("torneos")
      .select("id,nombre,juego,jugadores_max,estado")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTorneos(data);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-5xl font-black">
          Administrar Resultados
        </h1>

        <p className="text-zinc-400 mt-3">
          Elegí un torneo para administrar sus partidos.
        </p>

        {loading ? (
          <div className="mt-10">
            <h2 className="text-2xl font-bold">
              Cargando torneos...
            </h2>
          </div>
        ) : torneos.length === 0 ? (
          <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold">
              No hay torneos creados.
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
            {torneos.map((torneo) => (
              <div
                key={torneo.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-red-600 transition"
              >
                <h2 className="text-2xl font-bold">
                  🏆 {torneo.nombre}
                </h2>

                <p className="text-zinc-400 mt-3">
                  {torneo.juego}
                </p>

                <p className="text-zinc-400">
                  {torneo.jugadores_max} jugadores
                </p>

                <p className="mt-2 text-red-500 font-semibold">
                  {torneo.estado}
                </p>

                <Link href={`/dashboard/resultados/${torneo.id}`}>
                  <button className="mt-6 w-full bg-red-600 hover:bg-red-700 transition rounded-xl py-3 font-bold">
                    Administrar
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}