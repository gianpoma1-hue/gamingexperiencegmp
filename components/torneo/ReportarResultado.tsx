"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send, Paperclip, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ReporteMensaje = {
  id: string;
  autor_usuario: string;
  es_admin: boolean;
  mensaje: string | null;
  imagen_url: string | null;
  leido: boolean;
  created_at: string;
};

export default function ReportarResultado({
  partidoId,
  torneoId,
  miUsuario,
  rival,
  esAdmin = false,
  onClose,
}: {
  partidoId: string;
  torneoId: string;
  miUsuario: string;
  rival?: string;
  esAdmin?: boolean;
  onClose: () => void;
}) {
  const [mensajes, setMensajes] = useState<ReporteMensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!archivo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(archivo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  async function cargarMensajes() {
    const { data, error } = await supabase
      .from("reportes_resultado")
      .select("*")
      .eq("partido_id", partidoId)
      .order("created_at", { ascending: true });

    if (!error) {
      setMensajes((data as ReporteMensaje[]) || []);

      // Si el admin abre el chat, marcamos como leídos los mensajes de los jugadores
      if (esAdmin) {
        const idsSinLeer = (data as ReporteMensaje[] | null)
          ?.filter((m) => !m.es_admin && !m.leido)
          .map((m) => m.id);

        if (idsSinLeer && idsSinLeer.length > 0) {
          await supabase
            .from("reportes_resultado")
            .update({ leido: true })
            .in("id", idsSinLeer);
        }
      }
    }
  }

  function elegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Solo se pueden adjuntar imágenes.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("La imagen es muy pesada. Máximo 8MB.");
      return;
    }

    setArchivo(file);
  }

  async function enviar() {
    if (!texto.trim() && !archivo) return;

    setEnviando(true);

    let imagenUrl: string | null = null;

    try {
      if (archivo) {
        const extension = archivo.name.split(".").pop();
        const ruta = `${partidoId}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("comprobantes")
          .upload(ruta, archivo);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("comprobantes")
          .getPublicUrl(ruta);

        imagenUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("reportes_resultado").insert({
        partido_id: partidoId,
        torneo_id: torneoId,
        autor_usuario: miUsuario,
        es_admin: esAdmin,
        mensaje: texto.trim() || null,
        imagen_url: imagenUrl,
      });

      if (error) throw error;

      setTexto("");
      setArchivo(null);
      await cargarMensajes();
    } catch (error: any) {
      alert(error.message || "No se pudo enviar el reporte.");
    } finally {
      setEnviando(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 flex flex-col max-h-[85vh]">

        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-red-500" />
            <div>
              <p className="text-xs text-zinc-500">
                Reportar resultado al admin
              </p>
              <p className="font-bold">
                {rival ? `vs ${rival}` : "Comprobante del partido"}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {mensajes.length === 0 && (
            <p className="text-center text-zinc-500 text-sm mt-8">
              Contanos cómo terminó el partido y adjuntá una foto de la
              pantalla final como comprobante. El admin va a revisarlo y
              cargar el resultado oficial.
            </p>
          )}

          {mensajes.map((m) => {
            const esMio = m.autor_usuario === miUsuario && m.es_admin === esAdmin;

            return (
              <div
                key={m.id}
                className={`flex ${esMio ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    m.es_admin
                      ? "bg-emerald-700/80 text-white"
                      : esMio
                      ? "bg-red-600 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {m.es_admin && (
                    <p className="text-[10px] font-bold uppercase text-emerald-200 mb-1">
                      Admin
                    </p>
                  )}

                  {!m.es_admin && !esMio && (
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">
                      {m.autor_usuario}
                    </p>
                  )}

                  {m.imagen_url && (
                    <a href={m.imagen_url} target="_blank" rel="noreferrer">
                      <img
                        src={m.imagen_url}
                        alt="Comprobante del partido"
                        className="rounded-lg mb-2 max-h-64 object-cover border border-black/20"
                      />
                    </a>
                  )}

                  {m.mensaje && <p>{m.mensaje}</p>}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {previewUrl && (
          <div className="px-5 pt-3">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="h-20 rounded-lg border border-zinc-700"
              />
              <button
                onClick={() => setArchivo(null)}
                className="absolute -top-2 -right-2 bg-black rounded-full border border-zinc-700 p-1"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-zinc-800 p-4 flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={elegirArchivo}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 flex items-center justify-center shrink-0"
            title="Adjuntar foto"
            type="button"
          >
            <Paperclip size={18} />
          </button>

          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Ej: Ganamos 3-1, te dejo la foto..."
            className="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm outline-none focus:border-red-600 min-w-0"
          />

          <button
            onClick={enviar}
            disabled={enviando || (!texto.trim() && !archivo)}
            className="rounded-xl bg-red-600 hover:bg-red-700 px-4 flex items-center justify-center disabled:opacity-60 shrink-0"
          >
            {enviando ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

