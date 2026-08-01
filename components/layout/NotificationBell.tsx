"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Notificacion = {
  id: string;
  tipo: string;
  titulo: string;
  contenido: string | null;
  link: string | null;
  leida: boolean;
  created_at: string;
};

const iconoPorTipo: Record<string, string> = {
  mensaje: "💬",
  torneo_nuevo: "🆕",
  torneo_pronto: "⏰",
  pago_transferido: "💸",
  agregado_torneo: "🎮",
};

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();

  const [miUsuario, setMiUsuario] = useState<string | null>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!user) return;
    obtenerUsuario();
  }, [user]);

  useEffect(() => {
    if (!miUsuario) return;

    cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 15000);
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

  async function cargarNotificaciones() {
    const { data } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("usuario", miUsuario)
      .order("created_at", { ascending: false })
      .limit(20);

    setNotificaciones((data as Notificacion[]) || []);
  }

  async function marcarComoLeida(n: Notificacion) {
    if (!n.leida) {
      await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("id", n.id);

      setNotificaciones((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x))
      );
    }

    setAbierto(false);

    if (n.link) {
      router.push(n.link);
    }
  }

  async function marcarTodasComoLeidas() {
    const idsNoLeidas = notificaciones
      .filter((n) => !n.leida)
      .map((n) => n.id);

    if (idsNoLeidas.length === 0) return;

    await supabase
      .from("notificaciones")
      .update({ leida: true })
      .in("id", idsNoLeidas);

    setNotificaciones((prev) =>
      prev.map((n) => ({ ...n, leida: true }))
    );
  }

  async function borrarHistorial() {
    if (notificaciones.length === 0) return;

    const confirmar = window.confirm(
      "¿Borrar todo el historial de notificaciones? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("notificaciones")
      .delete()
      .eq("usuario", miUsuario);

    if (error) {
      alert("No se pudo borrar el historial: " + error.message);
      return;
    }

    setNotificaciones([]);
  }

  if (!miUsuario) return null;

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        className="relative w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-red-600 transition"
      >
        <Bell size={18} />

        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50">

          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="font-bold text-sm">Notificaciones</span>

            <div className="flex items-center gap-3">
              {noLeidas > 0 && (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Marcar todas como leídas
                </button>
              )}

              {notificaciones.length > 0 && (
                <button
                  onClick={borrarHistorial}
                  title="Borrar todo el historial"
                  className="text-zinc-500 hover:text-red-400 transition"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <p className="text-center text-zinc-500 text-sm py-10 px-4">
                No tenés notificaciones todavía.
              </p>
            ) : (
              notificaciones.map((n) => (
                <button
                  key={n.id}
                  onClick={() => marcarComoLeida(n)}
                  className={`block w-full text-left px-4 py-3 border-b border-zinc-800/60 hover:bg-zinc-800 transition ${
                    n.leida ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span>{iconoPorTipo[n.tipo] ?? "🔔"}</span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {n.titulo}
                      </p>

                      {n.contenido && (
                        <p className="text-xs text-zinc-400 truncate">
                          {n.contenido}
                        </p>
                      )}

                      <p className="text-[11px] text-zinc-600 mt-1">
                        {new Date(n.created_at).toLocaleString("es-AR")}
                      </p>
                    </div>

                    {!n.leida && (
                      <span className="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
