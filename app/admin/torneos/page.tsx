"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
  estado: string;
};

export default function AdminTorneosPage() {
  const router = useRouter();

  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarAdmin();
  }, []);

  async function verificarAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("USER:", user);

    if (!user) {
      alert("No hay usuario logueado");
      router.replace("/");
      return;
    }

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", user.email)
      .single();

    console.log("USUARIO:", usuario);
    console.log("ERROR:", error);

    alert(JSON.stringify(usuario));

    if (!usuario?.admin) {
      router.replace("/");
      return;
    }

    cargarTorneos();
  }

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
      alert("No se pudo eliminar.");
      return;
    }

    alert("Torneo eliminado.");

    cargarTorneos();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex pt-20">
        <AdminSidebar />

        <div className="flex-1 p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-5xl font-black">
                Torneos
              </h1>

              <p className="text-zinc-400 mt-2">
                Administrá todos los torneos.
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/torneos/nuevo")}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold"
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
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold">
                        {torneo.nombre}
                      </h2>

                      <p className="text-zinc-400">
                        {torneo.juego}
                      </p>

                      <p className="mt-3">
                        Estado:
                        <span className="text-red-500 font-bold ml-2">
                          {torneo.estado}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          router.push(`/admin/torneos/editar/${torneo.id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
                      >
                        Editar
                      </button>

                      <button className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg">
                        Cerrar
                      </button>

                      <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg">
                        Empezar
                      </button>

                      <button
                        onClick={() => eliminarTorneo(torneo.id)}
                        className="bg-red-700 hover:bg-red-800 px-5 py-2 rounded-lg"
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