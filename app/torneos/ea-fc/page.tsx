"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import TorneoCard, { TorneoCardData } from "@/components/torneo/TorneoCard";

export default function EAFCTorneosPage() {
  const router = useRouter();

  const [torneos, setTorneos] = useState<TorneoCardData[]>([]);
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
          .eq("torneo_id", torneo.id)
          .neq("estado_pago", "rechazado");

        return {
          ...torneo,
          inscritos: count || 0,
        };
      })
    );

    setTorneos(torneosActualizados);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 lg:pt-36 pb-16 lg:pb-20">

        <button
          onClick={() => router.push("/torneos")}
          className="mb-8 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-xl font-bold transition"
        >
          ← Volver a Juegos
        </button>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
          EA SPORTS FC <span className="text-red-600">26</span>
        </h1>

        <p className="text-zinc-400 mt-3 mb-8 lg:mt-4 lg:mb-12 text-base lg:text-lg">
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
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {torneos.map((torneo) => (
              <TorneoCard key={torneo.id} torneo={torneo} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
