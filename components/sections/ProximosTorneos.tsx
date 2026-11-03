"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import type { TorneoCardData } from "@/components/torneo/TorneoCard";
import ProximoTorneoCard from "@/components/torneo/ProximoTorneoCard";

const MAX_TORNEOS = 6;

function hoyISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function ProximosTorneos() {
  const [torneos, setTorneos] = useState<TorneoCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      const { data, error } = await supabase
        .from("torneos")
        .select("*")
        .eq("estado", "Abierto")
        .gte("fecha", hoyISO())
        .order("fecha", { ascending: true })
        .limit(MAX_TORNEOS);

      if (error) {
        console.error(error);
        if (!cancelado) setLoading(false);
        return;
      }

      const conCupos = await Promise.all(
        (data || []).map(async (torneo) => {
          const { count } = await supabase
            .from("inscripciones")
            .select("*", { count: "exact", head: true })
            .eq("torneo_id", torneo.id);

          return { ...torneo, inscritos: count || 0 } as TorneoCardData;
        })
      );

      if (!cancelado) {
        setTorneos(conCupos);
        setLoading(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <section className="relative py-16 lg:py-28 overflow-hidden">
      <div className="absolute right-0 top-0 w-[240px] h-[240px] lg:w-[500px] lg:h-[500px] rounded-full bg-red-600/5 blur-[80px] lg:blur-[180px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-14">
          <div>
            <p className="uppercase tracking-[3px] sm:tracking-[6px] text-sm sm:text-base text-red-600 font-bold mb-3 lg:mb-5">
              Inscripciones abiertas
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight">
              Próximos <span className="text-red-600">Torneos</span>
            </h2>
          </div>

          <Link
            href="/torneos"
            className="inline-flex items-center gap-2 self-start sm:self-auto text-sm sm:text-base font-bold text-zinc-300 hover:text-red-500 transition"
          >
            Ver todos <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl lg:rounded-3xl border border-zinc-800 bg-white/[0.03] animate-pulse"
              />
            ))}
          </div>
        ) : torneos.length === 0 ? (
          <div className="rounded-2xl lg:rounded-3xl border border-zinc-800 bg-white/[0.03] p-8 lg:p-12 text-center">
            <p className="text-lg lg:text-2xl font-black">Pronto anunciamos nuevos torneos</p>
            <p className="text-zinc-400 mt-2">Mientras tanto, mirá los juegos disponibles.</p>
            <Link
              href="/torneos"
              className="inline-flex items-center gap-2 mt-6 rounded-xl px-6 py-3 font-bold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition"
            >
              Ver torneos <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
            {torneos.map((torneo) => (
              <ProximoTorneoCard key={torneo.id} torneo={torneo} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
