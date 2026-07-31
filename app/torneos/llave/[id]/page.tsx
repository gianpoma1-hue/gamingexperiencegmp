"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Gamepad2,
  Users,
  Calendar,
  Trophy,
  Clock,
  Wifi,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Bracket from "@/components/torneo/Bracket";
import DMChat from "@/components/mensajes/DMChat";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { juegos } from "@/lib/games";

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

function formatearFecha(fecha?: string) {
  if (!fecha) return "A definir";

  return new Date(fecha)
    .toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(".", "")
    .toUpperCase();
}

export default function LlaveTorneoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [inscritos, setInscritos] = useState(0);
  const [miUsuario, setMiUsuario] = useState<string | null>(null);
  const [soporteAbierto, setSoporteAbierto] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      cargarDatos();
    }
  }, [authLoading]);

  async function cargarDatos() {
    const { data: torneoData, error: torneoError } = await supabase
      .from("torneos")
      .select("*")
      .eq("id", id)
      .single();

    if (torneoError || !torneoData) {
      alert("No se encontró el torneo.");
      return;
    }

    const { count } = await supabase
      .from("inscripciones")
      .select("*", { count: "exact", head: true })
      .eq("torneo_id", id);

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
    setPartidos((partidosData as Partido[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-black">Cargando llave...</h1>
      </main>
    );
  }

  const juegoInfo = juegos.find((j) => j.nombre === torneo?.juego);
  const rutaVolver = juegoInfo?.ruta ?? "/torneos";

  const formato = torneo?.modalidad === "equipo" ? "2 vs 2" : "1 vs 1";

  const finalTerminada =
    torneo?.estado === "Finalizado" && !!torneo?.campeon;

  const ultimaRonda =
    partidos.length > 0 ? Math.max(...partidos.map((p) => p.ronda)) : 0;

  const partidoFinal = partidos.find((p) => p.ronda === ultimaRonda);

  const soyCampeon =
    !!miUsuario &&
    finalTerminada &&
    !!partidoFinal &&
    partidoFinal.ganador === torneo?.campeon &&
    [
      partidoFinal.jugador1,
      partidoFinal.jugador2,
      partidoFinal.capitan1,
      partidoFinal.capitan2,
    ].includes(miUsuario);

  const esTrucoBlyts = torneo?.juego === "Truco Blyts";
  const esFC26 = torneo?.juego === "EA SPORTS FC 26";

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 lg:pt-28 pb-16">

        <button
          onClick={() => router.push(rutaVolver)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8 text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          VOLVER AL TORNEO
        </button>

        <h1 className="text-5xl font-black">
          <span className="text-red-600">LLAVES</span> DEL TORNEO
        </h1>

        <p className="text-zinc-400 mt-3 text-lg">
          Seguí el progreso de los mejores {torneo?.modalidad === "equipo" ? "equipos" : "JUGADORES"} en su camino al título.
        </p>

        {miUsuario && partidos.length > 0 && (esTrucoBlyts || esFC26) && (
          <div className="mt-8 rounded-2xl border-2 border-yellow-500/60 bg-yellow-500/5 px-4 sm:px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
              <h2 className="text-xl font-black tracking-wide text-yellow-500">
                IMPORTANTE — LECTURA OBLIGATORIA
              </h2>
            </div>

            {esTrucoBlyts && (
              <ul className="space-y-3 text-zinc-300 leading-7">
                <li className="flex gap-3">
                  <span className="text-yellow-500 font-bold">1.</span>
                  <span>
                    Comunicate con tu rival a través del{" "}
                    <span className="font-semibold text-white">
                      chat del partido
                    </span>{" "}
                    para intercambiar el ID o nombre de usuario del juego y
                    agregarse mutuamente en Truco Blyts.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-yellow-500 font-bold">2.</span>
                  <span>
                    El jugador que cree la partida debe configurarla a{" "}
                    <span className="font-semibold text-white">
                      30 puntos y sin flor
                    </span>
                    .
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-yellow-500 font-bold">3.</span>
                  <span>
                    Una vez finalizada la partida, es{" "}
                    <span className="font-semibold text-white">
                      obligatorio
                    </span>{" "}
                    que ambos jugadores ingresen a "Reportar resultado" y
                    carguen el mismo resultado. En caso de que los resultados
                    cargados no coincidan, el ganador deberá adjuntar una
                    captura de pantalla del resultado final de la partida
                    como respaldo.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-yellow-500 font-bold">4.</span>
                  <span>
                    El equipo campeón deberá reportar su resultado y luego
                    dirigirse a la sección de{" "}
                    <span className="font-semibold text-white">
                      Mensajes
                    </span>{" "}
                    (arriba, junto al perfil) para comunicarse con la
                    organización y coordinar la entrega del premio.
                  </span>
                </li>
              </ul>
            )}

            {esFC26 && (
              <div className="space-y-6 text-zinc-300 leading-7">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-yellow-500 mb-3">
                    Antes de jugar
                  </p>

                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span>💬</span>
                      <span>
                        Utilizá el{" "}
                        <span className="font-semibold text-white">
                          chat del partido
                        </span>{" "}
                        con tu rival para coordinar el horario e
                        intercambiar el ID de EA SPORTS FC 26.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span>🎮</span>
                      <span>
                        El partido deberá jugarse en el modo{" "}
                        <span className="font-semibold text-white">
                          "Amistoso Online" (Online Friendlies)
                        </span>
                        , agregando previamente a tu rival como amigo.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span>⚽</span>
                      <div>
                        <span>
                          El jugador que cree la partida deberá configurar
                          obligatoriamente:
                        </span>

                        <ul className="mt-2 ml-1 space-y-1 list-disc list-inside text-zinc-300">
                          <li>Duración de cada tiempo: 6 minutos.</li>
                          <li>Velocidad de juego: Normal.</li>
                          <li>Lesiones: Desactivadas.</li>
                          <li>Mano: Desactivada.</li>
                          <li>Plantillas: Actualizadas.</li>
                        </ul>
                      </div>
                    </li>

                    <li className="flex gap-3">
                      <span>⏱️</span>
                      <span>
                        Si el partido termina empatado, deberá disputarse la
                        prórroga. Si el empate persiste al finalizar la
                        prórroga, el ganador se definirá mediante la tanda
                        de penales.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-yellow-500 mb-3">
                    Al finalizar el partido
                  </p>

                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span>📝</span>
                      <span>
                        Ambos jugadores deberán ingresar al apartado{" "}
                        <span className="font-semibold text-white">
                          "Reportar resultado"
                        </span>{" "}
                        y cargar exactamente el mismo resultado del
                        partido.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span>📸</span>
                      <span>
                        Si los resultados informados son diferentes o existe
                        algún inconveniente, el ganador deberá presentar una
                        captura de pantalla del resultado final del partido
                        como comprobante.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span>❌</span>
                      <span>
                        Modificar la configuración obligatoria, abandonar el
                        partido o desconectarse intencionalmente podrá
                        derivar en sanciones o la pérdida del encuentro, de
                        acuerdo con el reglamento de Gaming Experience GMP.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INFO BAR */}
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 sm:px-8 py-6 flex flex-wrap gap-y-6 gap-x-10">

          <div className="flex items-center gap-3">
            <Gamepad2 className="text-zinc-500" size={22} />
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wide">
                Juego
              </p>
              <p className="font-bold">{torneo?.juego}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-zinc-500" size={22} />
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wide">
                Formato
              </p>
              <p className="font-bold">{formato}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-zinc-500" size={22} />
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wide">
                Inicio
              </p>
              <p className="font-bold">{formatearFecha(torneo?.fecha)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Trophy className="text-zinc-500" size={22} />
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wide">
                Premio
              </p>
              <p className="font-bold">
                ${torneo?.premio?.toLocaleString("es-AR")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-zinc-500" size={22} />
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wide">
                {formato === "2 vs 2" ? "Equipos" : "Jugadores"}
              </p>
              <p className="font-bold">
                {inscritos} / {torneo?.jugadores_max}
              </p>
            </div>
          </div>

        </div>

        {/* LLAVE */}
        {partidos.length === 0 ? (
          <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold">
              Todavía no hay partidos generados.
            </h2>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8">
            <Bracket
              jugadoresMax={torneo!.jugadores_max}
              miUsuario={miUsuario}
              torneoId={id}
              finalTerminada={finalTerminada}
              campeon={torneo?.campeon}
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

        {/* FOOTER INFO */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex gap-4">
            <Clock className="text-zinc-500 shrink-0" size={26} />
            <div>
              <p className="font-bold mb-1">Horarios</p>
              <p className="text-zinc-400 text-sm">
                Los horarios son definidos por la organización.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex gap-4">
            <Wifi className="text-zinc-500 shrink-0" size={26} />
            <div>
              <p className="font-bold mb-1">Desconexiones</p>
              <p className="text-zinc-400 text-sm">
                Ver reglamento para más información.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex gap-4">
            <HelpCircle className="text-zinc-500 shrink-0" size={26} />
            <div>
              <p className="font-bold mb-1">¿Dudas?</p>
              <p className="text-zinc-400 text-sm">
                Contactanos por nuestras redes.
              </p>
            </div>
          </div>

        </div>

      </div>

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
