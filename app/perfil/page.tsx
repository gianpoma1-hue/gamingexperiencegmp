"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import {
  Trophy,
  Gamepad2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ListChecks,
  Camera,
} from "lucide-react";

interface Usuario {
  id: string;
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
  foto_perfil: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const inputFotoRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [torneosJugados, setTorneosJugados] = useState(0);
  const [torneosGanados, setTorneosGanados] = useState(0);
  const [torneosPerdidos, setTorneosPerdidos] = useState(0);

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
      await cargarTorneos(data.usuario);
    }

    setLoading(false);
  }

  async function cargarTorneos(usuario: string) {
    const { data } = await supabase
      .from("inscripciones")
      .select(
        `
        usuario,
        estado_pago,
        torneos ( estado, campeon )
      `
      )
      .eq("usuario", usuario)
      .eq("estado_pago", "confirmado");

    if (!data) return;

    let jugados = 0;
    let ganados = 0;
    let perdidos = 0;

    data.forEach((inscripcion: any) => {
      const torneo = Array.isArray(inscripcion.torneos)
        ? inscripcion.torneos[0]
        : inscripcion.torneos;

      if (!torneo) return;

      if (torneo.estado === "Finalizado" || torneo.estado === "En curso") {
        jugados++;
      }

      if (torneo.estado === "Finalizado") {
        if (torneo.campeon === usuario) {
          ganados++;
        } else {
          perdidos++;
        }
      }
    });

    setTorneosJugados(jugados);
    setTorneosGanados(ganados);
    setTorneosPerdidos(perdidos);
  }

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo || !user) return;

    if (!archivo.type.startsWith("image/")) {
      alert("Elegí un archivo de imagen.");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert("La imagen no puede pesar más de 5MB.");
      return;
    }

    setSubiendoFoto(true);

    const extension = archivo.name.split(".").pop();
    const ruta = `${user.id}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(ruta, archivo, { upsert: true });

    if (uploadError) {
      alert("No se pudo subir la foto: " + uploadError.message);
      setSubiendoFoto(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(ruta);

    const nuevaUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("usuarios")
      .update({ foto_perfil: nuevaUrl })
      .eq("id", user.id);

    setSubiendoFoto(false);

    if (updateError) {
      alert("No se pudo guardar la foto: " + updateError.message);
      return;
    }

    setUser({ ...user, foto_perfil: nuevaUrl });
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

  const statsTorneos = [
    {
      label: "Torneos Jugados",
      value: torneosJugados,
      icon: ListChecks,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Torneos Ganados",
      value: torneosGanados,
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border-yellow-400/20",
    },
    {
      label: "Torneos Perdidos",
      value: torneosPerdidos,
      icon: XCircle,
      color: "text-zinc-400",
      bg: "bg-zinc-500/10 border-zinc-500/20",
    },
  ];

  const statsPartidos = [
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
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 lg:pt-28 pb-16 lg:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">

          {/* Encabezado de perfil */}
          <div className="relative rounded-2xl lg:rounded-3xl border border-zinc-800 bg-zinc-900">

            <div
              className="h-28 sm:h-40 lg:h-56 relative rounded-t-2xl lg:rounded-t-3xl overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(220,38,38,.25), transparent 55%), radial-gradient(circle at 80% 0%, rgba(37,99,235,.15), transparent 50%), #0a0a0a",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>

            <div className="px-4 sm:px-8 lg:px-10 pb-6 lg:pb-8">

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-10 sm:-mt-16 gap-4 sm:gap-6">

                <div className="flex items-end gap-4 sm:gap-6">

                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl bg-red-600 ring-4 ring-zinc-900 flex items-center justify-center text-3xl sm:text-5xl font-black shadow-[0_0_40px_rgba(220,38,38,.35)] overflow-hidden">
                      {user.foto_perfil ? (
                        <img
                          src={user.foto_perfil}
                          alt={user.usuario}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.usuario.charAt(0).toUpperCase()
                      )}
                    </div>

                    <button
                      onClick={() => inputFotoRef.current?.click()}
                      disabled={subiendoFoto}
                      title="Cambiar foto de perfil"
                      className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center hover:bg-red-600 transition disabled:opacity-60"
                    >
                      <Camera size={14} className="sm:hidden" />
                      <Camera size={16} className="hidden sm:block" />
                    </button>

                    <input
                      ref={inputFotoRef}
                      type="file"
                      accept="image/*"
                      onChange={subirFoto}
                      className="hidden"
                    />
                  </div>

                  <div className="pb-1">
                    <p className="text-zinc-500 text-[11px] sm:text-xs uppercase tracking-wide font-semibold mb-0.5">
                      Nombre de usuario
                    </p>
                    <h1 className="text-xl sm:text-3xl lg:text-4xl font-black">
                      {user.usuario}
                    </h1>
                    <p className="text-zinc-400 mt-1 text-sm sm:text-base">
                      {user.nombre}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Stats de torneos */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-300 mb-3 sm:mb-5">
              Torneos
            </h2>

            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {statsTorneos.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`rounded-xl sm:rounded-2xl border p-3 sm:p-6 ${stat.bg}`}
                  >
                    <Icon className={stat.color} size={20} />

                    <p className="text-xl sm:text-3xl font-black mt-2 sm:mt-4">
                      {stat.value}
                    </p>

                    <p className="text-zinc-400 text-[11px] sm:text-sm mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats generales de partidos */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-300 mb-3 sm:mb-5">
              Estadísticas Generales
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {statsPartidos.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`rounded-xl sm:rounded-2xl border p-3 sm:p-6 ${stat.bg}`}
                  >
                    <Icon className={stat.color} size={20} />

                    <p className="text-xl sm:text-3xl font-black mt-2 sm:mt-4">
                      {stat.value}
                    </p>

                    <p className="text-zinc-400 text-[11px] sm:text-sm mt-1 leading-tight">
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
