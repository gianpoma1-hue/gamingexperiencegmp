import Link from "next/link";
import { Swords, CalendarDays, Users } from "lucide-react";
import { buscarJuego } from "@/lib/games";
import type { TorneoCardData } from "@/components/torneo/TorneoCard";

// Tarjeta compacta para la home. La versión completa (con descripción,
// 2do premio y estado de inscripción del usuario) es TorneoCard.
export default function ProximoTorneoCard({ torneo }: { torneo: TorneoCardData }) {
  const juego = buscarJuego(torneo.juego);
  const completo = torneo.inscritos >= torneo.jugadores_max;
  const porcentaje =
    torneo.jugadores_max > 0
      ? Math.min(100, Math.round((torneo.inscritos / torneo.jugadores_max) * 100))
      : 0;
  const unidad = torneo.modalidad === "equipo" ? "equipos" : "jugadores";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl lg:rounded-3xl border border-zinc-800 bg-white/[0.03] transition-all duration-500 hover:border-red-600 lg:hover:-translate-y-2 lg:hover:shadow-[0_0_45px_rgba(220,38,38,.15)]">
      {/* Portada del juego */}
      <div className="relative h-36 sm:h-40 overflow-hidden bg-zinc-900">
        {juego?.imagen && (
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 lg:group-hover:scale-105"
            style={{ backgroundImage: `url('${juego.imagen}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/50 to-black/20" />

        <span className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wide">
          {torneo.juego}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <h3 className="text-lg lg:text-2xl font-black leading-tight">{torneo.nombre}</h3>

        {/* Premio */}
        <div className="mt-4 rounded-xl border border-green-800/40 bg-green-950/30 p-3">
          <p className="text-green-400 text-xs font-semibold">🥇 Premio 1er puesto</p>
          <p className="text-green-400 text-xl lg:text-2xl font-black mt-0.5">
            ${torneo.premio.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Cupos */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Users className="w-4 h-4" />
              Cupos
            </span>
            <span className="font-bold text-red-500">
              {torneo.inscritos} / {torneo.jugadores_max} {unidad}
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={torneo.jugadores_max}
            aria-valuenow={torneo.inscritos}
            aria-label="Cupos ocupados"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        {/* Fecha */}
        <p className="mt-4 flex items-center gap-1.5 text-sm text-zinc-300">
          <CalendarDays className="w-4 h-4 text-zinc-500" />
          {new Date(torneo.fecha).toLocaleDateString("es-AR", { timeZone: "UTC" })}
          {torneo.hora && <span className="text-zinc-500">· {torneo.hora}</span>}
        </p>

        {/* Acción */}
        <div className="mt-auto pt-5">
          {completo ? (
            <button
              disabled
              className="w-full rounded-xl bg-zinc-700 py-3 font-bold cursor-not-allowed"
            >
              TORNEO COMPLETO
            </button>
          ) : (
            <Link
              href={`/torneos/inscripcion/${torneo.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-950/40 transition-all active:scale-[0.98]"
            >
              <Swords className="w-5 h-5" />
              INSCRIBIRME
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
