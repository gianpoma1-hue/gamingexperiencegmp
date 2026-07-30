"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import {
  Trophy,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Target,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

interface Usuario {
  nombre: string;
  usuario: string;
  email: string;
  plataforma: string;
  partidos_jugados: number;
  victorias: number;
  derrotas: number;
  goles_favor: number;
  goles_contra: number;
  torneos_ganados: number;
}

export default function PerfilPage() {
  const router = useRouter();

  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, []);

  async function cargarPerfil() {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", authUser.email)
      .single();

    if (data) {
      setUser(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black text-white pt-28 flex items-center justify-center">
          <p className="text-zinc-400">Cargando perfil...</p>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black text-white pt-28 flex items-center justify-center">
          <p>No se encontró el perfil.</p>
        </main>
      </>
    );
  }

  const efectividad =
    user.partidos_jugados > 0
      ? Math.round((user.victorias / user.partidos_jugados) * 100)
      : 0;

  const stats = [
    {
      label: "Torneos Ganados",
      value: user.torneos_ganados,
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border-yellow-400/20",
    },
    {
      label: "Partidos Jugados",
      value: user.partidos_jugados,
      icon: Gamepad2,
      color: "text-red-500",
      bg: "bg-red-600/10 border-red-600/20",
    },
    {
      label: "Efectividad",
      value: `${efectividad}%`,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Victorias",
      value: user.victorias,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      label: "Derrotas",
      value: user.derrotas,
      icon: XCircle,
      color: "text-zinc-400",
      bg: "bg-zinc-500/10 border-zinc-500/20",
    },
    {
      label: "Goles a Favor",
      value: user.goles_favor,
      icon: Target,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Goles en Contra",
      value: user.goles_contra,
      icon: ShieldAlert,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Encabezado de perfil */}
          <div className="relative rounded-3xl border border-zinc-800 bg-zinc-900">

            <div
              className="h-48 md:h-56 relative rounded-t-3xl overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(220,38,38,.25), transparent 55%), radial-gradient(circle at 80% 0%, rgba(37,99,235,.15), transparent 50%), #0a0a0a",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>

            <div className="px-8 md:px-10 pb-8">

              <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between -mt-16 gap-6">

                <div className="flex items-end gap-6">
                  <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-2xl bg-red-600 ring-4 ring-zinc-900 flex items-center justify-center text-5xl font-black shadow-[0_0_40px_rgba(220,38,38,.35)]">
                    {user.usuario.charAt(0).toUpperCase()}
                  </div>

                  <div className="pb-1">
                    <h1 className="text-3xl md:text-4xl font-black">
                      {user.usuario}
                    </h1>
                    <p className="text-zinc-400 mt-1">
                      {user.nombre}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pb-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm font-semibold text-zinc-300">
                    🖥️ {user.plataforma}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/10 px-4 py-2 text-sm font-bold text-red-400">
                    🎮 EA SPORTS FC 26
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-xl font-bold text-zinc-300 mb-5">
              Estadísticas en EA SPORTS FC 26
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border p-6 ${stat.bg}`}
                  >
                    <Icon className={`${stat.color}`} size={26} />

                    <p className="text-3xl font-black mt-4">
                      {stat.value}
                    </p>

                    <p className="text-zinc-400 text-sm mt-1">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
