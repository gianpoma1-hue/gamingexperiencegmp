"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function MessagesBell() {
  const router = useRouter();
  const { user } = useAuth();

  const [miUsuario, setMiUsuario] = useState<string | null>(null);
  const [noLeidos, setNoLeidos] = useState(0);

  useEffect(() => {
    if (!user) return;
    obtenerUsuario();
  }, [user]);

  useEffect(() => {
    if (!miUsuario) return;

    cargarNoLeidos();
    const intervalo = setInterval(cargarNoLeidos, 15000);
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

  async function cargarNoLeidos() {
    const { count } = await supabase
      .from("mensajes_directos")
      .select("*", { count: "exact", head: true })
      .eq("destinatario", miUsuario)
      .eq("leido", false);

    setNoLeidos(count || 0);
  }

  if (!miUsuario) return null;

  return (
    <button
      onClick={() => router.push("/mensajes")}
      title="Mensajes"
      className="relative w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-red-600 transition"
    >
      <MessageSquare size={18} />

      {noLeidos > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {noLeidos > 9 ? "9+" : noLeidos}
        </span>
      )}
    </button>
  );
}

