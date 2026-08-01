"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Inscripcion = {
  id: string;
  nombre: string;
  usuario: string;
  plataforma: string;
  created_at: string;
  torneo_id: string;
  estado_pago: "pendiente" | "confirmado" | "rechazado";
  torneos: { nombre: string } | null;
};

export default function AdminInscripcionesPage() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarInscripciones();
  }, []);

  async function cargarInscripciones() {
    setLoading(true);

    const { data, error } = await supabase
      .from("inscripciones")
      .select(`
        id,
        nombre,
        usuario,
        plataforma,
        created_at,
        torneo_id,
        estado_pago,
        torneos (
          nombre
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Error al cargar las inscripciones.");
    } else {
      setInscripciones((data as Inscripcion[]) || []);
    }

    setLoading(false);
  }

  async function actualizarEstadoPago(
    id: string,
    estado_pago: "confirmado" | "rechazado"
  ) {
    const { error } = await supabase
      .from("inscripciones")
      .update({ estado_pago })
      .eq("id", id);

    if (error) {
      alert("No se pudo actualizar el estado del pago.");
      return;
    }

    cargarInscripciones();
  }

  async function eliminarInscripcion(id: string) {
    const confirmar = confirm(
      "¿Seguro que querés eliminar esta inscripción?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("inscripciones")
      .delete()
      .eq("id", id);

    if (error) {
      alert("No se pudo eliminar.");
      return;
    }

    cargarInscripciones();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex pt-20">

        <AdminSidebar />

        <div className="flex-1 p-5 pt-20 lg:p-10">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">
            Inscripciones
          </h1>

          <p className="text-zinc-400 mb-6 lg:mb-10 text-sm sm:text-base">
            Jugadores inscriptos en los torneos.
          </p>

          {loading ? (
            <p>Cargando...</p>
          ) : inscripciones.length === 0 ? (
            <p>No hay inscripciones.</p>
          ) : (
            <div className="space-y-5">

              {inscripciones.map((inscripcion) => (

                <div
                  key={inscripcion.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                    <div>

                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">
                          {inscripcion.nombre}
                        </h2>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            inscripcion.estado_pago === "confirmado"
                              ? "bg-green-500/10 text-green-400 border border-green-500"
                              : inscripcion.estado_pago === "rechazado"
                              ? "bg-red-500/10 text-red-400 border border-red-500"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500"
                          }`}
                        >
                          {inscripcion.estado_pago === "confirmado"
                            ? "Pago confirmado"
                            : inscripcion.estado_pago === "rechazado"
                            ? "Pago rechazado"
                            : "Pago pendiente"}
                        </span>
                      </div>

                      <p className="text-zinc-400 mt-2">
                        Usuario: {inscripcion.usuario}
                      </p>

                      <p className="text-zinc-400">
                        Plataforma: {inscripcion.plataforma}
                      </p>

                      <p className="text-zinc-400">
                        Torneo:{" "}
                        <span className="text-red-500 font-bold">
                          {inscripcion.torneos?.nombre ?? "Sin torneo"}
                        </span>
                      </p>

                      <p className="text-sm text-zinc-500 mt-3">
                        {new Date(
                          inscripcion.created_at
                        ).toLocaleString("es-AR")}
                      </p>

                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col flex-wrap gap-2 sm:gap-3">
                      {inscripcion.estado_pago !== "confirmado" && (
                        <button
                          onClick={() =>
                            actualizarEstadoPago(inscripcion.id, "confirmado")
                          }
                          className="bg-green-700 hover:bg-green-800 px-5 py-3 rounded-xl font-bold"
                        >
                          Confirmar pago
                        </button>
                      )}

                      {inscripcion.estado_pago !== "rechazado" && (
                        <button
                          onClick={() =>
                            actualizarEstadoPago(inscripcion.id, "rechazado")
                          }
                          className="bg-zinc-700 hover:bg-zinc-600 px-5 py-3 rounded-xl font-bold"
                        >
                          Rechazar pago
                        </button>
                      )}

                      <button
                        onClick={() =>
                          eliminarInscripcion(inscripcion.id)
                        }
                        className="bg-red-700 hover:bg-red-800 px-5 py-3 rounded-xl font-bold"
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
