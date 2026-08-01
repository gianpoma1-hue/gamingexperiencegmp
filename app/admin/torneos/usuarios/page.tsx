"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { UserPlus, UserX, Users } from "lucide-react";

type Torneo = {
  id: string;
  nombre: string;
  juego: string;
  jugadores_max: number;
};

type Inscripcion = {
  id: string;
  nombre: string;
  usuario: string;
  estado_pago: "pendiente" | "confirmado" | "rechazado";
};

export default function AdminUsuariosTorneoPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [torneoId, setTorneoId] = useState<string>("");

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [cargandoLista, setCargandoLista] = useState(false);

  const [usuarioNuevo, setUsuarioNuevo] = useState("");
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    cargarTorneos();
  }, []);

  useEffect(() => {
    if (torneoId) cargarInscripciones(torneoId);
  }, [torneoId]);

  async function cargarTorneos() {
    const { data } = await supabase
      .from("torneos")
      .select("id, nombre, juego, jugadores_max")
      .order("fecha", { ascending: false });

    const lista = (data as Torneo[]) || [];

    setTorneos(lista);

    if (lista.length > 0) {
      setTorneoId(lista[0].id);
    } else {
      setLoading(false);
    }
  }

  async function cargarInscripciones(idTorneo: string) {
    setCargandoLista(true);

    const { data, error } = await supabase
      .from("inscripciones")
      .select("id, nombre, usuario, estado_pago")
      .eq("torneo_id", idTorneo)
      .order("nombre", { ascending: true });

    if (!error) {
      setInscripciones((data as Inscripcion[]) || []);
    }

    setCargandoLista(false);
    setLoading(false);
  }

  async function quitarUsuario(inscripcion: Inscripcion) {
    const confirmar = window.confirm(
      `¿Sacar a ${inscripcion.nombre} (${inscripcion.usuario}) de este torneo?`
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("inscripciones")
      .delete()
      .eq("id", inscripcion.id);

    if (error) {
      alert("No se pudo eliminar al usuario.");
      return;
    }

    cargarInscripciones(torneoId);
  }

  async function agregarUsuario() {
    const nombreBuscado = usuarioNuevo.trim();

    if (!nombreBuscado) return;

    const torneo = torneos.find((t) => t.id === torneoId);

    if (!torneo) return;

    setAgregando(true);

    const { data: usuarioEncontrado } = await supabase
      .from("usuarios")
      .select("nombre, usuario")
      .ilike("usuario", nombreBuscado)
      .maybeSingle();

    if (!usuarioEncontrado) {
      setAgregando(false);
      alert(`No se encontró ningún usuario con el nombre "${nombreBuscado}".`);
      return;
    }

    const yaInscripto = inscripciones.some(
      (i) =>
        i.usuario.toLowerCase() === usuarioEncontrado.usuario.toLowerCase()
    );

    if (yaInscripto) {
      setAgregando(false);
      alert("Ese usuario ya está inscripto en este torneo.");
      return;
    }

    const inscritosNoRechazados = inscripciones.filter(
      (i) => i.estado_pago !== "rechazado"
    ).length;

    if (inscritosNoRechazados >= torneo.jugadores_max) {
      setAgregando(false);
      alert("El torneo ya está completo.");
      return;
    }

    const { error: insertError } = await supabase
      .from("inscripciones")
      .insert({
        torneo_id: torneo.id,
        nombre: usuarioEncontrado.nombre,
        usuario: usuarioEncontrado.usuario,
        estado_pago: "confirmado",
      });

    if (insertError) {
      setAgregando(false);
      alert("No se pudo agregar al usuario: " + insertError.message);
      return;
    }

    await supabase.from("notificaciones").insert({
      usuario: usuarioEncontrado.usuario,
      tipo: "agregado_torneo",
      titulo: "Estás dentro del torneo",
      contenido: `Te agregamos al torneo "${torneo.nombre}".`,
      link: "/torneos",
    });

    setUsuarioNuevo("");
    setAgregando(false);

    cargarInscripciones(torneoId);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex pt-20">
        <AdminSidebar />

        <div className="flex-1 p-5 pt-20 lg:p-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">
            Usuarios del torneo
          </h1>

          <p className="text-zinc-400 mb-8 text-sm sm:text-base">
            Mirá quién está anotado en cada torneo, sacá jugadores o
            agregalos vos mismo por su nombre de usuario.
          </p>

          {loading ? (
            <p>Cargando...</p>
          ) : torneos.length === 0 ? (
            <p className="text-zinc-500">Todavía no creaste ningún torneo.</p>
          ) : (
            <>
              <div className="mb-8 max-w-md">
                <label className="block mb-3 font-bold text-sm">
                  Torneo
                </label>

                <select
                  value={torneoId}
                  onChange={(e) => setTorneoId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3"
                >
                  {torneos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} — {t.juego}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 mb-8 max-w-xl">
                <h2 className="font-bold flex items-center gap-2 mb-4">
                  <UserPlus size={18} className="text-red-500" />
                  Agregar usuario al torneo
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={usuarioNuevo}
                    onChange={(e) => setUsuarioNuevo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && agregarUsuario()}
                    placeholder="Nombre de usuario (ej: pepito)"
                    className="flex-1 bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-red-600"
                  />

                  <button
                    onClick={agregarUsuario}
                    disabled={agregando || !usuarioNuevo.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-6 py-3 rounded-xl font-bold whitespace-nowrap"
                  >
                    {agregando ? "Agregando..." : "Agregar al torneo"}
                  </button>
                </div>
              </div>

              <h2 className="font-bold flex items-center gap-2 mb-4">
                <Users size={18} className="text-red-500" />
                Inscriptos ({inscripciones.length})
              </h2>

              {cargandoLista ? (
                <p>Cargando inscriptos...</p>
              ) : inscripciones.length === 0 ? (
                <p className="text-zinc-500">
                  Todavía no hay nadie anotado en este torneo.
                </p>
              ) : (
                <div className="space-y-3">
                  {inscripciones.map((i) => (
                    <div
                      key={i.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold">
                          {i.nombre}{" "}
                          <span className="text-zinc-500 font-normal">
                            ({i.usuario})
                          </span>
                        </p>

                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            i.estado_pago === "confirmado"
                              ? "bg-green-500/10 text-green-400 border border-green-500"
                              : i.estado_pago === "rechazado"
                              ? "bg-red-500/10 text-red-400 border border-red-500"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500"
                          }`}
                        >
                          {i.estado_pago === "confirmado"
                            ? "Pago confirmado"
                            : i.estado_pago === "rechazado"
                            ? "Pago rechazado"
                            : "Pago pendiente"}
                        </span>
                      </div>

                      <button
                        onClick={() => quitarUsuario(i)}
                        title="Sacar del torneo"
                        className="flex items-center gap-2 bg-zinc-800 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0"
                      >
                        <UserX size={14} />
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
