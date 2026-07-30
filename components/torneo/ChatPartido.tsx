"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Mensaje = {
  id: string;
  autor_usuario: string;
  contenido: string;
  created_at: string;
};

export default function ChatPartido({
  partidoId,
  miUsuario,
  rival,
  onClose,
}: {
  partidoId: string;
  miUsuario: string;
  rival: string;
  onClose: () => void;
}) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 4000);
    return () => clearInterval(intervalo);
  }, [partidoId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function cargarMensajes() {
    const { data } = await supabase
      .from("mensajes_partido")
      .select("*")
      .eq("partido_id", partidoId)
      .order("created_at", { ascending: true });

    setMensajes((data as Mensaje[]) || []);
  }

  async function enviar() {
    if (!texto.trim()) return;

    setEnviando(true);

    const { error } = await supabase.from("mensajes_partido").insert({
      partido_id: partidoId,
      autor_usuario: miUsuario,
      contenido: texto.trim(),
    });

    setEnviando(false);

    if (error) {
      alert("No se pudo enviar el mensaje.");
      return;
    }

    setTexto("");
    cargarMensajes();
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 flex flex-col max-h-[80vh]">

        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <p className="text-xs text-zinc-500">Chat del partido</p>
            <p className="font-bold">vs {rival}</p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {mensajes.length === 0 && (
            <p className="text-center text-zinc-500 text-sm mt-8">
              Todavía no hay mensajes. Escribile a tu rival para coordinar el partido o pasarle tu ID.
            </p>
          )}

          {mensajes.map((m) => {
            const esMio = m.autor_usuario === miUsuario;

            return (
              <div key={m.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${esMio ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-200"}`}>
                  {m.contenido}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-zinc-800 p-4 flex gap-3">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Escribí un mensaje..."
            className="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm outline-none focus:border-red-600"
          />

          <button
            onClick={enviar}
            disabled={enviando}
            className="rounded-xl bg-red-600 hover:bg-red-700 px-4 flex items-center justify-center disabled:opacity-60"
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
