"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import DMChat from "@/components/mensajes/DMChat";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Check,
  X as XIcon,
  Trophy,
} from "lucide-react";

type Amigo = {
  id: string;
  usuario_solicitante: string;
  usuario_receptor: string;
  estado: string;
  created_at: string;
};

type DMensaje = {
  id: string;
  conversacion_id: string;
  remitente: string;
  destinatario: string;
  es_admin: boolean;
  contenido: string | null;
  imagen_url: string | null;
  leido: boolean;
  created_at: string;
};

function conversacionEntre(a: string, b: string) {
  return [a, b].sort().join("::");
}

export default function MensajesPage() {
  const { user } = useAuth();

  const [miUsuario, setMiUsuario] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [mensajes, setMensajes] = useState<DMensaje[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);

  const [chatAbierto, setChatAbierto] = useState<{
    conversacionId: string;
    destinatario: string;
    otherLabel: string;
    esSoporte?: boolean;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    obtenerUsuario();
  }, [user]);

  useEffect(() => {
    if (!miUsuario) return;
    cargarTodo();
    const intervalo = setInterval(cargarTodo, 8000);
    return () => clearInterval(intervalo);
  }, [miUsuario]);

  async function obtenerUsuario() {
    const { data } = await supabase
      .from("usuarios")
      .select("usuario")
      .eq("id", user!.id)
      .single();

    setMiUsuario(data?.usuario ?? null);
  }

  async function cargarTodo() {
    const { data: amigosData } = await supabase
      .from("amigos")
      .select("*")
      .or(`usuario_solicitante.eq.${miUsuario},usuario_receptor.eq.${miUsuario}`)
      .order("created_at", { ascending: false });

    const listaAmigos = (amigosData as Amigo[]) || [];
    setAmigos(listaAmigos);

    const amistades = listaAmigos.filter((a) => a.estado === "aceptada");
    const conversaciones = [
      `soporte::${miUsuario}`,
      ...amistades.map((a) =>
        conversacionEntre(a.usuario_solicitante, a.usuario_receptor)
      ),
    ];

    const { data: mensajesData } = await supabase
      .from("mensajes_directos")
      .select("*")
      .in("conversacion_id", conversaciones)
      .order("created_at", { ascending: true });

    setMensajes((mensajesData as DMensaje[]) || []);
    setLoading(false);
  }

  async function buscarUsuarios() {
    if (!busqueda.trim()) {
      setResultados([]);
      return;
    }

    setBuscando(true);

    const { data } = await supabase
      .from("usuarios")
      .select("usuario")
      .ilike("usuario", `%${busqueda.trim()}%`)
      .neq("usuario", miUsuario)
      .limit(8);

    setResultados((data ?? []).map((u: any) => u.usuario).filter(Boolean));
    setBuscando(false);
  }

  async function enviarSolicitud(usuario: string) {
    const yaExiste = amigos.some(
      (a) =>
        (a.usuario_solicitante === miUsuario && a.usuario_receptor === usuario) ||
        (a.usuario_receptor === miUsuario && a.usuario_solicitante === usuario)
    );

    if (yaExiste) {
      alert("Ya existe una solicitud o amistad con ese usuario.");
      return;
    }

    const { error } = await supabase.from("amigos").insert({
      usuario_solicitante: miUsuario,
      usuario_receptor: usuario,
      estado: "pendiente",
    });

    if (error) {
      alert("No se pudo enviar la solicitud.");
      return;
    }

    await supabase.from("notificaciones").insert({
      usuario,
      tipo: "solicitud_amistad",
      titulo: "Nueva solicitud de amistad",
      contenido: `${miUsuario} quiere agregarte como amigo`,
      link: "/mensajes",
    });

    setResultados((prev) => prev.filter((u) => u !== usuario));
    cargarTodo();
  }

  async function responderSolicitud(id: string, estado: "aceptada" | "rechazada") {
    const solicitud = amigos.find((a) => a.id === id);

    const { error } = await supabase
      .from("amigos")
      .update({ estado })
      .eq("id", id);

    if (error) {
      alert("No se pudo actualizar la solicitud.");
      return;
    }

    if (estado === "aceptada" && solicitud) {
      await supabase.from("notificaciones").insert({
        usuario: solicitud.usuario_solicitante,
        tipo: "solicitud_amistad",
        titulo: "Solicitud de amistad aceptada",
        contenido: `${miUsuario} aceptó tu solicitud de amistad`,
        link: "/mensajes",
      });
    }

    cargarTodo();
  }

  const solicitudesRecibidas = amigos.filter(
    (a) => a.estado === "pendiente" && a.usuario_receptor === miUsuario
  );

  const amistades = amigos.filter((a) => a.estado === "aceptada");

  const conversacionesAmigos = useMemo(() => {
    return amistades
      .map((a) => {
        const otro =
          a.usuario_solicitante === miUsuario
            ? a.usuario_receptor
            : a.usuario_solicitante;

        const conversacionId = conversacionEntre(a.usuario_solicitante, a.usuario_receptor);

        const mensajesConv = mensajes.filter(
          (m) => m.conversacion_id === conversacionId
        );

        const ultimo = mensajesConv[mensajesConv.length - 1];
        const sinLeer = mensajesConv.filter(
          (m) => !m.leido && m.destinatario === miUsuario
        ).length;

        return { otro, conversacionId, ultimo, sinLeer };
      })
      .sort((a, b) => {
        const ta = a.ultimo ? new Date(a.ultimo.created_at).getTime() : 0;
        const tb = b.ultimo ? new Date(b.ultimo.created_at).getTime() : 0;
        return tb - ta;
      });
  }, [amistades, mensajes, miUsuario]);

  const soporteMensajes = mensajes.filter(
    (m) => m.conversacion_id === `soporte::${miUsuario}`
  );
  const soporteUltimo = soporteMensajes[soporteMensajes.length - 1];
  const soporteSinLeer = soporteMensajes.filter(
    (m) => !m.leido && m.destinatario === miUsuario
  ).length;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-5xl font-black">Mensajes</h1>
        <p className="text-zinc-400 mt-3">
          Hablá con otros jugadores y con el soporte del torneo.
        </p>

        {loading ? (
          <p className="mt-10 text-zinc-500">Cargando...</p>
        ) : (
          <div className="mt-10 space-y-10">
            {/* SOPORTE / ADMIN */}
            <button
              onClick={() =>
                setChatAbierto({
                  conversacionId: `soporte::${miUsuario}`,
                  destinatario: "ADMIN",
                  otherLabel: "Soporte (Admin)",
                  esSoporte: true,
                })
              }
              className="w-full text-left bg-emerald-950/30 border border-emerald-700/50 hover:border-emerald-500 rounded-2xl p-6 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-emerald-700/30 border border-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} className="text-emerald-400" />
                </div>

                <div className="min-w-0">
                  <p className="font-bold flex items-center gap-2">
                    Soporte / Reclamar premio
                    <Trophy size={14} className="text-yellow-500" />
                  </p>
                  <p className="text-zinc-400 text-sm truncate">
                    {soporteUltimo
                      ? soporteUltimo.contenido ??
                        (soporteUltimo.imagen_url ? "Foto enviada" : "")
                      : "¿Ganaste un torneo? Escribinos para coordinar tu premio."}
                  </p>
                </div>
              </div>

              {soporteSinLeer > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                  {soporteSinLeer}
                </span>
              )}
            </button>

            {/* BUSCAR / AGREGAR AMIGOS */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-red-500" />
                Agregar amigos
              </h2>

              <div className="flex gap-3">
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && buscarUsuarios()}
                  placeholder="Buscar por nombre de usuario..."
                  className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-red-600"
                />

                <button
                  onClick={buscarUsuarios}
                  disabled={buscando}
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-5 flex items-center gap-2 font-semibold disabled:opacity-60"
                >
                  <Search size={16} />
                  Buscar
                </button>
              </div>

              {resultados.length > 0 && (
                <div className="mt-4 space-y-2">
                  {resultados.map((usuario) => (
                    <div
                      key={usuario}
                      className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                    >
                      <span className="font-semibold">{usuario}</span>

                      <button
                        onClick={() => enviarSolicitud(usuario)}
                        className="text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <UserPlus size={14} />
                        Agregar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SOLICITUDES RECIBIDAS */}
            {solicitudesRecibidas.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Solicitudes de amistad
                </h2>

                <div className="space-y-2">
                  {solicitudesRecibidas.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                    >
                      <span className="font-semibold">
                        {s.usuario_solicitante}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => responderSolicitud(s.id, "aceptada")}
                          className="rounded-lg bg-emerald-700 hover:bg-emerald-600 p-2"
                          title="Aceptar"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          onClick={() => responderSolicitud(s.id, "rechazada")}
                          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 p-2"
                          title="Rechazar"
                        >
                          <XIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONVERSACIONES CON AMIGOS */}
            <div>
              <h2 className="text-xl font-bold mb-4">Tus chats</h2>

              {conversacionesAmigos.length === 0 ? (
                <p className="text-zinc-500 text-sm">
                  Todavía no tenés amigos agregados. Buscalos arriba para
                  empezar a chatear.
                </p>
              ) : (
                <div className="space-y-2">
                  {conversacionesAmigos.map((c) => (
                    <button
                      key={c.conversacionId}
                      onClick={() =>
                        setChatAbierto({
                          conversacionId: c.conversacionId,
                          destinatario: c.otro,
                          otherLabel: c.otro,
                        })
                      }
                      className="w-full text-left flex items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 hover:border-red-600/60 rounded-xl px-4 py-3 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center font-bold shrink-0">
                          {c.otro.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold truncate">{c.otro}</p>
                          <p className="text-zinc-400 text-xs truncate">
                            {c.ultimo
                              ? c.ultimo.contenido ??
                                (c.ultimo.imagen_url ? "Foto enviada" : "")
                              : "Todavía no hay mensajes"}
                          </p>
                        </div>
                      </div>

                      {c.sinLeer > 0 && (
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                          {c.sinLeer}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {chatAbierto && miUsuario && (
        <DMChat
          conversacionId={chatAbierto.conversacionId}
          miUsuario={miUsuario}
          destinatario={chatAbierto.destinatario}
          otherLabel={chatAbierto.otherLabel}
          esSoporte={chatAbierto.esSoporte}
          onClose={() => {
            setChatAbierto(null);
            cargarTodo();
          }}
        />
      )}
    </main>
  );
}

