"use client";

import { useRouter } from "next/navigation";
import { Swords } from "lucide-react";

export type TorneoCardData = {
  id: string;
  nombre: string;
  juego: string;
  jugadores_max: number;
  premio: number;
  premio_segundo?: number | null;
  inscripcion: number;
  fecha: string;
  estado: string;
  campeon: string | null;
  inscritos: number;
};

export default function TorneoCard({ torneo }: { torneo: TorneoCardData }) {
  const router = useRouter();

  const completo = torneo.inscritos >= torneo.jugadores_max;
  const tieneSegundoPremio = !!torneo.premio_segundo && torneo.premio_segundo > 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-600 transition">
      <h2 className="text-3xl font-black">{torneo.nombre}</h2>

      <p className="text-zinc-400 mt-2">{torneo.juego}</p>

      {/* Premios */}
      <div
        className={`grid gap-4 mt-8 ${
          tieneSegundoPremio ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        <div className="bg-green-950/30 border border-green-800/40 rounded-xl p-4">
          <p className="text-green-400 text-sm font-semibold">
            🥇 Premio 1er puesto
          </p>
          <h3 className="text-green-400 text-2xl font-black mt-1">
            ${torneo.premio.toLocaleString("es-AR")}
          </h3>
        </div>

        {tieneSegundoPremio && (
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4">
            <p className="text-zinc-400 text-sm font-semibold">
              🥈 Premio 2do puesto
            </p>
            <h3 className="text-zinc-200 text-2xl font-black mt-1">
              ${torneo.premio_segundo!.toLocaleString("es-AR")}
            </h3>
          </div>
        )}
      </div>

      {/* Datos del torneo */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div>
          <p className="text-zinc-500 text-sm">Inscripción</p>
          <h3 className="text-lg font-black">
            ${torneo.inscripcion.toLocaleString("es-AR")}
          </h3>
        </div>

        <div>
          <p className="text-zinc-500 text-sm">Jugadores</p>
          <h3 className="text-red-500 text-lg font-black">
            {torneo.inscritos} / {torneo.jugadores_max}
          </h3>
        </div>

        <div>
          <p className="text-zinc-500 text-sm">Fecha</p>
          <h3 className="text-lg font-bold">
            {new Date(torneo.fecha).toLocaleDateString("es-AR")}
          </h3>
        </div>
      </div>

      {/* Acción según el estado del torneo */}
      {torneo.estado === "En curso" ? (
        <button
          onClick={() => router.push(`/torneos/llave/${torneo.id}`)}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 font-bold text-lg transition"
        >
          🏆 VER LLAVE DEL TORNEO
        </button>
      ) : torneo.estado === "Finalizado" ? (
        <div className="mt-8">
          <button
            onClick={() => router.push(`/torneos/llave/${torneo.id}`)}
            className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-xl py-4 font-bold text-lg transition"
          >
            TORNEO FINALIZADO — VER LLAVE
          </button>

          <div className="mt-4 text-center">
            <p className="text-zinc-400 text-sm">🏆 Campeón</p>
            <p className="text-2xl font-black text-yellow-400">
              {torneo.campeon ?? "Sin definir"}
            </p>
          </div>
        </div>
      ) : completo ? (
        <button
          disabled
          className="mt-8 w-full bg-zinc-700 cursor-not-allowed rounded-xl py-4 font-bold text-lg"
        >
          TORNEO COMPLETO
        </button>
      ) : (
        <button
          onClick={() => router.push(`/torneos/inscripcion/${torneo.id}`)}
          className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-950/40 transition-all"
        >
          <Swords className="w-5 h-5" />
          INSCRIBIRME
        </button>
      )}
    </div>
  );
}
