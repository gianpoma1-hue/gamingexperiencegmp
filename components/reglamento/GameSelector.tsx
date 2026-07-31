"use client";

import type { Game } from "@/lib/games";

export default function GameSelector({
  games,
  selectedId,
  onSelect,
}: {
  games: Game[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
      {games.map((game) => {
        const isSelected = game.id === selectedId;

        return (
          <button
            key={game.id}
            onClick={() => onSelect(game.id)}
            className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-full border px-2 py-2.5 sm:px-6 sm:py-3 font-semibold text-xs sm:text-sm text-center transition-all duration-300 ${
              isSelected
                ? "border-red-600 bg-red-600/10 text-white"
                : "border-zinc-800 bg-[#111111] text-zinc-400 hover:border-zinc-600 hover:text-white"
            }`}
          >
            {game.nombre}
            {!game.disponible && (
              <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-yellow-400">
                Próximamente
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
