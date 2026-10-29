"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { Check, ImagePlus, Pencil, Trash2, UserPlus, UserX, Users, X } from "lucide-react";

type Torneo = {
  id: string;
  nombre: string;
  juego: string;
  jugadores_max: number;
  modalidad?: "individual" | "equipo";
};

type Inscripcion = {
  id: string;
  nombre: string;
  usuario: string;
  equipo?: string | null;
  escudo_url?: string | null;
  estado_pago: "pendiente" | "confirmado" | "rechazado";
};

export default function AdminUsuariosTorneoPage() {
  return (
    <Suspense fallback={null}>
      <AdminUsuariosTorneoContenido />
    </Suspense>
  );
}

function AdminUsuariosTorneoContenido() {
  const searchParams = useSearchParams();
  const torneoDesdeUrl = searchParams.get("torneo");

  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [torneoId, setTorneoId] = useState<string>("");

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [cargandoLista, setCargandoLista] = useState(false);

  const [usuarioNuevo, setUsuarioNuevo] = useState("");
  const [agregando, setAgregando] = useState(false);
  const [subiendoEscudoId, setSubiendoEscudoId] = useState<string | null>(null);

  const [equipoNuevo, setEquipoNuevo] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreEditando, setNombreEditando] = useState("");
  const [guardandoNombre, setGuardandoNombre] = useState(false);

  useEffect(() => {
    cargarTorneos();
  }, []);

  useEffect(() => {
    if (torneoId) cargarInscripciones(torneoId);
  }, [torneoId]);

  async function cargarTorneos() {
    const { data } = await supabase
      .from("torneos")
      .select("id, nombre, juego, jugadores_max, modalidad")
      .order("fecha", { ascending: false });

    const lista = (data as Torneo[]) || [];

    setTorneos(lista);

    if (torneoDesdeUrl && lista.some((t) => t.id === torneoDesdeUrl)) {
      setTorneoId(torneoDesdeUrl);
    } else if (lista.length > 0) {
      setTorneoId(lista[0].id);
    } else {
      setLoading(false);
    }
  }

  async function cargarInscripciones(idTorneo: string) {
    setCargandoLista(true);

    const { data, error } = await supabase
      .from("inscripciones")
      .select("*")
      .eq("torneo_id", idTorneo)
      .order("nombre", { ascending: true });

    if (!error) {
      setInscripciones((data as Inscripcion[]) || []);
    }

    setCargandoLista(false);
    setLoading(false);
  }

  // Actualiza una inscripción y avisa si Supabase no dejó guardar el cambio.
  // (Cuando faltan permisos, Supabase no da error: simplemente no modifica nada.)
  async function actualizarInscripcion(
    inscripcionId: string,
    cambios: { escudo_url?: string | null; equipo?: string | null }
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("inscripciones")
      .update(cambios)
      .eq("id", inscripcionId)
      .select("id");

    if (error) {
      alert("No se pudo guardar el cambio: " + error.message);
      return false;
    }

    if (!data || data.length === 0) {
      alert(
        "Supabase no permitió modificar esta inscripción (falta el permiso de admin). Ejecutá el SQL \"permisos-admin-inscripciones\" en Supabase y probá de nuevo."
      );
      return false;
    }

    return true;
  }

  function empezarEdicionNombre(i: Inscripcion) {
    setEditandoId(i.id);
    setNombreEditando(i.equipo ?? "");
  }

  async function guardarNombreEquipo(i: Inscripcion) {
    const nuevo = nombreEditando.trim();

    if (!nuevo) {
      alert("Ingresá un nombre para el equipo.");
      return;
    }

    if (nuevo === (i.equipo ?? "")) {
      setEditandoId(null);
      return;
    }

    const repetido = inscripciones.some(
      (x) =>
        x.id !== i.id &&
        (x.equipo ?? x.usuario).toLowerCase() === nuevo.toLowerCase()
    );

    if (repetido) {
      alert("Ya hay otro equipo con ese nombre en este torneo.");
      return;
    }

    setGuardandoNombre(true);

    // En los partidos el equipo figura con su nombre de equipo,
    // o con su usuario si todavía no tenía nombre.
    const nombreViejo = i.equipo ?? i.usuario;

    const ok = await actualizarInscripcion(i.id, { equipo: nuevo });

    if (!ok) {
      setGuardandoNombre(false);
      return;
    }

    // Si la llave ya está armada, actualizamos el nombre también ahí.
    const resultados = await Promise.all([
      supabase
        .from("partidos")
        .update({ jugador1: nuevo })
        .eq("torneo_id", torneoId)
        .eq("jugador1", nombreViejo),
      supabase
        .from("partidos")
        .update({ jugador2: nuevo })
        .eq("torneo_id", torneoId)
        .eq("jugador2", nombreViejo),
      supabase
        .from("partidos")
        .update({ ganador: nuevo })
        .eq("torneo_id", torneoId)
        .eq("ganador", nombreViejo),
      supabase
        .from("torneos")
        .update({ campeon: nuevo })
        .eq("id", torneoId)
        .eq("campeon", nombreViejo),
    ]);

    const falla = resultados.find((r) => r.error);

    if (falla?.error) {
      alert(
        "Se guardó el nombre, pero no se pudo actualizar en la llave: " +
          falla.error.message
      );
    }

    setInscripciones((prev) =>
      prev.map((x) => (x.id === i.id ? { ...x, equipo: nuevo } : x))
    );

    setGuardandoNombre(false);
    setEditandoId(null);
  }

  async function subirEscudo(inscripcion: Inscripcion, archivo: File | undefined) {
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      alert("Elegí un archivo de imagen (PNG, JPG, WEBP...).");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert("La imagen no puede pesar más de 5MB.");
      return;
    }

    setSubiendoEscudoId(inscripcion.id);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const adminId = authData.user?.id;

      if (!adminId) {
        alert("Tu sesión venció. Volvé a iniciar sesión.");
        return;
      }

      const extension = archivo.name.split(".").pop() || "png";
      const ruta = `${adminId}/escudo-${inscripcion.id}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(ruta, archivo, { upsert: true });

      if (uploadError) {
        alert("No se pudo subir el escudo: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(ruta);

      const nuevaUrl = publicUrlData.publicUrl;

      const guardado = await actualizarInscripcion(inscripcion.id, {
        escudo_url: nuevaUrl,
      });

      if (!guardado) return;

      setInscripciones((prev) =>
        prev.map((x) =>
          x.id === inscripcion.id ? { ...x, escudo_url: nuevaUrl } : x
        )
      );
    } finally {
      setSubiendoEscudoId(null);
    }
  }

  async function quitarEscudo(inscripcion: Inscripcion) {
    const confirmar = window.confirm(
      `¿Sacar el escudo del equipo "${inscripcion.equipo ?? inscripcion.nombre}"?`
    );

    if (!confirmar) return;

    const guardado = await actualizarInscripcion(inscripcion.id, {
      escudo_url: null,
    });

    if (!guardado) return;

    setInscripciones((prev) =>
      prev.map((x) =>
        x.id === inscripcion.id ? { ...x, escudo_url: null } : x
      )
    );
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

    const equipoParaAgregar =
      torneo.modalidad === "equipo" ? equipoNuevo.trim() : "";

    if (
      equipoParaAgregar &&
      inscripciones.some(
        (i) =>
          (i.equipo ?? i.usuario).toLowerCase() ===
          equipoParaAgregar.toLowerCase()
      )
    ) {
      setAgregando(false);
      alert("Ya hay otro equipo con ese nombre en este torneo.");
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
        ...(equipoParaAgregar ? { equipo: equipoParaAgregar } : {}),
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
    setEquipoNuevo("");
    setAgregando(false);

    cargarInscripciones(torneoId);
  }

  const torneoActual = torneos.find((t) => t.id === torneoId);
  const esEquipo = torneoActual?.modalidad === "equipo";

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

                {esEquipo && (
                  <input
                    value={equipoNuevo}
                    onChange={(e) => setEquipoNuevo(e.target.value)}
                    placeholder="Nombre del equipo (opcional)"
                    className="mb-3 w-full bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-red-600"
                  />
                )}

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
                      <div className="flex items-center gap-4 min-w-0">
                        {(esEquipo || i.equipo || i.escudo_url) && (
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-black flex items-center justify-center">
                            {i.escudo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={i.escudo_url}
                                alt={`Escudo de ${i.equipo ?? i.nombre}`}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <Users size={22} className="text-zinc-600" />
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-bold">
                            {i.nombre}{" "}
                            <span className="text-zinc-500 font-normal">
                              ({i.usuario})
                            </span>
                          </p>

                          {esEquipo || i.equipo ? (
                            editandoId === i.id ? (
                              <div className="mt-1 mb-2 flex flex-wrap items-center gap-2">
                                <input
                                  autoFocus
                                  value={nombreEditando}
                                  onChange={(e) => setNombreEditando(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") guardarNombreEquipo(i);
                                    if (e.key === "Escape") setEditandoId(null);
                                  }}
                                  placeholder="Nombre del equipo"
                                  className="w-56 max-w-full rounded-lg bg-black border border-zinc-700 px-3 py-1.5 text-sm outline-none focus:border-red-600"
                                />

                                <button
                                  onClick={() => guardarNombreEquipo(i)}
                                  disabled={guardandoNombre}
                                  title="Guardar nombre"
                                  className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold hover:bg-green-500 disabled:opacity-60"
                                >
                                  <Check size={14} />
                                  {guardandoNombre ? "Guardando..." : "Guardar"}
                                </button>

                                <button
                                  onClick={() => setEditandoId(null)}
                                  disabled={guardandoNombre}
                                  title="Cancelar"
                                  className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                                >
                                  <X size={14} />
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <p className="mt-1 mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                                <Users size={14} className="text-red-500 shrink-0" />
                                <span className="text-zinc-500">Equipo:</span>
                                {i.equipo ? (
                                  <span className="font-semibold text-white">
                                    {i.equipo}
                                  </span>
                                ) : (
                                  <span className="italic text-zinc-500">
                                    Sin nombre
                                  </span>
                                )}

                                <button
                                  onClick={() => empezarEdicionNombre(i)}
                                  title="Editar nombre del equipo"
                                  className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                  <Pencil size={12} />
                                  {i.equipo ? "Editar" : "Poner nombre"}
                                </button>
                              </p>
                            )
                          ) : null}

                          <div className="flex flex-wrap items-center gap-2">
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

                            {(esEquipo || i.equipo) && (
                              <>
                                <label
                                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-0.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 ${
                                    subiendoEscudoId === i.id
                                      ? "pointer-events-none opacity-60"
                                      : ""
                                  }`}
                                >
                                  <ImagePlus size={12} />
                                  {subiendoEscudoId === i.id
                                    ? "Subiendo..."
                                    : i.escudo_url
                                    ? "Cambiar escudo"
                                    : "Subir escudo"}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      subirEscudo(i, e.target.files?.[0]);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>

                                {i.escudo_url && (
                                  <button
                                    onClick={() => quitarEscudo(i)}
                                    title="Quitar escudo"
                                    className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-0.5 text-xs font-semibold text-zinc-400 transition hover:border-red-600 hover:text-red-400"
                                  >
                                    <Trash2 size={12} />
                                    Quitar escudo
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
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
