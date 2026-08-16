"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Usuario = {
  id: string;
  usuario: string;
  partidos_jugados: number;
  victorias: number;
  derrotas: number;
  goles_favor: number;
  goles_contra: number;
  torneos_ganados: number;
};

export default function AdminRankingPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [reiniciando, setReiniciando] = useState(false);

  const [rankingFin, setRankingFin] = useState("");
  const [guardandoFecha, setGuardandoFecha] = useState(false);

  useEffect(() => {
    cargarRanking();
    cargarConfiguracion();
  }, []);

  async function cargarRanking() {
    setLoading(true);

    const { data, error } = await supabase
      .from("usuarios")
      .select(
        "id,usuario,partidos_jugados,victorias,derrotas,goles_favor,goles_contra,torneos_ganados"
      )
      .gt("partidos_jugados", 0)
      .order("torneos_ganados", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUsuarios((data as Usuario[]) || []);
    }

    setLoading(false);
  }

  async function cargarConfiguracion() {
    const { data } = await supabase
      .from("configuracion")
      .select("ranking_fin")
      .eq("id", 1)
      .maybeSingle();

    setRankingFin(data?.ranking_fin ?? "");
  }

  async function guardarFechaFin() {
    setGuardandoFecha(true);

    const { error } = await supabase
      .from("configuracion")
      .update({
        ranking_fin: rankingFin || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setGuardandoFecha(false);

    if (error) {
      alert("No se pudo guardar la fecha: " + error.message);
      return;
    }

    alert("Fecha de fin del ranking actualizada.");
  }

  async function reiniciarRanking() {
    const confirmar = confirm(
      "¿Seguro que querés reiniciar el ranking? Esto pone en 0 los partidos, victorias, derrotas, goles y torneos ganados de TODOS los usuarios, y borra las estadísticas de otros juegos (como Truco Blyts). Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    const segundaConfirmacion = confirm(
      "Confirmá de nuevo: esto borra el historial de estadísticas de todos los jugadores en todos los juegos. ¿Continuar?"
    );

    if (!segundaConfirmacion) return;

    setReiniciando(true);

    const { error } = await supabase
      .from("usuarios")
      .update({
        partidos_jugados: 0,
        victorias: 0,
        derrotas: 0,
        goles_favor: 0,
        goles_contra: 0,
        torneos_ganados: 0,
      })
      .not("id", "is", null);

    const { error: errorJuegos } = await supabase
      .from("estadisticas_juego")
      .delete()
      .not("id", "is", null);

    setReiniciando(false);

    if (error || errorJuegos) {
      alert(
        "No se pudo reiniciar el ranking: " +
          (error?.message || errorJuegos?.message)
      );
      return;
    }

    alert("Ranking reiniciado correctamente.");
    cargarRanking();
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-black text-white pt-20">
        <AdminSidebar />

        <main className="flex-1 p-5 pt-20 lg:p-10">

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black">Ranking</h1>
              <p className="text-zinc-400 mt-2">
                Estadísticas actuales de EA SPORTS FC 26. El reinicio también
                borra las estadísticas de los demás juegos (Truco Blyts, etc.).
              </p>
            </div>

            <button
              onClick={reiniciarRanking}
              disabled={reiniciando}
              className="bg-red-700 hover:bg-red-800 disabled:opacity-60 px-6 py-4 rounded-xl font-bold"
            >
              {reiniciando
                ? "Reiniciando..."
                : "🔄 Reiniciar Ranking del Mes"}
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 max-w-xl">
            <h2 className="font-bold mb-1">Fin del ranking actual</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Esta fecha se muestra a los usuarios en la página pública de
              Ranking, para que sepan hasta cuándo pueden sumar puntos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={rankingFin}
                onChange={(e) => setRankingFin(e.target.value)}
                className="flex-1 bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-red-600"
              />

              <button
                onClick={guardarFechaFin}
                disabled={guardandoFecha}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-6 py-3 rounded-xl font-bold whitespace-nowrap"
              >
                {guardandoFecha ? "Guardando..." : "Guardar fecha"}
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-zinc-400 mt-10">Cargando...</p>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-800">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 text-sm">
                    <th className="px-5 py-4">Jugador</th>
                    <th className="px-5 py-4">PJ</th>
                    <th className="px-5 py-4">V</th>
                    <th className="px-5 py-4">D</th>
                    <th className="px-5 py-4">GF</th>
                    <th className="px-5 py-4">GC</th>
                    <th className="px-5 py-4">🏆</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-zinc-800 bg-black"
                    >
                      <td className="px-5 py-4 font-bold">{u.usuario}</td>
                      <td className="px-5 py-4">{u.partidos_jugados}</td>
                      <td className="px-5 py-4 text-green-400">
                        {u.victorias}
                      </td>
                      <td className="px-5 py-4 text-red-400">
                        {u.derrotas}
                      </td>
                      <td className="px-5 py-4">{u.goles_favor}</td>
                      <td className="px-5 py-4">{u.goles_contra}</td>
                      <td className="px-5 py-4 text-yellow-400 font-bold">
                        {u.torneos_ganados}
                      </td>
                    </tr>
                  ))}

                  {usuarios.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-8 text-center text-zinc-500"
                      >
                        Todavía no hay estadísticas cargadas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
