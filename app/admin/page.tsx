"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { empezarTorneo as iniciarTorneo } from "@/lib/empezarTorneo";

type Torneo = {
  id: string;
  nombre: string;
  juego: string;
  plataforma: string;
  jugadores_max: number;
  premio: number;
  inscripcion: number;
  fecha: string;
  estado: string;
  visible?: boolean;
};

export default function AdminTorneosPage() {
  const router = useRouter();

  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTorneos();
  }, []);

  async function cargarTorneos() {
    const { data } = await supabase
      .from("torneos")
      .select("*")
      .order("fecha", { ascending: true });

    setTorneos(data || []);
    setLoading(false);
  }

  async function eliminarTorneo(id: string) {
    const confirmar = confirm(
      "¿Seguro que querés eliminar este torneo?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("torneos")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Torneo eliminado.");

    cargarTorneos();
  }

  async function empezarTorneo(torneoId: string) {
    if (await iniciarTorneo(torneoId)) cargarTorneos();
  }
    return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="flex pt-20">

        <AdminSidebar />

        <div className="flex-1 p-5 pt-20 lg:p-10">

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 lg:mb-10">

            <div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
                Torneos
              </h1>

              <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                Administrá todos los torneos.
              </p>

            </div>

            <button
              onClick={() => router.push("/admin/torneos/nuevo")}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold text-sm sm:text-base"
            >
              + Crear Torneo
            </button>

          </div>

          {loading ? (

            <p>Cargando...</p>

          ) : (

            <div className="space-y-6">

              {torneos.map((torneo) => (

                <div
                  key={torneo.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                    <div>

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {torneo.nombre}
                        {torneo.visible === false && (
                          <span className="ml-3 align-middle rounded-md bg-yellow-500/15 px-2 py-0.5 text-xs font-bold text-yellow-400">
                            Prueba
                          </span>
                        )}
                      </h2>

                      <p className="text-zinc-400 text-sm sm:text-base">
                        {torneo.juego}
                      </p>

                      <p className="mt-2 text-sm sm:text-base">
                        Plataforma: {torneo.plataforma}
                      </p>

                      <p className="text-sm sm:text-base">
                        Premio: ${torneo.premio}
                      </p>

                      <p className="text-sm sm:text-base">
                        Inscripción: ${torneo.inscripcion}
                      </p>

                      <p className="text-sm sm:text-base">
                        Fecha: {torneo.fecha}
                      </p>

                      <p className="mt-3 text-sm sm:text-base">
                        Estado:
                        <span className="text-red-500 font-bold ml-2">
                          {torneo.estado}
                        </span>
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3">

                      <button
                        onClick={() =>
                          router.push(`/admin/torneos/editar/${torneo.id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/admin/torneos/usuarios?torneo=${torneo.id}`
                          )
                        }
                        className="bg-zinc-700 hover:bg-zinc-600 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Usuarios
                      </button>

                      <button
                        className="bg-yellow-600 hover:bg-yellow-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Cerrar
                      </button>

                     {torneo.estado === "En curso" ? (

  <button
    onClick={() => router.push(`/torneos/llave/${torneo.id}`)}
    className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-semibold"
  >
    🏆 Llave del Torneo
  </button>

) : (

  <button
    onClick={() => empezarTorneo(torneo.id)}
    className="bg-green-600 hover:bg-green-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-semibold"
  >
    Empezar
  </button>

)}

                      <button
                        onClick={() => eliminarTorneo(torneo.id)}
                        className="bg-red-700 hover:bg-red-800 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}
