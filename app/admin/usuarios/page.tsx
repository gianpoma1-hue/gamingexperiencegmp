"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Usuario = {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  plataforma: string;
  es_admin: boolean;
  partidos_jugados: number;
  victorias: number;
  torneos_ganados: number;
};

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    setLoading(true);

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error(error);
      alert("No se pudieron cargar los usuarios.");
    } else {
      setUsuarios((data as Usuario[]) || []);
    }

    setLoading(false);
  }

  async function cambiarAdmin(usuario: Usuario) {
    const confirmar = confirm(
      usuario.es_admin
        ? `¿Quitarle permisos de admin a ${usuario.usuario}?`
        : `¿Hacer admin a ${usuario.usuario}?`
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("usuarios")
      .update({ es_admin: !usuario.es_admin })
      .eq("id", usuario.id);

    if (error) {
      alert("No se pudo actualizar el usuario.");
      return;
    }

    cargarUsuarios();
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = busqueda.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(texto) ||
      u.usuario?.toLowerCase().includes(texto) ||
      u.email?.toLowerCase().includes(texto)
    );
  });

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-black text-white pt-20">
        <AdminSidebar />

        <main className="flex-1 p-5 pt-20 lg:p-10">

          <h1 className="text-4xl font-black">Usuarios</h1>
          <p className="text-zinc-400 mt-2">
            Todos los usuarios registrados en la plataforma.
          </p>

          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, usuario o email..."
            className="mt-6 w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-red-600"
          />

          {loading ? (
            <p className="text-zinc-400 mt-10">Cargando...</p>
          ) : (
            <div className="mt-8 space-y-4">
              {usuariosFiltrados.length === 0 && (
                <p className="text-zinc-500">
                  No se encontraron usuarios.
                </p>
              )}

              {usuariosFiltrados.map((u) => (
                <div
                  key={u.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between gap-6"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold">
                        {u.nombre || u.usuario}
                      </h2>

                      {u.es_admin && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600/10 text-red-400 border border-red-600">
                          Admin
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-400 text-sm mt-1">
                      @{u.usuario} · {u.email}
                    </p>

                    <p className="text-zinc-500 text-sm mt-1">
                      {u.plataforma} · {u.partidos_jugados ?? 0} partidos ·{" "}
                      {u.victorias ?? 0} victorias ·{" "}
                      {u.torneos_ganados ?? 0} torneos ganados
                    </p>
                  </div>

                  <button
                    onClick={() => cambiarAdmin(u)}
                    className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap ${
                      u.es_admin
                        ? "bg-zinc-700 hover:bg-zinc-600"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {u.es_admin ? "Quitar admin" : "Hacer admin"}
                  </button>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </>
  );
}
