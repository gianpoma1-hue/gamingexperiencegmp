"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import DMChat from "@/components/mensajes/DMChat";
import { ImageIcon } from "lucide-react";

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

type Hilo = {
  usuario: string;
  conversacionId: string;
  ultimo: DMensaje;
  sinLeer: number;
};

export default function AdminSoportePage() {
  const { user } = useAuth();

  const [miUsuarioAdmin, setMiUsuarioAdmin] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<DMensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiloAbierto, setHiloAbierto] = useState<Hilo | null>(null);

  useEffect(() => {
    if (!user) return;
    obtenerUsuario();
  }, [user]);

  useEffect(() => {
    if (!miUsuarioAdmin) return;
    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 6000);
    return () => clearInterval(intervalo);
  }, [miUsuarioAdmin]);

  async function obtenerUsuario() {
    const { data } = await supabase
      .from("usuarios")
      .select("usuario")
      .eq("id", user!.id)
      .single();

    setMiUsuarioAdmin(data?.usuario ?? "Admin");
  }

  async function cargarMensajes() {
    const { data, error } = await supabase
      .from("mensajes_directos")
      .select("*")
      .like("conversacion_id", "soporte::%")
      .order("created_at", { ascending: true });

    if (!error) {
      setMensajes((data as DMensaje[]) || []);
    }

    setLoading(false);
  }

  const hilos = useMemo(() => {
    const mapa = new Map<string, Hilo>();

    for (const m of mensajes) {
      const usuario = m.conversacion_id.replace("soporte::", "");
      const existente = mapa.get(usuario);

      if (!existente) {
        mapa.set(usuario, {
          usuario,
          conversacionId: m.conversacion_id,
          ultimo: m,
          sinLeer: !m.es_admin && !m.leido ? 1 : 0,
        });
      } else {
        existente.ultimo = m;
        if (!m.es_admin && !m.leido) existente.sinLeer += 1;
      }
    }

    return Array.from(mapa.values()).sort(
      (a, b) =>
        new Date(b.ultimo.created_at).getTime() -
        new Date(a.ultimo.created_at).getTime()
    );
  }, [mensajes]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex pt-20">
        <AdminSidebar />

        <div className="flex-1 p-5 pt-20 lg:p-10">
          <h1 className="text-5xl font-black mb-2">Soporte</h1>

          <p className="text-zinc-400 mb-10">
            Consultas y reclamos de premio de los usuarios.
          </p>

          {loading ? (
            <p>Cargando...</p>
          ) : hilos.length === 0 ? (
            <p className="text-zinc-500">
              Todavía no llegó ningún mensaje al soporte.
            </p>
          ) : (
            <div className="space-y-4">
              {hilos.map((hilo) => (
                <button
                  key={hilo.usuario}
                  onClick={() => setHiloAbierto(hilo)}
                  className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-emerald-600/60 rounded-2xl p-6 transition flex items-center justify-between gap-6"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-lg truncate">
                      {hilo.usuario}
                    </p>

                    <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2 truncate">
                      {hilo.ultimo.imagen_url && (
                        <ImageIcon size={14} className="shrink-0" />
                      )}
                      <span className="truncate">
                        {hilo.ultimo.es_admin ? "Vos: " : ""}
                        {hilo.ultimo.contenido ??
                          (hilo.ultimo.imagen_url ? "Envió una foto" : "")}
                      </span>
                    </p>
                  </div>

                  {hilo.sinLeer > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                      {hilo.sinLeer}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {hiloAbierto && miUsuarioAdmin && (
        <DMChat
          conversacionId={hiloAbierto.conversacionId}
          miUsuario={miUsuarioAdmin}
          destinatario={hiloAbierto.usuario}
          otherLabel={hiloAbierto.usuario}
          esAdmin
          esSoporte
          onClose={() => {
            setHiloAbierto(null);
            cargarMensajes();
          }}
        />
      )}
    </main>
  );
}

