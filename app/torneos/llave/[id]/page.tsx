"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Clock,
  Wifi,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  Gamepad2,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Bracket from "@/components/torneo/Bracket";
import ReglasPartido from "@/components/torneo/ReglasPartido";
import DMChat from "@/components/mensajes/DMChat";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { juegos, jugadoresPorEquipo } from "@/lib/games";

interface Torneo {
  id: string;
  nombre: string;
  juego: string;
  plataforma: string;
  modalidad: "individual" | "equipo";
  jugadores_max: number;
  premio: number;
  fecha: string;
  estado: string;
  campeon: string | null;
}

interface Partido {
  id: string;
  ronda: number;
  numero_partido: number;

  jugador1: string;
  jugador2: string;

  capitan1: string | null;
  capitan2: string | null;

  ganador: string | null;

  goles_jugador1: number | null;
  goles_jugador2: number | null;

  penales_jugador1: number | null;
  penales_jugador2: number | null;

  estado: string;
}

// Color principal de la llave según el juego. Si no está en la lista, usa el rojo de GMP.
const ACENTOS: Record<string, string> = {
  "Counter-Strike 2": "#22d3ee",
  "EA SPORTS FC 26": "#34d399",
  "League of Legends": "#60a5fa",
  "Truco Blyts": "#f59e0b",
};
const ACENTO_GMP = "#ef4444";

function formatearFecha(fecha?: string) {
  if (!fecha) return "A definir";

  return new Date(fecha)
    .toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(".", "")
    .replace(/ de /g, " ");
}

type Pestana = "llaves" | "reglas";

export default function LlaveTorneoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [inscritos, setInscritos] = useState(0);
  const [escudos, setEscudos] = useState<Record<string, string>>({});
  const [miUsuario, setMiUsuario] = useState<string | null>(null);
  const [soporteAbierto, setSoporteAbierto] = useState(false);
  const [pestana, setPestana] = useState<Pestana>("llaves");

  useEffect(() => {
    if (!authLoading) {
      cargarDatos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  async function cargarDatos() {
    const { data: torneoData, error: torneoError } = await supabase
      .from("torneos")
      .select("*")
      .eq("id", id)
      .single();

    if (torneoError || !torneoData) {
      setLoading(false);
      return;
    }

    const { count } = await supabase
      .from("inscripciones")
      .select("*", { count: "exact", head: true })
      .eq("torneo_id", id);

    // Escudos de los equipos: se cruzan por el mismo nombre que usan los partidos
    // (nombre del equipo en torneos por equipos, usuario en los individuales).
    const { data: inscripcionesData } = await supabase
      .from("inscripciones")
      .select("*")
      .eq("torneo_id", id);

    const mapaEscudos: Record<string, string> = {};
    (inscripcionesData ?? []).forEach(
      (ins: { usuario?: string; equipo?: string | null; escudo_url?: string | null }) => {
        if (!ins.escudo_url) return;
        if (ins.equipo) mapaEscudos[ins.equipo] = ins.escudo_url;
        if (ins.usuario) mapaEscudos[ins.usuario] = ins.escudo_url;
      }
    );

    const { data: partidosData } = await supabase
      .from("partidos")
      .select("*")
      .eq("torneo_id", id)
      .order("ronda", { ascending: true })
      .order("numero_partido", { ascending: true });

    if (user) {
      const { data: perfilData } = await supabase
        .from("usuarios")
        .select("usuario")
        .eq("id", user.id)
        .single();

      setMiUsuario(perfilData?.usuario ?? null);
    }

    setTorneo(torneoData);
    setInscritos(count || 0);
    setEscudos(mapaEscudos);
    setPartidos((partidosData as Partido[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07070a] text-white">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <p className="text-zinc-500 text-lg">Cargando llave...</p>
        </div>
      </main>
    );
  }

  if (!torneo) {
    return (
      <main className="min-h-screen bg-[#07070a] text-white">
        <Navbar />
        <div className="max-w-xl mx-auto pt-40 px-6 text-center">
          <h1 className="text-2xl font-bold">No se encontró el torneo</h1>
          <p className="text-zinc-400 mt-2">
            Puede que el enlace sea incorrecto o que el torneo ya no exista.
          </p>
          <button
            onClick={() => router.push("/torneos")}
            className="mt-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-5 py-3 font-semibold transition"
          >
            Ver todos los torneos
          </button>
        </div>
      </main>
    );
  }

  const juegoInfo = juegos.find((j) => j.nombre === torneo.juego);
  const rutaVolver = juegoInfo?.ruta ?? "/torneos";

  const esEquipo = torneo.modalidad === "equipo";
  const porEquipo = jugadoresPorEquipo(torneo.juego);
  const formato = esEquipo ? `${porEquipo} vs ${porEquipo}` : "1 vs 1";

  const finalTerminada = torneo.estado === "Finalizado" && !!torneo.campeon;

  const ultimaRonda =
    partidos.length > 0 ? Math.max(...partidos.map((p) => p.ronda)) : 0;

  const partidoFinal = partidos.find((p) => p.ronda === ultimaRonda);

  const soyCampeon =
    !!miUsuario &&
    finalTerminada &&
    !!partidoFinal &&
    partidoFinal.ganador === torneo.campeon &&
    [
      partidoFinal.jugador1,
      partidoFinal.jugador2,
      partidoFinal.capitan1,
      partidoFinal.capitan2,
    ].includes(miUsuario);

  const esTrucoBlyts = torneo.juego === "Truco Blyts";
  const esFC26 = torneo.juego === "EA SPORTS FC 26";
  const esCS2 = torneo.juego === "Counter-Strike 2";
  const hayReglasEspeciales = esTrucoBlyts || esFC26 || esCS2;
  const mostrarAvisoReglas =
    !!miUsuario && partidos.length > 0 && hayReglasEspeciales;

  const acento = ACENTOS[torneo.juego] ?? ACENTO_GMP;

  const estiloPagina = {
    "--accent": acento,
  } as CSSProperties;

  const estiloHero: CSSProperties = {
    backgroundImage: [
      "linear-gradient(90deg, #07070a 8%, rgba(7,7,10,0.82) 48%, rgba(7,7,10,0.45) 100%)",
      `radial-gradient(circle at 85% 20%, color-mix(in srgb, ${acento} 22%, transparent), transparent 55%)`,
      juegoInfo ? `url(${juegoInfo.imagen})` : "none",
    ].join(", "),
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <main
      className="min-h-screen bg-[#07070a] text-white"
      style={estiloPagina}
    >
      <Navbar />

      {/* HERO */}
      <section
        className="relative pt-16 lg:pt-20 border-b border-zinc-800"
        style={estiloHero}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 lg:pt-12 lg:pb-14">
          <button
            onClick={() => router.push(rutaVolver)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Volver al torneo
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="min-w-0">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold"
                style={{
                  color: "var(--accent)",
                  borderColor:
                    "color-mix(in srgb, var(--accent) 40%, transparent)",
                  background:
                    "color-mix(in srgb, var(--accent) 10%, transparent)",
                }}
              >
                <Gamepad2 size={14} />
                {torneo.juego} · {formato}
              </span>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black italic leading-[1.05] tracking-tight break-words">
                {torneo.nombre}
              </h1>

              <p className="mt-4 max-w-xl text-zinc-400 text-base lg:text-lg">
                Seguí el progreso de los mejores{" "}
                {esEquipo ? "equipos" : "jugadores"} en su camino al título.
              </p>
            </div>

            <dl className="grid w-full grid-cols-[repeat(3,minmax(0,1fr))] divide-x divide-zinc-800 rounded-xl border border-zinc-800 bg-black/50 backdrop-blur-sm lg:w-auto lg:shrink-0">
              <div className="min-w-0 px-3 py-3 sm:px-5 sm:py-4">
                <dt className="text-xs text-zinc-500">Premio</dt>
                <dd className="mt-1 text-base sm:text-xl font-black text-yellow-400">
                  ${torneo.premio?.toLocaleString("es-AR")}
                </dd>
              </div>

              <div className="min-w-0 px-3 py-3 sm:px-5 sm:py-4">
                <dt className="text-xs text-zinc-500">
                  {esEquipo ? "Equipos" : "Jugadores"}
                </dt>
                <dd
                  className="mt-1 text-base sm:text-xl font-black"
                  style={{ color: "var(--accent)" }}
                >
                  {inscritos} / {torneo.jugadores_max}
                </dd>
              </div>

              <div className="min-w-0 px-3 py-3 sm:px-5 sm:py-4">
                <dt className="text-xs text-zinc-500">Inicio</dt>
                <dd className="mt-1 text-sm sm:text-xl font-black leading-tight">
                  {formatearFecha(torneo.fecha)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* PESTAÑAS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          role="tablist"
          className="flex gap-8 border-b border-zinc-800"
        >
          {(
            [
              ["llaves", "Llaves"],
              ["reglas", "Reglas y soporte"],
            ] as [Pestana, string][]
          ).map(([clave, texto]) => {
            const activa = pestana === clave;
            return (
              <button
                key={clave}
                role="tab"
                aria-selected={activa}
                onClick={() => setPestana(clave)}
                className={`relative py-4 text-sm font-bold transition ${
                  activa ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {texto}
                {activa && (
                  <span
                    className="absolute inset-x-0 -bottom-px h-0.5"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {pestana === "llaves" && (
          <div className="py-8 lg:py-10">
            {mostrarAvisoReglas && (
              <button
                onClick={() => setPestana("reglas")}
                className="mb-8 flex w-full items-center gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/[0.05] px-4 py-3 text-left transition hover:bg-yellow-500/10"
              >
                <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                <span className="flex-1 text-sm text-zinc-300">
                  <span className="font-bold text-yellow-500">
                    Lectura obligatoria:
                  </span>{" "}
                  antes de jugar, revisá cómo se coordina, se configura y se
                  reporta cada partido.
                </span>
                <ChevronRight className="text-yellow-500 shrink-0" size={18} />
              </button>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 text-2xl font-black">
                <Trophy size={22} className="text-yellow-400" />
                Cuadro del torneo
              </h2>

              <span className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400">
                Eliminación directa · {torneo.jugadores_max}{" "}
                {esEquipo ? "equipos" : "jugadores"}
              </span>
            </div>

            {partidos.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-10 text-center">
                <h3 className="text-xl font-bold">
                  Todavía no hay partidos generados.
                </h3>
                <p className="mt-2 text-zinc-500 text-sm">
                  La llave aparece acá cuando la organización arme los cruces.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-6 lg:p-8">
                <Bracket
                  jugadoresMax={torneo.jugadores_max}
                  miUsuario={miUsuario}
                  torneoId={id}
                  escudos={escudos}
                  finalTerminada={finalTerminada}
                  campeon={torneo.campeon}
                  mostrarReclamar={soyCampeon}
                  onReclamarPremio={() => setSoporteAbierto(true)}
                  partidos={partidos.map((p) => ({
                    id: p.id,
                    ronda: p.ronda,
                    numero_partido: p.numero_partido,

                    jugador1: p.jugador1,
                    jugador2: p.jugador2,

                    capitan1: p.capitan1,
                    capitan2: p.capitan2,

                    goles_jugador1: p.goles_jugador1,
                    goles_jugador2: p.goles_jugador2,

                    penales_jugador1: p.penales_jugador1,
                    penales_jugador2: p.penales_jugador2,

                    ganador: p.ganador,
                  }))}
                />
              </div>
            )}
          </div>
        )}

        {pestana === "reglas" && (
          <div className="py-8 lg:py-10 space-y-8">
            {hayReglasEspeciales && (
              <ReglasPartido
                esTrucoBlyts={esTrucoBlyts}
                esFC26={esFC26}
                esCS2={esCS2}
              />
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex gap-4">
                <Clock className="text-zinc-500 shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">Horarios</p>
                  <p className="text-zinc-400 text-sm">
                    Los horarios son definidos por la organización.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex gap-4">
                <Wifi className="text-zinc-500 shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">Desconexiones</p>
                  <p className="text-zinc-400 text-sm">
                    Ver reglamento para más información.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex gap-4">
                <HelpCircle className="text-zinc-500 shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">¿Dudas?</p>
                  <p className="text-zinc-400 text-sm">
                    Contactanos por nuestras redes.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/reglamento")}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-bold text-zinc-200 transition hover:bg-zinc-800"
            >
              Ver reglamento completo
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="pb-16" />

      {soporteAbierto && miUsuario && (
        <DMChat
          conversacionId={`soporte::${miUsuario}`}
          miUsuario={miUsuario}
          destinatario="ADMIN"
          otherLabel="Soporte (Admin)"
          esSoporte
          onClose={() => setSoporteAbierto(false)}
        />
      )}
    </main>
  );
}
