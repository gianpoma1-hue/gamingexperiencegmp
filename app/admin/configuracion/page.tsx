"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";

export default function AdminConfiguracionPage() {
  const [titular, setTitular] = useState("");
  const [cbu, setCbu] = useState("");
  const [alias, setAlias] = useState("");
  const [banco, setBanco] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarConfig();
  }, []);

  async function cargarConfig() {
    const { data, error } = await supabase
      .from("configuracion_pagos")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setTitular(data.titular ?? "");
      setCbu(data.cbu ?? "");
      setAlias(data.alias ?? "");
      setBanco(data.banco ?? "");
    }

    setLoading(false);
  }

  async function guardar() {
    setGuardando(true);

    const { error } = await supabase
      .from("configuracion_pagos")
      .update({ titular, cbu, alias, banco })
      .eq("id", 1);

    setGuardando(false);

    if (error) {
      alert("No se pudo guardar: " + error.message);
      return;
    }

    alert("Datos de pago actualizados. Ya se van a mostrar así en la inscripción a torneos.");
  }

  const ideas = [
    {
      titulo: "Roles y permisos",
      texto:
        "Ya podés hacer admin a otros usuarios desde la sección Usuarios. Más adelante se puede sumar un rol intermedio (moderador) que confirme pagos sin poder crear/eliminar torneos.",
    },
    {
      titulo: "Métodos de pago",
      texto:
        "Hoy es transferencia manual. En el futuro se puede integrar Mercado Pago o Stripe para que la confirmación de pago sea automática.",
    },
    {
      titulo: "Notificaciones",
      texto:
        "Se pueden agregar notificaciones por email (además de la campanita) para avisos importantes, como que se confirmó tu pago.",
    },
    {
      titulo: "Datos por defecto de torneos",
      texto:
        "Guardar acá valores por defecto (plataforma, cupo, premio sugerido) para no cargarlos a mano cada vez que creás un torneo nuevo.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-black text-white pt-20">
        <AdminSidebar />

        <main className="flex-1 p-10 max-w-3xl">

          <h1 className="text-4xl font-black">Configuración</h1>
          <p className="text-zinc-400 mt-2">
            Datos de pago que ven los jugadores al inscribirse, y algunas
            ideas para más adelante.
          </p>

          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-5">

            <h2 className="text-xl font-bold">
              💳 Datos de transferencia
            </h2>

            {loading ? (
              <p className="text-zinc-400">Cargando...</p>
            ) : (
              <>
                <div>
                  <label className="text-sm text-zinc-400">Titular</label>
                  <input
                    value={titular}
                    onChange={(e) => setTitular(e.target.value)}
                    className="w-full mt-1 rounded-xl bg-black border border-zinc-700 px-4 py-3 outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400">CBU</label>
                  <input
                    value={cbu}
                    onChange={(e) => setCbu(e.target.value)}
                    className="w-full mt-1 rounded-xl bg-black border border-zinc-700 px-4 py-3 outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400">Alias</label>
                  <input
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full mt-1 rounded-xl bg-black border border-zinc-700 px-4 py-3 outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400">Banco</label>
                  <input
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    className="w-full mt-1 rounded-xl bg-black border border-zinc-700 px-4 py-3 outline-none focus:border-red-600"
                  />
                </div>

                <button
                  onClick={guardar}
                  disabled={guardando}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-6 py-4 rounded-xl font-bold"
                >
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </>
            )}

          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">
              💡 Ideas para más adelante
            </h2>

            <div className="space-y-4">
              {ideas.map((idea) => (
                <div
                  key={idea.titulo}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-red-400">{idea.titulo}</h3>
                  <p className="text-zinc-400 mt-2 leading-7">
                    {idea.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
