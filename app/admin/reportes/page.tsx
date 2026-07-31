"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import ReportarResultado from "@/components/torneo/ReportarResultado";
import { ImageIcon, MessageSquareText } from "lucide-react";

type Reporte = {
  id: string;
  partido_id: string;
  torneo_id: string;
  autor_usuario: string;
  es_admin: boolean;
  mensaje: string | null;
  imagen_url: string | null;
  leido: boolean;
  created_at: string;
  partidos: {
    jugador1: string;
    jugador2: string;
    ronda: number;
    numero_partido: number;
  } | null;
  torneos: {
    nombre: string;
  } | null;
};

type Hilo = {
  partidoId: string;
  torneoId: string;
  torneoNombre: string;
  jugador1: string;
  jugador2: string;
  ultimoMensaje: Reporte;
  cantidadSinLeer: number;
  mensajes: Reporte[];
};

export default function AdminReportesPage() {
  const router = useRouter();

  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiloAbierto, setHiloAbierto] = useState<Hilo | null>(null);

  useEffect(() => {
    cargarReportes();
    const intervalo = setInterval(cargarReportes, 6000);
    return () => clearInterval(intervalo);
  }, []);

  async function cargarReportes() {
    const { data, error } = await supabase
      .from("reportes_resultado")
      .select(
        `
        id,
        partido_id,
        torneo_id,
        autor_usuario,
        es_admin,
        mensaje,
        imagen_url,
        leido,
        created_at,
        partidos ( jugador1, jugador2, ronda, numero_partido ),
        torneos ( nombre )
      `
      )
      .order("created_at", { ascending: true });

    if (!error) {
      setReportes((data as unknown as Reporte[]) || []);
    }

    setLoading(false);
  }

  const hilos = useMemo(() => {
    const mapa = new Map<string, Hilo>();

    for (const r of reportes) {
      const existente = mapa.get(r.partido_id);

      if (!existente) {
        mapa.set(r.partido_id, {
          partidoId: r.partido_id,
          torneoId: r.torneo_id,
          torneoNombre: r.torneos?.nombre ?? "Torneo",
          jugador1: r.partidos?.jugador1 ?? "Jugador 1",
          jugador2: r.partidos?.jugador2 ?? "Jugador 2",
          ultimoMensaje: r,
          cantidadSinLeer: !r.es_admin && !r.leido ? 1 : 0,
          mensajes: [r],
        });
      } else {
        existente.ultimoMensaje = r;
        existente.mensajes.push(r);
        if (!r.es_admin && !r.leido) existente.cantidadSinLeer += 1;
      }
    }

    return Array.from(mapa.values()).sort(
      (a, b) =>
        new Date(b.ultimoMensaje.created_at).getTime() -
        new Date(a.ultimoMensaje.created_at).getTime()
    );
  }, [reportes]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex pt-20">
        <AdminSidebar />

        <div className="flex-1 p-5 pt-20 lg:p-10">
          <h1 className="text-5xl font-black mb-2">Reportes de resultado</h1>

          <p className="text-zinc-400 mb-10">
            Mensajes y fotos que los jugadores enviaron para avisar cómo
            terminó su partido.
          </p>

          {loading ? (
            <p>Cargando...</p>
          ) : hilos.length === 0 ? (
            <p className="text-zinc-500">
              Todavía no llegó ningún reporte de resultado.
            </p>
          ) : (
            <div className="space-y-4">
              {hilos.map((hilo) => (
                <button
                  key={hilo.partidoId}
                  onClick={() => setHiloAbierto(hilo)}
                  className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-red-600/60 rounded-2xl p-6 transition flex items-center justify-between gap-6"
                >
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                      {hilo.torneoNombre}
                    </p>

                    <p className="font-bold text-lg truncate">
                      {hilo.jugador1} vs {hilo.jugador2}
                    </p>

                    <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2 truncate">
                      {hilo.ultimoMensaje.imagen_url && (
                        <ImageIcon size={14} className="shrink-0" />
                      )}
                      <span className="truncate">
                        {hilo.ultimoMensaje.es_admin ? "Vos: " : ""}
                        {hilo.ultimoMensaje.mensaje ??
                          (hilo.ultimoMensaje.imagen_url
                            ? "Envió una foto"
                            : "")}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {hilo.cantidadSinLeer > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center">
                        {hilo.cantidadSinLeer}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/resultados/${hilo.torneoId}`);
                      }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 border border-emerald-700/50 rounded-lg px-3 py-2 flex items-center gap-2"
                    >
                      <MessageSquareText size={14} />
                      Cargar resultado
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {hiloAbierto && (
        <ReportarResultado
          partidoId={hiloAbierto.partidoId}
          torneoId={hiloAbierto.torneoId}
          miUsuario="Admin"
          rival={`${hiloAbierto.jugador1} vs ${hiloAbierto.jugador2}`}
          esAdmin
          onClose={() => {
            setHiloAbierto(null);
            cargarReportes();
          }}
        />
      )}
    </main>
  );
}

